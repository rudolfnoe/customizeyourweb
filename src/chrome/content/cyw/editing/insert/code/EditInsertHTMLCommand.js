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
         return this.editAction(insertHTMLAction, editContext, EDIT_INSERT_HTML_DIALOG_URL)
      },
      
      doEditAction: function(action, editContext){
         var result = this.editAction(action, editContext, EDIT_INSERT_HTML_DIALOG_URL)
         //result is null if editing was cancelled
         //old state must be recreated
         if(!result){
            action.preview(editContext)
         }
         return result;
      }
      
   }
   ObjectUtils.extend(EditInsertHTMLCommand, "AbstractEditInsertHtmlCommand", customizeyourweb);

   Namespace.bindToNamespace("customizeyourweb", "EditInsertHTMLCommand", EditInsertHTMLCommand);
})()
}