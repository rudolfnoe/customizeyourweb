with(customizeyourweb){
(function(){
   
   function AbstractEditInsertHtmlCommand(){
   }
   
   AbstractEditInsertHtmlCommand.prototype = {
      constructor: AbstractEditInsertHtmlCommand,

      /*
       * Common edit method
       */
      editAction: function(action, editContext, dialogUrl, position){
         var editDialog = new EditDialog(dialogUrl, "EditInsertHtmlCommand", action, editContext)
         editDialog.show(position)
			return editDialog.getActionResult()
       }
       
   }
   ObjectUtils.extend(AbstractEditInsertHtmlCommand, "AbstractEditCommand", customizeyourweb)

   Namespace.bindToNamespace("customizeyourweb", "AbstractEditInsertHtmlCommand", AbstractEditInsertHtmlCommand)
})()
}