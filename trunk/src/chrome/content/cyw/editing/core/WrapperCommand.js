(function(cyw){
   function WrapperCommand(editCommand, sidebarWinHandler){
      this.editCommand = editCommand
      this.sidebarWinHandler = sidebarWinHandler
      //Reference to created or edited/modified action
      this.action = null
      //Clone of edited action before it was modified (for undoing)
      this.actionBackup = null
      this.commandType = null
   }
   
   WrapperCommand.prototype={
      
      getAction: function(){
         return this.action
      },

      doCreateAction: function(editContext){
         var action = this.editCommand.doCreateAction(editContext)
         if(action==null){
            return null
         }
         //This is extra handling for the resize action
         var existingAction = this.getExistingActionById(action)
         if(existingAction){
            //In truth it was an editing of an existing action
            this.commandType="edit"
            this.actionBackup = existingAction
         }else{
            //no backup! as actionbackup must be real reference to action for undo
            this.commandType="create"
         }
         this.action = action
         return action
      },
      
      doEditAction: function(currentAction, editContext){
         this.commandType="edit"
         //Current action instance is used as backup
         this.actionBackup = currentAction
         //undo action
         currentAction.undo(editContext)
         
         //Editing gets clone of original action so in case of canceling the action in the action tree stays unmodifed 
         this.action = this.editCommand.doEditAction(cyw.ObjectUtils.deepClone(currentAction), editContext)
         if(!this.action){
            //editing cancelled, restore old state
            currentAction.preview(editContext)
         }
         return this.action
      },
      
      getExistingActionById: function(aAction){
         var actions = this.sidebarWinHandler.getActions()
          for (var i = 0;i < actions.size(); i++) {
            var action = actions.get(i)
            if(aAction.equals(action))
               return action
         }
         return null
      },
      
      undo: function(editContext){
         if(this.commandType=="create"){
            this.editCommand.undo(editContext, this.action, null)
            this.sidebarWinHandler.removeAction(this.action)
         }else if(this.commandType=="edit"){
            this.editCommand.undo(editContext, this.action, this.actionBackup)
            this.sidebarWinHandler.updateAction(this.actionBackup)
         }else{
            throw new Error('Unknown action type')
         }
      }
   }

   cyw.Namespace.bindToNamespace("customizeyourweb", "WrapperCommand", WrapperCommand)
})(customizeyourweb)
