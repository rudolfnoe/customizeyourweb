with(customizeyourweb){
(function(){
   /*
    * Superclass of edit-dialogs which contains common functionality
    * Is added to subclasses with ObjectUtils.injectFunctions
    */
   var AbstractEditDialogHandler = {
      getAction: function(clone){
         return EditDialog.getAction(clone)
      },
      
      getCurrentTargets: function(){
         return this.getTargetDefinition().getTargets(this.getTargetWindow())   
      },
      
      getEditContext: function(){
         return EditDialog.getEditContext()
      },
      
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
      
      initTargetDefinitionBinding: function(){
         var action = this.getAction(true)
         var targets = action.getTargets(this.getTargetWindow(), true)
         var targetElement = null
         if(targets.length==1){
            targetElement = targets[0]
         }
         this.getTargetDefinitionBinding().initialize(this.getTargetWindow(), targetElement, action.getTargetDefinition() ) 
      },
      
      hasMultipleTargets: function(){
         return this.getCurrentTargets().length>1  
      },
      
      loadJQuery: function(){
         CywUtils.loadJQuery()
      },
      
   }

   Namespace.bindToNamespace("customizeyourweb", "AbstractEditDialogHandler", AbstractEditDialogHandler)
   
      //helper
   function byId(id){
      return document.getElementById(id)
   }
   Namespace.bindToNamespace("customizeyourweb", "byId", byId)

})()
}