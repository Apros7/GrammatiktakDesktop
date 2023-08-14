/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office, Word */

let previous_chunks = []
let errors_from_backend = []

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

    update_info_text(context)
  });
}

async function update_info_text(context) {
  setInterval(() => {
    const chunks_checked = document.getElementById("chunks_checked");
    const chunks_to_correct = document.getElementById("chunks_to_correct");
    const extra = document.getElementById("extra");
    var documentBody = context.document.body;
    context.load(documentBody);
    const paragraphs = documentBody.paragraphs;
    paragraphs.load("text");
    context.sync().then(() => {
      const textContent = paragraphs.items.map(paragraph => paragraph.text);//.join('<br>');
      let [checked, not_checked] = check_each_chunk(textContent)
      chunks_checked.innerHTML = checked
      chunks_to_correct.innerHTML = not_checked
      extra.innerHTML = previous_chunks
    })
  }, 5000)
}

function check_each_chunk(textContent) {
  let checked_chunks = []
  let not_checked_chunks = []
  for (let i = 0; i < textContent.length; i++) {
    if (previous_chunks.includes(textContent[i])) {
      checked_chunks.push(textContent[i])
    } else {
      not_checked_chunks.push(textContent[i])
    }
  }
  previous_chunks = checked_chunks + not_checked_chunks
  return [checked_chunks, not_checked_chunks]

}



    // info_text_html.textContent = "Hej med dig"
    /**
     * Insert your Word code here
     */

    // insert a paragraph at the end of the document.
    // const paragraph = context.document.body.insertParagraph("Hello World", Word.InsertLocation.end);

    // // change the paragraph color to blue.
    // paragraph.font.color = "blue";