with(customizeyourweb){
(function(){
   function EditIfElementExistsCommand(){
   }
   
   EditIfElementExistsCommand.prototype = {

      createAction: function(editContext) {
         return new IfElementExistsAction(editContext.getTargetDefinition())
      }
      
   }
   ObjectUtils.extend(EditIfElementExistsCommand, "AbstractCommonAttributesEditCommand", customizeyourweb)

   Namespace.bindToNamespace("customizeyourweb", "EditIfElementExistsCommand", EditIfElementExistsCommand)
})()
}