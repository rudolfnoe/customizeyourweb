//with(customizeyourweb){
//(function(){
   const EDIT_MODIFY_DIALOG_URL = CywCommon.CYW_CHROME_URL + "editing/modify/edit_modify_dialog.xul";
   
   function EditModifyCommand(){
      this.AbstractEditCommand();
   }
   
   EditModifyCommand.prototype = {
      constructor: EditModifyCommand,

      doCreateAction: function(editContext){
         var action = new ModifyAction(editContext.getNextActionId(), editContext.getDefaultTargetDefinition()) 
         return this.editAction(action, editContext)
      },
      
      doEditAction: function(action, editContext){
         var result = this.editAction(action, editContext)
         if(!result){
            //Editing was canceled
            action.preview(editContext)
         }
         return result
      },
      
      editAction: function(action, editContext){
         var editDialog = new EditDialog(EDIT_MODIFY_DIALOG_URL, "EditModify", action, editContext)
         editDialog.show()
         if(editDialog.isOk()){
            this.setUndoMemento([editDialog.getNamedResult("changeMemento")]);
            return editDialog.getNamedResult("action");
         }else{
            return null;
         }
      }
      
   }
   ObjectUtils.extend(EditModifyCommand, "AbstractEditCommand", customizeyourweb)

   Namespace.bindToNamespace("customizeyourweb", "EditModifyCommand", EditModifyCommand)
//})()
//}