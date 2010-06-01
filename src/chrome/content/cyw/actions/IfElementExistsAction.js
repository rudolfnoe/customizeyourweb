 with(customizeyourweb){
(function(){
   function IfElementExistsAction(id, targetDefinition){
      this.AbstractIfAction()
      this.AbstractTargetedAction(id, targetDefinition)
   }
   
   IfElementExistsAction.prototype = {
      constructor: IfElementExistsAction,   
      
      isTargeted: function(){
         return true;
      },

      isTrue: function(cywContext){
         return this.isTargetInPage(cywContext.getTargetWindow())
      }
   }
   
   //Sequence of inheritence is important
   ObjectUtils.extend(IfElementExistsAction, "AbstractIfAction", customizeyourweb)
   ObjectUtils.extend(IfElementExistsAction, "AbstractTargetedAction", customizeyourweb)
   
   Namespace.bindToNamespace("customizeyourweb", "IfElementExistsAction", IfElementExistsAction)
})()
}