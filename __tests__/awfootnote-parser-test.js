const parse = require("../anywhere-footnote-parse").parse

describe('Test the parser', () => {

    test('Basic parser test', () => {

        const footnote = parse("This is my{empty}afnote:my-block[This is the text]")

        expect(footnote).not.toBeNull()


    })

    test('Basic parser test with refid', () => {

        const footnote = parse("This is my{empty}afnote:my-block[refid='key']")

        expect(footnote).not.toBeNull()


    })

    test('Basic parser test with refid and text parameter', () => {

        const footnote = parse("This is my{empty}afnote:my-block[refid='key', This is the second parameter]")

        expect(footnote).not.toBeNull()


    })


    test('Test for two footnotes on the same line', () => {

        const footnote_list = parse("This is my{empty}afnote:my-block[refid='key'] followed by another one.afnote:my-block[With text].");

        expect(footnote_list).not.toBeNull()



    })

    test('Test for three footnotes on the same line', () => {

        const footnote_list = parse("This is my{empty}afnote:my-block[Just text] followed by another one.afnote:my-block[refid='key', With text]. And another block.afnote:my-block[refid='key']");

        expect(footnote_list).not.toBeNull()

    })    
    
})
