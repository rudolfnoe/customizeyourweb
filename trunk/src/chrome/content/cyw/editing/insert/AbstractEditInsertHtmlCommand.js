with(customizeyourweb){
(function(){
   
   function AbstractEditInsertHtmlCommand(){
      //Marker Id which is used to mark added content for later undo
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

      /*
       * Common edit method
       */
      editAction: function(action, editContext, dialogUrl, position){
			//TODO Target element can change in edit dialog
			this.targetElement = editContext.getTargetElement()
         var editDialog = new EditDialog(dialogUrl, "EditInsertHtmlCommand", action, editContext, {htmlMarkerId: this.getHtmlMarkerId()})
         editDialog.show(position)
			return editDialog.getActionResult()
       },
       
       /*
        * @override
        */
       undo: function(editContext, actionBackup){
         AbstractInsertHtmlAction.removeHtml(this.htmlMarkerId, this.targetElement.ownerDocument)
         if(actionBackup)
            AbstractInsertHtmlAction.insertHtml(actionBackup.getHtmlCode(), this.targetElement, actionBackup.getPosition())
      }
      
   }
   ObjectUtils.extend(AbstractEditInsertHtmlCommand, "AbstractEditCommand", customizeyourweb)

   Namespace.bindToNamespace("customizeyourweb", "AbstractEditInsertHtmlCommand", AbstractEditInsertHtmlCommand)
})()
}