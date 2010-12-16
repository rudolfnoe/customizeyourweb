with(customizeyourweb){
(function(){
   function EditPasteCommand(){
      this.AbstractCommonAttributesEditCommand()
      this.elementToInsert = null
   }
   
   EditPasteCommand.prototype = {

      afterSuccessfulActionEditing: function(action, editContext){
         if(editContext.getClipboard()==null){
            Statusbar.setText('Nothing to paste in the clipboard.')
            return
         }
      },

     createAction: function(editContext) {
         var clipboard = this.elementToInsert = editContext.getClipboard()
         Assert.notNull(clipboard,  "Nothing to paste in clipboard")
         
         //create paste action
         return new PasteAction(editContext.getNextActionId(), editContext.getDefaultTargetDefinition(), this.determineWhere(editContext))
      },
      
      determineWhere: function(editContext){
         var pasteCommand = editContext.getCommand()
         return pasteCommand.getAttribute('where')
      }
      
   }
   ObjectUtils.extend(EditPasteCommand, "AbstractCommonAttributesEditCommand", customizeyourweb)

   Namespace.bindToNamespace("customizeyourweb", "EditPasteCommand", EditPasteCommand)
})()
}