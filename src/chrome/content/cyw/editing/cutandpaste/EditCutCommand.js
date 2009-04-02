with(customizeyourweb){
(function(){
   function EditCutCommand(){
      this.editRemoveCommmand = null
   }
   
   EditCutCommand.prototype = {
      doCreateAction: function(editContext){
         this.editRemoveCommand = new EditRemoveCommand()
         var removeAction = this.editRemoveCommand.doCreateAction(editContext)
         this.setAction(new CutAction(removeAction.getTargetDefinition()))
         editContext.setClipboard(editContext.getTargetElement())
         return this.getAction()
      },
      
      undo: function(){
        this.editRemoveCommand.undo() 
      }
      
   }
   ObjectUtils.extend(EditCutCommand, "AbstractEditCommand", customizeyourweb)

   Namespace.bindToNamespace("customizeyourweb", "EditCutCommand", EditCutCommand)
})()
}