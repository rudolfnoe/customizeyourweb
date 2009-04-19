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
         return this.editAction(action, targetElement)
      },
         
      doEditAction: function(editContext){
         return this.editAction(editContext.getAction(), editContext.getTargetElement())
      },

      editAction: function(action, targetElement){
         var editDialog = new EditDialog(EDIT_SHORTCUT_DIALOG_URL, "EditShortcut", true, window, null, {action: action, targetElement:targetElement})
         editDialog.show()
         action = editDialog.getNamedResult("action")
         if(action==null)
            return
         this.setAction(action)
         return this.getAction()
      }
      
   }
   
   
   ObjectUtils.extend(EditShortcutCommand, AbstractEditCommand)

   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "EditShortcutCommand", EditShortcutCommand)
})()
}