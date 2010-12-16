with(customizeyourweb){
(function(){
      
   function InsertStyleSheetAction (id){
      this.AbstractInsertHtmlAction(id, new XPathTargetDefinition("//head"), WhereToInsertEnum.LAST_CHILD)
      this.styleSheetCode = null
   }
   
   InsertStyleSheetAction.setStyleSheet = function(styleSheetCode, doc, scriptId, actionId){
   }
   
   InsertStyleSheetAction.prototype ={ 
      constructor: InsertStyleSheetAction,

      getStyleSheetCode: function(){
         return this.styleSheetCode
      },

      setStyleSheetCode: function(styleSheetCode){
         this.styleSheetCode = styleSheetCode
      },
      
      doActionInternal: function(cywContext){
         if(this.isTargetOptionalAndTargetMissing(cywContext)){
            return false
         }
         this.insertStyleSheet(cywContext)
         return true
      },
      
      insertStyleElement: function(abstractContext){
         var elementId = this.getElementId(abstractContext.getScriptId())
         var html = '<style type="text/css">\n'
         html += this.styleSheetCode
         html += "</style>"
         return this.insertElement(html, abstractContext, elementId)
      },
      
      insertStyleSheet: function(abstractContext){
         var styleElem = this.insertStyleElement(abstractContext)
         this.setPriorityImportant(styleElem)
      },
      
      preview: function(editContext){
        this.insertStyleSheet(editContext) 
      },
      
      setPriorityImportant: function(styleElement){
         var cssRules = styleElement.sheet.cssRules
         for (var i = 0; i < cssRules.length; i++) {
            var style = cssRules[i].style
            for (var j = 0; j < style.length; j++) {
               var prop = style.item(j)
               if(style.getPropertyPriority(prop)!="important"){
                  propValue = style.getPropertyValue(prop)
                  style.setProperty(prop, propValue, "important")
               }
            }
         }
      }
      
   }
   
   ObjectUtils.extend(InsertStyleSheetAction, "AbstractInsertHtmlAction", customizeyourweb)
   
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "InsertStyleSheetAction", InsertStyleSheetAction)
})()
}