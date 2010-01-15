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
            this.setAction(action)
            this.afterSuccessfulActionEditing(editContext)
            return this.getAction()
         }else{
            return null
         }
      },
      
      doEditAction: function(editContext){
         action = this.editCommonActionAttributes(editContext.getAction(), editContext)
         if(action){
            this.setAction(action)
            return this.getAction()
         }else{
            return null
         }
      },

      editCommonActionAttributes: function(action, editContext){
         var dialog = new CommonAttributesEditDialog(action, editContext.getTargetWindow(), editContext.getTargetElement(), 
                                                      this.allowMultiTargetDefinition) 
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