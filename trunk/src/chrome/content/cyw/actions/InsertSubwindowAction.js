with (customizeyourweb) {
   (function() {

      function InsertSubwindowAction(targetDefinition, position) {
         this.AbstractInsertHtmlAction(targetDefinition, position)
         this.AbstractChangeableAction()
         /* See static url, preview */
         this.behavior = SubwindowBehavior.STATIC
         // Height of the subwindow
         this.height = 500
         this.heightUnit = "px";
         //Left-position
         this.left = 0
         this.leftUnit = "px"
         //preview listener
         this.previewListener = null;
         // Style of subwindow
         this.style = SubwindowStyle.FIXED_POSITION
         //Top-position
         this.top = 0
         this.topUnit = "px"
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

         getLeft: function(){
            return this.left
         },
   
         setLeft: function(left){
            this.left = left
         },

         getLeftUnit: function(){
            return this.leftUnit
         },
   
         setLeftUnit: function(leftUnit){
            this.leftUnit = leftUnit
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

         getTop: function(){
            return this.top
         },
   
         setTop: function(top){
            this.top = top
         },
   
         getTopUnit: function(){
            return this.topUnit
         },
   
         setTopUnit: function(topUnit){
            this.topUnit = topUnit
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
         
         cleanUp: function(cywContext){
            this.savePropertyChanges(cywContext.getScriptId(), this.id)   
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
            }else if(this.style == SubwindowStyle.OVERLAYED){
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
            var self = this
            var tw = cywContext.getTargetWindow()
            var $injected = this.assureJQueryUI(cywContext)
            
            //TODO make it right
            //Create dialog div
            $injected('body').append('<div id="cyw_preview_dialog">' +
                                       '<iframe id="cyw_preview_frame" style="width:100%; height:100%"/>' + 
                                     '</div>')
                                     
            var $prevDialog = $injected('#cyw_preview_dialog')                         
            $prevDialog.dialog({title: "Preview"})
            $prevDialog.dialog("option", "height", this.height + this.heightUnit)
            $prevDialog.dialog("option", "width", this.width + this.widthUnit)
            //Workaround as otherwise we have an security issue
            var position = $injected.makeArray({})
            position[0] = self.left
            position[1] = self.top
            $prevDialog.dialog("option", "position", position)
            $prevDialog.css('height', "100%")
            $prevDialog.css('width', "100%")
            
            var $dialogDiv = $injected('div.ui-dialog')
            $dialogDiv.css('position', 'fixed')
            $dialogDiv.bind('resizestop', function(event, uiEvent) {
               $dialogDiv.css('position', 'fixed')
               self.updateSize(uiEvent)
            })
            $dialogDiv.bind('dragstop', function(event, uiEvent) {
               self.updatePosition(uiEvent)
            })
            //Must be fetched with the global $ otherwise PreviewListener has security exceptions when accessing doc shell
            var iframe = $("#cyw_preview_frame", cywContext.getTargetDocument()).get(0) 
            if(iframe){
               return iframe
            }else{
               throw new Error('insertion preview iframe failed')
            }
         },
         
         /*
          * Updates the position of the subwindow after dragging
          */
         updatePosition: function(uiEvent){
            this.left = uiEvent.position.left
            this.setPropertyChange("left", this.left)
            this.top = uiEvent.position.top
            this.setPropertyChange("top", this.top)
         },
         
         /*
          * Updates the size properties of the subwindow
          * @params uiEvent from jQuery
          */
         updateSize: function(uiEvent){
            this.updatePosition(uiEvent)
            this.width = uiEvent.size.width
            this.widthUnit = "px"
            this.setPropertyChange("width", this.width)
            this.setPropertyChange("widthUnit", this.widthUnit)
            this.height = uiEvent.size.height
            this.heightUnit = "px"
            this.setPropertyChange("height", this.height)
            this.setPropertyChange("heightUnit", this.heightUnit)
         }

      }
      ObjectUtils.extend(InsertSubwindowAction, "AbstractInsertHtmlAction", customizeyourweb)
      ObjectUtils.extend(InsertSubwindowAction, "AbstractChangeableAction", customizeyourweb)
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