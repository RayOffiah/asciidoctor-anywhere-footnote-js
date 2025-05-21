const parser = require('../awfootnote.js')
const actions = require('../anywhere-actions.js')
require('../footnote-type.js')

test('Basic parser test', () => {

    const footnote = parser.parse("This is my{empty}awfootnote:my-block[This is the text]", {actions})

    expect(footnote).not.toBeNull()


})

test('Basic parser test with refid', () => {

    const footnote = parser.parse("This is my{empty}awfootnote:my-block[refid='key']")

    expect(footnote).not.toBeNull()


})


test('Test for two footnotes on the same line', () => {

    const footnote_list = parser.parse("This is my{empty}awfootnote:my-block[refid='key'] followed by another oneawfootnote:my-block[With text].", {actions}).elements[1]

    expect(footnote_list).not.toBeNull()
    expect(footnote_list.length).toBe(2)


})

test('Test for three footnotes on the same line', () => {

    const footnote_list = parser.parse("This is my{empty}awfootnote:my-block[refid='key'] followed by another oneawfootnote:my-block[With text]. And another block.awfootnote:my-block[Spare text]", {actions}).elements[1]

    expect(footnote_list).not.toBeNull()
    expect(footnote_list.length).toBe(3)


})