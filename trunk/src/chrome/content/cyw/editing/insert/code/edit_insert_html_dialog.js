with(customizeyourweb){
(function(){
   var EditInsertHTMLDialogHandler = {
      action: null,
      htmlMarkerId: null,
      targetElement: null,
      
      doCancel: function(){
         if(this.targetElement){
            InsertHTMLAction.removeInsertedHtml(this.targetElement, this.htmlMarkerId)
         }
      },
      
      doOk: function(){
         Dialog.setResult(DialogResult.OK)
         this.synchronizeActionWithForm()
         Dialog.setNamedResult("action", this.action)
      },

      doOnload: function(){
         this.loadJQuery()
         //move to left
         this.initShortcuts()
         this.action = EditDialog.getAction()
         this.targetElement = EditDialog.getTargetElement()
         this.htmlMarkerId = Dialog.getNamedArgument("htmlMarkerId")
         if(this.action.getPosition()!=null){
            byId('whereML').value = StringUtils.defaultString(this.action.getPosition())
         }
         byId('htmlCodeTB').value = StringUtils.defaultString(this.action.getHtmlCode())
         byId('whereML').addEventListener("select", Utils.bind(this.updatePage, this), true)
         this.initValidators(this.targetElement)
      },
      
      initShortcuts: function(){
         this.scm = new ShortcutManager(window, "keydown", true)
         this.scm.addShortcutForElement("htmlCodeTB", "ctrl+Return", Dialog.acceptDialog)
      },
      
      initValidators: function(targetElement){
         var okValidator = new AndValidator() 
         okValidator.addValidator(ValidatorFactory.createTextboxNotEmptyValidator(byId('htmlCodeTB')))
         okValidator.addValidator(new TargetDefinitionXblValidator(byId('targetdefinition'), DomUtils.getOwnerWindow(targetElement)))
         Dialog.addOkValidator(okValidator)
         okValidator.validate()
      },
      
      synchronizeActionWithForm: function(){
         this.action.setPosition(byId('whereML').value)
         this.action.setHtmlCode(byId('htmlCodeTB').value)
         this.action.setTargetDefinition(byId('targetdefinition').getTargetDefinition())
      },

      updatePage: function(){
         Utils.executeDelayed("UPDATE_PAGE_TIMER", 200, this._updatePage, this)         
      },
      
      _updatePage: function(){
         InsertHTMLAction.removeInsertedHtml(this.targetElement, this.htmlMarkerId)
         this.synchronizeActionWithForm()
         AbstractInsertHTMLAction.insertHTML(this.action.getHtmlCode(), this.targetElement, this.action.getPosition(), this.htmlMarkerId)
      }
   }
   ObjectUtils.injectFunctions(EditInsertHTMLDialogHandler, AbstractEditDialogHandler)
   
   Namespace.bindToNamespace("customizeyourweb", "EditInsertHTMLDialogHandler", EditInsertHTMLDialogHandler)
   
   //helper
   function byId(id){
      return document.getElementById(id)
   }

})()
}