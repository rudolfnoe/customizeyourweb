with(customizeyourweb){
(function(){

   var EditInsertStyleSheetDialogHandler = {
      action: null,
      labelToStylesheetMap: new Map(),
      
      doCancel: function(){
         this.action.undo(EditDialog.getEditContext())
      },
      
      doInsertStyleSheetContent: function(){
         var styleML = this.getExistingStyleSheetsML()
         var stlyeSheetKey = styleML.selectedItem.value
         var styleSheet = this.labelToStylesheetMap.get(stlyeSheetKey)
         var cssRules = styleSheet.cssRules
         var insertString = ""
         for (var i = 0; i < cssRules.length; i++) {
            var rule = cssRules[i]
            if(!rule instanceof CSSStyleRule){
               continue
            }
            insertString += rule.selectorText + "{\n"
            var style = rule.style
            for (var j = 0; j < style.length; j++) {
               var prop = style.item(j)
               insertString += "   " + prop + ": " + style.getPropertyValue(prop) + ";\n" 
            }
            insertString += "}\n\n"
         }
         var styleSheetCodeTB = byId('styleSheetCodeTB')
         styleSheetCodeTB.value = styleSheetCodeTB.value + "\n\n" + insertString
         styleSheetCodeTB.focus()
      },
      
      doOk: function(){
         Dialog.setResult(DialogResult.OK)
         this.action.setStyleSheetCode(byId('styleSheetCodeTB').value)
         Dialog.setNamedResult("action", this.action)
      },

      doOnload: function(){
         try{
            this.initShortcuts()
            this.action = EditDialog.getAction()
            byId('styleSheetCodeTB').value = StringUtils.defaultString(this.action.getStyleSheetCode())
            this.initValidators()
            var targetDocument = EditDialog.getTargetDocument()
            this.fillExisitingStyleSheetsML(targetDocument)
            StyleSheetHighlighter.init(byId('styleSheetCodeTB'), targetDocument)
            this.setStyleSheetCodeInPage(this.action, byId('styleSheetCodeTB').value)
            byId('styleSheetCodeTB').focus()
         }catch(e){
            CywUtils.logError(e, null, true)
         }
      },
      
      fillExisitingStyleSheetsML: function(targetDocument){
         var styleML = this.getExistingStyleSheetsML()
         var styleSheets = targetDocument.styleSheets
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
      
      initShortcuts: function(){
         this.scm = new ShortcutManager(window, "keydown", true)
         this.scm.addShortcutForElement("styleSheetCodeTB", "ctrl+Return", Dialog.acceptDialog)
      },
      
      initValidators: function(){
         var okValidator = ValidatorFactory.createTextboxNotEmptyValidator(byId('styleSheetCodeTB'))
         Dialog.addOkValidator(okValidator)
         okValidator.validate()
      },
      
      setStyleSheetCodeInPage: function(action, styleSheetCode){
         var editContext = EditDialog.getEditContext()
         action.undo(editContext)
         action.setStyleSheetCode(styleSheetCode)
         action.preview(editContext)
      },
      
      updatePage: function(){
         Utils.executeDelayed("UPDATE_PAGE_TIMER", 200, function(){
            this.setStyleSheetCodeInPage(this.action, byId('styleSheetCodeTB').value)         
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