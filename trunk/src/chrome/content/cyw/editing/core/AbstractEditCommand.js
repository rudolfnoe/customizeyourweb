with(customizeyourweb){
(function(){
   
	function AbstractEditCommand(){
      this.undoAction = null
   }
   
   AbstractEditCommand.prototype = {
      constructor: AbstractEditCommand,
      AbstractEditCommand: AbstractEditCommand,
      
      getUndoAction: function(){
         return this.undoAction
      },

      setUndoAction: function(undoAction){
         this.undoAction = undoAction
      },

      //TODO finish implementation
      disableMenuItem: function(commandId, targetElement){
         return false 
      },
      
      doCreateAction: function(){
         throw new Error('Not yet implemented')
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
      
      undo: function(){
         //Empty default implementation
      }
   }
   
   Namespace.bindToNamespace("customizeyourweb", "AbstractEditCommand", AbstractEditCommand)   
})()
}