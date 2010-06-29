with(customizeyourweb){
(function(){
   var EditInsertSubwindowDialogHandler = {
      action: null,
      editContext: null,
		//Used for eventhandlers that they are not triggered until view is initialized
      initialized: false,
      //Storage of temp targetdefinition when Overlayed style is selected 
      targetDefinitionBackup: null,
      targetElement: null,
      
      undoMemento: null,
      
      
      doCancel: function(){
         if(this.undoMemento != null){
            this.action.undo(this.editContext, this.undoMemento)
         }
      },
      
      doOk: function(){
         this.synchronizeActionWithForm()
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
            //First init targetdef, no autoinit as it has to be set before style select event handler is triggered by initialization
            this.getTargetDefinitionBinding().initTargetDefintionField(this.editContext.getTargetWindow(), 
                                                                        this.targetElement, this.action.getTargetDefinition()) 
            PresentationMapper.mapModel2Presentation(this.action, document)
            var triggerEvent = this.action.getTriggerEvent()
            byId("mouseOverCB").checked = triggerEvent & SubwindowTriggerEvent.ONMOUSEOVER 
            byId("listViewCB").checked = triggerEvent & SubwindowTriggerEvent.ON_LISTVIEW_ITEM_CHANGE 
            this.initialized = true
            //Trigger eventhandlers indirectly
            this.handleStyleChanged()
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
         if(!this.initialized){
            return
         }
         var targetDefBinding = this.getTargetDefinitionBinding()
         try{
            if(byId('styleML').value==SubwindowStyle.OVERLAYED){
               byId('positionML').disabled = true
               this.targetDefinitionBackup = this.getTargetDefinition()
               targetDefBinding.setTargetDefinition(new XPathTargetDefinition("//body"))
               targetDefBinding.setDisabled(true)
            }else{
               byId('positionML').disabled = false
               if(this.targetDefinitionBackup){
                  targetDefBinding.setTargetDefinition(this.targetDefinitionBackup)
               }
               this.getTargetDefinitionBinding().setDisabled(false)
            }
            this.triggerPreview()
         }catch(e){
            Log.logError(e)
         }
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
         if(!this.initialized){
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