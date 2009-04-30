with(customizeyourweb){
(function(){
   function EditResizeCommand(){
   }
   
   EditResizeCommand.prototype = {
      constructor: EditResizeCommand,
      
      doCreateAction: function(editContext){
         var element = editContext.getTargetElement()
         this.setTargetElement(element)
         var commandData = editContext.getCommandData()
         var existingAction = this.getExistingAction(ModifyAction, editContext.getTargetDefinition())
         var modifyAction = null, styles = null
         if(existingAction){
            modifyAction = existingAction
            styles = existingAction.getStyles()
         }else{
            modifyAction = new ModifyAction(editContext.getTargetDefinition())
            styles = {}
         }
         var elementWrapper = new ElementWrapper(element)
         var hasChanged = false
         if(commandData.offsetWidth!=element.offsetWidth){
            hasChanged = true
            var width = styles.width = element.offsetWidth + "px"
            elementWrapper.setStyle("width", width, "important")
         }
         if(commandData.offsetHeight!=element.offsetHeight){
            hasChanged = true
            var height = styles.height = element.offsetHeight + "px"
            elementWrapper.setStyle("height", height, "important")
         }
         if(!hasChanged)
            return null
         modifyAction.setStyles(styles)
         this.setChangeMemento(elementWrapper.getChangeMemento())
         this.setAction(modifyAction)
         return modifyAction
      }
   }
   
   ObjectUtils.extend(EditResizeCommand, "EditModifyCommand", customizeyourweb)
   
   Namespace.bindToNamespace("customizeyourweb", "EditResizeCommand", EditResizeCommand)
})()
}