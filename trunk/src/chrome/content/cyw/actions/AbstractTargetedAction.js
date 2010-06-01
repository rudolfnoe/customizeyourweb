with(customizeyourweb){   
(function(){
   
   function AbstractTargetedAction(id, targetDefinition) {
         this.AbstractAction(id)
         this.targetDefinition = targetDefinition
   }
   
   AbstractTargetedAction.prototype = {
      constructor: AbstractTargetedAction,
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
      
      getTargets: function(cywContextOrTargetWin){
         var targets = this.targetDefinition.getTargets(cywContextOrTargetWin)
         if(targets.length==0){
            throw ScriptErrorHandler.createError(ErrorConstants.TARGET_NOT_FOUND, [this.getDefinitionAsString()])
         }
         return targets
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