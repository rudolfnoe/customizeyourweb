 with(customizeyourweb){
(function(){
   function IfElementExistsAction(targetDefinition){
      this.AbstractIfAction()
      this.AbstractTargetedAction(targetDefinition)
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