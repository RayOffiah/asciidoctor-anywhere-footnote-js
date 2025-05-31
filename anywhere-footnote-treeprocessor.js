require('@asciidoctor/core');

const functionMap = require('./anywhere-function-map').functionMap
const footnote_list = require('./anywhere-function-map').footnote_list

const _ = require('lodash')

module.exports = function (registry) {
    
    registry.treeProcessor(function () {
        
        this.process((document) => {

            processInlines(document)
            processBlocks(document)
            return document
        })

    })
}

function processInlines(document) {
    
    let paragraphs = document.findBy({context: 'paragraph'})
    
    paragraphs.forEach(paragraph => {
        
        functionMap['paragraph'](paragraph)
        
    })
    
}

function processBlocks(block) {

    let subBlocks = block.getBlocks()
    
    let groupedFootnotes = _.groupBy(footnote_list, 'block_id')

    subBlocks.forEach(subBlock => {

        const lines = subBlock.lines

        let new_lines = []

        lines.forEach(line => {

            try {

                // Get hold of the existing list.
                
                let check_line = matchFootnoteBlock(line)

                // The parser will match anything, but it will only return the footnote list
                // if afnotes are found in the line.
                if (check_line && check_line.length > 0) {

                    let footnote_group = groupedFootnotes[check_line]
                    
                    footnote_group.forEach(footnote => {
                        
                        // Make sure you have text for the footnote. If you don't, then
                        // you're looking at a reference to an existing footnote.
                        
                        if (footnote.text_parameter) {
                            let new_line = `xref:${footnote.ref_id}[^${footnote.footnote_marker}^] ${footnote.text_parameter} +\n`
                            new_lines.push(new_line)
                        }

                    })
                    
    
                }
                else {
                    new_lines.push(line)
                }


            }
            catch (e) {
                // If the match does fail, then just copy the line as is.
                new_lines.push(line)
            }


        })

        subBlock.lines = new_lines
        
    })

    return block

    
}

function matchFootnoteBlock(string) {

    const regex = /afnote::(.+?)\[\]/

    let result = string.match(regex)
    return result[1] ? result[1] : undefined
}
