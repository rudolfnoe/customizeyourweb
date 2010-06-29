with(customizeyourweb){
(function(){
   
   var CommonAttributesEditDialogHandler = {
      targetDefinitionBinding: null,
      
      doOnload: function(){
         try{
            this.targetDefinitionBinding = byId('targetdefinition')
            var targetWindow = EditDialog.getTargetWindow()
            this.targetDefinitionBinding.setTargetWindow(targetWindow)
            var targetElement = EditDialog.getTargetElement(targetElement)
            if(targetElement){
               this.targetDefinitionBinding.setTargetElement(targetElement)
               this.targetDefinitionBinding.createDefaultTargetDefinitions()
            }
            this.targetDefinitionBinding.setAllowMultiTargetDefinition(EditDialog.getAllowMultiTargetDefinition())
            var action = EditDialog.getAction() 
            //Must be set at the end as createDefaultTargetDefinitions would override name and optional flag
            this.targetDefinitionBinding.setOldTargetDefinition(action.getTargetDefinition())
            this.initValidators(targetWindow, EditDialog.getAllowMultiTargetDefinition())
         }catch(e){
            CywUtils.logError(e)
         }
      },
      
      doOk: function(){
         Dialog.setResult(DialogResult.OK)
         var action = EditDialog.getAction()
         action.setTargetDefinition(this.targetDefinitionBinding.getTargetDefinition())
         Dialog.setNamedResult("action", action)
      },
      
      initValidators: function(targetWindow, allowMultiTargetDef){
         var okValidator = new TargetDefinitionXblValidator(byId('targetdefinition'), targetWindow, allowMultiTargetDef)
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