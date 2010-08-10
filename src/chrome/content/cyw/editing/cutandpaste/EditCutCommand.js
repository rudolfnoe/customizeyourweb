with(customizeyourweb){
(function(){
   function EditCutCommand(){
      this.AbstractRemoveCommand()
      this.clipboardBackup = null
   }
   
   EditCutCommand.prototype = {
      
      afterSuccessfulActionEditing: function(action, editContext){
         this.clipboardBackup = editContext.getClipboard() 
         editContext.setClipboard(action.getTarget(editContext.getTargetWindow()))
         this.AbstractRemoveCommand_afterSuccessfulActionEditing(action, editContext)
      },
      
      createAction: function(editContext) {
         return new CutAction(editContext.getNextActionId(), editContext.getDefaultTargetDefinition())
      },
      
      undo: function(editContext, action, actionBackup){
         editContext.setClipboard(this.clipboardBackup)
         this.AbstractRemoveCommand_undo(editContext, action, actionBackup)
      }
      
   }
   ObjectUtils.extend(EditCutCommand, "AbstractRemoveCommand", customizeyourweb)

   Namespace.bindToNamespace("customizeyourweb", "EditCutCommand", EditCutCommand)
})()
}