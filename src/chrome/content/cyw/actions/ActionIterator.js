with(customizeyourweb){
(function(){
   /*
    * Iterator for actions tree
    * @param ArrayList actionsList
    */
   function ActionIterator(actionsList){
      this.currentIndex = 0
      this.actionArray = this.createActionArray(actionsList)
   }
   
   ActionIterator.prototype = {
      constructor: ActionIterator,
      
      /*
       * Assembles all actions of a container action or script
       * This is a little bit a hack as both supporting the getActions method
       * REFACTOR think about making Script a subclass of ContainerAction
       */
      assembleContainerActionItems: function(containerAction, resultArr){
         //this
         var actions = containerAction.getActions()
          for (var i = 0;i < actions.size(); i++) {
            var action = actions.get(i)
            resultArr.push(action)
            if(action.isContainer()){
               this.assembleContainerActionItems(action, resultArr)
            }
         }
      },
      
      createActionArray: function(actionsList){
         var actionArray = []
         //Make the action list a fake container action ;-)
         actionsList.getActions = function(){return actionsList}
         this.assembleContainerActionItems(actionsList, actionArray)
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
