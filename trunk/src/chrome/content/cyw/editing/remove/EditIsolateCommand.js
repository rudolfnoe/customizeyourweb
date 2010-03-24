with(customizeyourweb){
(function(){
   function EditIsolateCommand(){
      this.undoAction = null
   }
   
   EditIsolateCommand.prototype = {

      afterSuccessfulActionEditing: function(editContext){
         this.action = new IsolateAction(editContext.getTargetDefinition())
         var cywContext = new CywContext(editContext.getTargetWindow())
         this.action.doAction(cywContext)
      },
      
      createAction: function(editContext) {
         return new IsolateAction(editContext.getTargetDefinition())
      },
      
      undo: function(){
         
      }
      
   }
   ObjectUtils.extend(EditIsolateCommand, "AbstractCommonAttributesEditCommand", customizeyourweb)

   Namespace.bindToNamespace("customizeyourweb", "EditIsolateCommand", EditIsolateCommand)
})()
}