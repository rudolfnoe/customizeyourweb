with(customizeyourweb){
(function(){
   
	function AbstractEditCommand(){
      //Memento object storing undo data (GoF Pattern)
      //This memento is used for previewable actions (see IPreviewableAction)
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

      doCreateAction: function(){
         throw new Error('Must be implemented')
      },

      doEditAction: function(){
         throw new Error('Must be implemented')
      },
      
      /*
       * Returns already exisiting action based on the action type and the target defintion
       * @param function actionType: Constructor Function
       * @param AbstractTargetDefinition targetdefinition: The target definition of the action 
       * @returns AbstractAction: The action according the provided action type and target definition
       */
      getExistingAction: function(actionType, targetDefinition){
         Assert.paramsNotNull(arguments)
         var actions = EditScriptHandler.getSidebarWinHandler().getActions()
         var actionIter = new ActionIterator(actions)
         var exisitingAction = null
         while(actionIter.hasNext()){
            var action = actionIter.next()
            if(action.constructor==actionType && ObjectUtils.deepEquals(action.getTargetDefinition(), targetDefinition)){
               exisitingAction = action
            }
         }
         return exisitingAction
      },
      
      /*
       * Default Implementation
       * Use the new undo mechanism of IPreviableAction
       * @param EditContext editContext
       * @param AbstractAction action: The action which was create/edited by the step which should be undone
       * @param AbstractAction actionBackup: Only provided for undoing editing. This is the action in the state before it was modified
       */
      undo: function(editContext, action, actionBackup){
         if(ObjectUtils.instanceOf(action, IPreviewableAction)){
            action.undo(editContext, this.undoMemento)
            if(actionBackup){
               actionBackup.preview(editContext)
            }
         }
      }
   }
   
   Namespace.bindToNamespace("customizeyourweb", "AbstractEditCommand", AbstractEditCommand)   
})()
}