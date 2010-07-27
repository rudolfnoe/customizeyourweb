/**
 * Superclass of CywContext and EditContext with common fields
 * @class
 */
with(customizeyourweb){
(function(){
   const OBJECT_WINDOW_STORAGE_NS = "customizeyourweb"
   const CHANGE_MEMENTO_STORAGE = "ChangeMementoStorage"
   
   function AbstractContext(targetWindow){
      //cyw clipboard for copy / paste
      this.clipboard = null
		//The window to operate on
      this.targetWindow = targetWindow
		//The current running / edited script
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
      
      getScript: function(){
         return this.script
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
      },

      getScriptId: function(){
         return this.script.getId()
      },
      
      getActionChangeMemento: function(actionId){
         return this.getChangeMementoStorage()[this.getUniqueActionId(actionId)]
      },
      
      getChangeMementoStorage: function(){
         var changeMementoStorage = null
         if(!ObjectWindowStorage.hasObject(this.targetWindow, OBJECT_WINDOW_STORAGE_NS, CHANGE_MEMENTO_STORAGE)){
            changeMementoStorage = {}
            ObjectWindowStorage.setObject(this.targetWindow, OBJECT_WINDOW_STORAGE_NS, CHANGE_MEMENTO_STORAGE, changeMementoStorage)
         }else{
            changeMementoStorage = ObjectWindowStorage.getObject(this.targetWindow, OBJECT_WINDOW_STORAGE_NS, CHANGE_MEMENTO_STORAGE)
         }
         return changeMementoStorage
      },
      
      getUniqueActionId: function(actionId){
         return this.getScriptId() + "_" + actionId
      },
      
      setActionChangeMemento: function(actionId, changeMemento){
         var changeMementoStorage = this.getChangeMementoStorage()
         changeMementoStorage[this.getUniqueActionId(actionId)] = changeMemento
      }
   }

   
   Namespace.bindToNamespace("customizeyourweb", "AbstractContext", AbstractContext)
})()
}