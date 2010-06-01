with(customizeyourweb){
(function(){
   var EditInsertSubwindowDialogHandler = {
      action: null,
      editContext: null,
      targetElement: null,
		suspendPreview: false,
      undoMemento: null,
      
      
      doCancel: function(){
         if(this.undoMemento != null){
            this.action.undo(this.editContext, this.undoMemento)
         }
      },
      
      doOk: function(){
         this.synchronizeActionWithForm()
         if(this.action.getStyle()==SubwindowStyle.OVERLAYED){
            this.action.setTargetDefinition(new XPathTargetDefinition("//body"))
         }
         Dialog.setResult(DialogResult.OK)
         Dialog.setNamedResult("action", this.action)
      },

      doOnload: function(){
         try{
            this.action = EditDialog.getAction()
            this.editContext = EditDialog.getEditContext()
            //Remove existing preview window
            this.action.undo(this.editContext)
   			this.targetElement = EditDialog.getTargetElement()
   			//Suspend preview
            this.suspendPreview = true
            PresentationMapper.mapModel2Presentation(this.action, document)
            var triggerEvent = this.action.getTriggerEvent()
            byId("mouseOverCB").checked = triggerEvent & SubwindowTriggerEvent.ONMOUSEOVER 
            byId("listViewCB").checked = triggerEvent & SubwindowTriggerEvent.ON_LISTVIEW_ITEM_CHANGE 
            this.suspendPreview = false
            this.triggerPreview()
            this.initValidators(this.targetElement)
         }catch(e){
            Log.logError(e)
         }
      },
      
      synchronizeActionWithForm: function(){
         var url = byId("urlTB").value
         if(!StringUtils.startsWith(url, "http://")){
            byId("urlTB").value = "http://" + url
         }
         PresentationMapper.mapPresentation2Model(document, this.action)
         var mouseOverEvent = byId('mouseOverCB').checked ? SubwindowTriggerEvent.ONMOUSEOVER : 0
		   var listViewEvent = byId('listViewCB').checked ? SubwindowTriggerEvent.ON_LISTVIEW_ITEM_CHANGE : 0
         this.action.setTriggerEvent(mouseOverEvent | listViewEvent)
         this.action.setTargetDefinition(this.getTargetDefinition())
      },
      
      getPosition: function(){
         return byId("positionML").value
      },
      
      handleTypeChanged: function(){
         if(byId('staticRB').selected){
            byId('urlTB').disabled = false
            byId('mouseOverCB').disabled = true
            byId('listViewCB').disabled = true
         }else{
            byId('urlTB').disabled = true
            byId('mouseOverCB').disabled = false
            byId('listViewCB').disabled = false
         }
      },
      
      handleStyleChanged: function(){
         if(byId('styleML').value==SubwindowStyle.OVERLAYED){
            byId('positionML').disabled = true
         }else{
            byId('positionML').disabled = false
            
         }
         this.triggerPreview()
      },
      
      initValidators: function(targetElement){
         var targetDefValidator = new TargetDefinitionXblValidator(byId('targetdefinition'), DomUtils.getOwnerWindow(targetElement))
         var radiogroupVal = ValidatorFactory.createRadioGroupSelectionValidator(byId('behaviorRG'), "STATIC")
//         var radiogroupVal = ValidatorFactory.createTextboxNotEmptyValidator(byId('urlTB'))
         var okValidator = new AndValidator([targetDefValidator, radiogroupVal])
         
//         Dialog.addOkValidator(okValidator)
//         okValidator.validate()
       },

      triggerPreview: function(){
         if(this.suspendPreview){
            return
         }
         Utils.executeDelayed("UPDATE_PAGE_TIMER", 200, this._triggerPreview, this)         
      },
      
      _triggerPreview: function(){
         try{
   			if(this.undoMemento != null){
               this.action.undo(this.editContext, this.undoMemento)
            }
            this.synchronizeActionWithForm()
            this.undoMemento = this.action.preview(this.editContext)
         }catch(e){
            Log.logError(e)
         }
      }
   }
   ObjectUtils.injectFunctions(EditInsertSubwindowDialogHandler, AbstractEditDialogHandler)
   
   Namespace.bindToNamespace("customizeyourweb", "EditInsertSubwindowDialogHandler", EditInsertSubwindowDialogHandler)
   
})()
}