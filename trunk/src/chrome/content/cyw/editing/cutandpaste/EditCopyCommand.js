with(customizeyourweb){
(function(){
   function EditCopyCommand(){
      this.AbstractCommonAttributesEditCommand()
      this.clipboardBackup = null
   }
   
   EditCopyCommand.prototype = {

      afterSuccessfulActionEditing: function(action, editContext){
         this.clipboardBackup = editContext.getClipboard();
         editContext.setClipboard(action.getTarget(editContext.getTargetWindow()).cloneNode(true))
      },

      createAction: function(editContext) {
         return new CopyAction(editContext.getNextActionId(), editContext.getDefaultTargetDefinition())
      },
      
      undo: function(editContext){
         editContext.setClipboard(this.clipboardBackup)         
      }
   }
   ObjectUtils.extend(EditCopyCommand, "AbstractCommonAttributesEditCommand", customizeyourweb)

   Namespace.bindToNamespace("customizeyourweb", "EditCopyCommand", EditCopyCommand)
})()
}