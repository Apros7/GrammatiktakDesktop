/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office, Word */

Office.onReady((info) => {
  if (info.host === Office.HostType.Word) {
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";
    document.getElementById("run").onclick = run;
  }
});

export async function run() {
  return Word.run(async (context) => {
    const info_text_html = document.getElementById("info-text");
    var documentBody = context.document.body;
    context.load(documentBody);
    // info_text_html.textContent = "Hej med dig"
    /**
     * Insert your Word code here
     */

    // insert a paragraph at the end of the document.
    // const paragraph = context.document.body.insertParagraph("Hello World", Word.InsertLocation.end);

    // // change the paragraph color to blue.
    // paragraph.font.color = "blue";

    const paragraphs = documentBody.paragraphs;
    paragraphs.load("text");

    await context.sync()

    const textContent = paragraphs.items.map(paragraph => paragraph.text).join('<br>');

    info_text_html.innerHTML = textContent

    update_info_text(context)
  });
}

async function update_info_text(context) {
  setInterval(() => {
    const info_text_html = document.getElementById("info-text");
    var documentBody = context.document.body;
    context.load(documentBody);
    context.sync().then(() => {
      info_text_html.innerHTML = documentBody.text;
    })
  }, 10000)
}
