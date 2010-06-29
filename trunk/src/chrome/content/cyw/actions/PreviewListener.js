with(customizeyourweb){
(function(){
   /*
    * @param DOMElement iframe
    * @param UIEvents triggerEvent
    */
   function PreviewListener(iframe, triggerEvent){
      this.iframe = iframe; 
      this.topWin = DomUtils.getOwnerWindow(iframe).top
      this.triggerEvent = triggerEvent;
      this.timerId = CywUtils.createSessionUniqueId();
   }
   
   PreviewListener.prototype = {
         constructor: PreviewListener,
         
         destroy: function(){
//            CywUtils.logDebug("PreviewListener.destroy")
            this.topWin.removeEventListener("mouseover", this, true)
            this.topWin.removeEventListener(UIEvents.PREVIEW_LINK, this, true)
            this.iframe.removeEventListener("load", this, true)
         },
         
         init: function(){
            if(this.triggerEvent & SubwindowTriggerEvent.ONMOUSEOVER) {
               this.topWin.addEventListener("mouseover", this, true)
            }

            if(this.triggerEvent & SubwindowTriggerEvent.ON_LISTVIEW_ITEM_CHANGE) {
               this.topWin.addEventListener(UIEvents.PREVIEW_LINK, this, true)
            }
            
            this.iframe.addEventListener("load", this, true)
            CywUtils.logDebug("PreviewListener.init")
         },
         
         /*
          * Handles Load event on iframe to reenable JS
          */
         handleLoad: function(event){
            if(this.iframe.src=="about:blank"){
               this.insertNoPdfPreview(this.iframe.contentDocument)
            }else{
               //reenable JS after iframe is loaded
               this.setAllowJavaScriptOnIframe(true)
            }
         },
         
         /*
          * Handles mouseover events
          */
         handleMouseover: function(event) {
            if(!this.isPreviewTarget(event)){
               this.currentTarget = null
               return
            }
            this.currentTarget = event.target
            this.currentTarget.addEventListener("mouseout", this, true)
            Utils.executeDelayed(this.timerId, 200, this.preview, this, [event.target])
         },
         
         handleMouseout: function(event){
            this.currentTarget = null
            event.target.removeEventListener("mouseout", this, true)
            if(!$.contains(event.target, event.relatedTarget)){
               Utils.clearExecuteDelayedTimer(this.timerId)
            }
         },
         
         /*
          * Handles custom UIEvent "Previewlink"
          * see UIEvent.PREVIEW_LINK
          */
         handlePreviewlink: function(event){
            Utils.executeDelayed(this.timerId, 200, this.preview, this, [event.target])
         },
         
         insertNoPdfPreview: function(document){
            var html = '<div style="width:100%; font-family:arial; padding:10px; vertical-align:middle; text-align:center; border:1px solid black">' +
                  '<img src="chrome://customizeyourweb/content/common/ui/resources/warning.ico"/>Preview of PDF-Files is not supported!</div>'
            $("body", document).append(html)
         },
         
         /*
          * Checks whether target is previewable
          * Only simple links could be previewed
          */
         isPreviewTarget: function(event){
            var target = event.target
            if(!target || target.tagName!="A" ||
                StringUtils.startsWith(target.href, "javascript:") || 
                StringUtils.isEmpty(target.href)){
                  return false
            }else{
               return true
            }
         },
         
         preview: function(link){
            if(this.iframe.src!= link.href){
               if(StringUtils.endsWith(link.href, ".pdf")){
                  //No preview of PDF Files possible
                  this.iframe.src = "about:blank"
               }else{
                  //Disable JavaScript to prohibit focus lost
                  this.setAllowJavaScriptOnIframe(false)
                  this.iframe.src = link.href
               }
            }
         },

         setAllowJavaScriptOnIframe: function(allowJS){
            var docShell = this.iframe.contentWindow.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                              .getInterface(Components.interfaces.nsIWebNavigation)
                              .QueryInterface(Components.interfaces.nsIDocShell)
            docShell.allowJavascript = allowJS
         },
         
  }
   ObjectUtils.extend(PreviewListener, "AbstractGenericEventHandler", customizeyourweb)
   
   Namespace.bindToNamespace("customizeyourweb", "PreviewListener", PreviewListener)
})()
}