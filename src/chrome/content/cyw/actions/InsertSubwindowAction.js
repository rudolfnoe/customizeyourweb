with (customizeyourweb) {
   (function() {

      function InsertSubwindowAction(targetDefinition, position) {
         this.AbstractInsertHtmlAction(targetDefinition, position)
         /* See static url, preview */
         this.behavior = SubwindowBehavior.STATIC
         // Height of the subwindow
         this.height = 500
         this.heightUnit = "px";
         //preview listener
         this.previewListener = null;
         // Style of subwindow
         this.style = SubwindowStyle.FIXED_POSITION
         // Only in case of dynamic target
         this.triggerEvent = SubwindowTriggerEvent.ONMOUSEOVER
               | SubwindowTriggerEvent.ON_LISTVIEW_ITEM_CHANGE
         // Only in case of static target
         this.url = null
         // Width of the subwindow
         this.width = 400
         this.widthUnit = "px"
      }

      InsertSubwindowAction.prototype = {
         constructor : InsertSubwindowAction,

         getBehavior : function() {
            return this.behavior
         },

         setBehavior : function(behavior) {
            this.behavior = behavior
         },

         getHeight : function() {
            return this.height
         },

         setHeight : function(height) {
            this.height = height
         },

         getHeightUnit: function(){
            return this.heightUnit
         },

         setHeightUnit: function(heightUnit){
            this.heightUnit = heightUnit
         },

         getStyle : function() {
            return this.style
         },

         setStyle : function(style) {
            this.style = style
         },

         getTriggerEvent : function() {
            return this.triggerEvent
         },

         setTriggerEvent : function(triggerEvent) {
            this.triggerEvent = triggerEvent
         },

         getUrl : function() {
            return this.url
         },

         setUrl : function(url) {
            this.url = url
         },

         getWidth : function() {
            return this.width
         },

         setWidth : function(width) {
            this.width = width
         },

         getWidthUnit: function(){
            return this.widthUnit
         },

         setWidthUnit: function(widthUnit){
            this.widthUnit = widthUnit
         },
         
         attachEventListener: function(iframe){
            
         },

         doActionInternal : function(cywContext) {
            var iframe = this.insertIframeHtml(cywContext)
            this.initIframe(iframe)
            return true
         },

         insertFixedPositionedSubwindow : function(cywContext) {
            var html = "<iframe/>";
            var iframe = $(this.insertElement(html, cywContext, this.getElementId()));
            if(!iframe){
               throw new Error("Subwindow could not be inserted")
            }
            iframe.width(this.width+this.widthUnit)
            iframe.height(this.height+this.heightUnit)
            return iframe.get(0)
         },
         
         insertIframeHtml: function(cywContext){
            if(this.style == SubwindowStyle.FIXED_POSITION) {
               if(this.isTargetOptionalAndTargetMissing(cywContext)){
                  return false
               }
               var iframe = this.insertFixedPositionedSubwindow(cywContext)
            }else if(this.behavior == SubwindowStyle.OVERLAYED){
               var iframe = this.insertOverlayedSubwindow(cywContext)
            }else {
               throw new Error('unknown style value')
            }
            return iframe
         },
         
         initIframe: function(iframe){
            if(this.behavior == SubwindowBehavior.STATIC) {
              iframe.src = this.url
            }else if(this.behavior == SubwindowBehavior.PREVIEW) {
               this.previewListener = new PreviewListener(iframe, this.triggerEvent)
               this.previewListener.init()
            }else {
               throw new Error('unknown behavior value')
            }
         },
         
         insertOverlayedSubwindow: function(cywContext){
            throw new Error('not yet implemented')
         }

      }
      ObjectUtils.extend(InsertSubwindowAction, "AbstractInsertHtmlAction", customizeyourweb)
      customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "InsertSubwindowAction", InsertSubwindowAction)

      SubwindowBehavior = {
         STATIC : "STATIC",
         PREVIEW : "PREVIEW"
      }
      customizeyourweb.Namespace.bindToNamespace("customizeyourweb",
            "SubwindowBehavior", SubwindowBehavior)

      SubwindowTriggerEvent = {
         ONMOUSEOVER : 1,
         ON_LISTVIEW_ITEM_CHANGE : 2
      }
      customizeyourweb.Namespace.bindToNamespace("customizeyourweb",
            "SubwindowTriggerEvent", SubwindowTriggerEvent)

      SubwindowStyle = {
         OVERLAYED : "OVERLAYED",
         FIXED_POSITION : "FIXED_POSITION"
      }
      customizeyourweb.Namespace.bindToNamespace("customizeyourweb",
            "SubwindowStyle", SubwindowStyle)
   })()
}