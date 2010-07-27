with(customizeyourweb){
(function(){
   function EditDialog(url, name, action, editContext, argObj){
		Assert.isTrue(typeof url == "string")
		Assert.isTrue(typeof name == "string")
		Assert.isTrue(ObjectUtils.instanceOf(action, AbstractAction))
		if(editContext){
         Assert.isTrue(ObjectUtils.instanceOf(editContext, EditContext))
		}
		if(!argObj){
			argObj = {}
		}
		argObj.action = action
		if(editContext){
			argObj.editContext = editContext
			argObj.scriptId = editContext.getScriptId()
			argObj.targetWindow = editContext.getTargetWindow()
			argObj.targetElement = editContext.getTargetElement()
		}
      this.Dialog(url, name, true, window, "all", argObj)
   }
   
   //statics
   EditDialog.getAction = function(clone){
      return Dialog.getNamedArgument('action', clone)
   }
   
   EditDialog.getAllowMultiTargetDefinition = function(){
      return Dialog.getNamedArgument('allowMultiTargetDefinition')
   }
	
	EditDialog.getEditContext = function(){
		return Dialog.getNamedArgument('editContext')
	}
   
   EditDialog.getScriptId = function(){
      return EditDialog.getEditContext().getScriptId()
   }
   
   EditDialog.getTargetElement = function(){
      return EditDialog.getEditContext().getTargetElement()
   }
   
   EditDialog.getTargetDocument = function(){
      return EditDialog.getTargetWindow().document
   }
   
   EditDialog.getTargetWindow = function(){
      return EditDialog.getEditContext().getTargetWindow()
   }
   
   EditDialog.prototype = {
      constructor: EditDialog,
		
		getActionResult: function(){
         if(this.isOk()){
            return this.getNamedResult("action")
         }else{
            return null
         }
		}
   }
   
   ObjectUtils.extend(EditDialog, "Dialog", customizeyourweb)
   
   Namespace.bindToNamespace("customizeyourweb", "EditDialog", EditDialog)
})()
}