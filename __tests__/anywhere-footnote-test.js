const asciidoctor = require('@asciidoctor/core')()
const registry = asciidoctor.Extensions.create()
require('../anywhere-footnote-preprocessor')(registry)

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
It has two lines{empty}afnote:first-block[This is a footnote], 
the last of which will contain a footnote{empty}afnote:first-block[This is another footnote]
`

    let converted_doc = asciidoctor.convert(input_document,{safe: 'safe', standalone: true,
        extension_registry: registry})

    console.log(converted_doc)

})