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

         //Getter Setter
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
         
         //Functionality

         /*
          * The cleanup call is used to save the new position
          */
         cleanUp: function(cywContext){
            this.savePropertyChanges(cywContext.getScriptId(), this.id)   
         },
         
         /*
          * Implements abstract method from superclass
          */
         doActionInternal : function(cywContext) {
            var iframe = this.insertIframeHtml(cywContext)
            if(!iframe){
               return false
            }
            this.initIframe(iframe)
            return true
         },

         /*
          * Inserts an Iframe element which is fixed embedded within the page
          * @return DOMElement iframe
          */
         insertFixedPositionedSubwindow : function(cywContext) {
            var html = "<iframe/>";
            var $iframe = $(this.insertElement(html, cywContext, this.getElementId()));
            if(!$iframe){
               throw new Error("Subwindow could not be inserted")
            }
            $iframe.width(this.width+this.widthUnit)
            $iframe.height(this.height+this.heightUnit)
            return $iframe.get(0)
         },
         
         /*
          * Inserts the HTML for the iframe depending on its style
          */
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
         
         /*
          * Inits the iframe depending on its behavior
          */
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
         
         /*
          * Inserts HTML for free-floating Iframe
          * Implemented with jQuery UI dialog
          * @return DOMElement iframe 
          */
         insertOverlayedSubwindow: function(cywContext){
            //Redefinition of this for usage in callback functions of eventhandlers
            var self = this
            var tw = cywContext.getTargetWindow()
            //Assure that jQueryUI is injected in page
            var $injected = this.assureJQueryUI(cywContext)
            
            var dialogDivDomId = "cyw_iframe_" + cywContext.getScriptId() + "_" + this.getId()
            //Create dialog div
            $injected('body').append('<div id="' + dialogDivDomId + '">' +
                                       '<iframe style="width:100%; height:100%"/>' + 
                                     '</div>')
            var $iframeDialog = $injected('div#' + dialogDivDomId)

            //Set size
            $iframeDialog.dialog({title: "Preview"})
            $iframeDialog.dialog("option", "height", this.height + this.heightUnit)
            $iframeDialog.dialog("option", "width", this.width + this.widthUnit)
            
            //Set position
            //Workaround as otherwise we have an security issue
            var left = this.left
            var $tw = $(tw)
            if(this.leftUnit=="%"){
               left = Math.floor($tw.width()*this.left/100)
            }
            var top = this.top
            if(this.topUnit=="%"){
               top = Math.floor($tw.height()*this.left/100)
            }
            var position = $injected.makeArray({})
            position[0] = left
            position[1] = top
            $iframeDialog.dialog("option", "position", position)
            $iframeDialog.css('height', "100%")
            $iframeDialog.css('width', "100%")
            
            var $dialogDiv = $injected('div.ui-dialog')
            //jQuery dialogs scrolls by default which is not as it should be ;-)
            $dialogDiv.css('position', 'fixed')
            //Add eventhandler to dialog div iframe
            $dialogDiv.bind('resizestart', function(event, uiEvent) {
               //Hide preview frame as it suppress mouse move events on resizing
               $iframeDialog.hide()
            })
            $dialogDiv.bind('resizestop', function(event, uiEvent) {
               $iframeDialog.show()
               $dialogDiv.css('position', 'fixed')
               self.updateSize(event, uiEvent)
            })
            $dialogDiv.bind('dragstop', function(event, uiEvent) {
               self.updatePosition(event, uiEvent)
            })
            //Iframe reference must be fetched with the global $ otherwise PreviewListener 
            //has security exceptions when accessing doc shell
            var iframe = $("div#" + dialogDivDomId+">iframe", cywContext.getTargetDocument()).get(0) 
            if(iframe){
               return iframe
            }else{
               throw new Error('insertion preview iframe failed')
            }
         },
         
         /*
          * Updates the position of the subwindow after dragging
          */
         updatePosition: function(event, uiEvent){
            var $win = $(event.view)
            
            var left = uiEvent.position.left
            if(this.leftUnit=="%"){
               left = Math.round(left/$win.width()*100)
            }
            this.left = left 
            this.setPropertyChange("left", this.left)

            var top = uiEvent.position.top
            if(this.topUnit=="%"){
               top = Math.round(top/$win.height()*100)
            }
            this.top = top
            this.setPropertyChange("top", this.top)
         },
         
         /*
          * Updates the size properties of the subwindow
          * @params uiEvent from jQuery
          */
         updateSize: function(event, uiEvent){
            this.updatePosition(event, uiEvent)
            var $win = $(event.view)
            
            var width = uiEvent.size.width
            if(this.widthUnit=="%"){
               width= Math.round(width/$win.width()*100)
            }
            this.width = width 
            this.setPropertyChange("width", this.width)

            var height = uiEvent.size.height
            if(this.heightUnit=="%"){
               height= Math.round(height/$win.height()*100)
            }
            this.height = height 
            this.setPropertyChange("height", this.height)
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