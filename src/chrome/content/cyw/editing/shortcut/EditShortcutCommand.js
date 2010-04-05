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
         if(commandId=="customizeyourweb_shortcutCmd"){
            action = new ShortcutAction(editContext.getTargetDefinition())
         }else if(commandId=="customizeyourweb_macroShortcutCmd"){
            action = new MacroShortcutAction()
            targetElement = null
         }else if(commandId=="customizeyourweb_toggleVisibilityShortcutCmd"){
            action = new ToggleVisibilityShortcutAction(editContext.getTargetDefinition())
         }else{
            throw new Error ('unkown shortcut command id')
         }
         action.setRepetitionBehavior(RepetitionBehavior.RUN_ALWAYS)
         return this.editAction(action, editContext)
      },
         
      doEditAction: function(editContext){
         return this.editAction(editContext.getAction(), editContext)
      },

      editAction: function(action, editContext){
         var editDialog = new EditDialog(EDIT_SHORTCUT_DIALOG_URL, "EditShortcut", true, window, null, 
                                {action: action, targetElement:editContext.getTargetElement(), targetWindow:editContext.getTargetWindow()})
         editDialog.show()
         if(editDialog.getResult()==DialogResult.OK){
            return editDialog.getNamedResult("action")
         }else{
            return null
         }         
      }
      
   }
   
   
   ObjectUtils.extend(EditShortcutCommand, "AbstractEditCommand", customizeyourweb)

   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "EditShortcutCommand", EditShortcutCommand)
})()
}