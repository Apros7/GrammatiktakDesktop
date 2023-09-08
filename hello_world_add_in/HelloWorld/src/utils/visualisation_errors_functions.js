import { build_ooxml } from "../utils/ooxml_assistants.js"

export async function mark_text(sentence_information) {
    await Word.run(async (context) => {
        const indexes = get_indexes(sentence_information.errors_from_backend)
        const paragraphs = await get_paragraphs(context)
        for (let i = 0; i < paragraphs.items.length; i++) {
            const paragraph = paragraphs.items[i]
            const chunk_indexes = indexes[i]
            const ooxml = build_ooxml(chunk_indexes, paragraph.text)
            paragraph.clear()
            paragraph.insertOoxml(ooxml, Word.InsertLocation.start);
        }
    });
};

export async function correct_paragraph(correctedParagraph, chunkNumber) {
    await Word.run(async (context) => {
      const paragraphs = await get_paragraphs(context)
      paragraphs.items[chunkNumber].clear();
      paragraphs.items[chunkNumber].insertText(correctedParagraph, Word.InsertLocation.end)
      await context.sync();
  });
  }

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