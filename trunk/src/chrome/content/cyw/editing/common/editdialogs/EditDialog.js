with(customizeyourweb){
(function(){
   function EditDialog(url, name, modal, parentWin, features, argObj){
      features = StringUtils.defaultString(features)
      features = "all," + features
      this.Dialog(url, name, modal, parentWin, features, argObj)
   }
   
   EditDialog.prototype = {
      constructor: EditDialog   
   }
   
   ObjectUtils.extend(EditDialog, Dialog)
   
   Namespace.bindToNamespace("customizeyourweb", "EditDialog", EditDialog)
})()
}