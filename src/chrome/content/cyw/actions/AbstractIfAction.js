with(customizeyourweb){
(function(){
   function AbstractIfAction(){
      this.AbstractContainerAction()
   }
   
   AbstractIfAction.prototype = {
      constructor: AbstractIfAction,
      
      cleanUp: function(cywContext){
         if(this.isTrue(cywContext)){
            this.AbstractContainerAction_cleanUp(cywContext)
         }
      },

      doActionInternal: function(cywContext){
         if(this.isTrue(cywContext)){
            this.doChildActions(cywContext)
         }
      },
      
      doActionForCachedPageInternal: function(cywContext){
         return this.doActionInternal(cywContext)
      },
      
      isTrue: function(cywContext){
         throw new Error ('must be overridden in subclass')
      }
   }
   
   ObjectUtils.extend(AbstractIfAction, "AbstractContainerAction", customizeyourweb)
   
   Namespace.bindToNamespace("customizeyourweb", "AbstractIfAction", AbstractIfAction)
})()
}