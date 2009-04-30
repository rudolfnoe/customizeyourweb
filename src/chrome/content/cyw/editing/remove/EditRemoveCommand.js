with (customizeyourweb) {
(function() {
	function EditRemoveCommand() {
		this.AbstractRemoveCommand()
	}

	EditRemoveCommand.prototype = {

      createAction: function(editContext) {
         var action = new RemoveAction(editContext.getTargetDefinition())
         action.setRepetitionBehavior(RepetitionBehavior.RUN_ALWAYS)
         return action
      }
	}
	ObjectUtils.extend(EditRemoveCommand, "AbstractRemoveCommand", customizeyourweb)

	Namespace.bindToNamespace("customizeyourweb", "EditRemoveCommand", EditRemoveCommand)
})()
}