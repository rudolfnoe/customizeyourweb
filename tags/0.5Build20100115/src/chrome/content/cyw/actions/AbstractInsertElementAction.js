with(customizeyourweb){
(function(){
      
   function AbstractInsertElementAction(targetDefinition){
      this.AbstractTargetedAction(targetDefinition)
   }
   
   AbstractInsertElementAction.prototype ={ 
      constructor: AbstractInsertElementAction,

      doActionInternal: function(cywContext){
      }     

   }
   
   ObjectUtils.extend(AbstractInsertElementAction, "AbstractTargetedAction", customizeyourweb)
   
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "AbstractInsertElementAction", AbstractInsertElementAction)
})()
}