class AWFootNoteType {
 
    constructor(block_id, text_parameter, refid, footnote_marker) {
        
        this.block_id = block_id
        this.text_parameter = text_parameter
        this.refid = refid
        this.footnote_marker = footnote_marker
    }
    
}

let footnote_list = []
const EXISTING_FOOTNOTES = "existing-footnotes"

module.exports = AWFootNoteType;
module.exports.footnote_list = footnote_list;
module.exports.EXISTING_FOOTNOTES = EXISTING_FOOTNOTES;