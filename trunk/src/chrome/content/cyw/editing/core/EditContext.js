with(customizeyourweb){
(function(){
   function EditContext(){
      //Reference to the xul command element which was triggered
      this.command = null
      //Arbitrary Data which could be with addiontial information for the editing command
      //Currently only used for the resize command
      this.commandData = null,
      //Reference to the element which was selected by the user
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
      
      getNextActionId: function(){
         return this.getScript().getNextActionId() 
      },

      getDefaultTargetDefinition: function(){
         if(this.targetElement){
            return AbstractTargetDefinitionFactory.createDefaultDefinition(this.targetElement)
         }else{
            return null
         }
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