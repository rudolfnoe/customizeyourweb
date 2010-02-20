with(customizeyourweb){
(function(){
   function XPathTargetDefinitionXblHandler(targetDefinitionML, targetWin){
      this.AbstractTargetDefinitionXblHandler(targetDefinitionML, targetWin, null)
   }
   
   XPathTargetDefinitionXblHandler.prototype = {
      constructor: XPathTargetDefinitionXblHandler,
      
      createDefaultDefinition: function(targetElement){
         return XPathTargetDefinitionFactory.getInstance().createDefaultDefinition(targetElement)      
      },
      
      createDefinitions: function(targetElement){
         return XPathTargetDefinitionFactory.getInstance().createDefinitions(targetElement) 
      },
      
      getCurrentTargets: function(){
         var targetElems = null
         try{
            targetElems = XPathUtils.getElements(this.getTargetDefinitionValue(), this.getTargetDocument())
         }catch(e){
            throw new Error('Invalid XPath Expression')
         }
         return targetElems
      },
      
      getTargetDefinition: function(){
         return new XPathTargetDefinition(this.getTargetDefinitionML().value)      
      },
      
      handleCursorPositionChange: function(){
         var selectionStart = this.getTargetDefinitionML().inputField.selectionStart
         var xpath = this.getTargetDefinitionML().value
         var nextSlashIndex = xpath.indexOf("/", selectionStart) 
         if(nextSlashIndex!=-1){//If cursor in last part do noting
            var xpathPart = xpath.substring(0, nextSlashIndex)
            if(xpathPart=="")
               return //TODO make it right
            try{
               var elems = XPathUtils.getElements(xpathPart, this.getTargetWin().document)
            }catch(e){
               return
            }
            if(elems.length>=1){
               this.getTargetDefinitionHighlighter().updateHighlighting(elems)
               return
            }
         }
         this.getTargetDefinitionHighlighter().unhighlight()
      }
      
   }
   ObjectUtils.extend(XPathTargetDefinitionXblHandler, "AbstractTargetDefinitionXblHandler", customizeyourweb)
   
   Namespace.bindToNamespace("customizeyourweb", "XPathTargetDefinitionXblHandler", XPathTargetDefinitionXblHandler)
})()
}