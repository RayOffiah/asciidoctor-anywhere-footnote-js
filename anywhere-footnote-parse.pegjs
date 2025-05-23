{
  
  let _ = require('lodash');
  
  class AnywhereFootnote {
    
    constructor() {
      
      this.start = 0
      this.end = 0
      this.block_id = ""
      this.text_parameter = ""
      this.ref_id = ""
      this.footnote_marker = ""
      
    }
    
 }
  
 
  let anywhereFootnote = new AnywhereFootnote()
  let footnote_list = []
      
}



document        
  =  (footnote / content)* {
  
        let uniqueFootnotes = []
    
       return _.uniqBy(footnote_list, 'start')
  }
  
content         
  =  (!footnote .)+
  
footnote        
  =  "awfootnote:" block_id:id "[" parameter_list "]" {
  
      anywhereFootnote.block_id = block_id.join('').trim()
      
      // Now get positional information.
      let location_info = location()
      anywhereFootnote.start = location_info.start.offset
      anywhereFootnote.end = location_info.end.offset - 1
      footnote_list.push(anywhereFootnote)
     
      anywhereFootnote= new AnywhereFootnote()
  
  }
  
id              
  =  [^\[]+
  
parameter_list  
  = textParameter / refIdParameter
  
refIdParameter  
  =  "refid=" quote ref_id:refid quote {
    
    if (anywhereFootnote === null) {
       anywhereFootnote = new AnywhereFootnote()
    }
    
    anywhereFootnote.ref_id = ref_id.join('').trim()
    return anywhereFootnote
  }
  
textParameter   
  = text_param: (!refIdParameter [^\]])+ {
  
      if (anywhereFootnote === null) {
       anywhereFootnote = new AnywhereFootnote()
    }
    
    anywhereFootnote.text_parameter = text_param.map(obj => obj[1]).join('').trim()
    return anywhereFootnote
  }
  
refid           
  = [^\\']+
  
quote           
  =  [\\']

