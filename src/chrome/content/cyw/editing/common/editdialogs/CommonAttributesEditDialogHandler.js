with(customizeyourweb){
(function(){
   
   var CommonAttributesEditDialogHandler = {
      targetDefinitionField: null,
      
      doOnload: function(){
         try{
            this.targetDefinitionField = byId('targetdefinition')
            this.targetDefinitionField.setTargetElement(EditDialog.getTargetElement())
            this.targetDefinitionField.createDefaultTargetDefinitions()
            var action = Dialog.getNamedArgument('action') 
            //Must be set at the end as createDefaultTargetDefinitions would override name and optional flag
            this.targetDefinitionField.setOldTargetDefinition(action.getTargetDefinition())
            this.initValidators(EditDialog.getTargetElement())
         }catch(e){
            Utils.logError(e)
         }
      },
      
      doOk: function(){
         Dialog.setResult(DialogResult.OK)
         var action = Dialog.getNamedArgument('action')
         action.setTargetDefinition(this.targetDefinitionField.getTargetDefinition())
         Dialog.setNamedResult("action", action)
      },
      
      initValidators: function(targetElement){
         var okValidator = new TargetDefinitionXblValidator(byId('targetdefinition'), DomUtils.getOwnerWindow(targetElement))
         Dialog.addOkValidator(okValidator)
         okValidator.validate()
      }
   }

   Namespace.bindToNamespace("customizeyourweb", "CommonAttributesEditDialogHandler", CommonAttributesEditDialogHandler)

   function byId(id){
      return document.getElementById(id)
   }
})()
}