with(customizeyourweb){
(function(){
   
   function AbstractCommonAttributesEditCommand(allowMultiTargetDefinition){
      this.AbstractEditCommand()
      this.allowMultiTargetDefinition = arguments.length>=1?allowMultiTargetDefinition:false
   }
   
   AbstractCommonAttributesEditCommand.prototype = {
      constructor: AbstractCommonAttributesEditCommand,
      
      afterCancelActionCreation: function(editContext){
         //empty default implementation
      },

      afterSuccessfulActionCreation: function(action, editContext){
         this.afterSuccessfulActionEditing(action, editContext)
      },

      afterCancelActionEditing: function(unmodifiedAction, editContext){
         //empty default implementation
      },

      afterSuccessfulActionEditing: function(action, editContext){
         //empty default implementation
      },
      
      beforeActionCreation: function(action, editContext){
         //empty default implementation      
      },

      beforeActionEditing: function(action, editContext){
         //empty default implementation      
      },
      
      createAction: function(editContext) {
         Assert.fail('must be implemented')
      },
      
      doCreateAction : function(editContext) {
         var action = this.createAction(editContext)
         this.beforeActionCreation(action, editContext)
         var action = this.editCommonActionAttributes(action, editContext)
         if(action!=null){
            this.afterSuccessfulActionCreation(action, editContext)
         }else{
            this.afterCancelActionCreation(editContext)
         }
         return action
      },
      
      doEditAction: function(action, editContext){
         this.beforeActionEditing(action, editContext)
         var modifiedAction = this.editCommonActionAttributes(action, editContext)
         if(modifiedAction !=null){
            this.afterSuccessfulActionEditing(modifiedAction, editContext)
         }else{
            this.afterCancelActionEditing(action, editContext)
         }
         return modifiedAction
      },

      editCommonActionAttributes: function(action, editContext){
         var dialog = new CommonAttributesEditDialog(action, editContext, this.allowMultiTargetDefinition) 
         dialog.show()
         return dialog.getActionResult();
      }
      
   }
   
   ObjectUtils.extend(AbstractCommonAttributesEditCommand, "AbstractEditCommand", customizeyourweb)
   
   Namespace.bindToNamespace("customizeyourweb", "AbstractCommonAttributesEditCommand", AbstractCommonAttributesEditCommand)
})()
}