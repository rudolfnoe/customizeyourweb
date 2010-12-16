with(customizeyourweb){
(function(){
   function RemoveAction (id, targetDefinition){
      this.AbstractTargetedAction(id, targetDefinition)
      this.setAllowMultiTargets(true)
   }

   RemoveAction.prototype = {
      constructor: RemoveAction,
      doActionInternal: function(cywContext){
         if(!this.isTargetInPage(cywContext.getTargetWindow())){
            return false
         }
         this.removeElements(cywContext);
         return true
      },
      
      preview: function(editContext){
         this.removeElements(editContext)
      },
      
      removeElements:function(abstractContext){
         var targets = this.getTargets(abstractContext)
         var undoMemento = []
         for(i in targets){
            undoMemento.push(new RemovedElement(targets[i]))
         }
         $(targets, abstractContext.getTargetDocument()).remove()
         abstractContext.setActionChangeMemento(this.getId(), undoMemento)
      },
      
      undoInternal: function(editContext, undoMemento){
         var removedElements = undoMemento
         for(key in removedElements){
            removedElements[key].undoRemoval()
         }
      }
      
   }
   ObjectUtils.extend(RemoveAction, "AbstractPreviewableAction", customizeyourweb)
   ObjectUtils.extend(RemoveAction, "AbstractTargetedAction", customizeyourweb)
   
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "RemoveAction", RemoveAction)
})()
}