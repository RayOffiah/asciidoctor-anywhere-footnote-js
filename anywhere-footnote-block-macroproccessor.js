require('@asciidoctor/core');
const _ = require('lodash');
const foonote = require('./footnote-type')
module.exports = function (registry) {

    registry.blockMacro(function () {

        const self = this
        self.named('afnote')
        
        self.process((parent, target, attrs) => {
            
            let document = parent.getDocument()
            let stored_list = JSON.parse(document.getAttribute('existing-footnotes'))
            let footnote_list = _.groupBy(stored_list, 'block_id')
            let block = footnote_list[target]
            
            let text = ''
            
            block.forEach(footnote => {
                 if (footnote.text_parameter) {
                     text += `[#${footnote.block_id}-${footnote.ref_id}-block]^\[xref:${footnote.block_id}-${footnote.ref_id}-ref[${footnote.footnote_marker}]\]^ ${footnote.text_parameter} +\n`
                 }
            })
            
            return this.createBlock(parent, 'paragraph', text, {role: 'footnote'})
            
            
        })


    })

}

