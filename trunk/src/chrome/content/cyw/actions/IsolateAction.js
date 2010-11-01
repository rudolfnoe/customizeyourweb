with(customizeyourweb){
(function(){
   function IsolateAction (id, targetDefinition){
      this.AbstractTargetedAction(id, targetDefinition)
   }

   IsolateAction.prototype = {
      constructor: IsolateAction,
      doActionInternal: function(cywContext){
         if(!this.isTargetInPage(cywContext.getTargetWindow())){
            return false
         }
         var target = this.getTarget(cywContext)
         this.isolateTarget(target, cywContext.getTargetDocument())
      },
      
      isolateTarget: function(target, targetDoc){
         var target = $(target).remove()
         var $body = $("body", targetDoc)
         $body.contents().remove()
         $body.append(target)
      },
      
      preview: function(targetWindow){
         if(!this.isTargetInPage(targetWindow)){
            return null
         }
         var memento = {}   
         var target = this.getTarget(targetWindow)
         if(target.parentNode.tagName != "BODY"){
            memento.removedElementWrapper = new RemovedElement(target)
         }
         var $body = $("body", targetWindow.document)
         memento.bodyChildren = $body.contents().get()
         this.isolateTarget(target, targetWindow.document)
         return memento
      },
      
      undo: function(editContext, undoMemento){
         var targetDoc = editContext.getTargetDocument()
         $body = $("body", targetDoc)
         $body.contents().remove()
         $body.append($(undoMemento.bodyChildren))
         undoMemento.removedElementWrapper.undoRemoval()
      }
   }
   ObjectUtils.extend(IsolateAction, "AbstractTargetedAction", customizeyourweb)
   ObjectUtils.extend(IsolateAction, "IPreviewableAction", customizeyourweb)
   

   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "IsolateAction", IsolateAction)
})()
}