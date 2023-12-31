
export function fetchFeedback(service_url, text, feedback = null) {
    if (feedback === null) {feedback = document.querySelector(".feedback-text").innerText;}
    let object = {"sentence": text, "feedback": feedback};
    fetch(service_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(object)
    });
}

export async function fetchData(service_url, chunk, sentence_information) {
  // document.getElementById("extra2").textContent = JSON.stringify([chunk, differences, fixed_chunk === "Hej jeg hedder Lucas"], null, 2)
  let object = {"sentence": chunk, "feedback": null};
  const response = await fetch(service_url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }, 
    body: JSON.stringify(object) 
  });
  if (!response.ok) {
    return "error"
  }
  const data = await response.text();
  const errors = JSON.parse(data.replace(/\\u([a-f0-9]{4})/gi, (match, group) => String.fromCharCode(parseInt(group, 16))));
  sentence_information.waiting_for_backend[chunk] = false
  sentence_information.errors_matching_text[chunk] = errors
  // document.getElementById("extra2").textContent = JSON.stringify([chunk, errors], null, 2)
  return errors
}

function create_fetching_error_message() {
    const rightColumn = document.querySelector(".right-column");
    document.getElementById("loading-screen").style.display = "none";
    errorText = document.createElement("div")
    errorText.classList.add("errorText")
    errorText.textContent = "Der er desværre sket en fejl på vores side. \nVi er opmærksomme på fejlen og retter den hurtigst muligt!"
    document.body.appendChild(errorText)
}

export function handle_fetching_error(status, service_url) {
  if (status !== "error") {return status}
  create_fetching_error_message()
  // sent auto feedback in case of error
  fetchFeedback(service_url, feedback="Automatic Feedback: Text Failed")
}
