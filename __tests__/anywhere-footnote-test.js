const asciidoctor = require('@asciidoctor/core')()
const registry = asciidoctor.Extensions.create()
require('../anywhere-footnote-postprocessor')(registry)

const fs = require('fs');

describe('Test the preprocessor', () => {

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
        
        expect(converted_doc).toContain("href='#first-block-1-block' id='first-block-1-ref'")
        expect(converted_doc).toContain("<a href='#first-block-1-ref' id='first-block-1-block' class=\"footnote\" style=\"text-decoration: none\"><sup>[1]</sup></a> This is a footnote<br/>")

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
        expect(converted_doc).toContain("It has two lines<a href='#first-block-1-block' id='first-block-1-ref' class=\"footnote\" style=\"text-decoration: none\"><sup>[1]</sup></a>, the last of which will contain a footnote<a href='#first-block-2-block' id='first-block-2-ref' class=\"footnote\" style=\"text-decoration: none\"><sup>[2]</sup></a>. And we have another sentence before the block</p>\n")
        expect(converted_doc).toContain("<a href='#first-block-1-ref' id='first-block-1-block' class=\"footnote\" style=\"text-decoration: none\"><sup>[1]</sup></a> This is a footnote<br/>")
        expect(converted_doc).toContain("<a href='#first-block-2-ref' id='first-block-2-block' class=\"footnote\" style=\"text-decoration: none\"><sup>[2]</sup></a> This a second footnote<br/>")
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

        expect(converted_doc).toContain("<a href='#first-block-reference-1-block' id='first-block-reference-1-ref' class=\"footnote\" style=\"text-decoration: none\"><sup>[1]</sup></a>")
        expect(converted_doc).toContain("<a href='#first-block-reference-1-block' class=\"footnote\" style=\"text-decoration: none\"><sup>[1]</sup></a>")
        expect(converted_doc).toContain("<a href='#first-block-reference-1-ref' id='first-block-reference-1-block' class=\"footnote\" style=\"text-decoration: none\"><sup>[1]</sup></a> This is a footnote<br/>")
    })

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



function writeFile(filename, content) {
    
    fs.writeFile(filename, content, function(err) {
        
        if(err) {
            return console.log(err);
        }
        
        console.log("The file was saved!");
    })
}