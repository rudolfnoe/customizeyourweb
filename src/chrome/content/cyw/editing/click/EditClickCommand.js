with(customizeyourweb){
(function(){
   const EDIT_CLICK_DIALOG_URL = CywCommon.CYW_CHROME_URL + "editing/click/edit_click_dialog.xul"
   function EditClickCommand(){
   }
   
   EditClickCommand.prototype = {
      doCreateAction: function(editContext){
         var action = new ClickAction(editContext.getNextActionId(), editContext.getDefaultTargetDefinition())
         return this.editAction(action, editContext)
      },
      
      doEditAction: function(action, editContext){
         return this.editAction(action, editContext)
      },

      editAction: function(action, editContext){
         var editDialog = new EditDialog(EDIT_CLICK_DIALOG_URL, "Edit Click", action, editContext)
         editDialog.show()
			return editDialog.getActionResult();
      }
      
   }
   
   ObjectUtils.extend(EditClickCommand, "AbstractEditCommand", customizeyourweb)

   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "EditClickCommand", EditClickCommand)
})()
}