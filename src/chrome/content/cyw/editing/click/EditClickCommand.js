with(customizeyourweb){
(function(){
   const EDIT_CLICK_DIALOG_URL = CywCommon.CYW_CHROME_URL + "editing/click/edit_click_dialog.xul"
   function EditClickCommand(){
   }
   
   EditClickCommand.prototype = {
      doCreateAction: function(editContext){
         var action = new ClickAction(editContext.getTargetDefinition())
         return this.editAction(action, editContext.getTargetElement())
      },
      
      doEditAction: function(editContext){
         return this.editAction(editContext.getAction(), editContext.getTargetElement())
      },

      editAction: function(action, targetElement){
         var editDialog = new EditDialog(EDIT_CLICK_DIALOG_URL, "Edit Click", true, window, null, {action: action, targetElement: targetElement})
         editDialog.show()
         action = editDialog.getNamedResult("action")
         if(action==null)
            return
         this.setAction(action)
         return this.getAction()
      }
      
   }
   
   ObjectUtils.extend(EditClickCommand, "AbstractEditCommand", customizeyourweb)

   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "EditClickCommand", EditClickCommand)
})()
}