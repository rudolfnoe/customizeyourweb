with(customizeyourweb){
(function(){

   function CopyAction (targetDefinition){
      this.AbstractTargetedAction(targetDefinition)
   }
   
   CopyAction.prototype ={ 
      constructor: CopyAction,
      doActionInternal: function(cywContext){
         if(this.isTargetOptionalAndTargetMissing(cywContext)){
            return false
         }
         var target = this.getTarget(cywContext)
         //throw error or log
         cywContext.setClipboard(target.cloneNode(true))
         return true
      }     
   }
   
   ObjectUtils.extend(CopyAction, "AbstractTargetedAction", customizeyourweb)

   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "CopyAction", CopyAction)
})()
}