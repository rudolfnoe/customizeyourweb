with(customizeyourweb){
(function(){

   function CutAction (targetDefinition){
      this.AbstractTargetedAction(targetDefinition)
   }
   
   CutAction.prototype ={ 
      constructor: CutAction,
      doActionInternal: function(cywContext){
         if(this.isTargetOptionalAndTargetMissing(cywContext)){
            return false
         }
         var target = this.getTarget(cywContext)
         //throw error or log
         if(target.parentNode){
            cywContext.setClipboard(target)
            target.parentNode.removeChild(target)
         }
         return true
      }     
   }
   
   ObjectUtils.extend(CutAction, "AbstractTargetedAction", customizeyourweb)

   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "CutAction", CutAction)
})()
}