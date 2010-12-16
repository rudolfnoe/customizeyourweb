with(customizeyourweb){
(function(){
   const CHROME_URL_COMMON_ATTR_EDIT_DIALOG =
         "chrome://customizeyourweb/content/cyw/editing/common/editdialogs/common_attributes_edit_dialog.xul"
   
   function CommonAttributesEditDialog(targetedAction, targetWindow, targetElement, allowMultiTargetDefinition){
      this.dialog = null
      this.allowMultiTargetDefinition = arguments.length>=4?allowMultiTargetDefinition:false
      this.targetedAction = targetedAction
      this.targetElement = targetElement
      this.targetWindow = targetWindow
   }
   
   CommonAttributesEditDialog.prototype = {
      constructor: CommonAttributesEditDialog,
      
      getAction: function(){
         return this.targetedAction
      },
      
      isCancel: function(){
         if(!this.dialog)
            throw new Error('illegal state')
         return this.dialog.isCancel()
      },

      isOk: function(){
         if(!this.dialog)
            throw new Error('illegal state')
         return this.dialog.isOk()
      },
      
      show: function(){
         this.dialog = new EditDialog(CHROME_URL_COMMON_ATTR_EDIT_DIALOG, "CommonAttrEdit", true, 
                  window, null, 
                  {action: this.targetedAction, targetElement: this.targetElement, targetWindow: this.targetWindow, 
                   allowMultiTargetDefinition: this.allowMultiTargetDefinition})
         this.dialog.show()
         if(this.dialog.isCancel()){
            return DialogResult.CANCEL
         }else{
            this.targetedAction = this.dialog.getNamedResult('action')
            return DialogResult.OK
         }
      }
   }
   
   Namespace.bindToNamespace("customizeyourweb", "CommonAttributesEditDialog", CommonAttributesEditDialog)
})()
}