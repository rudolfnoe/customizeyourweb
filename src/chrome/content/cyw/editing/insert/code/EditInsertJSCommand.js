with(customizeyourweb){
(function(){
   const EDIT_INSERT_JS_DIALOG_URL = CywCommon.CYW_CHROME_URL + "editing/insert/code/edit_insert_js_dialog.xul"
   
   function EditInsertJSCommand(){}
   
   EditInsertJSCommand.prototype = {
      constructor: EditInsertJSCommand,

      doCreateAction: function(editContext){
         var insertJSAction = new InsertJSAction(editContext.getNextActionId())
         return this.editAction(insertJSAction)
      },
      
      doEditAction: function(action, editContext){
         return this.editAction(action)
      },
      
      editAction: function(action){
         var editDialog = new EditDialog(EDIT_INSERT_JS_DIALOG_URL, "EditInsertJS", action)
         editDialog.show()
         return editDialog.getActionResult()
       },
      
      undo: function(){
      }
      
   }
   ObjectUtils.extend(EditInsertJSCommand, "AbstractEditCommand", customizeyourweb)

   Namespace.bindToNamespace("customizeyourweb", "EditInsertJSCommand", EditInsertJSCommand)
})()
}