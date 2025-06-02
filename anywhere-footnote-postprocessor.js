require('@asciidoctor/core');

const footnote_list = require('./anywhere-function-map').footnote_list
const parse = require("./anywhere-footnote-parse").parse
const addFootNoteReferences = require("./anywhere-function-map").addFootNoteReferences
const _ = require('lodash')
const {replaceFootnoteTag} = require('./anywhere-function-map')

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
                    let footnote_string = `<a href='#${footnote.block_id}-${footnote.ref_id}-block' id='${footnote.block_id}-${footnote.ref_id}-ref' class="footnote" style="text-decoration: none"><sup>[${footnote.footnote_marker}]</sup></a>`
                    line = replaceFootnoteTag(line, footnote_string)
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
                        let new_line = `<a href='#${footnote.block_id}-${footnote.ref_id}-ref' id='${footnote.block_id}-${footnote.ref_id}-block' class="footnote" style="text-decoration: none"><sup>${footnote.footnote_marker}</sup></a> ${footnote.text_parameter}<br/> `
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

function matchFootnoteBlock(string) {

    const regex = /afnote::(.+?)\[\]/

    let result = string.match(regex)
    return result && result[1] ? result[1] : undefined
}

