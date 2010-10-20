(function(){   
   function CywContext(targetWindow, pageEventType, cachedPage){
      this.cachedPage = cachedPage?cachedPage:false
      this.clipboard = null
      this.pageEventType = pageEventType
   	this.targetWindow = targetWindow
      this.scriptId = null
   }
   
   //Statics
   //Name of the clipboard member, used for watching von property changes
   CywContext.CLIPBOARD_PROPERTY_NAME = "clipboard"
   
   CywContext.prototype = {
      constructor: CywContext,
      
      getPageEventType: function(){
         return this.pageEventType
      },

   	getTargetDocument: function(){
   		return this.targetWindow.document
   	},

   	getTargetWindow: function(){
   		return this.targetWindow
   	},
      
      getClipboard: function(){
         return this.clipboard
      },

      setClipboard: function(clipboard){
         this.clipboard = clipboard
      },
      
      getScriptId: function(){
         return this.scriptId
      },

      setScriptId: function(scriptId){
         this.scriptId = scriptId
      },

      isCachedPage: function(){
         return this.cachedPage
      },
      
      isDOMContentLoadedEvent: function(){
         return this.pageEventType && this.pageEventType==PageEvents.DOM_CONTENT_LOADED 
      },
      
      isMutationEvent: function(){
         return this.pageEventType && this.pageEventType==PageEvents.MUTATION_EVENT 
      }
   }
   
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "CywContext", CywContext)
   
})()