with(customizeyourweb){
(function(){
   const EDIT_INSERT_STYLESHEET_DIALOG_URL = CywCommon.CYW_CHROME_URL + "editing/insert/code/edit_insert_stylesheet_dialog.xul"
   
   function EditInsertStyleSheetCommand(){}
   
   EditInsertStyleSheetCommand.prototype = {
      constructor: EditInsertStyleSheetCommand,

      doCreateAction: function(editContext){
         var insertStyleSheetAction = new InsertStyleSheetAction(editContext.getNextActionId())
         return this.editAction(insertStyleSheetAction, editContext)
      },
      
      doEditAction: function(action, editContext){
         return this.editAction(action, editContext)
      },
      
      editAction: function(action, editContext){
         var editDialog = new EditDialog(EDIT_INSERT_STYLESHEET_DIALOG_URL, "EditInsertStyleShhet", action, editContext)
         editDialog.show()
         return editDialog.getActionResult()
      },
      
      undo: function(editContext, actionBackup){
         if(actionBackup){
            InsertStyleSheetAction.setStyleSheet(actionBackup.getStyleSheetCode(), editContext.getTargetDocument(), 
                  editContext.getScriptId(), actionBackup.getId())
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