with(customizeyourweb){
(function(){
   function IsolateAction (targetDefinition){
      this.AbstractTargetedAction(targetDefinition)
   }

   IsolateAction.prototype = {
      constructor: IsolateAction,
      doActionInternal: function(cywContext){
         if(!this.isTargetInPage(cywContext.getTargetWindow())){
            return false
         }
         var target = this.getTarget(cywContext)
         var memento = this.getUndoMemento()
         memento.targetParent = target.parentNode
         memento.target = target
         var $body = $("body", cywContext.getTargetDocument())
         memento.bodyChildren = $body.contents().get()
         target = $(target).remove()
         $body.contents().remove()
         $body.append(target)
      }
   }
   ObjectUtils.extend(IsolateAction, "AbstractTargetedAction", customizeyourweb)

   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "IsolateAction", IsolateAction)
})()
}