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
         var insertHTMLAction = new InsertHTMLAction(editContext.getTargetDefinition())
         return this.editAction(insertHTMLAction, editContext)
      },
      
      doEditAction: function(editContext){
         var action = editContext.getAction()
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
         var editDialog = new EditDialog(EDIT_INSERT_HTML_DIALOG_URL, "EditInsertJS", true, window, null, 
               {action: action, targetElement: this.targetElement, targetWindow:editContext.getTargetWindow(), htmlMarkerId: this.getHtmlMarkerId()})
         var centerScreen = WindowUtils.getCenterScreen(window.opener)
         editDialog.show(new Point(0, (centerScreen.getY()-DIALOG_HEIGHT/2)+"px"))
         if(editDialog.getResult()==DialogResult.OK){
            action = editDialog.getNamedResult("action")
            this.setAction(action)
            return this.getAction()
         }else{
            return null
         }
       }
      
   }
   ObjectUtils.extend(EditInsertHTMLCommand, "AbstractEditInsertHtmlCommand", customizeyourweb)

   Namespace.bindToNamespace("customizeyourweb", "EditInsertHTMLCommand", EditInsertHTMLCommand)
})()
}