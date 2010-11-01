with(customizeyourweb){
(function(){

   function CutAction (id, targetDefinition){
      this.AbstractTargetedAction(id, targetDefinition)
   }
   
   CutAction.prototype ={ 
      constructor: CutAction,
      doActionInternal: function(cywContext){
         if(this.isTargetOptionalAndTargetMissing(cywContext)){
            return false
         }
         var target = this.getTarget(cywContext)
         if(target.parentNode){
            cywContext.setClipboard(target)
            this.RemoveAction_doActionInternal(cywContext)
            return true 
         }else{
            throw new Error("CutAction.doActionInternal: target has no parent node")
         }
      }     
   }
   
   ObjectUtils.extend(CutAction, "RemoveAction", customizeyourweb)

   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "CutAction", CutAction)
})()
}