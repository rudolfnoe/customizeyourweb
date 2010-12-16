with (customizeyourweb) {
(function() {
   function AbstractRemoveCommand() {
      this.AbstractCommonAttributesEditCommand()
   }

   AbstractRemoveCommand.prototype = {
      constructor: AbstractRemoveCommand,
      AbstractRemoveCommand: AbstractRemoveCommand,

      afterSuccessfulActionEditing: function(action, editContext){
         action.preview(editContext)
      },

      createAction: function(editContext) {
         Assert.fail('must be implemented')
      }
   }
   ObjectUtils.extend(AbstractRemoveCommand, "AbstractCommonAttributesEditCommand", customizeyourweb)

   Namespace.bindToNamespace("customizeyourweb", "AbstractRemoveCommand", AbstractRemoveCommand)
})()
}