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
         this.insertHtml(this.htmlCode, cywContext)
         return true
      },
      
      /*
       * Initiates preview
       * @param targetWindow
       * @return Object: memento containing all information needed for undoing the modifications
       */
       preview: function(editContext){
          this.insertHtml(this.htmlCode, editContext)
       }
   }
   ObjectUtils.extend(InsertHTMLAction, "AbstractInsertHtmlAction", customizeyourweb)
   
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "InsertHTMLAction", InsertHTMLAction)
})()
}