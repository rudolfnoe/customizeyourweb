with(customizeyourweb){
(function(){
   const EDIT_INSERT_SUBWINDOW_DIALOG_URL = CywCommon.CYW_CHROME_URL + "editing/insert/subwindow/edit_insert_subwindow_dialog.xul"
   const DIALOG_HEIGHT="544"
   
   function EditInsertSubwindowCommand(){
      this.AbstractEditInsertHtmlCommand()
      this.targetElement = null
   }
   
   EditInsertSubwindowCommand.prototype = {
      constructor: EditInsertSubwindowCommand,

      doCreateAction: function(editContext){
         var insertHTMLAction = new InsertSubwindowAction(editContext.getTargetDefinition())
         return this.editAction(insertHTMLAction, editContext)
      },
      
      doEditAction: function(editContext){
         var action = editContext.getAction()
         var targetElement = editContext.getTargetElement()
         var result = this.editAction(action, editContext)
         return result
      },
      
      editAction: function(action, editContext){
         return this.AbstractEditInsertHtmlCommand_editAction(action, editContext, EDIT_INSERT_SUBWINDOW_DIALOG_URL)
       }
      
   }
   ObjectUtils.extend(EditInsertSubwindowCommand, "AbstractEditInsertHtmlCommand", customizeyourweb)

   Namespace.bindToNamespace("customizeyourweb", "EditInsertSubwindowCommand", EditInsertSubwindowCommand)
})()
}