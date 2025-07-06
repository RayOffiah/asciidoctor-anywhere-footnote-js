require('@asciidoctor/core')
const _ = require('lodash')
const randomstring = require('randomstring')
const romans = require('romans')

class AnywhereFootnote {

    constructor() {
        
        this.block_id = ""
        this.text_parameter = ""
        this.ref_id = ""
        this.footnote_marker = ""
        this.lbrace = ""
        this.rbrace = ""

    }
}

let footnote_list = []
let block_reset = false
let omit_separators_for_page = false 

const Formats = Object.freeze({
    ARABIC: 'arabic',
    ALPHA: 'alpha',
    ROMAN: 'roman',
})

let afnote_format = Formats.ARABIC  // Default

const AFNOTE_FORMAT = 'afnote-format'
const AFNOTE_BLOCK_RESET = 'afnote-block-reset'
const OMIT_SEPARATOR = 'omit-separator'
const AFNOTE_OMIT_SEPARATORS = 'afnote-omit-separators'
module.exports = function (registry) {

    registry.inlineMacro('afnote', function () {
        
        footnote_list.length = 0

        this.process((parent, target, attributes) => {
            
            const document = parent.getDocument()
            
            //Now see if we have an afnote-format attribute
            
            if (document.getAttribute(AFNOTE_FORMAT)) {
                afnote_format = Formats[document.getAttribute(AFNOTE_FORMAT).toUpperCase()]
            }
            else {
                afnote_format = Formats.ARABIC
            }

            block_reset = document.getAttribute(AFNOTE_BLOCK_RESET) === 'true'
            omit_separators_for_page = document.getAttribute(AFNOTE_OMIT_SEPARATORS) === 'true'
            
            let footnote = new AnywhereFootnote()

            if (_.isEmpty(attributes) || attributes[OMIT_SEPARATOR]) {

                // Then we are looking at the block
                // type: afnote:first-block[]
                
                let omit_separator =  attributes[OMIT_SEPARATOR] === 'true' 
                return processFootnoteBlock(this, parent, target, omit_separator)
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

            footnote.ref_id = attributes['refid'] ? attributes['refid'] : randomstring.generate(8)
            footnote.footnote_marker = attributes['marker'] ? attributes['marker'] : ''
            
            footnote.lbrace = attributes['lbrace'] === undefined ? '&#91;' : attributes['lbrace']
            footnote.rbrace = attributes['rbrace'] === undefined ? '&#93;' : attributes['rbrace']
            
            addFootNoteReferences(footnote, block_reset)
            
            // This odd bit of code is to ensure that we don't end up setting duplicate anchor ids
            // for footnotes that reference other footnotes. In this case, the second footnote
            // is assigned another random string, which means we won't be able to click to it
            // from the footnote block.
            let idString = footnote_list.some(item => item.ref_id === footnote.ref_id)
            ? '' : `${footnote.block_id}-${footnote.ref_id}`
            
           let inline = createFootnoteReference(footnote, idString)

            footnote_list.push(footnote)
            
            return this.createInline(parent, 'quoted', inline, {
                attributes: {
                    role: 'anywhere-footnote-marker',
                }
            })
        })


        function processFootnoteBlock(self, parent, target, omit_separator) {
            
            let block_id = target

            let groupedFootnotes = _.groupBy(footnote_list, 'block_id')
            let footnote_group = groupedFootnotes[block_id]
            
            if (!footnote_group) {
                
                throw new Error(`No footnotes found for block: ${block_id}`)
            }

            let footnote_block = ''
            
            if (omit_separator || omit_separators_for_page) {

                footnote_block = `\n\n`

            }
            else {
                let separator = self.createBlock(parent, 'paragraph', '', {"role": "anywhere-footnote-hr-divider"})
                footnote_block = separator.convert()    
            }
            
            footnote_group.forEach(footnote => {
                
                // You only need a footnote block entry if you have some text for it.
                // Otherwise, the footnote is referencing another footnote.
                if (footnote.text_parameter) {
                    footnote_block += `xref:${footnote.block_id}-${footnote.ref_id}-ref[${footnote.lbrace}${footnote.footnote_marker}${footnote.rbrace}, role="anywhere-footnote-marker"][[${footnote.block_id}-${footnote.ref_id}-block]] ${footnote.text_parameter} +\n`
                }
            })
            
            return self.createInline(parent, 'quoted', footnote_block, {
                attributes: {
                    role: 'anywhere-footnote-block'
                }
            })
        }

    })

    function addFootNoteReferences(footnote, block_reset) {

        // First, find the highest footnote number. The easiest thing to do is 
        //  count the number of footnotes in each block

        let counter = numberOfFootnotesInBlock(footnote.block_id, block_reset) + 1

        if (footnote.ref_id && !footnote.text_parameter) {
            // Reference to the existing footnote - use its marker and ref_id
            let referenced_footnote = getExistingFootnoteMarker(footnote_list, footnote.ref_id)

            footnote.footnote_marker = referenced_footnote.footnote_marker
            footnote.ref_id = referenced_footnote.ref_id
        }
        else {

            // Set marker if not already defined
            if (!footnote.footnote_marker) {
                footnote.footnote_marker = getFormattedNumber(counter, afnote_format)
            }
        }
    }
    
    function numberOfFootnotesInBlock(block_id, block_reset) {
        
        // Remember that you for generating the next footnote number, you only need to count the footnotes  
        // that have a text parameter; the ones that don't are referencing an existing footnote.
        if (block_reset) {
            return footnote_list.filter(footnote => footnote.block_id === block_id && footnote.text_parameter).length
        }
        else {
            return footnote_list.filter(footnote => footnote.text_parameter).length
        }
    }


    function getExistingFootnoteMarker(footnote_list, refid) {

        return footnote_list.find(footnote => footnote.ref_id === refid && footnote.text_parameter)

    }   
    
    function getFormattedNumber(number, format) {
        
        switch (format) {
            case Formats.ARABIC: {
                return String(number)
            } 
            case Formats.ALPHA : {
                
                if (number < 1 || number > 26) throw new Error('Alpha format only supports up to 26 footnotes')
                return ('a' + number - 1).toString()
            }
            case Formats.ROMAN : {
                if (number < 1 || number > 3999) throw new Error('Roman format only supports up to 3999 footnotes')
                return romans.romanize(number)
            }
            default: throw new Error(`Unknown format: ${format}`)
        }
    }

    function createFootnoteReference(footnote, idString) {
        
        const baseXref = `xref:${footnote.block_id}-${footnote.ref_id}-block[${footnote.lbrace}${footnote.footnote_marker}${footnote.rbrace}]`
        return idString ? `[[${idString}-ref]]${baseXref}` : baseXref
    }

}






