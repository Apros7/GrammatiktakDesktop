
import { VisualError } from "../utils/visualisation_errors.js"
import { fetchData } from "../utils/fetching.js"
import { sleep, unnestErrors } from "../utils/helper_functions.js"
import { check_clear_message, activate_spinner } from "../utils/visualisation_other.js"

let sentence_information = {
  removed_error_ids: ["id1"],
  errors_from_backend: [],
  errors_matching_text: {},
  previous_chunks: [],
  text_at_correction_time: "",
  waiting_for_backend: {}
} 

const service_url = "https://backend1-2f53ohkurq-ey.a.run.app";

Office.onReady((info) => {
  if (info.host === Office.HostType.Word) {
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";
    run()
    // document.getElementById("run").onclick = add_comment;
  }
});

function convert_character_index_to_word_index(startIndex, endIndex, text) {
  let wordIndexes = []
  let characterIndexCounter = 0
  let preLoopValue = 0
  const words = text.split(" ")
  for (let i = 0; i < words.length; i++) {
    // document.getElementById("extra2").textContent = JSON.stringify([preLoopValue, endIndex, words[i], wordIndexes], null, 2)
    if (preLoopValue > endIndex) { break }
    characterIndexCounter += words[i].length + 1 // +1 for space
    // document.getElementById("extra2").textContent = JSON.stringify([preLoopValue, startIndex, characterIndexCounter, words[i]], null, 2)
    if (startIndex < characterIndexCounter) { wordIndexes.push(i) }
    preLoopValue = characterIndexCounter
  }
  // document.getElementById("extra2").textContent = JSON.stringify(wordIndexes, null, 2)
  return wordIndexes
}

export async function mark_text() {
  await Word.run(async (context) => {
    // errors has to be a single nested list like sentence_information.errors_from_backend
    const errors = [ [ "Hej", "Hej,", [ 0, 3 ], "text1" ], [ "Lucas", "Lucas.", [ 15, 20 ], "text2" ] ]
    const indexes = get_indexes(errors)
    document.getElementById("extra2").textContent = JSON.stringify(indexes, null, 2)
  });
};

function get_indexes(errors) {
  let indexes = []
  for (const error of errors) {
    indexes.push(error[2])
  }
  return indexes
}

export async function add_comment(chunkNumber, commentText, indexes) {
  await Word.run(async (context) => {
    const startIndex = indexes[0]
    const endIndex = indexes[1]
    const range = context.document.body.getRange()
    range.load("text");
    await context.sync()

    const chunks = range.split(["\r"])
    chunks.load()
    await context.sync()

    const relevantChunk = chunks.items[chunkNumber]
    const chunkText = relevantChunk.text.replace(/\u0005/g, '')
    const wordIndexes = convert_character_index_to_word_index(startIndex, endIndex, chunkText)
    const words = relevantChunk.split([" "])
    words.load()
    await context.sync()

    let wordIndex = 0
    if (wordIndexes.length > 0) { wordIndex = wordIndexes[0] }
    const final_range = words.items[wordIndex]
    final_range.load("text");
    await context.sync()

    const comment = final_range.insertComment(commentText);
    comment.load();
    await context.sync();
  })
}

export async function correct_paragraph(correctedParagraph, chunkNumber) {
  await Word.run(async (context) => {

    const paragraphs = context.document.body.paragraphs;
    paragraphs.load('style');
    // document.getElementById("extra2").textContent = JSON.stringify("hey", null, 2)

    await context.sync();

    // document.getElementById("extra2").textContent = JSON.stringify("hey2", null, 2)

    paragraphs.items[chunkNumber].clear();

    // document.getElementById("extra2").textContent = JSON.stringify("hey3", null, 2)
    paragraphs.items[chunkNumber].insertText(correctedParagraph, Word.InsertLocation.end)

    // document.getElementById("extra2").textContent = JSON.stringify("hey4", null, 2)
    await context.sync();
});
}

export async function run() {
  return Word.run(async (context) => {
    // const extra = document.getElementById("extra");

    // let test_error = ["hej", "Hej.", [0, 3], "'Hej' skal starte med stort"]
    // document.body.appendChild(((new VisualError(test_error, sentence_information, 0)).visual_representation))

    while (true) {
      update_info_text(context)
      await sleep(2000)
    }
    
  });
}

