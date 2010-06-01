with(customizeyourweb){
(function(){
      
   function InsertHTMLAction (id, targetDefinition){
      this.AbstractTargetedAction(id, targetDefinition)
      this.htmlCode = null
   }
   
   InsertHTMLAction.prototype ={ 
      constructor: InsertHTMLAction,

      getHtmlCode: function(){
         return this.htmlCode
      },

      setHtmlCode: function(htmlCode){
         this.htmlCode = htmlCode
      },

      doActionInternal: function(cywContext){
         if(this.isTargetOptionalAndTargetMissing(cywContext)){
            return false
         }
         AbstractInsertHtmlAction.insertHtml(this.getHtmlCode(), this.getTarget(cywContext), this.getPosition())
         return true
      }

   }
   
   InsertHTMLAction.removeInsertedHtml = function(targetElement, htmlMarkerId){
      $('[cyw_html_marker_id=' + htmlMarkerId + ']', targetElement.ownerDocument).remove()
   }
   
   ObjectUtils.extend(InsertHTMLAction, "AbstractInsertHtmlAction", customizeyourweb)
   
   
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "InsertHTMLAction", InsertHTMLAction)
})()
}