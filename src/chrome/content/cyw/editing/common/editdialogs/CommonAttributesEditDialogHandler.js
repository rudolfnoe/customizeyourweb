with(customizeyourweb){
(function(){
   
   /*
    * Handler for common attributes dialog
    * TODO Add help text for which action dialog is shown.
    */
   var CommonAttributesEditDialogHandler = {
      
      doOnload: function(){
         try{
            var targetWindow = EditDialog.getTargetWindow()
            var targetElement = EditDialog.getTargetElement(targetElement)
            var action = EditDialog.getAction()
            var targetDefBinding = this.getTargetDefinitionBinding()
            targetDefBinding.initialize(targetWindow, targetElement, action.getTargetDefinition())
            var oldTargetDefinition = Dialog.getNamedArgument('oldTargetDefinition')
            if(oldTargetDefinition){
               targetDefBinding.setOldTargetDefinition(oldTargetDefinition)
            }
            
            //this.targetDefinitionBinding.setOldTargetDefinition(action.getTargetDefinition())
            targetDefBinding.setAllowMultiTargetDefinition(EditDialog.getAllowMultiTargetDefinition())
            this.initValidators(targetWindow, EditDialog.getAllowMultiTargetDefinition())
         }catch(e){
            CywUtils.logError(e)
         }
      },
      
      doOk: function(){
         Dialog.setResult(DialogResult.OK)
         var action = this.getAction()
         action.setTargetDefinition(this.getTargetDefinition())
         Dialog.setNamedResult("action", action)
      },
      
      initValidators: function(targetWindow, allowMultiTargetDef){
         var okValidator = new TargetDefinitionXblValidator(byId('targetdefinition'), targetWindow, allowMultiTargetDef)
         Dialog.addOkValidator(okValidator)
         okValidator.validate()
      }
   }
   ObjectUtils.injectFunctions(CommonAttributesEditDialogHandler, AbstractEditDialogHandler);
   Namespace.bindToNamespace("customizeyourweb", "CommonAttributesEditDialogHandler", CommonAttributesEditDialogHandler)

   function byId(id){
      return document.getElementById(id)
   }
})()
}