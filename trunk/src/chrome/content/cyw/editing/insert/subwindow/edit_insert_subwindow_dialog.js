with(customizeyourweb){
(function(){
   var EditInsertSubwindowDialogHandler = {
      action: null,
      htmlMarkerId: null,
      iframe: null,
      targetElement: null,
      
      doCancel: function(){
         if(this.iframe){
            $(this.iframe).remove()
         }
      },
      
      doOk: function(){
         this.synchronizeActionWithForm()
         Dialog.setResult(DialogResult.OK)
         Dialog.setNamedResult("action", this.action)
      },

      doOnload: function(){
         //move to left
         this.loadJQuery()
         this.action = EditDialog.getAction()
         this.targetElement = EditDialog.getTargetElement()
         var targetElement$ = $(this.targetElement) 
         if(targetElement$.find("iframe").length>0){
            this.iframe = targetElement$.find("iframe").get(0)
         }
         this.htmlMarkerId = Dialog.getNamedArgument("htmlMarkerId")
         PresentationMapper.mapModel2Presentation(this.action, document)
         var triggerEvent = this.action.getTriggerEvent()
         byId("mouseOverCB").checked = triggerEvent & SubwindowTriggerEvent.ONMOUSEOVER 
         byId("listViewCB").checked = triggerEvent & SubwindowTriggerEvent.ON_LISTVIEW_ITEM_CHANGE 
         
         this.initValidators(this.targetElement)
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
      },
      
      initValidators: function(targetElement){
         var targetDefValidator = new TargetDefinitionXblValidator(byId('targetdefinition'), DomUtils.getOwnerWindow(targetElement))
         var radiogroupVal = ValidatorFactory.createRadioGroupSelectionValidator(byId('behaviorRG'), "STATIC")
//         var radiogroupVal = ValidatorFactory.createTextboxNotEmptyValidator(byId('urlTB'))
         var okValidator = new AndValidator([targetDefValidator, radiogroupVal])
         
//         Dialog.addOkValidator(okValidator)
//         okValidator.validate()
       },

      updatePage: function(){
         Utils.executeDelayed("UPDATE_PAGE_TIMER", 200, this._updatePage, this)         
      },
      
      _updatePage: function(){
         if(this.iframe){
            $(this.iframe).remove()
         }
         this.synchronizeActionWithForm()
         var cywContext = new CywContext(this.getTargetWindow())
         this.iframe = this.action.insertIframeHtml(cywContext)
         this.iframe.scrollIntoView()
      }
   }
   ObjectUtils.injectFunctions(EditInsertSubwindowDialogHandler, AbstractEditDialogHandler)
   
   Namespace.bindToNamespace("customizeyourweb", "EditInsertSubwindowDialogHandler", EditInsertSubwindowDialogHandler)
   
})()
}