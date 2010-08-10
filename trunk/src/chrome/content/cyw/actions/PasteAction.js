with(customizeyourweb){
(function(){
   function PasteAction(id, targetDefinition, where){
      this.AbstractTargetedAction(id, targetDefinition)
      //On of WhereToInsertEnum
      this.where = where
   }
   
   PasteAction.prototype ={ 
      constructor: PasteAction,
      doActionInternal: function(cywContext){
         if(this.isTargetOptionalAndTargetMissing(cywContext)){
            return false
         }
         this.paste(cywContext)
         return true
      },
      
      paste: function(abstractContext){
         var refElement = this.getTarget(abstractContext)
         var elementToPaste = abstractContext.getClipboard()
         Assert.notNull(elementToPaste,  "Nothing to paste in clipboard")
         switch(this.where){
            case WhereToInsertEnum.AFTER:
               DomUtils.insertAfter(elementToPaste, refElement)
               break;
            case WhereToInsertEnum.BEFORE:
               DomUtils.insertBefore(elementToPaste, refElement)
               break;
            case WhereToInsertEnum.FIRST_CHILD:
               DomUtils.insertAsFirstChild(elementToPaste, refElement)
               break;
            case WhereToInsertEnum.LAST_CHILD:
               refElement.appendChild(elementToPaste)
               break;
         }
         abstractContext.setActionChangeMemento(this.id, elementToPaste)
         return elementToPaste
      },
      
      preview: function(editContext){
         return this.paste(editContext)
      },
      
      undo: function(editContext, undoMemento){
         if(!undoMemento){
            return
         }
         editContext.setClipboard(DomUtils.removeElement(undoMemento))
      }
   }
   
   ObjectUtils.extend(PasteAction, "AbstractTargetedAction", customizeyourweb)
   ObjectUtils.extend(PasteAction, "IPreviewableAction", customizeyourweb)

   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "PasteAction", PasteAction)
   
})()
}