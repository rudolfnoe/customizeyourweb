with(customizeyourweb){
(function(){
      
   function InsertStyleSheetAction (){
      this.AbstractAction()
      this.styleSheetCode = null
   }
   
   InsertStyleSheetAction.getAppenderElement = function(doc){
      var heads = doc.getElementsByTagName('head')
      return heads.length>0 ? heads[0] : doc.documentElement
   }
   
   InsertStyleSheetAction.getStyleSheetElementId = function(scriptId, actionId){
      return "customizeyourwebStyleElement_" + scriptId + "_" + actionId
   }

   InsertStyleSheetAction.setStyleSheet = function(styleSheetCode, doc, scriptId, actionId){
      var styleElemId = InsertStyleSheetAction.getStyleSheetElementId(scriptId, actionId)
      var styleElem = doc.getElementById(styleElemId)
      if(styleElem==null){
         styleElem = doc.createElement('style')
         styleElem.id = styleElemId 
      }   
      styleElem.innerHTML = styleSheetCode
      InsertStyleSheetAction.getAppenderElement(doc).appendChild(styleElem)
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
         InsertStyleSheetAction.setStyleSheet(this.getStyleSheetCode(), cywContext.getTargetDocument(), cywContext.getScriptId(), this.getId())
      }     

   }
   
   ObjectUtils.extend(InsertStyleSheetAction, "AbstractAction", customizeyourweb)
   
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "InsertStyleSheetAction", InsertStyleSheetAction)
})()
}