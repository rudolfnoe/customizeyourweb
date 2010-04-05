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
         
         //init fields
         var behavior = this.action.getBehavior()
         byId("behaviorRG").selectedItem = byId(behavior.toLowerCase() + "RB")
         byId("urlTB").value = this.action.getUrl()
         var triggerEvent = this.action.getTriggerEvent()
         byId("mouseOverCB").checked = triggerEvent & SubwindowTriggerEvent.ONMOUSEOVER 
         byId("listViewCB").checked = triggerEvent & SubwindowTriggerEvent.ON_LISTVIEW_ITEM_CHANGE 
         byId("styleML").value = this.action.getStyle()
         byId("positionML").value = this.action.getPosition()
         byId("heightTB").value = this.action.getHeight()
         byId("heightUnitCB").value = this.action.getHeightUnit()
         byId("widthTB").value = this.action.getWidth()
         byId("widthUnitCB").value = this.action.getWidthUnit()
         byId("leftTB").value = this.action.getLeft()
         byId("leftUnitCB").value = this.action.getLeftUnit()
         byId("topTB").value = this.action.getTop()
         byId("topUnitCB").value = this.action.getTopUnit()
         
         this.initValidators(this.targetElement)
      },
      
      synchronizeActionWithForm: function(){
         this.action.setBehavior(byId("behaviorRG").selectedItem.value)
         var url = byId("urlTB").value
         if(!StringUtils.startsWith(url, "http://")){
            url = "http://" + url
         }
         this.action.setUrl(url)
         var mouseOverEvent = byId('mouseOverCB').checked ? SubwindowTriggerEvent.ONMOUSEOVER : 0
		   var listViewEvent = byId('listViewCB').checked ? SubwindowTriggerEvent.ON_LISTVIEW_ITEM_CHANGE : 0
         this.action.setTriggerEvent(mouseOverEvent | listViewEvent)
         this.action.setStyle(byId("styleML").value)
         this.action.setPosition(this.getPosition())
         this.action.setHeight(byId("heightTB").value)
         this.action.setHeightUnit(byId("heightUnitCB").value)
         this.action.setWidth(byId("widthTB").value)
         this.action.setWidthUnit(byId("widthUnitCB").value)
         this.action.setLeft(byId("leftTB").value)
         this.action.setLeftUnit(byId("leftUnitCB").value)
         this.action.setTop(byId("topTB").value)
         this.action.setTopUnit(byId("topUnitCB").value)
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