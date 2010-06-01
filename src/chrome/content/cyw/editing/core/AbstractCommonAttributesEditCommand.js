with(customizeyourweb){
(function(){
   
   function AbstractCommonAttributesEditCommand(allowMultiTargetDefinition){
      this.AbstractEditCommand()
      this.allowMultiTargetDefinition = arguments.length>=1?allowMultiTargetDefinition:false
   }
   
   AbstractCommonAttributesEditCommand.prototype = {
      constructor: AbstractCommonAttributesEditCommand,
      
      afterSuccessfulActionEditing: function(editContext){
         //empty default implementation
      },
      
      createAction: function(editContext) {
         Assert.fail('must be implemented')
      },
      
      doCreateAction : function(editContext) {
         var action = this.createAction(editContext)
         //Define target definition
         action = this.editCommonActionAttributes(action, editContext)
         if(action){
            this.afterSuccessfulActionEditing(editContext, action)
            return action
         }else{
            return null
         }
      },
      
      doEditAction: function(action, editContext){
         return this.editCommonActionAttributes(action, editContext)
      },

      editCommonActionAttributes: function(action, editContext){
         var dialog = new CommonAttributesEditDialog(action, editContext, this.allowMultiTargetDefinition) 
         dialog.show()
         if(dialog.isCancel()){
            return null
         }else{
            return dialog.getAction()
         }
      }
   }
   
   ObjectUtils.extend(AbstractCommonAttributesEditCommand, "AbstractEditCommand", customizeyourweb)
   
   Namespace.bindToNamespace("customizeyourweb", "AbstractCommonAttributesEditCommand", AbstractCommonAttributesEditCommand)
})()
}