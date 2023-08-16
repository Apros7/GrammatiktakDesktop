


    // info_text_html.textContent = "Hej med dig"
    /**
     * Insert your Word code here
     */

    // insert a paragraph at the end of the document.
    // const paragraph = context.document.body.insertParagraph("Hello World", Word.InsertLocation.end);

    // // change the paragraph color to blue.
    // paragraph.font.color = "blue";


        // const info_text_html = document.getElementById("info-text");
    // var documentBody = context.document.body;
    // context.load(documentBody);

    // const paragraphs = documentBody.paragraphs;
    // paragraphs.load("text");

    // await context.sync()

    // const textContent = paragraphs.items.map(paragraph => paragraph.text).join('<br>');

    // info_text_html.innerHTML = textContent
    
    // const test_sentence = "Hej jeg hedder lucas"

    // extra.innerHTML = test_sentence
    // const errors = await fetchData(service_url, test_sentence)

    // extra.innerHTML = errors










// add_underline_on_words(context, indexes)

// function add_underline_on_words(context, indexes) {
//   var body = context.document.body;
//   var originalText = body.text;
//   var updatedText = originalText; 
//   let charactersAdded = 0;

//   // Define an invisible marker character (zero-width space)
//   var marker = '\u200B'; // Zero-Width Space

//   indexes.forEach((indexesThisParagraph) => {
//     indexesThisParagraph.forEach((indexRange) => {
//       var startIndex = indexRange[0];
//       var endIndex = indexRange[1];

//       var range = body.getRange(startIndex, endIndex + 1)
//       range.font.color = "#FF0000"
  
//       updatedText = updatedText.substring(0, startIndex + charactersAdded) + marker + updatedText.substring(startIndex + charactersAdded);
//       charactersAdded += marker.length;
      
//       // Adjust the end index for the next insertion
//       endIndex += marker.length;
      
//       updatedText = updatedText.substring(0, endIndex + charactersAdded) + marker + updatedText.substring(endIndex + charactersAdded);
//       charactersAdded += marker.length;
//     })
//   })
//   // body.insertHtml(updatedText, Word.InsertLocation.replace);
//   return context.sync()
// }


// function get_indexes(errors) {
//   let indexes = []
//   for (let i = 0; i < errors.length; i++) {
//     let current_indexes = []
//     for (let j = 0; j < errors[i].length; j++) {
//         current_indexes.push(errors[i][j][2])
//     }
//     indexes.push(current_indexes)
//   }
//   return indexes
// }

// async function make_sentence_red(context) {
//   const body = context.document.body
//   const indexes = get_indexes(errors_from_backend)
//   document.getElementById("extra").textContent = JSON.stringify(indexes, null, 2)

//   indexes.forEach((indexesThisParagraph) => {
//     indexesThisParagraph.forEach((indexRange) => {
//       var startIndex = indexRange[0];
//       var endIndex = indexRange[1];
//       let range = body.getRange(startIndex, endIndex)
//       range.font.color = "#FF0000"
//     })
//   })
//   document.getElementById("extra2").textContent = JSON.stringify(indexes, null, 2)
// }