with (customizeyourweb) {
(function() {
   function AbstractRemoveCommand() {
      this.parentNode = null
      this.removedElement = null
      this.nextSibling = null
   }

   AbstractRemoveCommand.prototype = {
      constructor: AbstractRemoveCommand,
      AbstractRemoveCommand: AbstractRemoveCommand,

      afterSuccessfulActionEditing: function(editContext){
         var element = editContext.getTargetElement()
         this.removedElement = element
         this.parentNode = element.parentNode
         this.nextSibling= element.nextSibling
         this.parentNode.removeChild(element)
      },
      
      createAction: function(editContext) {
         Assert.fail('must be implemented')
      },

      undo : function() {
         if(this.nextSibling){
            this.parentNode.insertBefore(this.removedElement, this.nextSibling)
         }else{
            this.parentNode.appendChild(this.removedElement)
         }
      }
   }
   ObjectUtils.extend(AbstractRemoveCommand, "AbstractCommonAttributesEditCommand", customizeyourweb)

   Namespace.bindToNamespace("customizeyourweb", "AbstractRemoveCommand", AbstractRemoveCommand)
})()
}