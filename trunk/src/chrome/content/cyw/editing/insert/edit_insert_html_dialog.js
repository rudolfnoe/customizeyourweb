with(customizeyourweb){
(function(){
   var EditInsertHTMLDialogHandler = {
      action: null,
      htmlMarkerId: null,
      targetElement: null,
      
      doCancel: function(){
         InsertHTMLAction.removeInsertedHtml(this.targetElement, this.htmlMarkerId)
      },
      
      doOk: function(){
         Dialog.setResult(DialogResult.OK)
         this.action.setWhereToInsert(byId('whereML').value)
         this.action.setHtmlCode(byId('htmlCodeTB').value)
         this.action.setTargetDefinition(byId('targetdefinition').getTargetDefinition())
         Dialog.setNamedResult("action", this.action)
      },

      doOnload: function(){
         //move to left
         this.initShortcuts()
         this.action = Dialog.getNamedArgument("action")
         this.htmlMarkerId = Dialog.getNamedArgument("htmlMarkerId")
         this.targetElement = Dialog.getNamedArgument("targetElement")
         if(this.action.getWhereToInsert()!=null){
            byId('whereML').value = StringUtils.defaultString(this.action.getWhereToInsert())
         }
         byId('htmlCodeTB').value = StringUtils.defaultString(this.action.getHtmlCode())
         byId('whereML').addEventListener("select", Utils.bind(this.updatePage, this), true)
      },
      
      initShortcuts: function(){
         this.scm = new ShortcutManager(window, "keydown", true)
         this.scm.addShortcutForElement("htmlCodeTB", "ctrl+Return", Dialog.acceptDialog)
      },
      
      updatePage: function(){
         Utils.executeDelayed("UPDATE_PAGE_TIMER", 200, this._updatePage, this)         
      },
      
      _updatePage: function(){
         InsertHTMLAction.removeInsertedHtml(this.targetElement, this.htmlMarkerId)
         this.action.setHtmlCode(byId('htmlCodeTB').value)
         this.action.setWhereToInsert(byId('whereML').value)
         InsertHTMLAction.insertHTML(this.targetElement, this.action, this.htmlMarkerId)
      }
   }

   Namespace.bindToNamespace("customizeyourweb", "EditInsertHTMLDialogHandler", EditInsertHTMLDialogHandler)
   
   //helper
   function byId(id){
      return document.getElementById(id)
   }

})()
}