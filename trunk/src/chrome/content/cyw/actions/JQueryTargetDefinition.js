with(customizeyourweb){
(function(){
   function JQueryTargetDefinition(selector){
      this.AbstractTargetDefinition()
      this.selector = selector
   }
   
   JQueryTargetDefinition.prototype = {
      constructor: JQueryTargetDefinition,
      
      getSelector: function(){
         return this.selector
      },

      setSelector: function(selector){
         this.selector = selector
      },
      
      getDefinitionAsString: function(){
         return this.getSelector()
      },

      getDefinitionStyle: function(){
         return TargetDefinitionStyle.JQUERY
      },

      getTargetsInternal: function(targetWin){
         return $(this.selector, targetWin.document).toArray()
      }         

   }
   
   ObjectUtils.extend(JQueryTargetDefinition, "AbstractTargetDefinition", customizeyourweb)
   
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "JQueryTargetDefinition", JQueryTargetDefinition)
})()
}