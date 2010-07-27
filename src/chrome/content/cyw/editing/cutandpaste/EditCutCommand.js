with(customizeyourweb){
(function(){
   function EditCutCommand(){
      this.AbstractRemoveCommand()
   }
   
   EditCutCommand.prototype = {
      
      afterSuccessfulActionEditing: function(action, editContext){
         editContext.setClipboard(action.getTarget(editContext.getTargetWindow()))
         this.AbstractRemoveCommand_afterSuccessfulActionEditing(action, editContext)
      },
      
      createAction: function(editContext) {
         return new CutAction(editContext.getNextActionId(), editContext.getDefaultTargetDefinition())
      }
      
   }
   ObjectUtils.extend(EditCutCommand, "AbstractRemoveCommand", customizeyourweb)

   Namespace.bindToNamespace("customizeyourweb", "EditCutCommand", EditCutCommand)
})()
}