with(customizeyourweb){
(function(){
   function EditContext(){
      this.command = null
      this.commandData = null,
      this.targetDefinition = null
      this.targetElement = null
   }
   
   EditContext.prototype = {
		constructor: EditContext,
		
      getAction: function(){
         return this.action
      },

      setAction: function(action){
         this.action = action
      },

      getCommand: function(){
         return this.command
      },

      setCommand: function(command){
         this.command = command
      },

      getCommandData: function(){
         return this.commandData
      },

      setCommandData: function(commandData){
         this.commandData = commandData
      },
      
      getTargetDefinition: function(){
         return this.targetDefinition
      },

      setTargetDefinition: function(targetDefinition){
         this.targetDefinition = targetDefinition
      },
 
      getTargetElement: function(){
         return this.targetElement
      },

      setTargetElement: function(targetElement){
         this.targetElement = targetElement
      }
     
   }
   ObjectUtils.extend(EditContext, "AbstractContext", customizeyourweb)
   Namespace.bindToNamespace("customizeyourweb", "EditContext", EditContext)
})()
}