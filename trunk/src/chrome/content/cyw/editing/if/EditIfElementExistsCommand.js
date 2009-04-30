with(customizeyourweb){
(function(){
   function EditIfElementExistsCommand(){
   }
   
   EditIfElementExistsCommand.prototype = {

      createAction: function(editContext) {
         var action = new IfElementExistsAction(editContext.getTargetDefinition()) 
         action.setRepetitionBehavior(RepetitionBehavior.RUN_ALWAYS)
         return action
      }
      
   }
   ObjectUtils.extend(EditIfElementExistsCommand, "AbstractCommonAttributesEditCommand", customizeyourweb)

   Namespace.bindToNamespace("customizeyourweb", "EditIfElementExistsCommand", EditIfElementExistsCommand)
})()
}