with (customizeyourweb) {
(function() {
   function AbstractRemoveCommand(allowMultiTargetDefinition) {
      this.AbstractCommonAttributesEditCommand(allowMultiTargetDefinition)
      this.removedElements = []
   }

   AbstractRemoveCommand.prototype = {
      constructor: AbstractRemoveCommand,
      AbstractRemoveCommand: AbstractRemoveCommand,

      afterSuccessfulActionEditing: function(editContext, action){
         var targets = action.getTargets(editContext.getTargetWindow())
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
            this.removedElements[i].undoRemoval()
         }
      }
   }
   ObjectUtils.extend(AbstractRemoveCommand, "AbstractCommonAttributesEditCommand", customizeyourweb)

   Namespace.bindToNamespace("customizeyourweb", "AbstractRemoveCommand", AbstractRemoveCommand)
})()
}