
import { VisualError } from "../utils/visualisation_errors.js"
import { fetchData } from "../utils/fetching.js"
import { sleep, unnestErrors } from "../utils/helper_functions.js"

let previous_chunks = []
let errors_from_backend = []
let sentence_information = {"removed_error_ids": ["id1"]}

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

async function get_text(context) {
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
  document.getElementById("extra").textContent = JSON.stringify(sentence_information, null, 2)

  let [checked, not_checked] = await check_each_chunk(context, textContent) 
  document.getElementById("chunks_checked").textContent = JSON.stringify(checked, null, 2)
  document.getElementById("chunks_to_correct").textContent = JSON.stringify(not_checked, null, 2)

  display_errors(context)
}

async function check_each_chunk(context, textContent) {
  let previous_errors = [...errors_from_backend]
  errors_from_backend = []
  let checked_chunks = [];
  let not_checked_chunks = [];
  
  for (let i = 0; i < textContent.length; i++) {
    let foundInPreviousChunks = false;
    
    for (let j = 0; j < previous_chunks.length; j++) {
      if (textContent[i] === previous_chunks[j]) {
        foundInPreviousChunks = true;
        break;
      }
    }

    // document.getElementById("extra2").textContent = "Fetching: " + textContent[i]
    
    if (foundInPreviousChunks) {
      checked_chunks.push(textContent[i]);
      errors_from_backend.push(previous_errors[i])
    } else if (textContent[i].trim().length > 0) {
      display_errors(context)
      not_checked_chunks.push(textContent[i]);
      const errors = await fetchData(service_url, textContent[i])
      const currentTextContent = await get_text(context)
      if (currentTextContent.length !== textContent.length || currentTextContent[i] !== textContent[i]) {
        display_errors(context)
        return;
      }
      errors_from_backend.push(errors)
    } else {
      errors_from_backend.push([])
    }
  }
  previous_chunks = checked_chunks.concat(not_checked_chunks);
  return [checked_chunks, not_checked_chunks];
}

async function display_errors(context) {

  const error_visualize_section = document.getElementById("errors-visualized");
  const errors_to_visualize = await unnestErrors(errors_from_backend)

  while (error_visualize_section.firstChild) {
    error_visualize_section.removeChild(error_visualize_section.firstChild);
  }

  for (let i = 0; i < errors_to_visualize.length; i++) {
    const new_visual_error = new VisualError(errors_to_visualize[i], sentence_information, i)
    if (new_visual_error.should_visualize_id()) { 
      document.getElementById("extra2").textContent = "yoyo"
      error_visualize_section.appendChild((new_visual_error.visual_representation))
    }
    // error_visualize_section.appendChild(((new VisualError(errors_to_visualize[i], sentence_information, i)).visual_representation))
  }
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