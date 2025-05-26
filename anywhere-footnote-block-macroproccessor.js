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
                text += `^\[xref:${footnote.ref_id}[${footnote.footnote_marker}]\]^ ${footnote.text_parameter} +\n`
            })
            
            return this.createBlock(parent, 'paragraph', text)
            
            
        })


    })

}

