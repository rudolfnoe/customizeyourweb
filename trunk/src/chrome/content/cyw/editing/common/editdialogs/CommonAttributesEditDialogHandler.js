with(customizeyourweb){
(function(){
   
   var CommonAttributesEditDialogHandler = {
      targetDefinitionField: null,
      
      doOnload: function(){
         try{
            this.targetDefinitionField = byId('targetdefinition')
            this.targetDefinitionField.setTargetElement(Dialog.getNamedArgument('targetElement'))
            this.targetDefinitionField.createDefaultTargetDefinitions()
            var action = Dialog.getNamedArgument('action') 
            //Must be set at the end as createDefaultTargetDefinitions would override name and optional flag
            this.targetDefinitionField.setOldTargetDefinition(action.getTargetDefinition())
         }catch(e){
            Utils.logError(e)
         }
      },
      
      doOk: function(){
         Dialog.setResult(DialogResult.OK)
         var action = Dialog.getNamedArgument('action')
         action.setTargetDefinition(this.targetDefinitionField.getTargetDefinition())
         Dialog.setNamedResult("action", action)
      }
   }

   Namespace.bindToNamespace("customizeyourweb", "CommonAttributesEditDialogHandler", CommonAttributesEditDialogHandler)

   function byId(id){
      return document.getElementById(id)
   }
})()
}