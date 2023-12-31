import { add_comment, mark_text2 } from "/src/taskpane/taskpane.js"
import { create_id_from_raw_error } from "/src/utils/helper_functions.js"
import { get_text } from "../utils/retrieve_text.js"
import { correct_paragraph } from "./visualisation_errors_functions.js"
import { mark_text } from "../utils/visualisation_errors_functions.js"

export class VisualError {
  constructor(error, sentence_information, error_index, context) {
    this.wrong_word = error[0]
    this.right_word = error[1]
    this.indexes = error[2]
    this.description = error[3]
    this.chunk_number = error[4]
    this.sentence_information = sentence_information
    this.error_index = error_index
    this.context = context
    this.id = this.create_id()
    this.visual_representation = document.createElement("div")
    this.visual_representation.classList.add("error-message")
    this.init_visual_representation()
  }

  create_id() {
    return this.indexes[0] + this.wrong_word + this.indexes[1]
  }

  should_visualize_id() {
    if (this.sentence_information.removed_error_ids.includes(this.id)) {return false}
    return true
  }

  init_visual_representation() {
    this.visual_representation.append(this.create_close_button())
    this.visual_representation.append(this.create_wrong_word())
    this.visual_representation.append(this.create_arrow())
    this.visual_representation.append(this.create_right_word())
    this.visual_representation.append(this.create_description())
    this.visual_representation.append(this.create_addAsComment())
  }

  create_close_button() {
    const closeButton = document.createElement("div");
    closeButton.classList.add("close-button");
    closeButton.textContent = "X";
    closeButton.addEventListener("click", () => {
      this.visual_representation.remove()
      this.sentence_information.removed_error_ids.push(this.id)
      mark_text(this.sentence_information)
    });
    return closeButton
  }

  create_wrong_word() {
    const wrongWord = document.createElement("div");
    wrongWord.classList.add("wrongWord")
    wrongWord.textContent = this.wrong_word
    return wrongWord
  }

  create_arrow() {
    const arrow = document.createElement("div");
    arrow.classList.add("arrow")
    arrow.innerHTML = "&#8594;"
    return arrow
  }

  create_description() {
    const description = document.createElement("div");
    description.classList.add("description");
    description.textContent = this.description
    return description
  }

  create_addAsComment() {
    const addAsComment = document.createElement("div");
    addAsComment.classList.add("addAsComment");
    addAsComment.textContent = "Tilføj som kommentar."
    addAsComment.addEventListener("click", async() => {
      this.visual_representation.remove()
      this.sentence_information.removed_error_ids.push(this.id)
      const commentText = '"' + this.wrong_word + '"' + " -> " + '"' + this.right_word + '"' + "\n" + this.description
      add_comment(this.chunk_number, commentText, this.indexes)
    });
    return addAsComment
  }

  create_right_word() {
    const correctWord = document.createElement("div");
    correctWord.classList.add("correctWord")
    correctWord.textContent = this.right_word;
    correctWord.addEventListener("click", async() => {
      const textContent = await get_text(this.context)
      const [correctedParagraph, previousParagraph] = await this.get_corrected_paragraph(textContent)

      correct_paragraph(correctedParagraph, this.chunk_number)
      this.update_sentence_information(correctedParagraph, previousParagraph)
      this.visual_representation.remove()
    })
    return correctWord
  }

  get_corrected_paragraph(textContent) {
    const relevantParagraph = textContent[this.chunk_number]
    const correctedParagraph = relevantParagraph.substring(0, this.indexes[0]) + this.right_word + relevantParagraph.substring(this.indexes[1])
    return [correctedParagraph, relevantParagraph]
  }

  update_sentence_information(correctedParagraph, previousParagraph) {
    let chunkErrors = this.sentence_information.errors_matching_text[previousParagraph]
    let errorsOtherThanThis = []
    for (let i = 0; i < chunkErrors.length; i++) {
      if (create_id_from_raw_error(chunkErrors[i]) !== this.id) {
        errorsOtherThanThis.push(this.push_error(chunkErrors[i]))
      }
    }
    this.sentence_information.errors_matching_text[correctedParagraph] = errorsOtherThanThis
    this.sentence_information.previous_chunks[this.chunk_number] = correctedParagraph
  }

  push_error(error) {
    // when one error is correct, the other errors indexes has to be adjusted accordingly
    if (error[2][0] < this.indexes[1]) { return error }
    const pushAmount = this.right_word.length - this.wrong_word.length
    error[2][0] += pushAmount
    error[2][1] += pushAmount
    return error
  }
}