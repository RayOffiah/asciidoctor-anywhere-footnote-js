require('@asciidoctor/core');
const parse = require("./anywhere-footnote-parse").parse
const footnote_list = require('./footnote-type').footnote_list

/**
 * The function map will read the context of the block and run the appropriate function
 * against the contents of the block
 */
const functionMap = {
    
    'paragraph': (block) => {
        
        let lines = block.lines
        
        let new_lines = []
        
        lines.forEach(line => {
            
            try {
                let  awFootnotes = parse(line)
                
                if (awFootnotes.length > 0) {

                    let new_line = line
                    
                    awFootnotes.forEach(footnote => {
                        
                        addFootNoteReferences(footnote)
                        let footnote_string = `[#${footnote.block_id}-${footnote.ref_id}-ref]^[xref:${footnote.block_id}-${footnote.ref_id}-block[${footnote.footnote_marker}]]^`
                        new_line = replaceFootnoteTag(new_line, footnote_string)
                        footnote_list.push(footnote)
                    })

                    new_lines.push(new_line)
                    
                }
                else {
                    new_lines.push(line)
                }
            }
            catch (e) {
                new_lines.push(line)
            }
        })
     
     block.lines = new_lines   
        
    },
    
    'table_cell': (block) => {
        
    }
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

module.exports = { functionMap, footnote_list}