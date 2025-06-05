require('@asciidoctor/core');

const parse = require("./anywhere-footnote-parse").parse
const _ = require('lodash')
const footnote_list = require('./footnote-type').footnote_list

module.exports = function (registry) {
    
    registry.postprocessor(function () {
        
        this.process((document, output) => {
            
            let lines =output.split('\n')
            lines = processInlines(lines)
            lines = processBlocks(lines)
            
            output = lines.join('\n')
            
            return output

        })

    })
}

function processInlines(lines) {
    
    let new_lines = []
    
    if (lines.length > 0) {
        
        lines.forEach(line => {
      
            let awFootnotes = parse(line)
            
            if (awFootnotes.length > 0) {
                
                awFootnotes.forEach(footnote => {
                    
                    addFootNoteReferences(footnote)

                    const idAttribute = footnote.text_parameter ? ` id='${footnote.block_id}-${footnote.ref_id}-ref'` : '';
                    const footnote_string = `<a href='#${footnote.block_id}-${footnote.ref_id}-block'${idAttribute} class="footnote" style="text-decoration: none"><sup>[${footnote.footnote_marker}]</sup></a>`;
                    line = replaceFootnoteTag(line, footnote_string);

                    footnote_list.push(footnote)
                    
                })
            }

            new_lines.push(line)
            
        })
    }
    
    return new_lines
 
}

function processBlocks(lines) {
    
    let groupedFootnotes = _.groupBy(footnote_list, 'block_id')
            
    let new_lines = []
    
    let counter = 0

    lines.forEach(line => {

        try {

            // Get hold of the existing list.

            ++counter
            let check_line = matchFootnoteBlock(line)

            // The parser will match anything, but it will only return the footnote list
            // if afnotes are found in the line.
            if (check_line && check_line.length > 0) {

                let footnote_group = groupedFootnotes[check_line]

                new_lines.push(`<div class="paragraph">`)
                footnote_group.forEach(footnote => {

                    // Make sure you have text for the footnote. If you don't, then
                    // you're looking at a reference to an existing footnote.

                    if (footnote.text_parameter) {
                        let new_line = `<a href='#${footnote.block_id}-${footnote.ref_id}-ref' id='${footnote.block_id}-${footnote.ref_id}-block' class="footnote" style="text-decoration: none"><sup>[${footnote.footnote_marker}]</sup></a> ${footnote.text_parameter}<br/> `
                        new_lines.push(new_line)
                    }

                })

                new_lines.push(`</div>`)
                new_lines.push(`<br/>`)

            } else {
                new_lines.push(line)
            }


        } catch (e) {
            // If the match does fail, then just copy the line as is.
            new_lines.push(line)
        }
        
    })
    

    return new_lines

    
}

function addFootNoteReferences(footnote) {

    // First, find the highest footnote number. The easiest thing to do is 
    // just count the number of footnotes in each block

    let counter = numberOfFootnotesInBlock() + 1
    
    if (footnote.ref_id && !footnote.text_parameter) {
        // Reference to the existing footnote - use its marker and ref_id
        let referenced_footnote = getExistingFootnoteMarker(footnote_list, footnote.ref_id)
        
        footnote.footnote_marker = referenced_footnote.footnote_marker
        footnote.ref_id = referenced_footnote.ref_id
    } 
    else {
        // New footnote - set ref_id and marker
        footnote.ref_id = footnote.ref_id ? `${footnote.ref_id}-${counter}` : `${counter}`

        // Set marker if not already defined
        if (!footnote.footnote_marker) {
            footnote.footnote_marker = `${counter}`;
        }
    }

    
}

function numberOfFootnotesInBlock() {
    return footnote_list.filter(footnote => footnote.block_id === footnote.block_id).length
}


function getExistingFootnoteMarker(footnote_list, refid) {

    return footnote_list.find(footnote => footnote.original_ref_id === refid && footnote.text_parameter)

}

function replaceFootnoteTag(string,  replacement) {

    const regex = /afnote:.+?\[.+?\]/
    return string.replace(regex, replacement)
}

function matchFootnoteBlock(string) {

    const regex = /afnote::(.+?)\[\]/

    let result = string.match(regex)
    return result && result[1] ? result[1] : undefined
}