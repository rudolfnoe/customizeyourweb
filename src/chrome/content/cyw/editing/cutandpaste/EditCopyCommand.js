with(customizeyourweb){
(function(){
   function EditCopyCommand(){
      this.editRemoveCommmand = null
   }
   
   EditCopyCommand.prototype = {

      afterSuccessfulActionEditing: function(action, editContext){
         editContext.setClipboard(action.getTarget(editContext.getTargetWindow()).cloneNode(true))
      },

      createAction: function(editContext) {
         return new CopyAction(editContext.getNextActionId(), editContext.getDefaultTargetDefinition())
      }
   }
   ObjectUtils.extend(EditCopyCommand, "AbstractCommonAttributesEditCommand", customizeyourweb)

   Namespace.bindToNamespace("customizeyourweb", "EditCopyCommand", EditCopyCommand)
})()
}