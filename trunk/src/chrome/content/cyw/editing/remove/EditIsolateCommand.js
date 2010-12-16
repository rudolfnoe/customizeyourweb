with(customizeyourweb){
(function(){
   function EditIsolateCommand(){
      this.AbstractCommonAttributesEditCommand()
   }
   
   EditIsolateCommand.prototype = {

      afterSuccessfulActionEditing: function(action, editContext){
         action.preview(editContext)
      },

      createAction: function(editContext) {
         return new IsolateAction(editContext.getNextActionId(), editContext.getDefaultTargetDefinition())
      }
      
   }
   ObjectUtils.extend(EditIsolateCommand, "AbstractCommonAttributesEditCommand", customizeyourweb)

   Namespace.bindToNamespace("customizeyourweb", "EditIsolateCommand", EditIsolateCommand)
})()
}