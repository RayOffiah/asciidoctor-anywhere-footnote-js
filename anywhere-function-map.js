require('@asciidoctor/core');
const parse = require("./anywhere-footnote-parse").parse
const footnote_list = require('./footnote-type').footnote_list

/**
 * The function map will read the context of the block and run the appropriate function
 * against the contents of the block
 */
const functionMap = {
    
    'document': (block) => {
        
        return block
    },
    'section': (block) => {
        
        return block
    },
    
    'paragraph': (block) => {
        
        let lines = block.lines
        
        let new_lines = []
        
        lines.forEach(line => {
            
            line = replaceLine(line)
            new_lines.push(line)
                
  
        })
     
         block.lines = new_lines   
        
    },
    
    'table': (block) => {
        
        processTableCells(block.rows['head'])
        processTableCells(block.rows['body'])
        processTableCells(block.rows['foot'])
        
    }
}

function processTableCells(cell_lines) {

    cell_lines.forEach(cell_line => {

        cell_line.forEach(cell => {

            cell.text = replaceLine(cell.text)

        })
    })
}

function addFootNoteReferences(footnote) {

    // First, find the highest footnote number. The easiest thing to do is 
    // just count the number of footnotes in each block

    let counter = numberOfFootnotesInBlock() + 1

    if (footnote.ref_id && !footnote.text_parameter) {
        footnote.footnote_marker = getExistingFootnoteMarker(footnote_list, footnote.ref_id);
    }

    footnote.ref_id = footnote.ref_id ? `${footnote.ref_id}-${counter}` : `${counter}`


    // Set default footnote marker if none exists
    if (!footnote.footnote_marker) {
        footnote.footnote_marker = `${counter}`;
    }
}

function numberOfFootnotesInBlock() {
    return footnote_list.filter(footnote => footnote.block_id === footnote.block_id).length
}


function getExistingFootnoteMarker(footnote_list, refid) {

    return footnote_list.find(footnote => footnote.original_ref_id === refid && footnote.text_parameter)['footnote_marker']

}

function replaceFootnoteTag(string,  replacement) {

    const regex = /afnote:.+?\[.+?\]/
    return string.replace(regex, replacement)
}


function replaceLine(line) {

    let  awFootnotes = parse(line)

    const role =  "footnote"; // Use a default role or one from the footnote object


    if (awFootnotes.length > 0) {
        awFootnotes.forEach(footnote => {
            addFootNoteReferences(footnote)
            let footnote_string = `[#${footnote.block_id}-${footnote.ref_id}-ref]^[xref:${footnote.block_id}-${footnote.ref_id}-block[${footnote.footnote_marker},role=footnote]]^`
            line = replaceFootnoteTag(line, footnote_string)
            footnote_list.push(footnote)
        })
    }
    
    return line
    
}

module.exports = { functionMap, footnote_list, addFootNoteReferences, replaceFootnoteTag}