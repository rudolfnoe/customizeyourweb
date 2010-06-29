(function(cyw){
   function WrapperCommand(editCommand, sidebarWinHandler){
      this.editCommand = editCommand
      this.sidebarWinHandler = sidebarWinHandler
      this.actionBackup = null
      this.commandType = null
   }
   
   WrapperCommand.prototype={
      
      doCreateAction: function(editContext){
         var action = this.editCommand.doCreateAction(editContext)
         if(action==null){
            return null
         }
         var existingAction = this.getExistingActionById(action)
         if(existingAction){
            this.commandType="edit"
            this.actionBackup = cyw.ObjectUtils.deepClone(action)
         }else{
            //no backup! as actionbackup must be real reference to action for undo
            this.actionBackup = action
            this.commandType="create"
         }
         return action
      },
      
      doEditAction: function(action, editContext){
         this.commandType="edit"
         this.actionBackup = action
         var clonedAction = cyw.ObjectUtils.deepClone(action)
         return this.editCommand.doEditAction(clonedAction, editContext)
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
         this.editCommand.undo(editContext, this.actionBackup)
         if(this.commandType=="create"){
            this.sidebarWinHandler.removeAction(this.actionBackup)
         }else if(this.commandType=="edit"){
            this.sidebarWinHandler.updateAction(this.actionBackup)
         }else{
            throw new Error('Unknown action type')
         }
      }
   }

   cyw.Namespace.bindToNamespace("customizeyourweb", "WrapperCommand", WrapperCommand)
})(customizeyourweb)
