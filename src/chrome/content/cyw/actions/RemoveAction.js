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
//         $(this.getTargets(cywContext)).remove()
         var targets = this.getTargets(cywContext)
         for (var i = 0; i < targets.length; i++) {
            var target = targets[i]
            if(target.parentNode){
               target.parentNode.removeChild(target)
            }
         }         
         return true
      }
   }
   ObjectUtils.extend(RemoveAction, "AbstractTargetedAction", customizeyourweb)

   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "RemoveAction", RemoveAction)
})()
}