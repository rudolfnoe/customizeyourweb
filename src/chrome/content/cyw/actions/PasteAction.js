with(customizeyourweb){
(function(){
   function PasteAction(targetDefinition, where){
      this.AbstractTargetedAction(targetDefinition)
      //On of WhereToInsertEnum
      this.where = where
   }
   
   PasteAction.paste = function(element, refElement, where){
      Assert.paramsNotNull(arguments)
      Assert.isTrue(ObjectUtils.containsValue(WhereToInsertEnum, where), "unknown insert point")
      switch(where){
         case WhereToInsertEnum.AFTER:
            DomUtils.insertAfter(element, refElement)
            break;
         case WhereToInsertEnum.BEFORE:
            DomUtils.insertBefore(element, refElement)
            break;
         case WhereToInsertEnum.FIRST_CHILD:
            DomUtils.insertAsFirstChild(element, refElement)
            break;
         case WhereToInsertEnum.LAST_CHILD:
            refElement.appendChild(element)
            break;
      }
   },
   
   PasteAction.prototype ={ 
      constructor: PasteAction,
      doActionInternal: function(cywContext){
         if(this.isTargetOptionalAndTargetMissing(cywContext)){
            return
         }
         var refElement = this.getTarget(cywContext)
         var clipboard = cywContext.getClipboard()
         Assert.notNull(clipboard,  "Nothing to paste in clipboard")
         PasteAction.paste(clipboard, refElement, this.where)
      }     
   }
   
   ObjectUtils.extend(PasteAction, "AbstractTargetedAction", customizeyourweb)

   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "PasteAction", PasteAction)
   
})()
}