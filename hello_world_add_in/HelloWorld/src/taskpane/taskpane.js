
import { VisualError } from "../utils/visualisation_errors.js"
import { fetchData } from "../utils/fetching.js"
import { sleep, unnestErrors } from "../utils/helper_functions.js"

let previous_chunks = []
let errors_from_backend = []
let sentence_information = []

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
      await sleep(5000)
    }
    
  });
}

async function update_info_text(context) {
  const chunks_checked = document.getElementById("chunks_checked");
  const chunks_to_correct = document.getElementById("chunks_to_correct");
  const extra = document.getElementById("extra");

  var documentBody = context.document.body;
  context.load(documentBody);

  const paragraphs = documentBody.paragraphs;
  paragraphs.load("text");
  await context.sync()
  const textContent = paragraphs.items.map(paragraph => paragraph.text);//.join('<br>');
  
  extra.textContent = JSON.stringify(textContent, null, 2)
  let checked = []
  let not_checked = []
  if (textContent.length !== 1 || textContent[0].length !== 0) { 
    [checked, not_checked] = await check_each_chunk(textContent) 
  }
  chunks_checked.innerHTML = checked
  chunks_to_correct.innerHTML = not_checked
  // extra.innerHTML = errors_from_backend;
}

async function check_each_chunk(textContent) {
  const extra = document.getElementById("extra");
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

    // extra.innerHTML = textContent[i] + " will fetch: " + !foundInPreviousChunks
    
    if (foundInPreviousChunks) {
      checked_chunks.push(textContent[i]);
      errors_from_backend.push(previous_errors[i])
    } else {
      not_checked_chunks.push(textContent[i]);
      // extra.innerHTML = textContent[i]
      const errors = await fetchData(service_url, textContent[i])
      errors_from_backend.push(errors)
      display_errors()
    }
  }
  previous_chunks = checked_chunks.concat(not_checked_chunks);
  return [checked_chunks, not_checked_chunks];
}

async function display_errors() {
  const extra = document.getElementById("extra");
  const error_visualize_section = document.getElementById("errors-visualized");
  // extra.textContent = JSON.stringify(errors_from_backend, null, 2)
  const errors_to_visualize = await unnestErrors(errors_from_backend)

  while (error_visualize_section.firstChild) {
    error_visualize_section.removeChild(error_visualize_section.firstChild);
  }

  for (let i = 0; i < errors_to_visualize.length; i++) {
    error_visualize_section.appendChild(((new VisualError(errors_to_visualize[i], sentence_information, i)).visual_representation))
  }
}