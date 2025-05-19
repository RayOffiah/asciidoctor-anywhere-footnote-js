const parser = require('../awfootnote.js')

test('Basic parser test', () => {

    const footnote = parser.parse("This is my{empty}awfootnote:my-block[This is the text]")

    expect(footnote).not.toBeNull()


})

test('Basic parser test with refid', () => {

    const footnote = parser.parse("This is my{empty}awfootnote:my-block[refid='key']")

    expect(footnote).not.toBeNull()


})


test('Test for two footnotes on the same line', () => {

    const footnote = parser.parse("This is my{empty}awfootnote:my-block[refid='key'] followed by another oneawfootnote:my-block[With text].")

    expect(footnote).not.toBeNull()


})