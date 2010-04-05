with(customizeyourweb){
(function(){
   function EditIsolateCommand(){
   }
   
   EditIsolateCommand.prototype = {

      afterSuccessfulActionEditing: function(editContext, action){
         var undoAction = ObjectUtils.deepClone(action)
         this.setUndoAction(undoAction)
         var cywContext = new CywContext(editContext.getTargetWindow())
         undoAction.doAction(cywContext)
      },
      
      createAction: function(editContext) {
         return new IsolateAction(editContext.getTargetDefinition())
      },
      
      undo: function(editContext){
         this.getUndoAction().undo(new CywContext(editContext.getTargetWindow()))
      }
      
   }
   ObjectUtils.extend(EditIsolateCommand, "AbstractCommonAttributesEditCommand", customizeyourweb)

   Namespace.bindToNamespace("customizeyourweb", "EditIsolateCommand", EditIsolateCommand)
})()
}