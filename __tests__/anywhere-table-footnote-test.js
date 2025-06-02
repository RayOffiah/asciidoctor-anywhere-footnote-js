const asciidoctor = require('@asciidoctor/core')()
const registry = asciidoctor.Extensions.create()
require('../anywhere-footnote-treeprocessor')(registry)
require('../anywhere-footnote-postprocessor')(registry)
const fs = require('fs');

describe('Test the preprocessor', () => {

    test('Load basic table file', () => {

        let input_document = ` 


= Test document

:test: afnote::first-block[] 
== First section

Some random text before we crack on with the table.

And we can add in the Asciidoc logo

image::asciidoc-logo.png[And a logo]

In this document, we use a table with footnotes. It's important to test this thoroughly. Why?
. It will make sure that nested items are handled correctly.
. Table support is kind of the point.

|===
| Name | Description | Summary

| Ray Offiah
| Technical Writerafnote:first-block[Part time]
| All round good egg

| Boregard Jones
| Corporate checker
| CEO, Astronaut{empty}afnote:first-block[This guy is fictional]
|===


{test}

And then follow it with some more text.
`

        let converted_doc = asciidoctor.convert(input_document,{safe: 'safe', standalone: true,
            extension_registry: registry})

        writeFile("basic-table.html", converted_doc)

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