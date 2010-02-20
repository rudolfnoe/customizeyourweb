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
      
      getCurrentTargets: function(){
         var targetElems = null
         try{
            targetElems = $(this.getTargetDefinitionValue(), this.getTargetDocument()).toArray()
         }catch(e){
            throw new Error('Invalid JQuery Expression:' + e.toString())
         }
         return targetElems
      },
      
      getTargetDefinition: function(){
         return new JQueryTargetDefinition(this.getTargetDefinitionValue())      
      }
      
   }
   ObjectUtils.extend(JQueryTargetDefinitionXblHandler, "AbstractTargetDefinitionXblHandler", customizeyourweb)
   
   Namespace.bindToNamespace("customizeyourweb", "JQueryTargetDefinitionXblHandler", JQueryTargetDefinitionXblHandler)
})()
}