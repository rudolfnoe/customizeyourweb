with(customizeyourweb){
(function(){
   const EDIT_INSERT_HTML_DIALOG_URL = CywCommon.CYW_CHROME_URL + "editing/insert/code/edit_insert_html_dialog.xul"
   
   function EditInsertHTMLCommand(){
      this.AbstractEditInsertHtmlCommand()
      this.targetElement = null
   }
   
   EditInsertHTMLCommand.prototype = {
      constructor: EditInsertHTMLCommand,

      doCreateAction: function(editContext){
         var insertHTMLAction = new InsertHTMLAction(editContext.getNextActionId(), editContext.getDefaultTargetDefinition())
         return this.editAction(insertHTMLAction, editContext, EDIT_INSERT_HTML_DIALOG_URL)
      },
      
      doEditAction: function(action, editContext){
         var targetElement = editContext.getTargetElement()
         var modifiedAction = this.editAction(action, editContext, EDIT_INSERT_HTML_DIALOG_URL)
         if(modifiedAction!=null){
            AbstractInsertHtmlAction.insertHtml(modifiedAction.getHtmlCode(), targetElement, modifiedAction.getPosition(), this.getHtmlMarkerId())
         }
         return modifiedAction
      }
      
   }
   ObjectUtils.extend(EditInsertHTMLCommand, "AbstractEditInsertHtmlCommand", customizeyourweb)

   Namespace.bindToNamespace("customizeyourweb", "EditInsertHTMLCommand", EditInsertHTMLCommand)
})()
}