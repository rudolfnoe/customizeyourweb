with(customizeyourweb){
(function(){
   function EditIsolateCommand(){
   }
   
   EditIsolateCommand.prototype = {

      afterSuccessfulActionEditing: function(action, editContext){
         var previewAction = ObjectUtils.deepClone(action)
         this.setUndoMemento(previewAction.preview(editContext.getTargetWindow()))
      },
      
      createAction: function(editContext) {
         return new IsolateAction(editContext.getNextActionId(), editContext.getDefaultTargetDefinition())
      }
      
   }
   ObjectUtils.extend(EditIsolateCommand, "AbstractCommonAttributesEditCommand", customizeyourweb)

   Namespace.bindToNamespace("customizeyourweb", "EditIsolateCommand", EditIsolateCommand)
})()
}