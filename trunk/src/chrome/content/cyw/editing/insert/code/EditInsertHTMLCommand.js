with(customizeyourweb){
(function(){
   const EDIT_INSERT_HTML_DIALOG_URL = CywCommon.CYW_CHROME_URL + "editing/insert/code/edit_insert_html_dialog.xul"
   const DIALOG_HEIGHT="544"
   
   function EditInsertHTMLCommand(){
      this.AbstractEditInsertHtmlCommand()
      this.targetElement = null
   }
   
   EditInsertHTMLCommand.prototype = {
      constructor: EditInsertHTMLCommand,

      doCreateAction: function(editContext){
         var insertHTMLAction = new InsertHTMLAction(editContext.getNextActionId(), editContext.getTargetDefinition())
         return this.editAction(insertHTMLAction, editContext)
      },
      
      doEditAction: function(action, editContext){
         var targetElement = editContext.getTargetElement()
         var result = this.editAction(action, editContext)
         //TODO check if correct
         if(result!=null){
            AbstractInsertHtmlAction.insertHtml(action.getHtmlCode(), targetElement, action.getPosition(), this.getHtmlMarkerId())
         }
         return result
      },
      
      editAction: function(action, editContext){
         this.targetElement = editContext.getTargetElement()
         var editDialog = new EditDialog(EDIT_INSERT_HTML_DIALOG_URL, "EditInsertJS", action, editContext, 
			                              {htmlMarkerId: this.getHtmlMarkerId()})
         var centerScreen = WindowUtils.getCenterScreen(window.opener)
         editDialog.show(new Point(0, (centerScreen.getY()-DIALOG_HEIGHT/2)+"px"))
         return editDialog.getActionResult()
       }
   }
   ObjectUtils.extend(EditInsertHTMLCommand, "AbstractEditInsertHtmlCommand", customizeyourweb)

   Namespace.bindToNamespace("customizeyourweb", "EditInsertHTMLCommand", EditInsertHTMLCommand)
})()
}