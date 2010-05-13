with(customizeyourweb){
(function(){
   function EditIsolateCommand(){
   }
   
   EditIsolateCommand.prototype = {

      afterSuccessfulActionEditing: function(editContext, action){
         var previewAction = ObjectUtils.deepClone(action)
         this.setUndoMemento(previewAction.preview(editContext.getTargetWindow()))
      },
      
      createAction: function(editContext) {
         return new IsolateAction(editContext.getTargetDefinition())
      }
      
   }
   ObjectUtils.extend(EditIsolateCommand, "AbstractCommonAttributesEditCommand", customizeyourweb)

   Namespace.bindToNamespace("customizeyourweb", "EditIsolateCommand", EditIsolateCommand)
})()
}