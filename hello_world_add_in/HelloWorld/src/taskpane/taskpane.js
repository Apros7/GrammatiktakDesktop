
import { VisualError } from "../utils/visualisation_errors.js"
import { fetchData } from "../utils/fetching.js"
import { sleep } from "../utils/helper_functions.js"

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
    // const info_text_html = document.getElementById("info-text");
    // var documentBody = context.document.body;
    // context.load(documentBody);

    // const paragraphs = documentBody.paragraphs;
    // paragraphs.load("text");

    // await context.sync()

    // const textContent = paragraphs.items.map(paragraph => paragraph.text).join('<br>');

    // info_text_html.innerHTML = textContent

    const extra = document.getElementById("extra");

    // const test_sentence = "Hej jeg hedder lucas"

    // extra.innerHTML = test_sentence
    // const errors = await fetchData(service_url, test_sentence)

    // extra.innerHTML = errors

    let test_error = ["hej", "Hej.", [0, 3], "'Hej' skal starte med stort"]
    document.body.appendChild(((new VisualError(test_error, sentence_information, 0)).visual_representation))

    // while (true) {
    //   extra.innerHTML = "Resetting"
    //   update_info_text(context)
    //   sleep(2000)
    // }
    
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
  let [checked, not_checked] = await check_each_chunk(textContent)
  extra.innerHTML = "Checking each chunk9"
  chunks_checked.innerHTML = checked
  chunks_to_correct.innerHTML = not_checked
  extra.innerHTML = errors_from_backend;
}

async function check_each_chunk(textContent) {
  const extra = document.getElementById("extra");
  let previous_errors = [...errors_from_backend]
  errors_from_backend = []
  let checked_chunks = [];
  let not_checked_chunks = [];

  extra.innerHTML = "Checking each chunk"
  
  for (let i = 0; i < textContent.length; i++) {
    let foundInPreviousChunks = false;

    extra.innerHTML = "Checking each chunk1"
    
    for (let j = 0; j < previous_chunks.length; j++) {
      if (textContent[i] === previous_chunks[j]) {
        foundInPreviousChunks = true;
        break;
      }
    }

    extra.innerHTML = textContent[i] + " will fetch: " + foundInPreviousChunks
    
    if (foundInPreviousChunks) {
      extra.innerHTML = "Checking each chunk3"
      checked_chunks.push(textContent[i]);
      extra.innerHTML = "Checking each chunk4"
      errors_from_backend.push(previous_errors[i])
    } else {
      not_checked_chunks.push(textContent[i]);
      extra.innerHTML = textContent[i]
      const errors = await fetchData(service_url, textContent[i])
      errors_from_backend.push(errors)
    }
  }
  
  extra.innerHTML = "Checking each chunk7"

  previous_chunks = checked_chunks.concat(not_checked_chunks);
  
  extra.innerHTML = "Checking each chunk8"

  return [checked_chunks, not_checked_chunks];
}

// function display_errors(errors) {

// }