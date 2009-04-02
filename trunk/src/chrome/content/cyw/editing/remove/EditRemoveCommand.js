with (customizeyourweb) {
(function() {
	function EditRemoveCommand() {
		this.parentNode = null
		this.removedElement = null
		this.nextSibling = null
	}

	EditRemoveCommand.prototype = {

      afterSuccessfulActionEditing: function(editContext){
         var element = editContext.getTargetElement()
         this.removedElement = element
         this.parentNode = element.parentNode
         this.nextSibling= element.nextSibling
         this.parentNode.removeChild(element)
      },
      
      createAction: function(editContext) {
         return new RemoveAction(editContext.getTargetDefinition())
      },

		undo : function() {
         if(this.nextSibling){
            this.parentNode.insertBefore(this.removedElement, this.nextSibling)
         }else{
            this.parentNode.appendChild(this.removedElement)
         }
		}
	}
	ObjectUtils.extend(EditRemoveCommand, "AbstractCommonAttributesEditCommand", customizeyourweb)

	Namespace.bindToNamespace("customizeyourweb", "EditRemoveCommand", EditRemoveCommand)
})()
}