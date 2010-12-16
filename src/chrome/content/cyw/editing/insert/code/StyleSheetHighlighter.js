with(customizeyourweb){
(function(){
   const POSITION_CHANGE_KEY_CODES = [KeyEvent.DOM_VK_LEFT, KeyEvent.DOM_VK_RIGHT, KeyEvent.DOM_VK_UP, KeyEvent.DOM_VK_DOWN, 
                                       KeyEvent.DOM_VK_HOME, KeyEvent.DOM_VK_END, KeyEvent.DOM_VK_PAGE_UP, KeyEvent.DOM_VK_PAGE_DOWN];
   const REGEXP_COMMENTS = /\/\*.*?\*\//m
   const MAX_NUMBER_HIGHLIGHLIGHTED_ELEMENTS = 100
   
   var StyleSheetHighlighter = {
      editor: null,
      lastSelector: null,
      multiElementHighlighter: null,
      targetDocument: null,
      
      cleanUp: function(){
         this.multiElementHighlighter.unhighlight()
      },
      
      getSelector: function(){
         var content = this.editor.value
         var cursorPos = this.getCursorPos()
         var indexLastClosingBracket = content.lastIndexOf('}', cursorPos-1)
         var indexLastOpeningBracket = content.lastIndexOf("{", cursorPos)
         var selector = null
         if(indexLastClosingBracket>=0){
            selector = content.substring(indexLastClosingBracket+1, indexLastOpeningBracket)
         }else{
            selector = content.substring(0, indexLastOpeningBracket)
         }
         selector = selector.replace(REGEXP_COMMENTS, "")
         selector = selector.replace(/\n/g, "").trim()
         return selector
      },
      
      getCursorPos: function(){
         return this.editor.getCursorPos()
      },
      
      handleClick: function(event){
         this.handlePositionChange()
      },
      
      handleKeyUp: function(event){
         if (POSITION_CHANGE_KEY_CODES.indexOf(event.keyCode)==-1){
            return
         }
         this.handlePositionChange()
      },
      
      handlePositionChange: function(){
         Utils.executeDelayed("STYLE_SHEET_HIGHLIGHTER", 500, this._handlePositionChange, this)
      },
      
      _handlePositionChange: function(){
         try{
            if(this.isHighlight()){
               var selector = this.getSelector()
               if(selector==this.lastSelector){
                  return
               }
               this.lastSelector = selector
               this.hightlightMatchingElements(selector)
            }else{
               this.multiElementHighlighter.unhighlight()
               this.lastSelector = null
            }
         }catch(e){
            CywUtils.logError(e, null, true)            
         }
      },
      
      hightlightMatchingElements: function(selector){
         try{
            var matchingElems = this.targetDocument.querySelectorAll(selector)
         }catch(e){
            //Invalid selector
            return
         }
         this.multiElementHighlighter.updateHighlighting(DomUtils.convertNodeListToArray(matchingElems), MAX_NUMBER_HIGHLIGHLIGHTED_ELEMENTS)
      },
      
      init: function(editor, targetDocument){
         this.editor = editor
         this.multiElementHighlighter = new MultiElementHighlighter("#208F1A", false)
         this.targetDocument = targetDocument
         
         editor.addEventListener("keyup", Utils.bind(this.handleKeyUp, this), true)
         editor.addEventListener("click", Utils.bind(this.handleClick, this), true)
         editor.ownerDocument.defaultView.addEventListener("unload", Utils.bind(this.cleanUp, this), true)
      },
      
      isHighlight: function(){
         var content = this.editor.value
         var cursorPos = this.getCursorPos()
         var indexLastOpeningBracket = content.lastIndexOf('{', cursorPos)
         var indexLastClosingBracket = content.lastIndexOf('}', cursorPos-1)
         var indexNextOpeningBracket = content.indexOf("{", cursorPos)
         var indexNextClosingBracket = content.indexOf('}', cursorPos-1)
         return (indexLastOpeningBracket > indexLastClosingBracket) && 
                 ((indexNextClosingBracket < indexNextOpeningBracket) || 
                 (indexNextOpeningBracket == -1 && indexNextClosingBracket != -1))     
         
      }
      
   }

   Namespace.bindToNamespace("customizeyourweb", "StyleSheetHighlighter", StyleSheetHighlighter)
})()
}