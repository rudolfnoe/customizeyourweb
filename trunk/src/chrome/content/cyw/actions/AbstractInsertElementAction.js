with(customizeyourweb){
(function(){
      
   function AbstractInsertElementAction(targetDefinition, position){
      this.AbstractTargetedAction(targetDefinition)
      //Position where the element should be inserted relative to the target element
      this.position = position?position:WhereToInsertEnum.AFTER
   }
   
   AbstractInsertElementAction.prototype ={ 
      constructor: AbstractInsertElementAction,

      getPosition: function(){
         return this.position
      },

      setPosition: function(position){
         this.position = position
      }

   }
   
   ObjectUtils.extend(AbstractInsertElementAction, "AbstractTargetedAction", customizeyourweb)
   
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "AbstractInsertElementAction", AbstractInsertElementAction)
})()
}