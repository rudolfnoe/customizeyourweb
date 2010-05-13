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
         var memento = new UndoMemento()   
         var target = this.getTarget(targetWindow)
         if(target.parentNode.tagName != "BODY"){
            memento.setData("removedElementWrapper", new RemovedElement(target))
         }
         var $body = $("body", targetWindow.document)
         memento.setData("bodyChildren", $body.contents().get())
         this.isolateTarget(target, targetWindow.document)
         return memento
      },
      
      undo: function(targetWindow, undoMemento){
         var targetDoc = targetWindow.document
         $body = $("body", targetDoc)
         $body.contents().remove()
         $body.append($(undoMemento.getData("bodyChildren")))
         undoMemento.getData("removedElementWrapper").undoRemoval()
      }
   }
   ObjectUtils.extend(IsolateAction, "AbstractTargetedAction", customizeyourweb)
   ObjectUtils.extend(IsolateAction, "IPreviewableAction", customizeyourweb)
   

   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "IsolateAction", IsolateAction)
})()
}