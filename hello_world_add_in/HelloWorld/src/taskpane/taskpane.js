
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
    const indexes = get_indexes(sentence_information.errors_from_backend)
    const paragraphs = await get_paragraphs(context)
    for (let i = 0; i < paragraphs.items.length; i++) {
      const paragraph = paragraphs.items[i]
      const chunk_indexes = indexes[i]
      const ooxml = `<pkg:package xmlns:pkg='http://schemas.microsoft.com/office/2006/xmlPackage'>
      <pkg:part pkg:name='/_rels/.rels' pkg:contentType='application/vnd.openxmlformats-package.relationships+xml' pkg:padding='512'>
        <pkg:xmlData>
          <Relationships xmlns='http://schemas.openxmlformats.org/package/2006/relationships'>
            <Relationship Id='rId1' Type='http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument' Target='word/document.xml'/>
          </Relationships>
        </pkg:xmlData>
      </pkg:part>
      <pkg:part pkg:name='/word/document.xml' pkg:contentType='application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml'>
        <pkg:xmlData>
          <w:document xmlns:w='http://schemas.openxmlformats.org/wordprocessingml/2006/main'>
            <w:body>
              <w:p>
                <w:pPr>
                  <w:spacing w:before='360' w:after='0' w:line='480' w:lineRule='auto'/>
                  <w:rPr>
                    <w:u w:val='single' w:color='0000FF' w:sz='12'/>
                  </w:rPr>
                </w:pPr>
                <w:r>
                  <w:rPr>
                    <w:u w:val='single' w:color='0000FF' w:sz='12'/>
                  </w:rPr>
                  <w:t>${paragraph.text}</w:t>
                </w:r>
              </w:p>
            </w:body>
          </w:document>
        </pkg:xmlData>
      </pkg:part>
    </pkg:package>`;
      paragraph.clear()
      paragraph.insertOoxml(ooxml, Word.InsertLocation.start);
    }
    document.getElementById("extra2").textContent = JSON.stringify(paragraphs.items, null, 2)
  });
};

async function get_paragraphs(context) {
  const paragraphs = context.document.body.paragraphs;
  paragraphs.load('style');
  paragraphs.load('text')
  await context.sync();
  return paragraphs
}

function get_indexes(errors) {
  // returns list of lists (chunk reference) of lists of errors
  let indexes = []
  for (let i = 0; i < errors.length; i++) {
    let current_indexes = []
    for (let j = 0; j < errors[i].length; j++) {
        current_indexes.push(errors[i][j][2])
    }
    indexes.push(current_indexes)
  }
  return indexes
}

async function get_chunks(context) {
  const range = context.document.body.getRange()
  range.load("text");
  await context.sync()

  const chunks = range.split(["\r"])
  chunks.load()
  await context.sync()
  return chunks
}

export async function add_comment(chunkNumber, commentText, indexes) {
  await Word.run(async (context) => {
    const startIndex = indexes[0]
    const endIndex = indexes[1]
    const chunks = await get_chunks(context)

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
    const paragraphs = await get_paragraphs(context)
    paragraphs.items[chunkNumber].clear();
    paragraphs.items[chunkNumber].insertText(correctedParagraph, Word.InsertLocation.end)
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
  
  let [checked, not_checked] = await check_each_chunk(context, textContent) 
  document.getElementById("chunks_checked").textContent = JSON.stringify(checked, null, 2)
  document.getElementById("chunks_to_correct").textContent = JSON.stringify(not_checked, null, 2)
  // document.getElementById("extra").textContent = JSON.stringify(sentence_information, null, 2)

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