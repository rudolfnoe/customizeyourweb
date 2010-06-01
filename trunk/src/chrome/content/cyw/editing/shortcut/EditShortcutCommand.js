with(customizeyourweb){
(function(){
   const EDIT_SHORTCUT_DIALOG_URL = CywCommon.CYW_CHROME_URL + "editing/shortcut/edit_shortcut_dialog.xul"
   function EditShortcutCommand(){
   }
   
   EditShortcutCommand.prototype = {
      doCreateAction: function(editContext){
         var action = null
         var targetElement = editContext.getTargetElement()
         var commandId = editContext.getCommand().id
         var actionId = editContext.getNextActionId()
         if(commandId=="customizeyourweb_shortcutCmd"){
            action = new ShortcutAction(actionId, editContext.getTargetDefinition())
         }else if(commandId=="customizeyourweb_macroShortcutCmd"){
            action = new MacroShortcutAction(actionId)
            targetElement = null
         }else if(commandId=="customizeyourweb_toggleVisibilityShortcutCmd"){
            action = new ToggleVisibilityShortcutAction(actionId, editContext.getTargetDefinition())
         }else{
            throw new Error ('unkown shortcut command id')
         }
         action.setRepetitionBehavior(RepetitionBehavior.RUN_ALWAYS)
         return this.editAction(action, editContext)
      },
         
      doEditAction: function(action, editContext){
         return this.editAction(action, editContext)
      },

      editAction: function(action, editContext){
         var editDialog = new EditDialog(EDIT_SHORTCUT_DIALOG_URL, "EditShortcut", action, editContext)
         editDialog.show()
         return editDialog.getActionResult()
      }
      
   }
   ObjectUtils.extend(EditShortcutCommand, "AbstractEditCommand", customizeyourweb)

   Namespace.bindToNamespace("customizeyourweb", "EditShortcutCommand", EditShortcutCommand)
})()
}