with(customizeyourweb){
(function(){
   function EditIfElementExistsCommand(){
      this.AbstractCommonAttributesEditCommand()
   }
   
   EditIfElementExistsCommand.prototype = {

      createAction: function(editContext) {
         var action = new IfElementExistsAction(editContext.getNextActionId(), editContext.getDefaultTargetDefinition()) 
         action.setRepetitionBehavior(RepetitionBehavior.RUN_ALWAYS)
         return action
      }
      
   }
   ObjectUtils.extend(EditIfElementExistsCommand, "AbstractCommonAttributesEditCommand", customizeyourweb)

   Namespace.bindToNamespace("customizeyourweb", "EditIfElementExistsCommand", EditIfElementExistsCommand)
})()
}