with(customizeyourweb){
(function(){
   function AbstractTargetDefinition(){
      this.targetName = null
      this.targetOptional = false
   }
   
   AbstractTargetDefinition.prototype = {
      constructor: AbstractTargetDefinition,   
      
      getTargetName: function(){
         return this.targetName
      },

      setTargetName: function(targetName){
         this.targetName = targetName
      },
      
      isTargetOptional: function(){
         return this.targetOptional
      },

      setTargetOptional: function(targetOptional){
         this.targetOptional = targetOptional
      },
      
      isTargetOptionalAndTargetMissing: function(targetWin){
         return this.isTargetOptional() && !this.isTargetInPage(targetWin)
      },
      
      getTargetWin: function(cywContextOrTargetWin){
         return (cywContextOrTargetWin instanceof Components.interfaces.nsIDOMWindow)?
               cywContextOrTargetWin:cywContextOrTargetWin.getTargetWindow()
      },

      getDefinitionAsString: function(){
         throw new Error('must be implemented')
      },
      
      getDefinitionStyle: function(){
         throw new Error('must be implemented')
      },
      
      getTarget: function(cywContextOrTargetWin){
         var targetWin = this.getTargetWin(cywContextOrTargetWin)
         var targets = this.getTargetsInternal(targetWin)
         //Should be moved to abstract targeted action?
         if(targets.length==0){
            throw ScriptErrorHandler.createError(ErrorConstants.TARGET_NOT_FOUND, [this.getDefinitionAsString()])
         }else if(targets.length>1){
            throw ScriptErrorHandler.createError(ErrorConstants.NON_UNIQUE_TARGET_DEFINITION, [this.getDefinitionAsString()])
         }
         return targets[0]
      },
      
      getTargets: function(cywContextOrTargetWin){
         return this.getTargetsInternal(this.getTargetWin(cywContextOrTargetWin))
      },
      
      getTargetsInternal: function(targetWin){
         throw new Error('must be implemented')   
      },
      
      isTargetInPage: function(targetWin){
         return this.getTargetsInternal(targetWin).length>=1
      }
      
   }
   
   Namespace.bindToNamespace("customizeyourweb", "AbstractTargetDefinition", AbstractTargetDefinition)
   
   var TargetDefinitionStyle = {
      JQUERY: "JQUERY",
      SIMPLE: "SIMPLE",
      XPATH: "XPATH"
   }
   Namespace.bindToNamespace("customizeyourweb", "TargetDefinitionStyle", TargetDefinitionStyle)
})()
}