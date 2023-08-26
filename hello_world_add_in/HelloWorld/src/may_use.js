


//     // info_text_html.textContent = "Hej med dig"
//     /**
//      * Insert your Word code here
//      */

//     // insert a paragraph at the end of the document.
//     // const paragraph = context.document.body.insertParagraph("Hello World", Word.InsertLocation.end);

//     // // change the paragraph color to blue.
//     // paragraph.font.color = "blue";


//         // const info_text_html = document.getElementById("info-text");
//     // var documentBody = context.document.body;
//     // context.load(documentBody);

//     // const paragraphs = documentBody.paragraphs;
//     // paragraphs.load("text");

//     // await context.sync()

//     // const textContent = paragraphs.items.map(paragraph => paragraph.text).join('<br>');

//     // info_text_html.innerHTML = textContent
    
//     // const test_sentence = "Hej jeg hedder lucas"

//     // extra.innerHTML = test_sentence
//     // const errors = await fetchData(service_url, test_sentence)

//     // extra.innerHTML = errors










// // add_underline_on_words(context, indexes)

// // function add_underline_on_words(context, indexes) {
// //   var body = context.document.body;
// //   var originalText = body.text;
// //   var updatedText = originalText; 
// //   let charactersAdded = 0;

// //   // Define an invisible marker character (zero-width space)
// //   var marker = '\u200B'; // Zero-Width Space

// //   indexes.forEach((indexesThisParagraph) => {
// //     indexesThisParagraph.forEach((indexRange) => {
// //       var startIndex = indexRange[0];
// //       var endIndex = indexRange[1];

// //       var range = body.getRange(startIndex, endIndex + 1)
// //       range.font.color = "#FF0000"
  
// //       updatedText = updatedText.substring(0, startIndex + charactersAdded) + marker + updatedText.substring(startIndex + charactersAdded);
// //       charactersAdded += marker.length;
      
// //       // Adjust the end index for the next insertion
// //       endIndex += marker.length;
      
// //       updatedText = updatedText.substring(0, endIndex + charactersAdded) + marker + updatedText.substring(endIndex + charactersAdded);
// //       charactersAdded += marker.length;
// //     })
// //   })
// //   // body.insertHtml(updatedText, Word.InsertLocation.replace);
// //   return context.sync()
// // }


// // function get_indexes(errors) {
// //   let indexes = []
// //   for (let i = 0; i < errors.length; i++) {
// //     let current_indexes = []
// //     for (let j = 0; j < errors[i].length; j++) {
// //         current_indexes.push(errors[i][j][2])
// //     }
// //     indexes.push(current_indexes)
// //   }
// //   return indexes
// // }

// // async function make_sentence_red(context) {
// //   const body = context.document.body
// //   const indexes = get_indexes(errors_from_backend)
// //   document.getElementById("extra").textContent = JSON.stringify(indexes, null, 2)

// //   indexes.forEach((indexesThisParagraph) => {
// //     indexesThisParagraph.forEach((indexRange) => {
// //       var startIndex = indexRange[0];
// //       var endIndex = indexRange[1];
// //       let range = body.getRange(startIndex, endIndex)
// //       range.font.color = "#FF0000"
// //     })
// //   })
// //   document.getElementById("extra2").textContent = JSON.stringify(indexes, null, 2)
// // }



// -----



// async correct_paragraph(textContent) {

//     const relevantParagraph = textContent[this.chunk_number]
//     const correctedParagraph = relevantParagraph.substring(0, this.indexes[0]) + this.right_word + relevantParagraph.substring(this.indexes[1])

//     // const body = this.context.document.body;
//     // const paragraphs = body.paragraphs
//     // document.getElementById("extra2").textContent = JSON.stringify("hey1", null, 2)
//     // // selection.insertText(correctedParagraph, Word.InsertLocation.replace);
//     // paragraphs.load();

//     // var documentBody = this.context.document.body;
//     // this.context.load(documentBody);

//     // const paragraphs = this.context.document.body.paragraphs;
//     // paragraphs.load("style");
    
