with(customizeyourweb){
(function(){
   var EditInsertJSDialogHandler = {
      action: null,
      
      doCancel: function(){
         //Do nothing
      },
      
      doOk: function(){
         Dialog.setResult(DialogResult.OK)
         this.action.setJsCode(byId('jsCodeTB').value)
         Dialog.setNamedResult("action", this.action)
      },

      doOnload: function(){
         this.initShortcuts()
         this.action = Dialog.getNamedArgument("action")
         byId('jsCodeTB').value = StringUtils.defaultString(this.action.getJsCode())
      },
      
      initShortcuts: function(){
         this.scm = new ShortcutManager(window, "keydown", true)
         this.scm.addShortcutForElement("jsCodeTB", "ctrl+Return", Dialog.acceptDialog)
      }
   }

   Namespace.bindToNamespace("customizeyourweb", "EditInsertJSDialogHandler", EditInsertJSDialogHandler)
   
   //helper
   function byId(id){
      return document.getElementById(id)
   }

})()
}