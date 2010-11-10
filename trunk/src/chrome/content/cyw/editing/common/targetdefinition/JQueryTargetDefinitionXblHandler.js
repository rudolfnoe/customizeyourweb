with(customizeyourweb){
(function(){
   function JQueryTargetDefinitionXblHandler(targetDefinitionML, targetWin){
      this.AbstractTargetDefinitionXblHandler(targetDefinitionML, targetWin, null)
   }
   
   JQueryTargetDefinitionXblHandler.prototype = {
      constructor: JQueryTargetDefinitionXblHandler,
      
      createDefaultDefinition: function(targetElement){
         return JQueryTargetDefinitionFactory.getInstance().createDefaultDefinition(targetElement)      
      },
      
      createDefinitions: function(targetElement){
         return JQueryTargetDefinitionFactory.getInstance().createDefinitions(targetElement) 
      },
      
      /*jQuery escape sequence are two backslashes, but if entered it turns into 4 backslashes as they are escaped too
       * Therefore the correction back to two backslashes
       */
      getCorretedTargetDefString: function(){
         return this.getTargetDefinitionValue().replace(/[\\]{2}/g, "\\")
      },
      
      getCurrentTargets: function(){
         var targetElems = null
         try{
            targetElems = $(this.getCorretedTargetDefString(), this.getTargetDocument()).toArray()
         }catch(e){
            throw new Error('Invalid JQuery Expression:' + e.toString())
         }
         return targetElems
      },
      
      getTargetDefinition: function(){
         return new JQueryTargetDefinition(this.getCorretedTargetDefString())      
      }
      
   }
   ObjectUtils.extend(JQueryTargetDefinitionXblHandler, "AbstractTargetDefinitionXblHandler", customizeyourweb)
   
   Namespace.bindToNamespace("customizeyourweb", "JQueryTargetDefinitionXblHandler", JQueryTargetDefinitionXblHandler)
})()
}