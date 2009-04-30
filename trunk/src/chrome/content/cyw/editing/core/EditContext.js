with(customizeyourweb){
(function(){
   function EditContext(){
      this.action = null
      this.clipboard = null
      this.command = null
      this.commandData = null,
      this.script = null,
      this.targetDefinition = null
      this.targetElement = null
      this.targetWindow = null
   }
   
   EditContext.prototype = {
      getAction: function(){
         return this.action
      },

      setAction: function(action){
         this.action = action
      },

      getClipboard: function(){
         return this.clipboard
      },

      setClipboard: function(clipboard){
         this.clipboard = clipboard
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
      },
      
      getTargetWindow: function(){
         return this.targetWindow
      },

      setTargetWindow: function(targetWindow){
         this.targetWindow = targetWindow
      }
      
   }

   Namespace.bindToNamespace("customizeyourweb", "EditContext", EditContext)
})()
}