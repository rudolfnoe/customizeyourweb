with(customizeyourweb){
(function(){
   var EditInsertHTMLDialogHandler = {
      action: null,
      editContext: null,
      targetElement: null,
      
      
      doCancel: function(){
         this.action.undo(this.editContext)
      },
      
      doOk: function(){
         Dialog.setResult(DialogResult.OK)
         this.synchronizeActionWithForm()
         Dialog.setNamedResult("action", this.action)
      },

      doOnload: function(){
         this.loadJQuery()
         //Get clone of action
         this.action = EditDialog.getAction(true)
         this.editContext = EditDialog.getEditContext()
         this.targetElement = EditDialog.getTargetElement()
         PresentationMapper.mapModel2Presentation(this.action, document, "value")
         byId('whereML').addEventListener("select", Utils.bind(this.updatePage, this), true)
         this.initListeners()
         this.initShortcuts()
         this.initValidators(this.targetElement)
      },
      
      initListeners: function(){
         this.getTargetDefinitionBinding().addValueChangedListener(new EventHandlerAdapter(this.handleTargetDefChanged, this));
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
      
      handleTargetDefChanged: function(evemt){
         this._updatePage();   
      },
      
      synchronizeActionWithForm: function(){
         PresentationMapper.mapPresentation2Model(document, this.action, "value")
         this.action.setTargetDefinition(byId('targetdefinition').getTargetDefinition())
      },

      updatePage: function(){
         Utils.executeDelayed("UPDATE_PAGE_TIMER", 200, this._updatePage, this)         
      },
      
      _updatePage: function(){
         this.action.undo(this.editContext)
         this.synchronizeActionWithForm()
         this.action.preview(this.editContext)
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