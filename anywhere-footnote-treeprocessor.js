require('@asciidoctor/core');
const parse = require("./anywhere-footnote-parse").parse
const _ = require('lodash')
const EXISTING_FOOTNOTES = "existing-footnotes"
let existing_footnotes = []

module.exports = function (registry) {
    
    registry.treeProcessor(function () {
        
        this.process((document) => {

            processInlines(document)
            processBlocks(document)
            return document
        })

    })

}

function processInlines(block) {
    
    let subBlocks = block.getBlocks()
    
    subBlocks.forEach(subBlock => {

        const lines = subBlock.lines

        let new_lines = []

        lines.forEach(line => {

            try {

                // Get hold of the existing list.


                let footnote_list = parse(line)

                // The parser will match anything, but it will only return the footnote list
                // if afnotes are found in the line.
                if (footnote_list.length > 0) {

                    let new_line = line

                    footnote_list.forEach(footnote => {

                        addFootNoteReferences(footnote)
                        existing_footnotes.push(footnote)

                        // If there is no text for the footnote, but we have a refid, then we must
                        // be trying to reference an existing note. In this case, find the note we are
                        // referencing and copy the marker from it.

                        let footnote_string = `[#${footnote.block_id}-${footnote.ref_id}-ref]^[xref:${footnote.block_id}-${footnote.ref_id}-block[${footnote.footnote_marker}]]^`
                        new_line = replaceFootnoteTag(new_line, footnote_string)

                    })

                    console.log(new_line)
                    new_lines.push(new_line)
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
        
        if (subBlock.getBlocks().length > 0) {
            processInlines(subBlock)
        }
        
    })
    
    return block
    

    
    
}

function processBlocks(block) {

    let subBlocks = block.getBlocks()
    
    let groupedFootnotes = _.groupBy(existing_footnotes, 'block_id')

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
                        let new_line = `xref:${footnote.ref_id}[^${footnote.footnote_marker}^] ${footnote.text_parameter} +\n`
                        new_lines.push(new_line)  
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

        if (subBlock.getBlocks().length > 0) {
            processInlines(subBlock)
        }

    })

    return block

    
}
function numberOfFootnotesInBlock() {
    return existing_footnotes.filter(footnote => footnote.block_id === footnote.block_id).length
}

function addFootNoteReferences(footnote) {

    // First, find the highest footnote number. The easiest thing to do is 
    // just count the number of footnotes in each block
    
    let counter = numberOfFootnotesInBlock() + 1
    
    if (footnote.ref_id && !footnote.text_parameter) {
        footnote.footnote_marker = getExistingFootnoteMarker(existing_footnotes, footnote.ref_id);
    }
    
    footnote.ref_id = footnote.ref_id ? `${footnote.ref_id}-${counter}` : `${counter}`


   // Set default footnote marker if none exists
    if (!footnote.footnote_marker) {
        footnote.footnote_marker = `${counter}`;
    }
}

function getExistingFootnoteMarker(footnote_list, refid) {
    
    return footnote_list.find(footnote => footnote.original_ref_id === refid && footnote.text_parameter)['footnote_marker']
    
}
function matchFootnoteBlock(string) {
    
    const regex = /afnote::(.+?)\[\]/

    let result = string.match(regex)
    return result[1] ? result[1] : undefined
}

function replaceFootnoteTag(string,  replacement) {

    const regex = /afnote:.+?\[.+?\]/
    return string.replace(regex, replacement)
}