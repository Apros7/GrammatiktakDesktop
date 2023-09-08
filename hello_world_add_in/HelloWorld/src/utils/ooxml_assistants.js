

export function build_ooxml(indexes, text) {
    const [allIndexes, shouldHaveUnderline] = find_all_indexes(indexes, text)
    let ooxmlBuild = ooxmlBaseTop 
    let texts = []
    for (let i = 0; i < shouldHaveUnderline.length; i++) {
        const text_part = check_last_character_for_space_error(text.substring(allIndexes[i][0], allIndexes[i][1]))
        texts.push([text_part, text_part.slice(-1)])
        ooxmlBuild += build_ooxml_part(text_part, shouldHaveUnderline[i])
    }
    ooxmlBuild += ooxmlBaseBottom
    return ooxmlBuild
}

function check_last_character_for_space_error(text) {
    if (text.slice(-1) == " ") { text = text.substring(0, text.length-1) + "&#160;"}
    if (text.charAt(0) == " ") { text = "&#160;" + text.substring(1, text.length) }
    return text
}

function find_all_indexes(indexes, text) {
    let lastNumber = 0
    let allIndexes = []
    let shouldHaveUnderline = []
    for (const index of indexes) {
        allIndexes.push([lastNumber, index[0]])
        shouldHaveUnderline.push(false)
        lastNumber = index[1]
        allIndexes.push(index)
        shouldHaveUnderline.push(true)
    }
    if (lastNumber < text.length - 1) { allIndexes.push([lastNumber, text.length - 1]); shouldHaveUnderline.push(false) }
    return [allIndexes, shouldHaveUnderline]
}

function build_ooxml_part(text, includeUnderline) {
    if (includeUnderline) {
        return `<w:r>
        <w:rPr>
          <w:u w:val='single' w:color='0000FF' w:sz='40'/>
        </w:rPr>
        <w:t>${text}</w:t>
      </w:r>`
    } else {
        return `<w:r>
        <w:t>${text}</w:t>
      </w:r>`
    }
}

const ooxmlBaseTop = `<pkg:package xmlns:pkg='http://schemas.microsoft.com/office/2006/xmlPackage'>
<pkg:part pkg:name='/_rels/.rels' pkg:contentType='application/vnd.openxmlformats-package.relationships+xml' pkg:padding='512'>
  <pkg:xmlData>
    <Relationships xmlns='http://schemas.openxmlformats.org/package/2006/relationships'>
      <Relationship Id='rId1' Type='http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument' Target='word/document.xml'/>
    </Relationships>
  </pkg:xmlData>
</pkg:part>
<pkg:part pkg:name='/word/document.xml' pkg:contentType='application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml'>
  <pkg:xmlData>
    <w:document xmlns:w='http://schemas.openxmlformats.org/wordprocessingml/2006/main'>
      <w:body>
        <w:p>
          <w:pPr>
            <w:spacing w:before='360' w:after='0' w:line='480' w:lineRule='auto'/>
            <w:rPr>
              <w:u w:val='single' w:color='0000FF' w:sz='20'/>
            </w:rPr>
          </w:pPr>`
const ooxmlBaseBottom = `</w:p>
</w:body>
</w:document>
</pkg:xmlData>
</pkg:part>
</pkg:package>`