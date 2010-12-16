with(customizeyourweb){
(function(){
   const EDIT_INSERT_SUBWINDOW_DIALOG_URL = CywCommon.CYW_CHROME_URL + "editing/insert/subwindow/edit_insert_subwindow_dialog.xul"
   
   function EditInsertSubwindowCommand(){
      this.AbstractEditInsertHtmlCommand()
   }
   
   EditInsertSubwindowCommand.prototype = {
      constructor: EditInsertSubwindowCommand,

      doCreateAction: function(editContext){
         var insertHTMLAction = new InsertSubwindowAction(editContext.getNextActionId(), editContext.getDefaultTargetDefinition())
         return this.editInDialog(insertHTMLAction, editContext, EDIT_INSERT_SUBWINDOW_DIALOG_URL)
      },
      
      doEditAction: function(action, editContext){
         return this.editAction(action, editContext, EDIT_INSERT_SUBWINDOW_DIALOG_URL);
      }
      
   }
   ObjectUtils.extend(EditInsertSubwindowCommand, "AbstractEditInsertHtmlCommand", customizeyourweb);

   Namespace.bindToNamespace("customizeyourweb", "EditInsertSubwindowCommand", EditInsertSubwindowCommand);
})()
}