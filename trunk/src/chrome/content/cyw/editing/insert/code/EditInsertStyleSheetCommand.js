with(customizeyourweb){
(function(){
   const EDIT_INSERT_STYLESHEET_DIALOG_URL = CywCommon.CYW_CHROME_URL + "editing/insert/code/edit_insert_stylesheet_dialog.xul"
   
   function EditInsertStyleSheetCommand(){}
   
   EditInsertStyleSheetCommand.prototype = {
      constructor: EditInsertStyleSheetCommand,

      doCreateAction: function(editContext){
         var insertStyleSheetAction = new InsertStyleSheetAction()
         return this.editAction(insertStyleSheetAction, editContext.getTargetDocument(), editContext.getScriptId())
      },
      
      doEditAction: function(editContext){
         return this.editAction(editContext.getAction(), editContext.getTargetDocument(), editContext.getScriptId())
      },
      
      editAction: function(action, targetDocument, scriptId){
         var editDialog = new EditDialog(EDIT_INSERT_STYLESHEET_DIALOG_URL, "EditInsertStyleShhet", true, window, null, 
               {action: action, targetDocument:targetDocument, scriptId: scriptId})
         editDialog.show()
         if(editDialog.getResult()==DialogResult.OK){
            return editDialog.getNamedResult("action")
         }else{
            return null
         }
       },
      
      undo: function(editContext, actionBackup){
         if(actionsBackup){
            InsertStyleSheetAction.setStyleSheet(actionBackup.getStyleSheetCode(), editContext.getTargetDocument(), 
                  editContext.getScriptId(), actionsBackup.getId())
         }else{
            var styleElemId = InsertStyleSheetAction.getStyleSheetElementId(editContext.getScriptId(), this.getAction().getId())
            DomUtils.removeElement(editContext.getTargetDocument().getElementById(styleElemId))
         }
      }
      
   }
   ObjectUtils.extend(EditInsertStyleSheetCommand, "AbstractEditCommand", customizeyourweb)

   Namespace.bindToNamespace("customizeyourweb", "EditInsertStyleSheetCommand", EditInsertStyleSheetCommand)
})()
}