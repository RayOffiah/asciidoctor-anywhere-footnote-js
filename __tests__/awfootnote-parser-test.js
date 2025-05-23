const parse = require("../anywhere-footnote-parse").parse


test('Basic parser test', () => {

    const footnote = parse("This is my{empty}awfootnote:my-block[This is the text]")

    expect(footnote).not.toBeNull()


})

test('Basic parser test with refid', () => {

    const footnote = parse("This is my{empty}awfootnote:my-block[refid='key']")

    expect(footnote).not.toBeNull()


})


test('Test for two footnotes on the same line', () => {

    const footnote_list = parse("This is my{empty}awfootnote:my-block[refid='key'] followed by another oneawfootnote:my-block[With text].");

    expect(footnote_list).not.toBeNull()
    expect(footnote_list.length).toBe(2)


})

test('Test for three footnotes on the same line', () => {

    const footnote_list = parse("This is my{empty}awfootnote:my-block[refid='key'] followed by another oneawfootnote:my-block[With text]. And another block.awfootnote:my-block[Spare text]");

    expect(footnote_list).not.toBeNull()



})