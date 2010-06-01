with(customizeyourweb){
(function(){
   
   function AbstractEditInsertHtmlCommand(){
      this.htmlMarkerId = CywUtils.createSessionUniqueId()
		this.targetElement = null
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
			//TODO Target element can change in edit dialog
			this.targetElement = editContext.getTargetElement()
         var editDialog = new EditDialog(dialogUrl, "EditInsertHtmlCommand", action, editContext, {htmlMarkerId: this.getHtmlMarkerId()})
         editDialog.show(position)
			return editDialog.getActionResult()
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