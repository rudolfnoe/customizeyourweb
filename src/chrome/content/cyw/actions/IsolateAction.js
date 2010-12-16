with(customizeyourweb){
(function(){

   function IsolateAction (id, targetDefinition){
      this.AbstractTargetedAction(id, targetDefinition)
   }

   IsolateAction.prototype = {
      constructor: IsolateAction,
      doActionInternal: function(cywContext){
         var successful = this.isolateTarget(cywContext)
         return successful
      },
      
      isolateTarget: function(abstractContext){
         var targetWindow = abstractContext.getTargetWindow()
         if(!this.isTargetInPage(targetWindow)){
            return false
         }
         
         //Fill memento
         var target = this.getTarget(targetWindow)
         var undoMemento = {}
         if(target.parentNode.tagName != "BODY"){
            undoMemento.removedElementWrapper = new RemovedElement(target)
         }
         var $body = $("body", targetWindow.document)
         undoMemento.bodyChildren = $body.contents().get()
         abstractContext.setActionChangeMemento(this.getId(), undoMemento)
         
         //Isolate target
         var target = $(target).remove()
         $body.contents().remove()
         $body.append(target)
         return true
      },
      
      preview: function(editContext){
         this.isolateTarget(editContext)
      },
      
      undoInternal: function(editContext, undoMemento){
         var targetDoc = editContext.getTargetDocument()
         $body = $("body", targetDoc)
         $body.contents().remove()
         $body.append($(undoMemento.bodyChildren))
         undoMemento.removedElementWrapper.undoRemoval()
      }
   }
   ObjectUtils.extend(IsolateAction, "AbstractPreviewableAction", customizeyourweb)
   ObjectUtils.extend(IsolateAction, "AbstractTargetedAction", customizeyourweb)
   

   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "IsolateAction", IsolateAction)
})()
}