with(customizeyourweb){
(function(){
   /*
    * Superclass of actions which have the need to store changes in their
    * setting after they have been executed (e.g. Subwindow can change position)
    */
   function AbstractChangeableAction(){
      this.changed = false
      this.changedPropertiesMap = {}
   }
   
   AbstractChangeableAction.prototype = {
      constructor: AbstractChangeableAction,
      
      setPropertyChange: function(name, value){
         Assert.paramsNotNull(arguments)
         this.changed = true
         this.changedPropertiesMap[name] = value
      },
      
      savePropertyChanges: function(scriptId, actionId){
         Assert.paramsNotNull(arguments)
         if(this.changed){
            CywConfig.updateAction(scriptId, actionId, this.changedPropertiesMap)
         }
      }
   }
   
   Namespace.bindToNamespace("customizeyourweb", "AbstractChangeableAction", AbstractChangeableAction)
})()
}