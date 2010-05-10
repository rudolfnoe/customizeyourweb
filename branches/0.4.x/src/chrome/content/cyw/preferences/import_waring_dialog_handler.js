with(customizeyourweb){
(function(){
   var ImportWarningDialogHandler = {
      doOnload: function(){
         document.getElementById('scriptContentTB').value = Dialog.getNamedArgument("scriptsContent")
      },
      
      doCancel: function(){
         Dialog.setResult(DialogResult.CANCEL)
      },

      doOk: function(){
         Dialog.setResult(DialogResult.OK)
      }
   }

   Namespace.bindToNamespace("customizeyourweb", "ImportWarningDialogHandler", ImportWarningDialogHandler)
})()
}