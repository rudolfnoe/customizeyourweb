with(customizeyourweb){
(function(){
   function EditFocusCommand(){
   }
   
   EditFocusCommand.prototype = {

      createAction: function(editContext) {
         return new FocusAction(editContext.getTargetDefinition()) 
      }
      
   }
   ObjectUtils.extend(EditFocusCommand, "AbstractCommonAttributesEditCommand", customizeyourweb)

   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "EditFocusCommand", EditFocusCommand)
})()
}