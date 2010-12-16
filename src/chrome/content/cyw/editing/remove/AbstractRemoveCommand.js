with (customizeyourweb) {
(function() {
   function AbstractRemoveCommand(allowMultiTargetDefinition) {
      this.AbstractCommonAttributesEditCommand(allowMultiTargetDefinition)
      this.removedElements = []
      this.parentNode = null
      this.removedElement = null
      this.nextSibling = null
   }

   AbstractRemoveCommand.prototype = {
      constructor: AbstractRemoveCommand,
      AbstractRemoveCommand: AbstractRemoveCommand,

      afterSuccessfulActionEditing: function(editContext){
         var targets = this.getAction().getTargets(editContext.getTargetWindow())
         for (var i = 0; i < targets.length; i++) {
            var targetElem = targets[i]
            if(targetElem.parentNode){
               this.removedElements.push(new RemovedElement(targetElem))
               DomUtils.removeElement(targetElem)
            }
         }
      },
      
      createAction: function(editContext) {
         Assert.fail('must be implemented')
      },

      undo : function() {
         for (var i = 0; i < this.removedElements.length; i++) {
            var removedElem = this.removedElements[i]
            if(removedElem.nextSibling){
               removedElem.parentNode.insertBefore(removedElem.element, removedElem.nextSibling)
            }else{
               removedElem.parentNode.appendChild(removedElem.element)
            }
         }
      }
   }
   ObjectUtils.extend(AbstractRemoveCommand, "AbstractCommonAttributesEditCommand", customizeyourweb)

   Namespace.bindToNamespace("customizeyourweb", "AbstractRemoveCommand", AbstractRemoveCommand)
})()
}