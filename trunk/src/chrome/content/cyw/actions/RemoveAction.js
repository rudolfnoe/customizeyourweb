with(customizeyourweb){
(function(){
   function RemoveAction (targetDefinition){
      this.AbstractTargetedAction(targetDefinition)
   }

   RemoveAction.prototype = {
      constructor: RemoveAction,
      doActionInternal: function(cywContext){
         if(!this.isTargetInPage(cywContext.getTargetWindow())){
            return false
         }
         var target = this.getTarget(cywContext)
         if(target.parentNode)
            target.parentNode.removeChild(target)
         
         return true
      }
      
   }
   ObjectUtils.extend(RemoveAction, "AbstractTargetedAction", customizeyourweb)

   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "RemoveAction", RemoveAction)
})()
}