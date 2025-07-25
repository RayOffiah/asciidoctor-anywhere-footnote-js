const asciidoctor = require('@asciidoctor/core')()
const fs = require('fs');
const { describe, test, expect } =require('@jest/globals') ;

describe('Test the processor', () => {
    
    let registry;

    beforeEach(() => {
        registry = asciidoctor.Extensions.create();
        require('../anywhere-footnote-processor')(registry);
    });
    

    test('Load basic file', () => {
        
        let input_document = ` 

= Test document


++++
<link rel="stylesheet" href="anywhere-footnote.css"/>
++++

This is a test document.
It has two lines{empty}afnote:first-block[This is a footnote, lbrace='{empty}', rbrace='{empty}'], the last of which will contain a footnote

afnote:first-block[]
`

        let converted_doc = asciidoctor.convert(input_document,{safe: 'safe', standalone: true,
            extension_registry: registry})
        
        expect(converted_doc.includes(`<a id="afnote-first-block-1-ref">`)).toBeTruthy()
        expect(converted_doc.includes(`<a href="#afnote-first-block-1-def">`)).toBeTruthy()
        expect(converted_doc.includes(`<a id="afnote-first-block-1-def"></a><a href="#afnote-first-block-1-ref" class="afnote-marker">`)).toBeTruthy()
        
        writeFile("basic.html", converted_doc)
 
    })


    test('Two footnotes on the same line', () => {
        
        // noinspection SpellCheckingInspection
        let input_document = ` 

= Test document

++++
<link rel="stylesheet" href="anywhere-footnote.css"/>
++++

This is a test document.
It has two lines{empty}afnote:first-block[This is a footnote], the last of which will contain a footnote{empty}afnote:first-block[This a second footnote]. And we have another sentence before the block

afnote::first-block[]

Test line
`

        let converted_doc = asciidoctor.convert(input_document,{safe: 'safe', standalone: true,
            extension_registry: registry})
        
        // Make sure both footnotes are processed. 
        expect(converted_doc.includes(`It has two lines<span class="afnote-marker"><a id="afnote-first-block-1-ref"></a><a href="#afnote-first-block-1-def">1</a></span>, the last of which will contain a footnote<span class="afnote-marker"><a id="afnote-first-block-2-ref"></a><a href="#afnote-first-block-2-def">2</a></span>. And we have another sentence before the block</p>
`)).toBeTruthy()
        
        expect(converted_doc.includes(`<dt class="hdlist1"><a id="afnote-first-block-1-def"></a><a href="#afnote-first-block-1-ref" class="afnote-marker">1</a></dt>
`)).toBeTruthy()
        
        expect(converted_doc.includes(`<dt class="hdlist1"><a id="afnote-first-block-2-def"></a><a href="#afnote-first-block-2-ref" class="afnote-marker">2</a></dt>
`)).toBeTruthy()
        
        expect(converted_doc.includes(`Test line`)).toBeTruthy()
        
        writeFile("two-lines.html", converted_doc)
        
    })



    test('Two footnotes — the second on references the first', () => {

        // noinspection SpellCheckingInspection GrammarInspection
        let input_document = ` 

= Test document

++++
<link rel="stylesheet" href="anywhere-footnote.css"/>
++++

This is a test document.
It has two lines{empty}afnote:first-block[refid='reference', reftext='This is a footnote'], 
the last of which will contain a footnote{empty}afnote:first-block[refid='reference']
And we have another sentence before the block

afnote:first-block[]
`

        let converted_doc = asciidoctor.convert(input_document,{safe: 'safe', standalone: true,
            extension_registry: registry})

        expect(countOccurrences(converted_doc, `#afnote-first-block-reference-def`)).toBe(2)
        writeFile("referencer.html", converted_doc)

    })

    test('Using two marker', () => {

        // noinspection SpellCheckingInspection GrammarInspection
        let input_document = ` 

= Test document

++++
<link rel="stylesheet" href="anywhere-footnote.css"/>
++++

This is a test document.
It has two lines{empty}afnote:first-block[marker='*', reftext='This is a footnote'], 
the last of which will contain a footnote{empty}afnote:first-block[Another marker, marker='#']
And we have another sentence before the block

afnote:first-block[]
`

        let converted_doc = asciidoctor.convert(input_document,{safe: 'safe', standalone: true,
            extension_registry: registry})

        expect(converted_doc.includes(`<a href="#afnote-first-block-1-ref" class="afnote-marker">*</a>`)).toBeTruthy()
        expect(converted_doc.includes(`<a href="#afnote-first-block-2-ref" class="afnote-marker">#</a>`)).toBeTruthy()
        
        writeFile("two_markers.html", converted_doc)



    })

    
    test('Using reference marks', () => {

        // noinspection SpellCheckingInspection GrammarInspection
        let input_document = ` 

= Test document

++++
<link rel="stylesheet" href="anywhere-footnote.css"/>
++++

This is a test document.
It has two lines{empty}afnote:first-block[marker='*', refid='reference', reftext='This is a footnote'], 
the last of which will contain a footnote{empty}afnote:first-block[refid='reference']
And we have another sentence before the block

afnote:first-block[]
`

        let converted_doc = asciidoctor.convert(input_document,{safe: 'safe', standalone: true,
            extension_registry: registry})
        
        expect(converted_doc.includes(`<a id="afnote-first-block-reference-ref"></a><a href="#afnote-first-block-reference-def">*</a>`)).toBeTruthy()
        
        // Note that we don't attach an id to the second footnote reference.
        expect(converted_doc.includes(`<a href="#afnote-first-block-reference-def">*</a>`))
        writeFile("marker.html", converted_doc)



    })


    test('Using braces', () => {

        // noinspection SpellCheckingInspection GrammarInspection
        let input_document = ` 

= Test document

++++
<link rel="stylesheet" href="anywhere-footnote.css"/>
++++

This is a test document.
It has two lines{empty}afnote:first-block[marker='*', refid='reference', reftext='This is a footnote', lbrace='{', rbrace='}'],  
the last of which will contain a footnote{empty}afnote:first-block[refid='reference']
And we have another sentence before the block

afnote:first-block[]
`

        let converted_doc = asciidoctor.convert(input_document,{safe: 'safe', standalone: true,
            extension_registry: registry})

        expect(converted_doc.includes(`<a href="#afnote-first-block-reference-def">{*}</a>`)).toBeTruthy()
        expect(converted_doc.includes(`<a href="#afnote-first-block-reference-def">*</a>`))
        writeFile("braces.html", converted_doc)
        
    })

    test('Multiple blocks', () => {

        // noinspection SpellCheckingInspection GrammarInspection
        let input_document = `
        
= Test document

++++
<link rel="stylesheet" href="anywhere-footnote.css"/>
++++

This is a test document.
It has two lines{empty}afnote:first-block[This is a footnote], the last of which will contain a footnote
            
But what is this? Yes, another set of footnotes in a different block{empty}afnote:second-block[This is a footnote for the second block]

== First block of footnotes
afnote:first-block[]
        
== Second block of footnotes
afnote:second-block[]
            `
        let converted_doc = asciidoctor.convert(input_document,{safe: 'safe', standalone: true,
            extension_registry: registry})

        expect(converted_doc.includes(`<a id="afnote-first-block-1-ref"></a><a href="#afnote-first-block-1-def">1</a>`)).toBeTruthy()
        expect(converted_doc.includes(`<a id="afnote-second-block-2-ref"></a><a href="#afnote-second-block-2-def">2</a>`)).toBeTruthy()
        expect(converted_doc.includes(`<dt class="hdlist1"><a id="afnote-first-block-1-def"></a><a href="#afnote-first-block-1-ref" class="afnote-marker">1</a></dt>`)).toBeTruthy()
        expect(converted_doc.includes(`<dt class="hdlist1"><a id="afnote-second-block-2-def"></a><a href="#afnote-second-block-2-ref" class="afnote-marker">2</a></dt>`)).toBeTruthy()
        
        writeFile("two_blocks.html", converted_doc)
    })



    test('Tables', () => {
        let input_document = `
        
= Test document

++++
<link rel="stylesheet" href="anywhere-footnote.css"/>
++++

This is a test document for tables.


.Sample Table Title
[cols="1,2,2", options="header"]
|===
|ID |Name |Description

|1
|Product Aafnote:first-block[This is the first footnote]
|High-quality widget with advanced features{empty}afnote:first-block[This is the second]

|2
|Product B
|Budget-friendly solution for everyday use

|3
|Product C
|Premium option with extended warranty
|===

.Quarterly Sales Report 2025
[cols="1,2,1,1,1", options="header"]
|===
|Quarter |Product |Units Sold |Revenue ($) |Profit Margin (%)

|Q1
|Smartphone Xafnote:second-block[This is for the second block.]
|5,420
|$1,084,000
|32.5

|Q1
|Laptop Pro
|1,875
|$2,250,000
|28.7

|Q1
|Smart Watch
|3,650
|$729,000
|41.2

|Q2
|Smartphone X
|6,780
|$1,356,000afnote:second-block[Pricey!]
|33.8

|Q2
|Laptop Pro
|2,140
|$2,568,000
|29.4

|Q2
|Smart Watch
|4,290
|$858,000
|42.1

|Q3
|Smartphone X
|7,890
|$1,578,000
|34.2

|Q3
|Laptop Pro
|2,560
|$3,072,000
|30.1

|Q3
|Smart Watch
|5,130
|$1,026,000
|43.5
|===

== First block of footnotes
afnote:first-block[]
        
== Second block of footnotes
afnote:second-block[]


.Sample Product Comparison
[cols="1,1,1,1"]
|===
|Product |Price ($) |Rating (1-5) |Stock Status

|Premium Headphonesafnote:mid-block[Special offer!] |249.99 |4.7 |In Stock

|Wireless Speaker |129.95 |4.2 |Limited

4+|afnote:mid-block[omit-separator="true"]

|Smart Watch |199.50 |4.5 |In Stock

|Bluetooth Earbuds |89.99 |4.0 |Out of Stock
|===

            `
        let converted_doc = asciidoctor.convert(input_document,{safe: 'safe', standalone: true,
            extension_registry: registry})

        expect(converted_doc.includes(`<a id="afnote-second-block-3-ref">`)).toBeTruthy()
        expect(converted_doc.includes(`#afnote-second-block-3-def"`)).toBeTruthy()
        expect(converted_doc.includes(`<a href="#afnote-mid-block-5-def">5</a>`)).toBeTruthy()
        expect(converted_doc.includes(`<a id="afnote-mid-block-5-ref"></a><a href="#afnote-mid-block-5-def">5</a>`)).toBeTruthy()
        expect(converted_doc.includes(`<a id="afnote-mid-block-5-def"></a><a href="#afnote-mid-block-5-ref" class="afnote-marker">5</a>`)).toBeTruthy()
        
        writeFile("two_tables.html", converted_doc)
    })

    test('Test different prefixes', () => {

        let input_document = ` 

= Test document

:afnote-id-prefix: rayId-
:afnote-css-prefix: rayCss-

++++
<link rel="stylesheet" href="anywhere-footnote.css"/>
++++

This is a test document.
It has two lines{empty}afnote:first-block[This is a footnote, lbrace='{empty}', rbrace='{empty}'], the last of which will contain a footnote

afnote:first-block[]
`

        let converted_doc = asciidoctor.convert(input_document,{safe: 'safe', standalone: true,
            extension_registry: registry})

        expect(converted_doc.includes("rayId-first-block-1")).toBeTruthy()
        expect(converted_doc.includes("rayCss-marker")).toBeTruthy()
        expect(converted_doc.includes("rayCss-block")).toBeTruthy()
        writeFile("prefixes.html", converted_doc)

    })


    test('Test block macro format', () => {

        let input_document = ` 

= Test document


++++
<link rel="stylesheet" href="anywhere-footnote.css"/>
++++

This is a test document.
It has two lines{empty}afnote:first-block[This is a footnote, lbrace='{empty}', rbrace='{empty}'], the last of which will contain a footnote

afnote::first-block[]
`

        let converted_doc = asciidoctor.convert(input_document,{safe: 'safe', standalone: true,
            extension_registry: registry})
        
        expect(converted_doc.includes(`class="paragraph afnote-hr-divider"`)).toBeTruthy()
        expect(converted_doc.includes(`#afnote-first-block-1-def"`)).toBeTruthy()

        writeFile("block-macro.html", converted_doc)

    })

    test('Roman numerals test', () => {

        // noinspection SpellCheckingInspection GrammarInspection
        let input_document = `
        
= Test document

:afnote-format: roman

++++
<link rel="stylesheet" href="anywhere-footnote.css"/>
++++

This is a test document.
It has two lines{empty}afnote:first-block[This is a footnote], the last of which will contain a footnote
            
But what is this? Yes, another set of footnotes in a different block{empty}afnote:second-block[This is a footnote for the second block]

== First block of footnotes
afnote:first-block[]
        
== Second block of footnotes
afnote:second-block[]
            `
        let converted_doc = asciidoctor.convert(input_document,{safe: 'safe', standalone: true,
            extension_registry: registry})
        
        writeFile("roman-numerals.html", converted_doc)
    })


})


function countOccurrences(string, substring) {
    // Split the string by the substring and count the resulting array length minus 1
    return string.split(substring).length - 1;
}


function writeFile(filename, content) {
    
    fs.writeFileSync(filename, content)
}