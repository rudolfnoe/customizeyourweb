with(customizeyourweb){
(function(){
   function ActionIterator(script){
      this.currentIndex = 0
      this.script = script
      this.actionArray = this.createActionArray()
   }
   
   ActionIterator.prototype = {
      constructor: ActionIterator,
      
      /*
       * Assembles all actions of a container action or script
       * This is a little bit a hack as both supporting the getActions method
       * TODO think about making Script a subclass of ContainerAction
       */
      assembleContainerActionItems: function(containerActionOrScript, resultArr){
         //this
         var actions = containerActionOrScript.getActions()
          for (var i = 0;i < actions.size(); i++) {
            var action = actions.get(i)
            if(action.isContainer()){
               this.assembleContainerActionItems(action, resultArr)
            }else{
               resultArr.push(action)
            }
         }
      },
      
      createActionArray: function(){
         var actionArray = []
         this.assembleContainerActionItems(this.script, actionArray)
         return actionArray
      }, 
      
      hasNext: function(){
         return this.currentIndex < this.actionArray.length
      },
      
      next: function(){
         return this.actionArray[this.currentIndex++]   
      }
   }
   
   Namespace.bindToNamespace("customizeyourweb", "ActionIterator", ActionIterator)
})()
}
