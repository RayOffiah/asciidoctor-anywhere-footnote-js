require('@asciidoctor/core');
const parse = require("./anywhere-footnote-parse").parse
const AWFootNoteType = require('./footnote-type')
const {Asciidoctor} = require('@asciidoctor/core')
const {footnote_list} = require('./footnote-type')

const EXISTING_FOOTNOTES = "existing-footnotes"

module.exports = function (registry) {
    
    registry.preprocessor(function () {

        this.process((document, reader) => {
            

            processInlines(document, reader)

            return reader
        })

    })

}

function processInlines(document, reader) {
    
    const lines = reader.getLines();
    let new_lines = []
    let existing_footnotes = {}
    
    lines.forEach(line => {

        try {
            
            // Get hold of the existing list.
            
            
            let footnote_list = parse(line)

            
            Object.entries(footnote_list).forEach(([key, footnote_block]) => {

                let block_to_attach_to = getFootnoteBlockForAttaching(key, existing_footnotes)
                footnote_list = addFootNoteReferences(footnote_list, key, block_to_attach_to)
                
                footnote_block.forEach(footnote => {

                    let footnote_string = `xref#${footnote.block_id}-${footnote.ref_id}[^${footnote.footnote_marker}^]`
                    let new_line = replaceAt(line, footnote.start, footnote.end + 1, footnote_string)
                    console.log(new_line)
                    new_lines.push(new_line)
                    block_to_attach_to[key].push(footnote)
                    
                })
                

            })
        } 
        catch (e) {
            // If the match fails, then just copy the line as is.
            new_lines.push(line)
        }
        
        
    })
    
    return reader.lines = new_lines
}

function getFootnoteBlockForAttaching(key, existing_footnotes) {
    
    if (existing_footnotes[key] === undefined) {

        existing_footnotes[key] = []
        
    }

    return existing_footnotes
    
    
    
}

function addFootNoteReferences(footnote_list, key, block_to_attach_to) {

    // First, find the highest footnote number. Easiest thing to do is 
    // just count the number of footnotes in each block
    
    let highest_footnote_number = block_to_attach_to[key].length
    
    Object.entries(footnote_list).forEach(([key, footnote_block]) => {

        let counter = block_to_attach_to[key].length
        
        footnote_block.forEach(footnote => {
            
            if (footnote.ref_id === '') {
                footnote.ref_id = `ref-${++counter}`
            }
            
            if (footnote.footnote_marker.length === 0) {
                footnote.footnote_marker = String(counter) 
            }
            
        })
        
    })

    
    return footnote_list
}
function replaceAt(string, start, end, replacement) {
    return string.substring(0, start) + replacement + string.substring(end);
}
