require('@asciidoctor/core');
const  { parse } = require('./awfootnote.js');
const actions = require('./anywhere-actions.js')
require('./footnote-type.js')
const AWFootNoteType = require('./footnote-type')


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
    let anchor_count = 0
    
    lines.forEach(line => {

        try {
            
            let footnote_list = parse(line, {actions})
            
            if (footnote_list.elements.some(element => element instanceof Array 
                && element.some(e => e instanceof AWFootNoteType))) {
                
                footnote_list.elements.filter(element => element instanceof Array 
                    && element.some(e => e instanceof AWFootNoteType))
                    .forEach(e => {
                        
                        anchor_count = anchor_count + 1
                        let anchor_id = e.block_id + '-' + anchor_count
                        let anchor_text = `xref:#${e.block_id}-${anchor_count}[^${anchor_id}^]`
                        new_lines.push(line.substring(0, e.start) + anchor_text + line.substring(e.end + 1))
                    })
            }
            else {
                new_lines.push(line)
            }
            
        } 
        catch (e) {
            // If the match fails, then just copy the line as is.
            new_lines.push(line)
        }  
        
    })
  
    
    return reader;
}


