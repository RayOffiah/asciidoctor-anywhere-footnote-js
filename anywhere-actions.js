const AWFootNoteType = require('./footnote-type.js')
let footnote_list = require('./footnote-type.js').footnote_list;
const actions = {

    get_text_parameter(input, start, end, elements ) {
        
        let awfootnote;
        
        if (elements instanceof AWFootNoteType) {
            awfootnote = elements
            awfootnote.text_parameter = elements.map(e => e.text).join('')
        }
        else {
            
            awfootnote = new AWFootNoteType(null, elements.map(e => e.text).join(''), null, null)
        }
        
        return awfootnote
        
    },
    
    get_ref_id(input, start, end, elements ) {

        let awfootnote;
        
        if (elements instanceof AWFootNoteType) {
            awfootnote = elements
            awfootnote.refid = elements[2].text
        } else {
            awfootnote = new AWFootNoteType(null, null, elements[2].text)
        }

        return awfootnote

    },
    
    store_footnote(input, start, end, elements ) {
        
        console.log(input)  
        let awfootnote = elements[3]
        awfootnote.block_id = elements[1].text
        awfootnote.start = start
        awfootnote.end = end - 1
        footnote_list.add(awfootnote)
        return footnote_list
    }
    
}

module.exports = actions;