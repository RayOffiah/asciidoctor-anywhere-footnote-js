require('@asciidoctor/core');

const _ = require('lodash')

class AnywhereFootnote {

    constructor() {

        this.start = 0
        this.end = 0
        this.block_id = ""
        this.text_parameter = ""
        this.ref_id = ""
        this.original_ref_id = ""
        this.footnote_marker = ""
        this.lbrace = ""
        this.rbrace = ""

    }
}

let footnote_list = []

module.exports = function (registry) {

    registry.inlineMacro('afnote', function () {

        const self = this

        this.process((parent, target, attributes) => {

            let footnote = new AnywhereFootnote()

            // Small bug in the api. It needs to distinguish between inline and block
            if (target.startsWith(':')) {

                // Then we are looking at the block
                // type: afnote::first-block[]

                return processBlockMacro(target)
            }

            footnote.block_id = target

            if (attributes['$positional'] &&attributes['$positional'][0]) {

                footnote.text_parameter = attributes['$positional'][0]
            }
            else if (attributes['reftext']) {
                footnote.text_parameter = attributes['reftext']
            }
            else {
                footnote.text_parameter = ''
            }

            footnote.ref_id = attributes['refid'] ? attributes['refid'] : ''
            footnote.original_ref_id = footnote.ref_id
            footnote.footnote_marker = attributes['marker'] ? attributes['marker'] : ''
            footnote.lbrace = attributes['lbrace'] ? attributes['lbrace'] : ''
            footnote.rbrace = attributes['rbrace'] ? attributes['rbrace'] : ''


            addFootNoteReferences(footnote)

            footnote_list.push(footnote)
            

            return `[[${footnote.block_id}-${footnote.ref_id}-ref]]xref:${footnote.block_id}-${footnote.ref_id}-block[${footnote.lbrace}${footnote.footnote_marker}${footnote.rbrace}, role="anywhere-footnote"]`

        })


        function processBlockMacro(target) {

            // Okay, the target will have an extra ':' character
            // that will need to be removed.
            let block_id = target.substring(1)

            let groupedFootnotes = _.groupBy(footnote_list, 'block_id')
            let footnote_group = groupedFootnotes[block_id]

            let footnote_block = `__________________________ +\n`

            footnote_group.forEach(footnote => {
                
                // You only need a footnote block entry if you have some text for it.
                // Otherwise, the footnote is referencing another footnote.
                if (footnote.text_parameter) {
                    footnote_block += `xref:${footnote.block_id}-${footnote.ref_id}-ref[${footnote.lbrace}${footnote.footnote_marker}${footnote.rbrace}, role="anywhere-footnote"][[${footnote.block_id}-${footnote.ref_id}-block]] ${footnote.text_parameter} +\n`
                }
            })


            return footnote_block
        }

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

                    const idAttribute = footnote.text_parameter ? `[[${footnote.block_id}-${footnote.ref_id}-ref]]` : '';
                    const footnote_string = `${idAttribute}xref:${footnote.block_id}-${footnote.ref_id}-block[^${footnote.lbrace}${footnote.footnote_marker}${footnote.rbrace}^]`
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
                
                footnote_group.forEach(footnote => {

                    // Make sure you have text for the footnote. If you don't, then
                    // you're looking at a reference to an existing footnote.

                    if (footnote.text_parameter) {
                        let new_line = `[#${footnote.block_id}-${footnote.ref_id}-block]#xref:${footnote.block_id}-${footnote.ref_id}-ref[^${footnote.lbrace}${footnote.footnote_marker}${footnote.rbrace}^] ${footnote.text_parameter}#` 
                        new_lines.push(new_line)
                    }

                })

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
    //  count the number of footnotes in each block

    let counter = numberOfFootnotesInBlock(footnote.block_id) + 1
    
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

function numberOfFootnotesInBlock(block_id) {
    return footnote_list.filter(footnote => footnote.block_id === block_id).length
}


function getExistingFootnoteMarker(footnote_list, refid) {

    return footnote_list.find(footnote => footnote.original_ref_id === refid && footnote.text_parameter)

}

function replaceFootnoteTag(string,  replacement) {

    const regex = /afnote:.+?\[.+?]/
    return string.replace(regex, replacement)
}

function matchFootnoteBlock(string) {

    const regex = /afnote::(.+?)\[]/

    let result = string.match(regex)
    return result && result[1] ? result[1] : undefined
}