with(customizeyourweb){
(function(){
   function AbstractIfAction(){
      this.AbstractContainerAction()
   }
   
   AbstractIfAction.prototype = {
      constructor: AbstractIfAction,
      
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