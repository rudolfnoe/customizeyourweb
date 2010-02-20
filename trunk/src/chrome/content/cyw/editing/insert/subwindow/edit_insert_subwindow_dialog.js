with(customizeyourweb){
(function(){
   var EditInsertSubwindowDialogHandler = {
      action: null,
      htmlMarkerId: null,
      targetElement: null,
      
      doCancel: function(){
//         if(this.targetElement){
//            InsertHTMLAction.removeInsertedHtml(this.targetElement, this.htmlMarkerId)
//         }
      },
      
      doOk: function(){
         Dialog.setResult(DialogResult.OK)
         this.action.setBehavior(byId("behaviorRG").selectedItem.value)
         var url = byId("urlTB").value
         if(!StringUtils.startsWith(url, "http://")){
            url = "http://" + url
         }
         this.action.setUrl(url)
//         alert(byId('mouseOverCB').checked)
         var mouseOverEvent = byId('mouseOverCB').checked ? SubwindowTriggerEvent.ONMOUSEOVER : 0
				var listViewEvent = byId('listViewCB').checked ? SubwindowTriggerEvent.ON_LISTVIEW_ITEM_CHANGE : 0
//         alert(mouseOverEvent | listViewEvent)
         this.action.setTriggerEvent(mouseOverEvent | listViewEvent)
         this.action.setStyle(byId("styleML").value)
         this.action.setPosition(byId("positionML").value)
         this.action.setHeight(byId("heightTB").value)
         this.action.setHeightUnit(byId("heightUnitCB").value)
         this.action.setWidth(byId("widthTB").value)
         this.action.setWidthUnit(byId("widthUnitCB").value)
         this.action.setTargetDefinition(byId('targetdefinition').getTargetDefinition())
         Dialog.setNamedResult("action", this.action)
      },

      doOnload: function(){
         //move to left
         this.action = EditDialog.getAction()
         this.targetElement = EditDialog.getTargetElement()
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
         
         this.initValidators(this.targetElement)
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
         //Utils.executeDelayed("UPDATE_PAGE_TIMER", 200, this._updatePage, this)         
      },
      
      _updatePage: function(){
//         InsertHTMLAction.removeInsertedHtml(this.targetElement, this.htmlMarkerId)
//         this.action.setHtmlCode(byId('htmlCodeTB').value)
//         this.action.setWhereToInsert(byId('whereML').value)
//         InsertHTMLAction.insertHTML(this.targetElement, this.action, this.htmlMarkerId)
      }
   }

   Namespace.bindToNamespace("customizeyourweb", "EditInsertSubwindowDialogHandler", EditInsertSubwindowDialogHandler)
   
   //helper
   function byId(id){
      return document.getElementById(id)
   }

})()
}