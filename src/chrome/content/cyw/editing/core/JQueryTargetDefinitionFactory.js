with(customizeyourweb){
(function(){
   
   function JQueryTargetDefinitionFactory(){
   }
   
   //Static 
   JQueryTargetDefinitionFactory.instance = null
   
   JQueryTargetDefinitionFactory.getInstance = function(){
      if(!JQueryTargetDefinitionFactory.instance)
         JQueryTargetDefinitionFactory.instance = new JQueryTargetDefinitionFactory()
      return JQueryTargetDefinitionFactory.instance
   }
   
   JQueryTargetDefinitionFactory.prototype = {
      constructor: JQueryTargetDefinitionFactory,
      
      createDefaultDefinition: function(element){
         return this.createDefinitions(element)[0]
      },

      /*Creates JQuery selectors for give element
       * @return Array[JQueryTargetDefinition] 
       */
      createDefinitions: function(element){
         var strategies = JQuerySelectorFactory.getDefaultStrategies()
         var selectors = JQuerySelectorFactory.createSelectors(element)
         var result = []
         for (var i = 0; i < selectors.length; i++) {
            result.push(new JQueryTargetDefinition(selectors[i]))               
         }
         return result
      }
      
   }
   
   ObjectUtils.extend(JQueryTargetDefinitionFactory, "AbstractTargetDefinitionFactory", customizeyourweb)
   
   Namespace.bindToNamespace("customizeyourweb", "JQueryTargetDefinitionFactory", JQueryTargetDefinitionFactory)
})()
}