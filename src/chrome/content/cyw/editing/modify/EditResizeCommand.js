with(customizeyourweb){
(function(){
   function EditResizeCommand(){
   }
   
   EditResizeCommand.prototype = {
      constructor: EditResizeCommand,
      
      /*
       * REFACTOR Change EditScriptHandler that it decides wether to create or edit an action
       * Then no extra handling here an in the wrapper command is neccessary
       */
      doCreateAction: function(editContext){
         var element = editContext.getTargetElement()
         var commandData = editContext.getCommandData()
         var existingAction = this.getExistingAction(ModifyAction, editContext.getDefaultTargetDefinition())
         var modifyAction = null, styles = null
         if(existingAction){
            modifyAction = ObjectUtils.deepClone(existingAction)
            styles = modifyAction.getStyles()
         }else{
            modifyAction = new ModifyAction(editContext.getNextActionId(), editContext.getDefaultTargetDefinition())
            styles = {}
         }
         var hasChanged = false
         if(commandData.offsetWidth!=element.offsetWidth){
            hasChanged = true
            styles.width = element.offsetWidth + "px"
         }
         if(commandData.offsetHeight!=element.offsetHeight){
            hasChanged = true
            styles.height = element.offsetHeight + "px"
         }
         if(!hasChanged)
            return null
         modifyAction.setStyles(styles)
         modifyAction.preview(editContext)
         return modifyAction
      }
   }
   
   ObjectUtils.extend(EditResizeCommand, "EditModifyCommand", customizeyourweb)
   
   Namespace.bindToNamespace("customizeyourweb", "EditResizeCommand", EditResizeCommand)
})()
}