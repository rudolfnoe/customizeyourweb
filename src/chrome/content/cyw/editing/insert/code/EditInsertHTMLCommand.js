with(customizeyourweb){
(function(){
   const EDIT_INSERT_HTML_DIALOG_URL = CywCommon.CYW_CHROME_URL + "editing/insert/code/edit_insert_html_dialog.xul"
   
   function EditInsertHTMLCommand(){
      this.AbstractEditInsertHtmlCommand()
   }
   
   EditInsertHTMLCommand.prototype = {
      constructor: EditInsertHTMLCommand,

      doCreateAction: function(editContext){
         var insertHTMLAction = new InsertHTMLAction(editContext.getNextActionId(), editContext.getDefaultTargetDefinition())
         return this.editInDialog(insertHTMLAction, editContext, EDIT_INSERT_HTML_DIALOG_URL)
      },
      
      doEditAction: function(action, editContext){
         return this.editAction(action, editContext, EDIT_INSERT_HTML_DIALOG_URL)
      }
      
   }
   ObjectUtils.extend(EditInsertHTMLCommand, "AbstractEditInsertHtmlCommand", customizeyourweb);

   Namespace.bindToNamespace("customizeyourweb", "EditInsertHTMLCommand", EditInsertHTMLCommand);
})()
}