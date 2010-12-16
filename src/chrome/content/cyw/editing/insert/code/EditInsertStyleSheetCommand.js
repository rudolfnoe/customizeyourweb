with(customizeyourweb){
(function(){
   const EDIT_INSERT_STYLESHEET_DIALOG_URL = CywCommon.CYW_CHROME_URL + "editing/insert/code/edit_insert_stylesheet_dialog.xul"
   
   function EditInsertStyleSheetCommand(){}
   
   EditInsertStyleSheetCommand.prototype = {
      constructor: EditInsertStyleSheetCommand,

      doCreateAction: function(editContext){
         var insertStyleSheetAction = new InsertStyleSheetAction(editContext.getNextActionId())
         return this.editInDialog(insertStyleSheetAction, editContext, EDIT_INSERT_STYLESHEET_DIALOG_URL)
      },
      
      doEditAction: function(action, editContext){
         return this.editAction(action, editContext, EDIT_INSERT_STYLESHEET_DIALOG_URL)
      }
   }
   ObjectUtils.extend(EditInsertStyleSheetCommand, "AbstractEditInsertHtmlCommand", customizeyourweb)

   Namespace.bindToNamespace("customizeyourweb", "EditInsertStyleSheetCommand", EditInsertStyleSheetCommand)
})()
}