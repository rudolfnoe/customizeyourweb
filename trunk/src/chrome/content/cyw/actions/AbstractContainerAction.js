with(customizeyourweb){
(function(){
   function AbstractContainerAction(){
      this.actions = new ArrayList()
   }
   
   AbstractContainerAction.prototype = {
      constructor: AbstractContainerAction,
      
      getActions: function(){
         return this.actions
      },

      setActions: function(actions){
         this.actions = actions
      },

      addChild: function(action){
         this.actions.add(action)
      },
      
      cleanUp: function(cywContext){
          for (var i = 0;i < this.getActions().size(); i++) {
            this.getActions().get(i).cleanUp(cywContext)
         }
      },
      
      doChildActions: function(cywContext){
          for (var i = 0;i < this.getActions().size(); i++) {
            var action= this.getActions().get(i)
            action.doAction(cywContext)
         }
      },
      
      isContainer: function(){
         return true
      },
      
      removeChild: function(child){
         this.actions.remove(child)         
      }
      
   }
   ObjectUtils.extend(AbstractContainerAction, "AbstractAction", customizeyourweb)
   
   Namespace.bindToNamespace("customizeyourweb", "AbstractContainerAction", AbstractContainerAction)
})()
}