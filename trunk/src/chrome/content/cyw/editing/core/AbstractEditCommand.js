with(customizeyourweb){
(function(){
   
	function AbstractEditCommand(){
      this.undoMemento = null
   }
   
   AbstractEditCommand.prototype = {
      constructor: AbstractEditCommand,
      AbstractEditCommand: AbstractEditCommand,
      
      getUndoMemento: function(){
         return this.undoMemento
      },

      setUndoMemento: function(undoMemento){
         this.undoMemento = undoMemento
      },

      //TODO finish implementation
      disableMenuItem: function(commandId, targetElement){
         return false 
      },
      
      doCreateAction: function(){
         throw new Error('Must be implemented')
      },

      doEditAction: function(){
         throw new Error('Must be implemented')
      },
      
      /*
       * @param function actionType: Constructor Function
       */
      getExistingAction: function(actionType, targetDefinition){
         if(!actionType || !targetDefinition)
            throw new Error ('NullPointerException')
         //TODO maybe consider first and second level actions
         var actions = EditScriptHandler.getSidebarWinHandler().getActions()
         for (var i = actions.size()-1; i >= 0; i--) {
            var action = actions.get(i)
            if(action.constructor==actionType && ObjectUtils.deepEquals(action.getTargetDefinition(), targetDefinition))
               return action
         }
      },
      
      /*
       * Default Implementation
       */
      undo: function(editContext, actionBackup){
         if(ObjectUtils.instanceOf(actionBackup, IPreviewableAction) && this.undoMemento){
            actionBackup.undo(editContext.getTargetWindow(), this.undoMemento)
         }
         //Empty default implementation
      }
   }
   
   Namespace.bindToNamespace("customizeyourweb", "AbstractEditCommand", AbstractEditCommand)   
})()
}