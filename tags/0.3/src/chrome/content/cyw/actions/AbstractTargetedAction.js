with(customizeyourweb){   
(function(){
   
   function AbstractTargetedAction(targetDefinition) {
         this.AbstractAction()
         this.targetDefinition = targetDefinition
   }
   
   AbstractTargetedAction.prototype = {
      constructor: AbstractTargetedAction,
      AbstractTargetedAction: AbstractTargetedAction,
      /*
       * Sets the target identifier
       */

      getTargetDefinition: function(){
         return this.targetDefinition
      },

      setTargetDefinition: function(targetDefinition){
         this.targetDefinition = targetDefinition
      },
      
      isTargetOptionalAndTargetMissing: function(cywContext){
         return this.targetDefinition.isTargetOptionalAndTargetMissing(cywContext.getTargetWindow())  
      },
      
      isTargetInPage: function(targetWin){
         return this.targetDefinition.isTargetInPage(targetWin)
      },
      
      isTargeted: function(){
         return true
      },
      
      getTarget : function(cywContextOrTargetWin) {
         return this.targetDefinition.getTarget(cywContextOrTargetWin)
      },
      
      //Could not be moved to AbstractTargerDefinition as ScriptErrorHandler needs information about action
      getTargetWithoutError : function(cywContext){
         try{
            return this.getTarget(cywContext)
         }catch(e){
            ScriptErrorHandler.addScriptError(cywContext.getScriptId(), e, null, this, cywContext.getTargetWindow())
            return null
         }
      }
      
   }
   
   ObjectUtils.extend(AbstractTargetedAction, "AbstractAction", customizeyourweb)   
   
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "AbstractTargetedAction", AbstractTargetedAction)
})()
}