//     document.getElementById("extra2").textContent = JSON.stringify("hey", null, 2)
//     document.getElementById("extra2").textContent = JSON.stringify("hey2", null, 2)
//     // await this.context.sync();
//     document.getElementById("extra2").textContent = JSON.stringify(paragraphs, null, 2)
//     // paragraphs.items[this.chunk_number].clear();
//     // const paragraphToChange = paragraphs.items[this.chunk_number]
//     document.getElementById("extra2").textContent = JSON.stringify(paragraphToChange, null, 2)
//     // paragraphToChange.clear()
//     // paragraphToChange.insertText(correctedParagraph, Word.InsertLocation.after)
//     document.getElementById("extra2").textContent = JSON.stringify(paragraphToChange, null, 2)
    
//     // documentBody.insertText("2222", Word.InsertLocation.end)
//     // await this.context.sync();
//     document.getElementById("extra2").textContent = JSON.stringify("hey6", null, 2)



//     // selection.load("text");
//     // await this.context.sync();
//     // paragraphs.items[this.chunk_number].select()
//     // document.getElementById("extra2").textContent = JSON.stringify(paragraphs.items, null, 2)
//     // const selection = this.context.document.getSelection()
//     // selection.insertText(correctedParagraph, Word.InsertLocation.replace);
//     document.getElementById("extra2").textContent = JSON.stringify("hey7", null, 2)
//     // await this.context.sync();
//     document.getElementById("extra2").textContent = JSON.stringify("hey8", null, 2)


//     // paragraph.select()

//     // document.getElementById("extra2").textContent = JSON.stringify("hey4", null, 2)
//     // const paragraphsObj = this.context.document.body.paragraphs;
//     // this.context.load(paragraphsObj, ["items", "text"])
//     // this.context.sync().then(() => {
//     //   paragraphsObj.items[this.chunk_number].insertParagraph(correctedParagraph, Word.InsertLocation.end)
//     // }).then(() => {
//     //   this.context.sync(); 
//     //   document.getElementById("extra2").textContent = JSON.stringify(paragraphsObj.items[this.chunk_number], null, 2)
//     // })
//     // const originalRange = this.context.document.body.getRange(relevantParagraph);
//     // document.getElementById("extra2").textContent = JSON.stringify("hey1", null, 2)

//     // const start = originalRange.start + this.indexes[0];
//     // const end = originalRange.start + this.indexes[1];

//     // document.getElementById("extra2").textContent = JSON.stringify("hey2", null, 2)

//     // paragraphsObj.items[this.chunk_number].insertParagraph(correctedParagraph, Word.InsertLocation.replace)

//     // document.getElementById("extra2").textContent = JSON.stringify("hey3", null, 2)
    
//     // this.context.document.body.insertParagraph("Hello World", Word.InsertLocation.replace);
//     // documentBody.insertParagraph(correctedParagraph, Word.InsertLocation.after);
//     // this.context.sync()

//     // document.getElementById("extra2").textContent = JSON.stringify("hey4", null, 2)

//     // const correctedRange = this.context.document.body.getRange(start, start + correctedText.length);
//     // correctedRange.setFormattings(formatting);

//     // document.getElementById("extra2").textContent = JSON.stringify(paragraphsObj.items[this.chunk_number], null, 2)
    
//     // textContent[this.chunk_number] = correctedParagraph
//     // this.context.document.body.clear();
//     // for (let i = 0; i < textContent.length; i++) {
//     //   if (textContent[i].length > 0) {
//     //     this.context.document.body.insertParagraph(textContent[i], Word.InsertLocation.end);
//     //   }
//     // }
//     return [correctedParagraph, relevantParagraph]
//   }

// -----

// function get_indexes(errors) {
//     let indexes = []
//     for (let i = 0; i < errors.length; i++) {
//       let current_indexes = []
//       for (let j = 0; j < errors[i].length; j++) {
//           current_indexes.push(errors[i][j][2])
//       }
//       indexes.push(current_indexes)
//     }
//     return indexes
//   }