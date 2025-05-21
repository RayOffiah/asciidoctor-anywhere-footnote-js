class AWFootNoteType {
 
    constructor(block_id, text_parameter, refid, footnote_marker) {
        
        this.start = 0
        this.end = 0
        this.block_id = block_id
        this.text_parameter = text_parameter
        this.refid = refid
        this.footnote_marker = footnote_marker
    }
    
}

let footnote_list = new Set()

module.exports = AWFootNoteType;
module.exports.footnote_list = footnote_list;