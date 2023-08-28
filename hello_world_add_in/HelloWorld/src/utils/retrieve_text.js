
import { fixChunk } from "../utils/helper_functions.js"

export async function get_text(context) {
    var documentBody = context.document.body;
    context.load(documentBody);
    const paragraphs = documentBody.paragraphs;
    paragraphs.load("text");
    await context.sync();

    let textContent = paragraphs.items.map(paragraph => paragraph.text);
    textContent = textContent.map(text => text.replace(/\u0005/g, ''));
    textContent = textContent.map(text => fixChunk(text));
    return textContent;
  }