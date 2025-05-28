const asciidoctor = require('@asciidoctor/core')()
const registry = asciidoctor.Extensions.create()
require('../anywhere-footnote-preprocessor')(registry)
require('../anywhere-footnote-block-macroproccessor')(registry)
const fs = require('fs');

describe('Test the tabling', () => {
    
    test('Load basic table file', () => {

        let input_document = ` 

= Test document

The whole point of this is to give Asciidoc the ability to add footnotes to tables.
And then also have them rendered underneath it.

|===

| Title | Description  | Summary

| First try some text in the first columm.
| Then add a full description, but also include a footnote{empty}afnote:first-block[This is a footnote]
| And we can add a summary footnote in the last columnafnote:first-block[This is a summary footnote].
|===

afnote::first-block[]

And of course, we can add some text below our footnotes

`

        let converted_doc = asciidoctor.convert(input_document,{safe: 'safe', standalone: true,
            extension_registry: registry})

        writeFile("basic-table.html", converted_doc)

    })


    test('Load two tables, two sets of footnotes', () => {

        let input_document = ` 

= Test document

The whole point of this is to give Asciidoc the ability to add footnotes to tables.
And then also have them rendered underneath it.

|===

| Title | Description  | Summary

| First try some text in the first columm.
| Then add a full description, but also include a footnote{empty}afnote:first-block[This is a footnote]
| And we can add a summary footnote in the last columnafnote:first-block[This is a summary footnote].
|===

afnote::first-block[]

And of course, we can add some text below our footnotes

|===

| Name | Details  | Summary

| First try some text in the first columm.
| Then add a full description, but also include a footnote{empty}afnote:second-block[This is a second block]
| And we can add a summary footnote in the last columnafnote:second-block[This is a summary footnote for the second block].
|===

afnote::second-block[]
`

        let converted_doc = asciidoctor.convert(input_document,{safe: 'safe', standalone: true,
            extension_registry: registry})

        writeFile("two-tables.html", converted_doc)

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