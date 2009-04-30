with(customizeyourweb){
(function(){
   function EditCutCommand(){
      this.AbstractRemoveCommand()
   }
   
   EditCutCommand.prototype = {
      afterSuccessfulActionEditing: function(editContext){
         //To resuse it
         editContext.setClipboard(editContext.getTargetElement())
         //call superclass method
         this.AbstractRemoveCommand_afterSuccessfulActionEditing(editContext)
      },
      
      createAction: function(editContext) {
         return new CutAction(editContext.getTargetDefinition())
      }
      
   }
   ObjectUtils.extend(EditCutCommand, "AbstractRemoveCommand", customizeyourweb)

   Namespace.bindToNamespace("customizeyourweb", "EditCutCommand", EditCutCommand)
})()
}