export async function get_text(context) {
  var documentBody = context.document.body;
  context.load(documentBody);
  const paragraphs = documentBody.paragraphs;
  paragraphs.load("text");
  await context.sync();
  let textContent = paragraphs.items.map(paragraph => paragraph.text);
  textContent = textContent.map(text => text.replace(/\u0005/g, ''));
  return textContent;
}

async function update_info_text(context) {
  const textContent = await get_text(context)
  // document.getElementById("extra").textContent = JSON.stringify(sentence_information, null, 2)
  
  let [checked, not_checked] = await check_each_chunk(context, textContent) 
  document.getElementById("chunks_checked").textContent = JSON.stringify(checked, null, 2)
  document.getElementById("chunks_to_correct").textContent = JSON.stringify(not_checked, null, 2)

}

async function check_each_chunk(context, textContent) {
  // activate spinner if any change is detected or not done with fetching
  let text_not_changed = (JSON.stringify(await get_text(context)) === JSON.stringify(textContent) && textContent.length === sentence_information.errors_from_backend.length)
  let waiting_for_backend = Object.values(sentence_information.waiting_for_backend).some(value => value);
  if (!text_not_changed || waiting_for_backend) { 
    activate_spinner()
  }

  sentence_information.errors_from_backend = []
  let checked_chunks = [];
  let not_checked_chunks = [];
  
  for (let i = 0; i < textContent.length; i++) {
    let foundInPreviousChunks = false;
    
    for (let j = 0; j < sentence_information.previous_chunks.length; j++) {
      if (textContent[i] === sentence_information.previous_chunks[j]) {
        foundInPreviousChunks = true;
        break;
      }
    }

    // document.getElementById("extra2").textContent = "Fetching: " + textContent[i]
    if (textContent[i].trim().length === 0) {
      checked_chunks.push("")
      sentence_information.errors_from_backend.push([])
    }
    else if (foundInPreviousChunks) {
      checked_chunks.push(textContent[i]);
      const matching_errors = sentence_information.errors_matching_text[textContent[i]]
      sentence_information.errors_from_backend.push(matching_errors)
    } else {
      not_checked_chunks.push(textContent[i]);
      let errors = []
      if (!sentence_information.waiting_for_backend[textContent[i]]) {
        sentence_information.waiting_for_backend[textContent[i]] = true
        errors = await fetchData(service_url, textContent[i], sentence_information)
      } else {
        continue
      }
      const currentTextContent = await get_text(context)
      if (currentTextContent.length !== textContent.length || currentTextContent[i] !== textContent[i]) {
        continue;
      }
      sentence_information.errors_from_backend.push(errors) 
    }
  }
  sentence_information.previous_chunks = checked_chunks.concat(not_checked_chunks);

  // bug with errors being undefined.
  if (sentence_information.previous_chunks.length === sentence_information.errors_from_backend.length) {
    let new_prev_chunks = []
    for (let i = 0; i < checked_chunks.concat(not_checked_chunks).length; i++) {
      if (sentence_information.errors_from_backend[i] !== "null") {
        new_prev_chunks.push(sentence_information.previous_chunks[i])
      } else {
        delete sentence_information.errors_matching_text[sentence_information.previous_chunks[i]]
      }
    }
    sentence_information.previous_chunks = new_prev_chunks
  }

  // display errors if all done with fetching
  text_not_changed = (JSON.stringify(await get_text(context)) === JSON.stringify(textContent) && textContent.length === sentence_information.errors_from_backend.length)
  waiting_for_backend = Object.values(sentence_information.waiting_for_backend).some(value => value);
  // document.getElementById("extra2").textContent = JSON.stringify([JSON.stringify(await get_text(context)), JSON.stringify(textContent)], null, 2)
  if (text_not_changed && !waiting_for_backend) { 
    display_errors(context)
  }

  // display_errors(context)
  return [checked_chunks, not_checked_chunks]; 
}

async function display_errors(context) {

  const error_visualize_section = document.getElementById("errors-visualized");
  document.getElementById("extra").textContent = JSON.stringify(sentence_information.errors_from_backend, null, 2)
  const errors_to_visualize = await unnestErrors(sentence_information.errors_from_backend)

  while (error_visualize_section.firstChild) {
    error_visualize_section.removeChild(error_visualize_section.firstChild);
  }

  for (let i = 0; i < errors_to_visualize.length; i++) {
    const new_visual_error = new VisualError(errors_to_visualize[i], sentence_information, i, context)
    if (new_visual_error.should_visualize_id()) { 
      error_visualize_section.appendChild((new_visual_error.visual_representation))
    }
  }

  check_clear_message(sentence_information)
}