with(customizeyourweb){
(function(){
   function EditCopyCommand(){
      this.editRemoveCommmand = null
   }
   
   EditCopyCommand.prototype = {

      afterSuccessfulActionEditing: function(editContext){
         editContext.setClipboard(editContext.getTargetElement().cloneNode(true))
      },
      
      createAction: function(editContext) {
         return new CopyAction(editContext.getNextActionId(), editContext.getTargetDefinition())
      }
   }
   ObjectUtils.extend(EditCopyCommand, "AbstractCommonAttributesEditCommand", customizeyourweb)

   Namespace.bindToNamespace("customizeyourweb", "EditCopyCommand", EditCopyCommand)
})()
}