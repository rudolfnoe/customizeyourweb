with(customizeyourweb){
(function(){

   var EditInsertStyleSheetDialogHandler = {
      action: null,
      httpRequest: null,
      scriptId: null,
      labelToStylesheetMap: new Map(),
      targetDocument: null,
      
      doCancel: function(){
         this.setStyleSheetCodeInPage(this.action.getStyleSheetCode())
      },
      
      doInsertStyleSheetContent: function(){
         var styleML = this.getExistingStyleSheetsML()
         var stlyeSheetKey = styleML.selectedItem.value
         var styleSheet = this.labelToStylesheetMap.get(stlyeSheetKey)
         var cssRules = styleSheet.cssRules
         var rules = []
         for (var i = 0; i < cssRules.length; i++) {
            rules[i] = cssRules.item(i).cssText
         }
         var styleSheetCodeTB = byId('styleSheetCodeTB')
         styleSheetCodeTB.value = styleSheetCodeTB.value + "\n" + rules.join('\n\n')
         styleSheetCodeTB.focus()
      },
      
      doOk: function(){
         Dialog.setResult(DialogResult.OK)
         this.action.setStyleSheetCode(byId('styleSheetCodeTB').value)
         Dialog.setNamedResult("action", this.action)
      },

      doOnload: function(){
         this.initShortcuts()
         this.action = EditDialog.getAction()
         this.scriptId = EditDialog.getScriptId() 
         this.targetDocument = EditDialog.getTargetDocument()
         byId('styleSheetCodeTB').value = StringUtils.defaultString(this.action.getStyleSheetCode())
         this.fillExisitingStyleSheetsML()
         this.initValidators()
         byId('styleSheetCodeTB').focus()
      },
      
      fillExisitingStyleSheetsML: function(){
         //var styleSheetElements = XPathUtils.getElements("//link[@rel='stylesheet']", this.targetDocument)
         var styleML = this.getExistingStyleSheetsML()
         var styleSheets = this.targetDocument.styleSheets
         for (var i = 0; i < styleSheets.length; i++) {
            var styleSheet = styleSheets[i]
            var href = styleSheet.href
            if(StringUtils.startsWith(href, "chrome")){
               continue
            }
            var mapKey = StringUtils.isEmpty(styleSheet.href)?"StyleSheet " + (i+1):styleSheet.href
            this.labelToStylesheetMap.put(mapKey, styleSheet)
            ControlUtils.appendItemToMenulist(styleML, mapKey, mapKey)  
         }
         styleML.selectedIndex = 0
      },
      
      getExistingStyleSheetsML: function(){
         return byId('exisitingStyleSheetsML')
      },
      
      handleStyleSheetLoaded: function(){
         var styleSheetCodeTB = byId('styleSheetCodeTB')
         styleSheetCodeTB.value = styleSheetCodeTB.value + "\n" + this.httpRequest.getResponseText() 
      }, 
      
      initShortcuts: function(){
         this.scm = new ShortcutManager(window, "keydown", true)
         this.scm.addShortcutForElement("styleSheetCodeTB", "ctrl+Return", Dialog.acceptDialog)
      },
      
      initValidators: function(){
         var okValidator = ValidatorFactory.createTextboxNotEmptyValidator(byId('styleSheetCodeTB'))
         Dialog.addOkValidator(okValidator)
         okValidator.validate()
      },
      
      setStyleSheetCodeInPage: function(styleSheetCode){
         if(StringUtils.isEmpty(styleSheetCode)){
            var styleSheetElemId = InsertStyleSheetAction.getStyleSheetElementId(this.scriptId, this.action.getId())
            var styleSheetElement = this.targetDocument.getElementById(styleSheetElemId)
            if(styleSheetElement){
               DomUtils.removeElement(styleSheetElement)
            }
         }else{
            InsertStyleSheetAction.setStyleSheet(styleSheetCode, this.targetDocument, this.scriptId, this.action.getId())
         }
      },
      
      updatePage: function(){
         Utils.executeDelayed("UPDATE_PAGE_TIMER", 200, function(){
            this.setStyleSheetCodeInPage(byId('styleSheetCodeTB').value)         
         }, this)
      }
   }
   Namespace.bindToNamespace("customizeyourweb", "EditInsertStyleSheetDialogHandler", EditInsertStyleSheetDialogHandler)
   
   //helper
   function byId(id){
      return document.getElementById(id)
   }

})()
}