with(customizeyourweb){
(function(){
   
   function InsertSubwindowAction(targetDefinition, position){
      this.AbstractInsertElementAction(targetDefinition, position)
      /*See static url, preview*/
      this.behavior = SubwindowBehavior.STATIC
      //Height of the subwindow
      this.height = 500
      //Style of subwindow
      this.style = SubwindowStyle.FIXED_POSITION
      //Only in case of dynamic target
      this.triggerEvent = SubwindowTriggerEvent.ONMOUSEOVER 
      //Only in case of static target
      this.url = null
      //Width of the subwindow
      this.width = 400
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
   ObjectUtils.extend(InsertSubwindowAction, "AbstractInsertElementAction", customizeyourweb)
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "InsertSubwindowAction", InsertSubwindowAction)

   SubwindowBehavior = {
      STATIC: "STATIC",
      PREVIEW: "PREVIEW"
   }
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "SubwindowBehavior", SubwindowBehavior)
   
   SubwindowTriggerEvent = {
      ONMOUSEOVER: "ONMOUSEOVER",
      ON_LISTVIEW_ITEM_CHANGE: "ON_LISTVIEW_ITEM_CHANGE"
   }
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "SubwindowTriggerEvent", SubwindowTriggerEvent)
   
   SubwindowStyle = {
      OVERLAYED: "OVERLAYED",
      FIXED_POSITION : "FIXED_POSITION"
   }
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "SubwindowStyle", SubwindowStyle)
})()
}