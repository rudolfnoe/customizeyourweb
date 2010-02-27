with(customizeyourweb){
(function(){
   function PreviewListener(iframe, triggerEvent){
      this.iframe = iframe; 
      this.topWin = DomUtils.getOwnerWindow(iframe).top
      this.triggerEvent = triggerEvent;
      this.timerId = CywUtils.createSessionUniqueId();
   }
   
   PreviewListener.prototype = {
         constructor: PreviewListener,
         
         setAllowJavaScriptOnIframe: function(allowJS){
            var docShell = this.iframe.contentWindow.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                              .getInterface(Components.interfaces.nsIWebNavigation)
                              .QueryInterface(Components.interfaces.nsIDocShell)
            docShell.allowJavascript = allowJS
         },
         
         init: function(){
            if(this.triggerEvent & SubwindowTriggerEvent.ONMOUSEOVER) {
               this.topWin.addEventListener("mouseover", this, true)
            }

            if(this.triggerEvent & SubwindowTriggerEvent.ON_LISTVIEW_ITEM_CHANGE) {
               this.topWin.addEventListener(UIEvents.PREVIEW_LINK, this, true)
            }
            
            this.iframe.addEventListener("load", this, true)
         },
         
         handleLoad: function(event){
            //reenable JS after iframe is loaded
            this.setAllowJavaScriptOnIframe(true)
         },
         
         handleMouseover: function(event) {
            if(!this.isPreviewTarget(event)){
               return
            }
            this.currentTarget = event.target
            this.currentTarget.addEventListener("mouseout", this, true)
            Utils.executeDelayed(this.timerId, 200, this.preview, this, [event.target])
         },
         
         handleMouseout: function(event){
            event.target.removeEventListener("mouseout", this, true)
            if(!$.contains(event.target, event.relatedTarget)){
               Utils.clearExecuteDelayedTimer(this.timerId)
            }
         },
         
         handlePreviewlink: function(event){
            Utils.executeDelayed(this.timerId, 200, this.preview, this, [event.target])
         },
         
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
            if(this.iframe.src != link.href){
               //Disable JavaScript to prohibit focus lost
               this.setAllowJavaScriptOnIframe(false)
               this.iframe.src = link.href
            }
         }
   }
   ObjectUtils.extend(PreviewListener, "AbstractGenericEventHandler", customizeyourweb)
   
   Namespace.bindToNamespace("customizeyourweb", "PreviewListener", PreviewListener)
})()
}