export function check_clear_message(sentence_information) {
  const error_visualize_section = document.getElementById("errors-visualized");
  // document.getElementById("extra2").textContent = [error_visualize_section.childElementCount, chunks.length, sentence_information.errors_from_backend.length]
  if (error_visualize_section.childElementCount === 0) {
    error_visualize_section.innerHTML = ""
    let allClearText = document.createElement("div")
    allClearText.classList.add("allClearText")
    allClearText.textContent = "Det ser ud til, at din tekst er fejlfri 😊."
    error_visualize_section.appendChild(allClearText)
  }
}

export function activate_spinner() {
  const error_visualize_section = document.getElementById("errors-visualized");
  error_visualize_section.innerHTML = "";

  const background = document.createElement("div");
  background.classList.add("spinner-background")

  let text = document.createElement("div");
  text.classList.add("spinner-text")
  text.innerText = "Vi retter din tekst..."

  const spinner = document.createElement("div");
  spinner.classList.add("spinner")
  
  background.appendChild(spinner)
  background.appendChild(text)
  error_visualize_section.appendChild(background)
}