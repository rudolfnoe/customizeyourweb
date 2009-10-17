with(customizeyourweb){
(function(){
   function EditDialog(url, name, modal, parentWin, features, argObj){
      features = StringUtils.defaultString(features)
      features = "all," + features
      this.Dialog(url, name, modal, parentWin, features, argObj)
   }
   
   //statics
   EditDialog.getAction = function(){
      return Dialog.getNamedArgument('action')
   }
   
   EditDialog.getTargetElement = function(){
      return Dialog.getNamedArgument('targetElement')
   }
   
   EditDialog.getTargetWindow = function(){
      return Dialog.getNamedArgument('targetWindow')
   }
   
   EditDialog.prototype = {
      constructor: EditDialog   
   }
   
   ObjectUtils.extend(EditDialog, "Dialog", customizeyourweb)
   
   Namespace.bindToNamespace("customizeyourweb", "EditDialog", EditDialog)
})()
}