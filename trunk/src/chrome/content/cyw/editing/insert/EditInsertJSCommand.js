with(customizeyourweb){
(function(){
   const EDIT_INSERT_JS_DIALOG_URL = CywCommon.CYW_CHROME_URL + "editing/insert/edit_insert_js_dialog.xul"
   
   function EditInsertJSCommand(){}
   
   EditInsertJSCommand.prototype = {
      constructor: EditInsertJSCommand,

      doCreateAction: function(editContext){
         var insertJSAction = new InsertJSAction()
         return this.editAction(insertJSAction)
      },
      
      doEditAction: function(editContext){
         return this.editAction(editContext.getAction())
      },
      
      editAction: function(action){
         var editDialog = new EditDialog(EDIT_INSERT_JS_DIALOG_URL, "EditInsertJS", true, window, null, {action: action})
         editDialog.show()
         if(editDialog.getResult()==DialogResult.OK){
            action = editDialog.getNamedResult("action")
            this.setAction(action)
            return this.getAction()
         }else{
            return null
         }
       },
      
      undo: function(){
      },
      
   }
   ObjectUtils.extend(EditInsertJSCommand, AbstractEditCommand)

   Namespace.bindToNamespace("customizeyourweb", "EditInsertJSCommand", EditInsertJSCommand)
})()
}