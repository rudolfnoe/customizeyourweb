with(customizeyourweb){
(function(){
   function AbstractTargetDefinitionFactory(){
   }
   
   AbstractTargetDefinitionFactory.getFactoryFor = function(element){
      var tagName = element.tagName
      var simpleTargetDefinitionTags = Prefs.getPrefAsArray("customizeyourweb.simpleTargetDefinitionTags", ",")
      var simpleTargetDefTag = false
      for (var i = 0; i < simpleTargetDefinitionTags.length; i++) {
         if(simpleTargetDefinitionTags[i].toUpperCase()==tagName.toUpperCase()){
            simpleTargetDefTag = true
            break
         }
      }
      if(simpleTargetDefTag){
         return SimpleTargetDefinitionFactory.getInstance()
      }else{
         return XPathTargetDefinitionFactory.getInstance()
      }
   }
   
   AbstractTargetDefinitionFactory.createDefaultDefinition = function(element){
      return this.getFactoryFor(element).createDefaultDefinition(element)
   }
   
   AbstractTargetDefinitionFactory.createDefinitions = function(element){
      return this.getFactoryFor(element).createDefinitions(element)
   }
   
   AbstractTargetDefinitionFactory.prototype = {
      constructor: AbstractTargetDefinitionFactory,
      
      createDefaultDefinition: function(element){
         throw new Error ('not implemented')
      },

      createDefinitions: function(element){
         throw new Error ('not implemented')
      }
   }
   
   Namespace.bindToNamespace("customizeyourweb", "AbstractTargetDefinitionFactory", AbstractTargetDefinitionFactory)
})()
}