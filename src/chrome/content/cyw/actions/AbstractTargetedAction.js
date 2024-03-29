with(customizeyourweb){   
(function(){
   
   function AbstractTargetedAction(id, targetDefinition) {
         this.AbstractAction(id)
         this.targetDefinition = targetDefinition
         this.allowMultiTargets = false
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
      
      allowsMultiTargets: function(){
         return this.allowMultiTargets
      },

      setAllowMultiTargets: function(allowMultiTargets){
         this.allowMultiTargets = allowMultiTargets
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

      getTargets: function(/*DOMWindow | CywContext*/ cywContextOrTargetWin, /*Boolean*/ withoutError){
         var targets = this.targetDefinition.getTargets(cywContextOrTargetWin)
         if(targets.length==0 && !withoutError){
            throw ScriptErrorHandler.createError(ErrorConstants.TARGET_NOT_FOUND, [this.getTargetDefinition().getDefinitionAsString()])
         }
         return targets
      },
      
      //Could not be moved to AbstractTargerDefinition as ScriptErrorHandler needs information about action
      getTargetWithoutError : function(cywContext){
         try{
            return this.getTarget(cywContext)
         }catch(e){
            ScriptErrorHandler.addScriptError(ErrorConstants.TARGET_NOT_FOUND, [this.getTargetDefinition().getDefinitionAsString()], 
                                                e, cywContext.getScriptId(), this.getId(), cywContext.getTargetWindow())
            return null
         }
      }
      
   }
   
   ObjectUtils.extend(AbstractTargetedAction, "AbstractAction", customizeyourweb)   
   
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "AbstractTargetedAction", AbstractTargetedAction)
})()
}