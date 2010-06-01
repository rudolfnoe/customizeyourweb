/**
 * Superclass of CywContext and EditContext with common fields
 * @class
 */
with(customizeyourweb){
(function(){
   function AbstractContext(targetWindow){
      //injected jQuery reference
      this.$ = null
      //clipboard for copy / paste
      this.clipboard = null
		//The window to operate on
      this.targetWindow = targetWindow
		//The current script
      this.script = null
   }
   
   AbstractContext.prototype = {
      constructor: AbstractContext,   

      getClipboard: function(){
         return this.clipboard
      },

      setClipboard: function(clipboard){
         this.clipboard = clipboard
      },
      
      isJQueryInjected: function(){
         return this.$ != null 
      },
      
      isJQueryUIInjected: function(){
         return this.$.ui != null 
      },
      
      getJQuery: function(){
         return this.$
      },
      
      setJQuery: function($){
         this.$ = $
      },

      getNextActionId: function(){
         return this.script.getNextActionId() 
      },

      getScriptId: function(){
         return this.script.getId()
      },
      
      setScript: function(script){
         this.script = script
      },

      getTargetDocument: function(){
         return this.targetWindow.document
      },

      getTargetWindow: function(){
         return this.targetWindow
      },

      setTargetWindow: function(targetWindow){
         this.targetWindow = targetWindow
      }
   }
   
   Namespace.bindToNamespace("customizeyourweb", "AbstractContext", AbstractContext)
})()
}