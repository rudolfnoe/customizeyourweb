with(customizeyourweb){
(function(){
   function XPathTargetDefinitionXblHandler(targetDefinitionML, targetWin){
      this.targetDefinitionML = targetDefinitionML
      this.targetDefinitionPartHighlighter = new MultiElementHighlighter("#208F1A", true)
      this.targetWin = targetWin
   }
   
   XPathTargetDefinitionXblHandler.prototype = {
      constructor: XPathTargetDefinitionXblHandler,
      
      cleanUp: function(){
         this.targetDefinitionPartHighlighter.unhighlight()   
      },
      
      createDefaultDefinition: function(targetElement){
         return XPathTargetDefinitionFactory.getInstance().createDefaultDefinition(targetElement)      
      },
      
      createDefinitions: function(targetElement){
         return XPathTargetDefinitionFactory.getInstance().createDefinitions(targetElement) 
      },
      
      getCurrentTargets: function(){
         var targetElems = null
         try{
            targetElems = XPathUtils.getElements(this.targetDefinitionML.value, this.targetWin.document)
         }catch(e){
            throw new Error('Invalid XPath Expression')
         }
         return targetElems
      },
      
      getTargetDefinition: function(){
         return new XPathTargetDefinition(this.targetDefinitionML.value)      
      },
      
      handleCursorPositionChange: function(){
         var selectionStart = this.targetDefinitionML.inputField.selectionStart
         var xpath = this.targetDefinitionML.value
         var nextSlashIndex = xpath.indexOf("/", selectionStart) 
         if(nextSlashIndex!=-1){//If cursor in last part do noting
            var xpathPart = xpath.substring(0, nextSlashIndex)
            if(xpathPart=="")
               return //TODO make it right
            try{
               var elems = XPathUtils.getElements(xpathPart, this.targetWin.document)
            }catch(e){
               return
            }
            if(elems.length>=1){
               this.targetDefinitionPartHighlighter.updateHighlighting(elems)
               return
            }
         }
         this.targetDefinitionPartHighlighter.unhighlight()
      }
      
   }
   
   Namespace.bindToNamespace("customizeyourweb", "XPathTargetDefinitionXblHandler", XPathTargetDefinitionXblHandler)
})()
}