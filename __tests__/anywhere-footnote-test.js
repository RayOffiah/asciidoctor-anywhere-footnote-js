const asciidoctor = require('@asciidoctor/core')()
const fs = require('fs');

describe('Test the preprocessor', () => {
    
    let registry;

    beforeEach(() => {
        registry = asciidoctor.Extensions.create();
        require('../anywhere-footnote-postprocessor')(registry);
    });
    

    test('Load basic file', () => {

        let input_document = ` 

= Test document

This is a test document.
It has two lines{empty}afnote:first-block[This is a footnote], the last of which will contain a footnote

afnote::first-block[]
`

        let converted_doc = asciidoctor.convert(input_document,{safe: 'safe', standalone: true,
            extension_registry: registry})

        writeFile("basic.html", converted_doc)
 
    })


    test('Two footnotes on the same line', () => {

        let input_document = ` 

= Test document

This is a test document.
It has two lines{empty}afnote:first-block[This is a footnote], the last of which will contain a footnote{empty}afnote:first-block[This a second footnote]. And we have another sentence before the block

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
It has two lines{empty}afnote:first-block[refid='reference', reftext='This is a footnote'], 
the last of which will contain a footnote{empty}afnote:first-block[refid='reference']
And we have another sentence before the block

afnote::first-block[]
`

        let converted_doc = asciidoctor.convert(input_document,{safe: 'safe', standalone: true,
            extension_registry: registry})
        writeFile("referencer.html", converted_doc)

    })


    test('Using reference marks', () => {

        let input_document = ` 

= Test document

This is a test document.
It has two lines{empty}afnote:first-block[marker='*', refid='reference', reftext='This is a footnote'], 
the last of which will contain a footnote{empty}afnote:first-block[refid='reference']
And we have another sentence before the block

afnote::first-block[]
`

        let converted_doc = asciidoctor.convert(input_document,{safe: 'safe', standalone: true,
            extension_registry: registry})
        writeFile("marker.html", converted_doc)



    })



})




function writeFile(filename, content) {
    
    fs.writeFileSync(filename, content)
}