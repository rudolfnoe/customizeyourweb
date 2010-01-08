with(customizeyourweb){
(function(){
   
   function InsertSubwindowAction(targetDefinition){
      this.AbstractInsertElementAction(targetDefinition)
      /*See static url, preview*/
      this.behavior = SubwindowBehavior.STATIC_URL
      //Height of the subwindow
      this.height = "500"
      //Style of subwindow
      this.style = SubwindowStyle.OVERLAYED
      //Only in case of dynamic target
      this.triggerEvent = SubwindowTriggerEvent.ON_MOUSE_OVER 
      //Only in case of static target
      this.url = null
      //Width of the subwindow
      this.width = "400px"
   }
   
   InsertSubwindowAction.prototype ={ 
      constructor: InsertSubwindowAction,

      getBehavior: function(){
         return this.behavior
      },

      setBehavior: function(behavior){
         this.behavior = behavior
      },

      getHeight: function(){
         return this.height
      },

      setHeight: function(height){
         this.height = height
      },

      getStyle: function(){
         return this.style
      },

      setStyle: function(style){
         this.style = style
      },

      getTriggerEvent: function(){
         return this.triggerEvent
      },

      setTriggerEvent: function(triggerEvent){
         this.triggerEvent = triggerEvent
      },

      getUrl: function(){
         return this.url
      },

      setUrl: function(url){
         this.url = url
      },

      getWidth: function(){
         return this.width
      },

      setWidth: function(width){
         this.width = width
      },

      doActionInternal: function(cywContext){
      }     

   }
   ObjectUtils.extend(InsertSubwindowAction, "AbstractAction", customizeyourweb)
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "InsertSubwindowAction", InsertSubwindowAction)

   SubwindowBehavior = {
      STATIC_URL: "STATIC_URL",
      PREVIEW: "PREVIEW"
   }
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "SubwindowBehavior", SubwindowBehavior)
   
   SubwindowTriggerEvent = {
      ON_MOUSE_OVER: "ON_MOUSE_OVER",
      ON_LISTVIEW_ITEM_CHANGE: "ON_LISTVIEW_ITEM_CHANGE"
   }
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "SubwindowTriggerEvent", SubwindowTriggerEvent)
   
   SubwindowStyle = {
      OVERLAYED: "OVERLAYED",
      INTEGRATED: "INTEGRATED"
   }
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "SubwindowStyle", SubwindowStyle)
})()
}