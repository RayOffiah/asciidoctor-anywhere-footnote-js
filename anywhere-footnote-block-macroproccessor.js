require('@asciidoctor/core');
module.exports = function (registry) {

    registry.blockMacro(function () {

        const self = this
        self.named('afnote')
        
        self.process((parent, target, attrs) => {
            
            let document = parent.getDocument()
            let footnote_list = JSON.parse(document.getAttribute('existing-footnotes'))
            
            let block = footnote_list[target]
            
            let text = ''
            
            block.forEach(footnote => {
                text += `[#${footnote.block_id}-${footnote.ref_id}-block]^\[xref:${footnote.block_id}-${footnote.ref_id}-ref[${footnote.footnote_marker}]\]^ ${footnote.text_parameter} +\n`
            })
            
            return this.createBlock(parent, 'paragraph', text, {role: 'footnote'})
            
            
        })


    })

}

