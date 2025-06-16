require('@asciidoctor/core');

const _ = require('lodash')

class AnywhereFootnote {

    constructor() {

        this.start = 0
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
        
        footnote_list.length = 0

        this.process((parent, target, attributes) => {

            let footnote = new AnywhereFootnote()

            // Small bug in the api. It needs to distinguish between inline and block
            if (_.isEmpty(attributes) || attributes['omit-separator']) {

                // Then we are looking at the block
                // type: afnote:first-block[]

                return processBlockMacro(target, attributes['omit-separator'])
            }

            footnote.block_id = target

            if (attributes['$positional'] && attributes['$positional'][0]) {

                footnote.text_parameter = attributes['$positional'][0]
            }
            else if (attributes['reftext']) {
                footnote.text_parameter = attributes['reftext']
            }
            else {
                footnote.text_parameter = ''
            }

            footnote.ref_id = attributes['ref_id'] ? attributes['ref_id'] : ''
            footnote.original_ref_id = footnote.ref_id
            footnote.footnote_marker = attributes['marker'] ? attributes['marker'] : ''
            footnote.lbrace = attributes['lbrace'] ? attributes['lbrace'] : ''
            footnote.rbrace = attributes['rbrace'] ? attributes['rbrace'] : ''


            addFootNoteReferences(footnote)

            footnote_list.push(footnote)
            

            return `[[${footnote.block_id}-${footnote.ref_id}-ref]]xref:${footnote.block_id}-${footnote.ref_id}-block[${footnote.lbrace}${footnote.footnote_marker}${footnote.rbrace}, role="anywhere-footnote-marker"]`

        })


        function processBlockMacro(target, omit_separator) {
            
            let block_id = target

            let groupedFootnotes = _.groupBy(footnote_list, 'block_id')
            let footnote_group = groupedFootnotes[block_id]
            
            if (!footnote_group) {
                
                throw new Error(`No footnotes found for block: ${block_id}`)
            }

            let footnote_block = ''
            
            if (!omit_separator && omit_separator !== 'false') {
                footnote_block = `<hr class="anywhere-footnote-separator"/>\n`
            }
                 

            footnote_group.forEach(footnote => {
                
                // You only need a footnote block entry if you have some text for it.
                // Otherwise, the footnote is referencing another footnote.
                if (footnote.text_parameter) {
                    footnote_block += `xref:${footnote.block_id}-${footnote.ref_id}-ref[${footnote.lbrace}${footnote.footnote_marker}${footnote.rbrace}, role="anywhere-footnote-block"][[${footnote.block_id}-${footnote.ref_id}-block]] ${footnote.text_parameter} +\n`
                }
            })
            
            return footnote_block
        }

    })

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
    
}






