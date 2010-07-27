with (customizeyourweb) {
(function() {
   function AbstractRemoveCommand(allowMultiTargetDefinition) {
      this.AbstractCommonAttributesEditCommand(allowMultiTargetDefinition)
      this.removedElements = []
   }

   AbstractRemoveCommand.prototype = {
      constructor: AbstractRemoveCommand,
      AbstractRemoveCommand: AbstractRemoveCommand,

      afterCancelActionEditing: function(unmodifiedAction, editContext){
         this.previewAction(unmodifiedAction, editContext)
      },
      
      afterSuccessfulActionEditing: function(action, editContext){
         this.previewAction(action, editContext)
      },
      
      previewAction:function(action, editContext){
         var undoMemento = action.preview(editContext)
         editContext.setActionChangeMemento(action.getId(), undoMemento)
      },
      
      beforeActionEditing: function(action, editContext){
         var changeMemento = editContext.getActionChangeMemento(action.getId())
         if(changeMemento){
            this.undo(editContext, action)   
         }
      },
      
      createAction: function(editContext) {
         Assert.fail('must be implemented')
      },

      undo : function(editContext, action, actionBackup) {
         action.undo(editContext, editContext.getActionChangeMemento(action.getId()));
         if(actionBackup){
            this.previewAction(actionBackup, editContext)
         }
      }
   }
   ObjectUtils.extend(AbstractRemoveCommand, "AbstractCommonAttributesEditCommand", customizeyourweb)

   Namespace.bindToNamespace("customizeyourweb", "AbstractRemoveCommand", AbstractRemoveCommand)
})()
}