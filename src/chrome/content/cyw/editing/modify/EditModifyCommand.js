with(customizeyourweb){
(function(){
   const EDIT_MODIFY_DIALOG_URL = CywCommon.CYW_CHROME_URL + "editing/modify/edit_modify_dialog.xul"
   
   function EditModifyCommand(){
      this.targetElement = null
   }
   
   EditModifyCommand.prototype = {
      constructor: EditModifyCommand,

      setTargetElement: function(targetElement){
         this.targetElement = targetElement
      },

      doCreateAction: function(editContext){
         var action = new ModifyAction(editContext.getNextActionId(), editContext.getTargetDefinition()) 
         return this.editAction(action, editContext)
      },
      
      doEditAction: function(action, editContext){
         return this.editAction(action, editContext)
      },
      
      editAction: function(action, editContext){
			//TODO: targetElement can change in edit dialog!
         this.targetElement = editContext.getTargetElement()
         var editDialog = new EditDialog(EDIT_MODIFY_DIALOG_URL, "EditModify", action, editContext)
         editDialog.show()
         if(editDialog.isOk()){
				//TODO 
            this.setUndoMemento([editDialog.getNamedResult("changeMemento")])
            return editDialog.getNamedResult("action")
         }else{
            return null
         }
      },
      
      undo: function(){
         if(this.targetElement){
            var elementWrapper = new MultiElementWrapper([this.targetElement])
            elementWrapper.setChangeMemento(this.getUndoMemento())
            elementWrapper.restore()
         }
      }
   }
   ObjectUtils.extend(EditModifyCommand, "AbstractEditCommand", customizeyourweb)

   Namespace.bindToNamespace("customizeyourweb", "EditModifyCommand", EditModifyCommand)
})()
}