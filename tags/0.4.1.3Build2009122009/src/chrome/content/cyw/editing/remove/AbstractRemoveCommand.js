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
            if(DomUtils.removeElement(targetElem)){
               this.removedElements.push(new RemovedElement(targetElem))
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
               removedElem.parentNode.insertBefore(removedElem, removedElem.nextSibling)
            }else{
               removedElem.parentNode.appendChild(removedElem)
            }
         }
      }
   }
   ObjectUtils.extend(AbstractRemoveCommand, "AbstractCommonAttributesEditCommand", customizeyourweb)

   Namespace.bindToNamespace("customizeyourweb", "AbstractRemoveCommand", AbstractRemoveCommand)
})()
}