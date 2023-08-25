
import { VisualError } from "../utils/visualisation_errors.js"
import { fetchData } from "../utils/fetching.js"
import { sleep, unnestErrors } from "../utils/helper_functions.js"
import { check_clear_message, activate_spinner } from "../utils/visualisation_other.js"

let sentence_information = {
  removed_error_ids: ["id1"],
  errors_from_backend: [],
  errors_matching_text: {},
  previous_chunks: [],
  text_at_correction_time: ""
} 

const service_url = "https://backend1-2f53ohkurq-ey.a.run.app";

Office.onReady((info) => {
  if (info.host === Office.HostType.Word) {
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";
    run()
    // document.getElementById("run").onclick = run;
  }
});

export async function run() {
  return Word.run(async (context) => {
    const extra = document.getElementById("extra");

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
  const textContent = paragraphs.items.map(paragraph => paragraph.text);
  return textContent;
}

async function update_info_text(context) {
  const textContent = await get_text(context)
  // document.getElementById("extra").textContent = JSON.stringify(sentence_information, null, 2)
  
  activate_spinner()
  let [checked, not_checked] = await check_each_chunk(context, textContent) 
  document.getElementById("chunks_checked").textContent = JSON.stringify(checked, null, 2)
  document.getElementById("chunks_to_correct").textContent = JSON.stringify(not_checked, null, 2)

  display_errors(context)
}

async function check_each_chunk(context, textContent) {
  let previous_errors = [...sentence_information.errors_from_backend]
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
      const errors = await fetchData(service_url, textContent[i])
      sentence_information.errors_matching_text[textContent[i]] = errors
      const currentTextContent = await get_text(context)
      if (currentTextContent.length !== textContent.length || currentTextContent[i] !== textContent[i]) {
        continue;
      }
      sentence_information.errors_from_backend.push(errors) 
    }
  }
  sentence_information.previous_chunks = checked_chunks.concat(not_checked_chunks);

  if (JSON.stringify(get_text()) === JSON.stringify(textContent) && textContent.length === sentence_information.errors_from_backend.length) { 
    display_errors()
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

function get_indexes(errors) {
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