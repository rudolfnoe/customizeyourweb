with(customizeyourweb){
(function(){
   
   function AbstractEditInsertHtmlCommand(){
      this.htmlMarkerId = CywUtils.createSessionUniqueId()
   }
   
   AbstractEditInsertHtmlCommand.prototype = {
      constructor: AbstractEditInsertHtmlCommand,

      getHtmlMarkerId: function(){
         return this.htmlMarkerId
      },

      setHtmlMarkerId: function(htmlMarkerId){
         this.htmlMarkerId = htmlMarkerId
      },

      editAction: function(action, editContext, dialogUrl, dialogHeight, position){
         this.targetElement = editContext.getTargetElement()
         var editDialog = new EditDialog(dialogUrl, "EditInsertHtmlCommand", true, window, null, 
               {action: action, targetElement: this.targetElement, targetWindow:editContext.getTargetWindow(), htmlMarkerId: this.getHtmlMarkerId()})
         editDialog.show(position)
         if(editDialog.getResult()==DialogResult.OK){
            return editDialog.getNamedResult("action")
         }else{
            return null
         }
       },

       undo: function(editContext, actionBackup){
         InsertHTMLAction.removeInsertedHtml(this.targetElement, this.htmlMarkerId)
         if(actionBackup)
            AbstractInsertHtmlAction.insertHtml(actionBackup.getHtmlCode(), this.targetElement, actionBackup.getPosition())
      }
      
   }
   ObjectUtils.extend(AbstractEditInsertHtmlCommand, "AbstractEditCommand", customizeyourweb)

   Namespace.bindToNamespace("customizeyourweb", "AbstractEditInsertHtmlCommand", AbstractEditInsertHtmlCommand)
})()
}