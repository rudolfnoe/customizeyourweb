KeyInputbox = customizeyourweb.KeyInputbox
with(customizeyourweb){
(function(){
   function byId(id){
      return document.getElementById(id)
   }
   
   var EditListViewDialogHandler = {
      action: null,
      rootElement: null,
      listItemWrappers: new Array(),
      
      doCancel: function(){
         this.unhighlightAllItems()
      },
      
      doOnload: function(){
         this.action = EditDialog.getAction()
         if(this.action.getCombinedKeyCode()!=null){
            byId("keyCombinationKIB").setCombinedValue(this.action.getCombinedKeyCode())
         }
         byId("shortstringinputbox").value = StringUtils.defaultString(this.action.getShortString())
         byId("listItemsTagNameTB").value = this.action.getListItemsTagName()
         var higlightCssObj = CssUtils.parseCssText(this.action.getHighlightCss())
         byId('highlightBackgroundCF').value = higlightCssObj["background-color"]
         byId('noOfHeaderRowsTB').value = this.action.getNoOfHeaderRows()
         byId('ommitEveryXthItemTB').value = this.action.getOmmitEveryXthItem()
         byId('focusOnLoadCB').checked = this.action.isFocusOnLoad()
         this.rootElement = EditDialog.getTargetElement()
         this.highlightAllItems()
         this.initValidators(EditDialog.getTargetWindow())
      },
      
      doOk: function(){
         this.action.setCombinedKeyCode(byId("keyCombinationKIB").getCombinedValue())
         this.action.setShortString(byId("shortstringinputbox").value) 
         this.action.setListItemsTagName(byId("listItemsTagNameTB").value)
         this.action.setHighlightCss(this.getHighlightCss())
         this.action.setNoOfHeaderRows(byId('noOfHeaderRowsTB').value) 
         this.action.setOmmitEveryXthItem(byId('ommitEveryXthItemTB').value) 
         this.action.setFocusOnLoad(byId('focusOnLoadCB').checked)
         this.action.setTargetDefinition(byId('targetdefinition').getTargetDefinition())
         Dialog.setNamedResult("action", this.action)
         this.unhighlightAllItems()
      },
      
      getHighlightCss: function(){
         return "background-color: " + byId('highlightBackgroundCF').value
      },
      
      updateHighlighting: function(){
         Utils.executeDelayed("LISTVIEW_ITEMS_CHANGED", 500, this.highlightAllItems, this)
      },
      
      highlightAllItems: function(){
         this.unhighlightAllItems()
         if(!this.rootElement){
            return
         }
         var listItems = this.rootElement.getElementsByTagName(byId("listItemsTagNameTB").value)
         for (var i = 0; i < listItems.length; i++) {
            var itemWrapper = new ElementWrapper(listItems[i])
            this.listItemWrappers.push(itemWrapper)
            itemWrapper.setCss(this.getHighlightCss())
         }
      },
      
      initValidators: function(targetWindow){
         var okValidator = new AndValidator()
         okValidator.addValidator(new TargetDefinitionXblValidator(byId('targetdefinition'), targetWindow))
         okValidator.addValidator(ValidatorFactory.createTextboxNotEmptyValidator(byId('listItemsTagNameTB')))
         Dialog.addOkValidator(okValidator)
         okValidator.validate()
      },
      
      unhighlightAllItems: function(){
         for (var i = 0; i < this.listItemWrappers.length; i++) {
            this.listItemWrappers[i].restoreStyle()
         }
         this.listItemWrappers = []
      }
   }

   Namespace.bindToNamespace("customizeyourweb", "EditListViewDialogHandler", EditListViewDialogHandler)
})()
}