const asciidoctor = require('@asciidoctor/core')()
const registry = asciidoctor.Extensions.create()
require('../anywhere-footnote-preprocessor')(registry)
require('../anywhere-footnote-block-macroproccessor')(registry)
const fs = require('fs');

describe('Test the preprocessor', () => {

    test('Load basic file', () => {

        let input_document = ` 

= Test document

This is a test document.
It has two lines{empty}awfootnote:first-block[This is a footnote], the last of which will contain a footnote
`

        let converted_doc = asciidoctor.convert(input_document,{safe: 'safe', standalone: true,
            extension_registry: registry})

        console.log(converted_doc)

    })


    test('Two footnotes on the same line', () => {

        let input_document = ` 

= Test document

This is a test document.
It has two lines{empty}afnote:first-block[This is a footnote], the last of which will contain a footnote{empty}afnote:first-block[This is another footnote]. And we have another sentence before the block

afnote::first-block[]
`

        let converted_doc = asciidoctor.convert(input_document,{safe: 'safe', standalone: true,
            extension_registry: registry})
        writeFile("two-lines.html", converted_doc)


    })



    test('Two footnotes — the second on references the first', () => {

        let input_document = ` 

= Test document

This is a test document.
It has two lines{empty}afnote:first-block[refid='reference', This is a footnote], 
the last of which will contain a footnote{empty}afnote:first-block[refid='reference']
And we have another sentence before the block

afnote::first-block[]
`

        let converted_doc = asciidoctor.convert(input_document,{safe: 'safe', standalone: true,
            extension_registry: registry})
        writeFile("referencer.html", converted_doc)


    })

})


function writeFile(filename, content) {
    
    fs.writeFile(filename, content, function(err) {
        
        if(err) {
            return console.log(err);
        }
        
        console.log("The file was saved!");
    })
}