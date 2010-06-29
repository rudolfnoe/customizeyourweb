with(customizeyourweb){
(function(){
   /*
    * Superclass of edit-dialogs which contains common functionality
    * Is added to subclasses with ObjectUtils.injectFunctions
    */
   var AbstractEditDialogHandler = {
		getScriptId: function(){
			 return EditDialog.getTargetWindow()
		},
		
      getTargetDefinition: function(){
         return byId('targetdefinition').getTargetDefinition()
      },
      
      getTargetDefinitionBinding: function(){
         return byId('targetdefinition')
      },
      
      getTargetWindow: function(){
         return EditDialog.getTargetWindow()
      },
      
      loadJQuery: function(){
         CywUtils.loadJQuery()
      }
      
   }

   Namespace.bindToNamespace("customizeyourweb", "AbstractEditDialogHandler", AbstractEditDialogHandler)
   
      //helper
   function byId(id){
      return document.getElementById(id)
   }
   Namespace.bindToNamespace("customizeyourweb", "byId", byId)

})()
}