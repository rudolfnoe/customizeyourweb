with(customizeyourweb){
(function(){
   
   var CommonAttributesEditDialogHandler = {
      targetDefinitionBinding: null,
      
      doOnload: function(){
         try{
            this.targetDefinitionBinding = byId('targetdefinition')
            var targetWindow = EditDialog.getTargetWindow()
            var targetElement = EditDialog.getTargetElement(targetElement)
            var action = EditDialog.getAction() 
            this.targetDefinitionBinding.initialize(targetWindow, targetElement, action.getTargetDefinition())
            var oldTargetDefinition = Dialog.getNamedArgument('oldTargetDefinition')
            if(oldTargetDefinition){
               this.targetDefinitionBinding.setOldTargetDefinition(oldTargetDefinition)
            }
            
            //this.targetDefinitionBinding.setOldTargetDefinition(action.getTargetDefinition())
            this.targetDefinitionBinding.setAllowMultiTargetDefinition(EditDialog.getAllowMultiTargetDefinition())
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