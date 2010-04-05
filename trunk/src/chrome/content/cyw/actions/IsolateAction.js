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
         memento.removedElementWrapper = new RemovedElement(target)
         var $body = $("body", cywContext.getTargetDocument())
         memento.bodyChildren = $body.contents().get()
         target = $(target).remove()
         $body.contents().remove()
         $body.append(target)
      },
      
      undo: function(cywContext){
         var targetDoc = cywContext.getTargetDocument()
         $body = $("body", targetDoc)
         $body.contents().remove()
         var memento = this.getUndoMemento()
         $body.append($(memento.bodyChildren))
         memento.removedElementWrapper.undoRemoval()
         
      }
   }
   ObjectUtils.extend(IsolateAction, "AbstractTargetedAction", customizeyourweb)

   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "IsolateAction", IsolateAction)
})()
}