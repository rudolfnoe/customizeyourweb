with(customizeyourweb){
(function(){
   
   /*
    * Handler for common attributes dialog
    * ENHANCEMENT Button for preview
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
            targetDefBinding.setAllowMultiTargetDefinition(action.allowsMultiTargets())
            this.initValidators(targetWindow, action.allowsMultiTargets())
            this.setTitle(action)
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
      },
      
      setTitle: function(action){
         var type = ObjectUtils.getType(action)
         var actionIndex = type.lastIndexOf("Action")
         document.title = type.substring(0, actionIndex) + " Action"
      }
   }
   ObjectUtils.injectFunctions(CommonAttributesEditDialogHandler, AbstractEditDialogHandler);
   Namespace.bindToNamespace("customizeyourweb", "CommonAttributesEditDialogHandler", CommonAttributesEditDialogHandler)

   function byId(id){
      return document.getElementById(id)
   }
})()
}