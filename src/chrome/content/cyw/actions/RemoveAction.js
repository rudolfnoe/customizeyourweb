with(customizeyourweb){
(function(){
   function RemoveAction (id, targetDefinition){
      this.AbstractTargetedAction(id, targetDefinition)
   }

   RemoveAction.prototype = {
      constructor: RemoveAction,
      doActionInternal: function(cywContext){
         if(!this.isTargetInPage(cywContext.getTargetWindow())){
            return false
         }
         var undoMemento = this.removeElements(cywContext);
         cywContext.setActionChangeMemento(this.getId(), undoMemento)
         return true
      },
      
      preview: function(editContext){
         return this.removeElements(editContext)
      },
      
      removeElements:function(abstractContext){
         var targets = this.getTargets(abstractContext)
         var undoMemento = []
         for(key in targets){
            undoMemento.push(new RemovedElement(targets[key]))
         }
         $(targets, abstractContext.getTargetDocument()).remove()
         return undoMemento
      },
      
      undo: function(editContext, undoMemento){
         var removedElements = undoMemento
         for(key in removedElements){
            removedElements[key].undoRemoval()
         }
      }
      
   }
   ObjectUtils.extend(RemoveAction, "AbstractTargetedAction", customizeyourweb)

   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "RemoveAction", RemoveAction)
})()
}