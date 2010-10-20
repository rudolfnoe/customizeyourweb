with(customizeyourweb){
(function(){
   const CHROME_URL_COMMON_ATTR_EDIT_DIALOG =
         "chrome://customizeyourweb/content/cyw/editing/common/editdialogs/common_attributes_edit_dialog.xul"
   
   function CommonAttributesEditDialog(targetedAction, editContext, allowMultiTargetDefinition, oldTargetDefinition){
      this.dialog = null
      this.allowMultiTargetDefinition = arguments.length>=3?allowMultiTargetDefinition:false
      this.editContext = editContext
      this.oldTargetDefinition = oldTargetDefinition
      this.targetedAction = targetedAction
   }
   
   CommonAttributesEditDialog.prototype = {
      constructor: CommonAttributesEditDialog,
      
      getActionResult: function(){
         return this.dialog.getActionResult()
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
         this.dialog = new EditDialog(CHROME_URL_COMMON_ATTR_EDIT_DIALOG, "CommonAttrEdit", this.targetedAction, 
			      this.editContext, {allowMultiTargetDefinition: this.allowMultiTargetDefinition,
                                    oldTargetDefinition: this.oldTargetDefinition})
         this.dialog.show()
         if(this.dialog.isCancel()){
            return DialogResult.CANCEL
         }else{
            return DialogResult.OK
         }
      }
   };
   
   Namespace.bindToNamespace("customizeyourweb", "CommonAttributesEditDialog", CommonAttributesEditDialog)
})()
}