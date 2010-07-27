with(customizeyourweb){
(function(){
   
   /*
    * Dummy action for retargeting
    */
   function EditRetargetCommand(){
   }
   
   EditRetargetCommand.prototype = {
      constructor: EditRetargetCommand,
      EditRetargetCommand: EditRetargetCommand,
      
      doCreateAction: function(){
         throw new Error('Must never be called')
      },

      doEditAction: function(action, editContext){
         //Save old targetDefinition
         var oldTargetDef = action.getTargetDefinition().getDefinitionAsString()
         //Create new default target definition
         action.setTargetDefinition(AbstractTargetDefinitionFactory.createDefaultDefinition(editContext.getTargetElement()))
         var dialog = new CommonAttributesEditDialog(action, editContext, false, oldTargetDef) 
         dialog.show()
         return dialog.getActionResult()
      },
      
      undo: function(editContext, action){
         //do nothing
      }
   }
   
   Namespace.bindToNamespace("customizeyourweb", "EditRetargetCommand", EditRetargetCommand)   
})()
}