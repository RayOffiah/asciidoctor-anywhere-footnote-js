require('@asciidoctor/core')
const _ = require('lodash')
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

const Formats = Object.freeze({
    ARABIC: 'arabic',
    ALPHA: 'alpha',
    ROMAN: 'roman',
})

const AFNOTE_FORMAT = 'afnote-format'
const AFNOTE_BLOCK_RESET = 'afnote-block-reset'
const OMIT_SEPARATOR = 'omit-separator'

const AFNOTE_ID_PREFIX = 'afnote-id-prefix'
const AFNOTE_CSS_PREFIX = 'afnote-css-prefix'

const AFNOTE_OMIT_SEPARATORS = 'afnote-omit-separators'
const AFNOTE_ID_DEFAULT_PREFIX = 'afnote-'
const AFNOTE_CSS_DEFAULT_PREFIX = 'afnote-'

let footnote_list = []
let block_reset = false
let omit_separators_for_page = false 
let af_note_id_prefix = AFNOTE_ID_DEFAULT_PREFIX
let af_note_css_prefix = AFNOTE_CSS_DEFAULT_PREFIX


let afnote_format = Formats.ARABIC  // Default

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
            af_note_id_prefix = document.getAttribute(AFNOTE_ID_PREFIX) ? document.getAttribute(AFNOTE_ID_PREFIX) : AFNOTE_ID_DEFAULT_PREFIX
            af_note_css_prefix = document.getAttribute(AFNOTE_CSS_PREFIX) ? document.getAttribute(AFNOTE_CSS_PREFIX) : AFNOTE_CSS_DEFAULT_PREFIX
            
            let footnote = new AnywhereFootnote()

            if (_.startsWith(target, ':') ||
                _.isEmpty(attributes) 
                || attributes[OMIT_SEPARATOR]) {

                // Then we are looking at the block
                // type: afnote:first-block[]
                
                let omit_separator =  attributes[OMIT_SEPARATOR] === 'true' || omit_separators_for_page
                
                const block_id = _.startsWith(target, ':') ? _.trimStart(target, ':') : target
                
                return processFootnoteBlock(this, parent, block_id, omit_separator)
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

            footnote.ref_id = attributes['refid'] ? attributes['refid'] : `${numberOfFootnotesInBlock(footnote.block_id, false) + 1}`
            footnote.footnote_marker = attributes['marker'] ? attributes['marker'] : ''
            
            footnote.lbrace = attributes['lbrace'] === undefined ? '' : attributes['lbrace']
            footnote.rbrace = attributes['rbrace'] === undefined ? '' : attributes['rbrace']
            
            addFootNoteReferences(footnote, block_reset)
            
            // This odd bit of code is to ensure that we don't end up setting duplicate anchor ids
            // for footnotes that reference other footnotes. In this case, the second footnote
            // is assigned another random string, which means we won't be able to click to it
            // from the footnote block.
            let idString = footnote_list.some(item => item.ref_id === footnote.ref_id)
            ? '' : `${af_note_id_prefix}${footnote.block_id}-${footnote.ref_id}`
            
           let inline = createFootnoteReference(footnote, idString)

            footnote_list.push(footnote)
            
            return this.createInline(parent, 'quoted', inline, {
                attributes: {
                    role: `${af_note_css_prefix}marker`,
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

            let separator_text = omit_separator  ? `\n\n` 
                :  self.createBlock(parent, 'paragraph', '', {"role": `${af_note_css_prefix}hr-divider`}).convert()

            
            let footnote_block_list = self.createList(parent, 'dlist', {role: `${af_note_css_prefix}horizontal`})
            
            footnote_group.forEach(footnote => {
                
                // You only need a footnote block entry if you have some text for it.
                // Otherwise, the footnote is referencing another footnote.
                if (footnote.text_parameter) {
                    
                    let term = `[[${af_note_id_prefix}${footnote.block_id}-${footnote.ref_id}-def]]xref:${af_note_id_prefix}${footnote.block_id}-${footnote.ref_id}-ref[${footnote.lbrace}${footnote.footnote_marker}${footnote.rbrace}, role="${af_note_css_prefix}marker"]`
                    let description = `${footnote.text_parameter}`
                    let footnote_term = self.createListItem(footnote_block_list, `${term}`)
                    let footnote_description = self.createListItem(footnote_block_list, `${description}`)
                    let dlist_item = [[footnote_term], footnote_description]

                    footnote_block_list.getBlocks().push(dlist_item)
                }
            })
            
            return self.createInline(parent, 'quoted', `${separator_text}\n${footnote_block_list.convert()}`, {
                attributes: {
                    role: `${af_note_css_prefix}block`
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
            let referenced_footnote = getExistingFootnoteMarker(footnote_list, footnote.block_id, footnote.ref_id)

            // If you don't find a referenced note, then something has gone wrong.
            
            if (!referenced_footnote) {
                throw new Error(`No reference footnote found with refid: ${footnote.ref_id} found in block: ${footnote.block_id}`)   
            }
            
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


    function getExistingFootnoteMarker(footnote_list, block_id, ref_id) {

        return footnote_list.find(footnote => footnote.block_id === block_id 
            && footnote.ref_id === ref_id && footnote.text_parameter)

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
        
        const baseXref = `xref:${af_note_id_prefix}${footnote.block_id}-${footnote.ref_id}-def[${footnote.lbrace}${footnote.footnote_marker}${footnote.rbrace}]`
        return idString ? `[[${idString}-ref]]${baseXref}` : baseXref
    }
    
}






