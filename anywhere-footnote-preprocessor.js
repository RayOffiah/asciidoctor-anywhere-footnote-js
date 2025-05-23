require('@asciidoctor/core');
const parse = require("./anywhere-footnote-parse").parse
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
            
            let footnote_list = parse(line)
            
            footnote_list.forEach(footnote => {
                
                let footnote_string = `xref#${footnote.refid}[^${footnote.footnote_marker}^]`
                let new_line = replaceAt(footnote.start, footnote.end, footnote_string)
                console.log(new_line)
                new_lines.push(new_line)
            })
        } 
        catch (e) {
            // If the match fails, then just copy the line as is.
            new_lines.push(line)
        }  
        
    })
  
    
    return reader;
}


function replaceAt(string, start, end, replacement) {
    return string.substring(0, start) + replacement + string.substring(end);
}
