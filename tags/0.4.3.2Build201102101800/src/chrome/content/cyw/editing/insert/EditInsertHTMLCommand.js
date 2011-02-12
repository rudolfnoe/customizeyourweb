with(customizeyourweb){
(function(){
   const EDIT_INSERT_HTML_DIALOG_URL = CywCommon.CYW_CHROME_URL + "editing/insert/edit_insert_html_dialog.xul"
   const DIALOG_HEIGHT="544"
   
   function EditInsertHTMLCommand(){
      this.targetElement = null
      this.htmlMarkerId = (new Date()).getTime()
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
            InsertHTMLAction.insertHTML(targetElement, action, this.htmlMarkerId)
         }
         return result
      },
      
      editAction: function(action, editContext){
         this.targetElement = editContext.getTargetElement()
         var editDialog = new EditDialog(EDIT_INSERT_HTML_DIALOG_URL, "EditInsertJS", true, window, null, 
               {action: action, targetElement: this.targetElement, targetWindow:editContext.getTargetWindow(), htmlMarkerId: this.htmlMarkerId})
         var centerScreen = WindowUtils.getCenterScreen(window.opener)
         editDialog.show(new Point(0, (centerScreen.getY()-DIALOG_HEIGHT/2)+"px"))
         if(editDialog.getResult()==DialogResult.OK){
            action = editDialog.getNamedResult("action")
            this.setAction(action)
            return this.getAction()
         }else{
            return null
         }
       },
      
      undo: function(editContext, actionBackup){
         InsertHTMLAction.removeInsertedHtml(this.targetElement, this.htmlMarkerId)
         if(actionBackup)
            InsertHTMLAction.insertHTML(this.targetElement, actionBackup)
      }
      
   }
   ObjectUtils.extend(EditInsertHTMLCommand, "AbstractEditCommand", customizeyourweb)

   Namespace.bindToNamespace("customizeyourweb", "EditInsertHTMLCommand", EditInsertHTMLCommand)
})()
}