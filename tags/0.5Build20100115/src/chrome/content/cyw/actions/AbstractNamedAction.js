with(customizeyourweb){
(function(){
   function AbstractNamedAction(){
      this.name = null
   }
   
   AbstractNamedAction.prototype = {
      constructor: AbstractNamedAction,
      
      getName: function(){
         return this.name
      },

      setName: function(name){
         this.name = name
      }
      
   }
   
   Namespace.bindToNamespace("customizeyourweb", "AbstractNamedAction", AbstractNamedAction)
})()
}