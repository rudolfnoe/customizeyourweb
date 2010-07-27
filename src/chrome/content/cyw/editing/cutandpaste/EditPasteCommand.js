with(customizeyourweb){
(function(){
   function EditPasteCommand(){
      this.elementToInsert = null
   }
   
   EditPasteCommand.prototype = {

      afterSuccessfulActionEditing: function(action, editContext){
         PasteAction.paste(editContext.getClipboard(), editContext.getTargetElement(), this.determineWhere(editContext))
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
      },
      
      undo: function(){
         DomUtils.removeElement(this.elementToInsert)
      }
      
   }
   ObjectUtils.extend(EditPasteCommand, "AbstractCommonAttributesEditCommand", customizeyourweb)

   Namespace.bindToNamespace("customizeyourweb", "EditPasteCommand", EditPasteCommand)
})()
}