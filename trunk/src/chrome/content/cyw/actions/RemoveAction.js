with(customizeyourweb){
(function(){
   function RemoveAction (targetDefinition){
      this.AbstractTargetedAction(targetDefinition)
   }

   RemoveAction.prototype = {
      constructor: RemoveAction,
      doActionInternal: function(cywContext){
         if(this.isTargetOptionalAndTargetMissing(cywContext)){
            return
         }
         var target = this.getTarget(cywContext)
         if(target.parentNode)
            target.parentNode.removeChild(target)
      }
      
   }
   ObjectUtils.extend(RemoveAction, "AbstractTargetedAction", customizeyourweb)

   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "RemoveAction", RemoveAction)
})()
}