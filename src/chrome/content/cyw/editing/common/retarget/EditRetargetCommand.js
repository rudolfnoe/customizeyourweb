with(customizeyourweb){
(function(){
   
   /*
    * Dummy action for retargeting
    * TODO Preview is missing
    */
   function EditRetargetCommand(){
   }
   
   /*
    * TODO In the edit dialog the action name is displayed an no hint of retargeting
    * ENHANCEMENT Enable preview and undoing of retargeting
    */
   EditRetargetCommand.prototype = {
      constructor: EditRetargetCommand,
      EditRetargetCommand: EditRetargetCommand,
      
      doCreateAction: function(){
         throw new Error('Must never be called')
      },

      doEditAction: function(action, editContext){
         //Save old targetDefinition
         var oldTargetDef = action.getTargetDefinition().getDefinitionAsString()
         //Create new default target definition
         action.setTargetDefinition(AbstractTargetDefinitionFactory.createDefaultDefinition(editContext.getTargetElement()))
         var dialog = new CommonAttributesEditDialog(action, editContext, oldTargetDef) 
         dialog.show()
         var actionResult = dialog.getActionResult()
         if(dialog.isOk()){
            actionResult.preview(editContext)
         }
         return actionResult 
      }
      
   }
   ObjectUtils.extend(EditRetargetCommand, "AbstractEditCommand", customizeyourweb)
   
   Namespace.bindToNamespace("customizeyourweb", "EditRetargetCommand", EditRetargetCommand)   
})()
}