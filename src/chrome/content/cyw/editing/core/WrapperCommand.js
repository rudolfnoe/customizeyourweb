with(customizeyourweb){
(function(){
   function WrapperCommand(editCommand, sidebarWinHandler){
      this.editCommand = editCommand
      this.sidebarWinHandler = sidebarWinHandler
      this.actionBackup = null
      this.commandType = null
   }
   
   WrapperCommand.prototype={
      createActionBackup: function(action){
         this.actionBackup = ObjectUtils.deepClone(action)
      },
      
      doCreateAction: function(editContext){
         var action = this.editCommand.doCreateAction(editContext)
         if(action==null){
            return null
         }
         var existingAction = this.getExistingActionById(action)
         if(existingAction){
            this.commandType="edit"
            this.createActionBackup(existingAction)
         }else{
            this.commandType="create"
         }
         return action
      },
      
      doEditAction: function(editContext){
         this.commandType="edit"
         this.createActionBackup(editContext.getAction())
         return this.editCommand.doEditAction(editContext)
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
      
      undo: function(editContext, actionBackup){
         this.editCommand.undo(editContext, this.actionBackup)
         if(this.commandType=="create"){
            this.sidebarWinHandler.removeAction(this.editCommand.getAction())
         }else if(this.commandType=="edit"){
            this.sidebarWinHandler.updateAction(this.actionBackup)
         }else{
            throw new Error('Unknown action type')
         }
      }
   }

   Namespace.bindToNamespace("customizeyourweb", "WrapperCommand", WrapperCommand)
})()
}