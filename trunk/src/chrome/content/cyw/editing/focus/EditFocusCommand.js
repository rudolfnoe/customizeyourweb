with(customizeyourweb){
(function(){
   function EditFocusCommand(){
      this.AbstractCommonAttributesEditCommand()
   }
   
   EditFocusCommand.prototype = {

      createAction: function(editContext) {
         return new FocusAction(editContext.getNextActionId(), editContext.getDefaultTargetDefinition()) 
      }
      
   }
   ObjectUtils.extend(EditFocusCommand, "AbstractCommonAttributesEditCommand", customizeyourweb)

   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "EditFocusCommand", EditFocusCommand)
})()
}