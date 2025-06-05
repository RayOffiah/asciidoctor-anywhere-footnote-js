{
  
  let _ = require('lodash');
  
  class AnywhereFootnote {
    
    constructor() {
      
      this.start = 0
      this.end = 0
      this.block_id = ""
      this.text_parameter = ""
      this.ref_id = ""
      this.original_ref_id = ""
      this.footnote_marker = ""
      
    }
    
 }
  
 
  let anywhereFootnote = new AnywhereFootnote()
  let footnote_list = []
  let counter = 0
      
}



document        
  =  (footnote / content)* {
  
        let uniqueFootnotes =  _.uniqBy(footnote_list, 'start')
        return uniqueFootnotes
  }
  
content         
  =  (!footnote .)+
  
footnote        
  =  "afnote:" block_id:id "[" parameter_list "]" {
  
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
  = textParameter / attributedParameters

textParameter   
  =  !attributedParameters text_param:[^\]]+ {
  
      if (anywhereFootnote === null) {
       anywhereFootnote = new AnywhereFootnote()
    }
    
    anywhereFootnote.text_parameter = text_param.join('').trim()
    return anywhereFootnote
  }
  
  
attributedParameters
  = parameter (__ "," __ parameter)*
parameter  
  =   refIdParameter / markerParameter /refTextParameter
  
refIdParameter  
  =  "refid=" value:quotedString {
    
    if (anywhereFootnote === null) {
       anywhereFootnote = new AnywhereFootnote()
    }
    
    anywhereFootnote.ref_id = value
    anywhereFootnote.original_ref_id = anywhereFootnote.ref_id
    return anywhereFootnote
  }
  
markerParameter  
  =  "marker=" value:quotedString {
    
    if (anywhereFootnote === null) {
       anywhereFootnote = new AnywhereFootnote()
    }
    
    anywhereFootnote.footnote_marker = value
    return anywhereFootnote
  }  
  
refTextParameter
  = "reftext=" value:quotedString {
  
      if (anywhereFootnote === null) {
         anywhereFootnote = new AnywhereFootnote()
      }
      
      anywhereFootnote.text_parameter = value
      return anywhereFootnote
  }
  
__
  = [ \t]*

quotedString
  = "'" chars:[^']* "'" { return chars.join(""); }
  / '"' chars:[^"]* '"' { return chars.join(""); }
