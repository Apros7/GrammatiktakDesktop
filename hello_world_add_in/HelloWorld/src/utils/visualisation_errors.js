
export class VisualError {
  constructor(error, sentence_information, error_index) {
    this.wrong_word = error[0]
    this.right_word = error[1]
    this.indexes = error[2]
    this.description = error[3]
    this.sentence_information = sentence_information
    this.error_index = error_index
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
  }

  create_close_button() {
    const closeButton = document.createElement("div");
    closeButton.classList.add("close-button");
    closeButton.textContent = "X";
    closeButton.addEventListener("click", () => {
      this.visual_representation.remove()
      this.sentence_information.removed_error_ids.push(this.id)
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

  create_right_word() {
    const correctWord = document.createElement("div");
    correctWord.classList.add("correctWord")
    correctWord.textContent = this.right_word;
    correctWord.addEventListener("click", () => {
      this.visual_representation.remove()
    })
    return correctWord
  }

  create_description() {
    const description = document.createElement("div");
    description.classList.add("description");
    description.textContent = this.description
    return description
  }
}