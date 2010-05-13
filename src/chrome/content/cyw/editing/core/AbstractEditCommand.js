with(customizeyourweb){
(function(){
   
	function AbstractEditCommand(){
      this.action = null
   }
   
   AbstractEditCommand.prototype = {
      constructor: AbstractEditCommand,
      AbstractEditCommand: AbstractEditCommand,
      
      //TODO finish implementation
      disableMenuItem: function(commandId, targetElement){
         return false 
      },
      
   	getAction: function(){
   		return this.action
   	},

      setAction: function(action){
   		this.action = action
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