with(customizeyourweb){
(function(){
   function SimpleTargetDefinitionXblHandler(targetDefinitionML, targetWin, targetElement){
      this.targetDefinitionML = targetDefinitionML
      this.targetElement = targetElement
      this.targetWin = targetWin
      this.autocompleteHandler = null
      this.initAutocompleteHandler()
   }
   
   SimpleTargetDefinitionXblHandler.prototype = {
      constructor: SimpleTargetDefinitionXblHandler,
      
      cleanUp: function(){
         this.autocompleteHandler.destroy()
      },
      
      createAutocompleteItem: function(name, value){
         var result = name + "="
         //TODO Could not be handled by parsing of simple target def
         var quotetype = '"'
//         if(StringUtils.contains("'", value)){
//            quotetype = '"'
//         }else{
//            quotetype = "'"
//         }
         result += quotetype + value + quotetype
         return result
      },
      
      createDefaultDefinition: function(targetElement){
         return SimpleTargetDefinitionFactory.getInstance().createDefaultDefinition(targetElement)      
      },
      
      createDefinitions: function(targetElement){
        return SimpleTargetDefinitionFactory.getInstance().createDefinitions(targetElement) 
      },

      getCurrentTargets: function(){
         return this.getTargetDefinition().getTargets(this.targetWin)
      },
      
      getTargetDefinition: function(){
         return SimpleTargetDefinitionFactory.getInstance().parseTargetDefinition(this.targetDefinitionML.value)      
      },
      
      handleCursorPositionChange: function(event){
      },
      
      initAutocompleteHandler: function(){
         var attributes = this.targetElement.attributes
         var autocompleteItems = []

         //Add item for text
         var textItem = this.createAutocompleteItem("text", SimpleTargetDefinition.getAttributeValue(this.targetElement, "text"))
         
         //Add attributes
         autocompleteItems.push(textItem)
         for (var i = 0; i < attributes.length; i++) {
            var attr = attributes.item(i)
            autocompleteItems.push(this.createAutocompleteItem(attr.name, 
                                                               SimpleTargetDefinition.getAttributeValue(this.targetElement, attr.name)))
         }
         this.autocompleteHandler = new Autocomplete(this.targetDefinitionML, new DefaultAutocompleteSearchHandler(autocompleteItems))
         
      }
   }
   
   Namespace.bindToNamespace("customizeyourweb", "SimpleTargetDefinitionXblHandler", SimpleTargetDefinitionXblHandler)
})()
}