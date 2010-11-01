with (customizeyourweb) {
   (function() {

      /*
       * Insert subwindow (iframe) with static content or dynamic preview functionality
       * TODO If insert subwindow is defined after listview the preview after load fails as the focus event fires before the 
       * preview listener is set up
       */
      function InsertSubwindowAction(id, targetDefinition) {
         this.AbstractInsertHtmlAction(id, targetDefinition)
         //Inherit from changeable action to handle saving of resizing and repositioning
         this.AbstractChangeableAction()
         /* See static url, preview */
         this.behavior = SubwindowBehavior.PREVIEW
         //preview listener
         this.previewListener = null;
         //Rectangle defineds position and size
			this.rectangle = new Rectangle(50, 0, 50, 100, "%")
         
			// Style of subwindow
         this.style = SubwindowStyle.OVERLAYED
         // Only in case of dynamic target
         this.triggerEvent = SubwindowTriggerEvent.ONMOUSEOVER
               | SubwindowTriggerEvent.ON_LISTVIEW_ITEM_CHANGE
         // Only in case of static target
         this.url = null
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
         //Functionality

         /*
          * Binds listener for resizing and repositioning
          */
         registerChangeListener: function(dialogElement, $injected){
            var $widget = $injected(dialogElement)
            var $iframe = $widget.find("iframe") 
            //Binding must apply to the widget element of the dialog (see $(dialog).dialog("widget"))!!! 
            $widget.bind('resizestart', function(event, uiEvent) {
               //Hide preview frame as it suppress mouse move events on resizing
               $iframe.hide()
            })
            var self = this
            $widget.bind('resizestop', function(event, uiEvent) {
               $iframe.show()
               $widget.css('position', 'fixed')
               self.updateSize(event, uiEvent)
            })
            $widget.bind('dragstart', function(event, uiEvent) {
               $iframe.hide()
            })
            $widget.bind('dragstop', function(event, uiEvent) {
               $iframe.show()
               self.updatePosition(event, uiEvent)
            })
         },
         
         /*
          * The cleanup call is used to save the new position
          * @override
          */
         cleanUpInternal: function(cywContext){
            this.savePropertyChanges(cywContext.getScriptId(), this.id)
            //Explicit destroy is neccessary otherwise listeners keep alive and causes errors
            this.previewListener.destroy()
            this.removeSubwindow(cywContext);
         },
         
         destroyJQueryDialog: function(abstractContext){
            var $injected = this.assureJQueryUI(abstractContext)
            $injected("div#" + this.getElementId(abstractContext.getScriptId())).dialog( "destroy" )
         },
         
         
         /*
          * Implements abstract method from superclass
          * @override
          */
         doActionInternal : function(cywContext) {
            var iframe = this.insertIframeHtml(cywContext)
            if(!iframe){
               return false
            }
            this.initIframe(iframe)
            return true
         },
         
         //If unit is in px it returns pixel value else
         //converts % value in px
         getUnitInPixel: function(value, unit, oneHundertPercentValue){
            var result = value
            if(unit=="%"){
               result = Math.floor(oneHundertPercentValue * value / 100)
            }
            return result
         },
         
         /*
          * Inserts an Iframe element which is fixed embedded within the page
          * @return DOMElement iframe
          */
         insertFixedPositionedSubwindow : function(abstractContext) {
            //Insert HTML
            var id = this.getElementId(abstractContext.getScriptId())
            var html = "<iframe id='" + id + "'/>";
            var iframe = this.insertElement(html, abstractContext, id)
            if(!iframe){
               throw new Error("Subwindow could not be inserted")
            }
            //Set dimension
            var $iframe = $(iframe);
            $iframe.width(this.rectangle.width+this.rectangle.widthUnit)
            $iframe.height(this.rectangle.height+this.rectangle.heightUnit)
            return iframe
         },
         
         /*
          * Inserts the HTML for the iframe depending on its style
          */
         insertIframeHtml: function(abstractContext){
            if(this.style == SubwindowStyle.FIXED_POSITION) {
               if(this.isTargetOptionalAndTargetMissing(abstractContext)){
                  return false
               }
               var iframe = this.insertFixedPositionedSubwindow(abstractContext)
            }else if(this.style == SubwindowStyle.OVERLAYED){
               var iframe = this.insertOverlayedSubwindow(abstractContext)
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
          * Inserts the jQery dialog and returns the DOM Element representing the dialog
          * @params abstractContext
          * @params jQuery $injected the injected jQuery object
          * @returns DOMElement root element representing the dialog
          */
			insertJQueryUIDialog: function(abstractContext, $injected){
            var targetWindow = abstractContext.getTargetWindow()

            //Create dialog div for content which will be wrapped by jQuery
            var dialogDivId = this.getElementId(abstractContext.getScriptId())
            $iframeDialog = $injected('body').append('<div id="' + dialogDivId + '">' +
                                       '<iframe style="min-height:100%; height:100%; width:100%"/>' + 
                                     '</div>').find('#' + dialogDivId)

            //Save currently focused element as with opening of dialog dialog gains focus
            var activeElement = targetWindow.document.activeElement
                                     
            //Open Dialog
            $iframeDialog.dialog({title: "Preview"})
            
            //Put focus back to active element
            if(activeElement){
               activeElement.focus()
            }

            //Set size
            var $targetWindow = $(targetWindow)
            var targetWinHeight = $targetWindow.height() 
            var targetWinWidth = $targetWindow.width() 
            $iframeDialog.dialog("option", "height", this.getUnitInPixel(this.rectangle.height, this.rectangle.heightUnit, targetWinHeight))
            $iframeDialog.dialog("option", "width", this.getUnitInPixel(this.rectangle.width, this.rectangle.widthUnit, targetWinWidth))
            
            //Set position of dialog
				var $dialogElement = $injected("div.ui-dialog").has("div#" + dialogDivId)
            //jQuery dialogs scrolls by default which is not as it should be ;-)
            $dialogElement.css('position', 'fixed')
            //As the position option of dialog assumes relative positioning this has to be workarounded
            $dialogElement.css('top', this.getUnitInPixel(this.rectangle.y, this.rectangle.yUnit, targetWinHeight))
            $dialogElement.css('left', this.getUnitInPixel(this.rectangle.x, this.rectangle.xUnit, targetWinWidth))
            
            //Set height on iframe div of assuring that iframe spans the entire dialog
            //TODO Why do I have to substract 40?
            var iframeHeight = $dialogElement.height() - $dialogElement.find("div.ui-dialog-titlebar").height() - 40  
            $iframeDialog.css('height', iframeHeight + "px")
            
				return $dialogElement.get(0)
			},
         
         /*
          * Inserts HTML for free-floating Iframe
          * Implemented with jQuery UI dialog
          * @return DOMElement iframe 
          */
         insertOverlayedSubwindow: function(abstractContext){
            //Assure that jQueryUI is injected in page
            var $injected = this.assureJQueryUI(abstractContext)
            
				//Insert jQuery dialog
            var dialogElement = this.insertJQueryUIDialog(abstractContext, $injected)
            
            //Bind listener 
            this.registerChangeListener(dialogElement, $injected)
            
            //Iframe reference must be fetched with the global $ otherwise PreviewListener 
            //has security exceptions when accessing doc shell
            var iframe = $("div#" + this.getElementId(abstractContext.getScriptId()) +">iframe", abstractContext.getTargetDocument()).get(0) 
            if(iframe){
               return iframe
            }else{
               throw new Error('insertion preview iframe failed')
            }
         },
			
			//@see IPreviewableAction.preview
			preview: function(editContext){
				var iframe = this.insertIframeHtml(editContext)
				return {}
			},
         
         removeSubwindow: function(abstractContext){
            if(this.style == SubwindowStyle.OVERLAYED) {
   			   this.destroyJQueryDialog(abstractContext)
            }
            $("#" + this.getElementId(abstractContext.getScriptId()), abstractContext.getTargetDocument()).remove()
         },
			
			undo: function(abstractContext){
            this.removeSubwindow(abstractContext)
			},
         
         /*
          * Updates the position of the subwindow after dragging
          */
         updatePosition: function(event, uiEvent){
            var $win = $(event.view)
            
            //Determine pos values for fixed positing
            var offsetToViewport = DomUtils.getOffsetToBody(event.currentTarget)
            var x = offsetToViewport.x
            if(this.rectangle.xUnit=="%"){
               x = Math.round(x/$win.width()*100)
            }
            this.rectangle.x = x 
            this.setPropertyChange("rectangle.x", this.rectangle.x)

            var y = offsetToViewport.y
            if(this.rectangle.yUnit=="%"){
               y = Math.round(y/$win.height()*100)
            }
            this.rectangle.y = y
            this.setPropertyChange("rectangle.y", this.rectangle.y)
         },
         
         /*
          * Updates the size properties of the subwindow
          * @params uiEvent from jQuery
          */
         updateSize: function(event, uiEvent){
            //Set correct postion as we use fixed position of dialog
            var offsetToViewport = DomUtils.getOffsetToViewport(event.currentTarget)
            uiEvent.helper.css("top", offsetToViewport.y)
            uiEvent.helper.css("left", offsetToViewport.x)
            this.updatePosition(event, uiEvent)
            
            var $win = $(event.view)
            
            var width = uiEvent.size.width
            if(this.rectangle.widthUnit=="%"){
               width= Math.round(width/$win.width()*100)
            }
            this.rectangle.width = width 
            this.setPropertyChange("rectangle.width", this.rectangle.width)

            var height = uiEvent.size.height
            if(this.rectangle.heightUnit=="%"){
               height= Math.round(height/$win.height()*100)
            }
            this.rectangle.height = height 
            this.setPropertyChange("rectangle.height", this.rectangle.height)
         }

      }
      ObjectUtils.extend(InsertSubwindowAction, "AbstractInsertHtmlAction", customizeyourweb)
      ObjectUtils.extend(InsertSubwindowAction, "AbstractChangeableAction", customizeyourweb)
      ObjectUtils.extend(InsertSubwindowAction, "IPreviewableAction", customizeyourweb)
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
      customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "SubwindowStyle", SubwindowStyle)
   })()
}