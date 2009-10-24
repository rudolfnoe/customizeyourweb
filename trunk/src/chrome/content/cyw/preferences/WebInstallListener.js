with(customizeyourweb){
(function(){
   /*
    * Listens to clicks on attached script files in CYW Forum
    */
   function WebInstallListener(){
      this.AbstractGenericEventHandler()
      this.init()
   }
   
   //Static members
   WebInstallListener.instance = null
   
   WebInstallListener.disable = function(){
      this.getInstance().suspend()
      this.getInstance().setInstallScriptMIVisibility(false)
   }

   WebInstallListener.enable = function(){
      this.getInstance().resume()
   }
   
   WebInstallListener.getInstance = function(){
      if(this.instance == null){
         this.instance = new WebInstallListener()
      }
      return this.instance
   }
   
   WebInstallListener.prototype = {
      constructor: WebInstallListener,
      
      handleClick: function(event){
         if(this.ignoreClick(event)){
            return
         }
         (new WebInstaller()).installScript(event.target.href)
         Utils.stopEvent(event)
         return
      },
      
      handlePopupshowing: function(){
         var showInstallScriptMI = true
         if(!gContextMenu || !gContextMenu.onLink){ 
            showInstallScriptMI = false
         }
         var href  =  gContextMenu.target.href
         var textContent = gContextMenu.target.textContent
         if(!StringUtils.endsWith(href, ".xml") && !StringUtils.contains(".xml", textContent)){
            showInstallScriptMI = false
         }
         this.setInstallScriptMIVisibility(showInstallScriptMI)
      },
      
      init: function(){
         var browser = Firefox.getBrowser()
         browser.addEventListener("click", this, true)
         document.getElementById("contentAreaContextMenu").addEventListener("popupshowing", this, true)
      },
      
      ignoreClick: function(event){
         if(!event.target || !event.target.tagName || event.target.tagName != "A" || 
            event.button !=0 ){ //other than left click){
            return true
         }
         var href = event.target.href
         if(!(StringUtils.startsWith(href, "http://www.customize-your-web.de") || 
              StringUtils.startsWith(href, "http://forum.customize-your-web.de")) || 
            !StringUtils.contains("/download/file.php?", href) ||
            event.target.className != "postlink"){
            return true
         }
         var textContent = event.target.textContent
         if(!StringUtils.contains(".xml", textContent)){
            return true
         }
         return false
      },
      
      /*
       * @param boolean show
       */
      setInstallScriptMIVisibility: function(show){
         document.getElementById("customizeyourweb_installScriptMI").setAttribute("hidden", !show)
         document.getElementById("customizeyourweb-separator").setAttribute("hidden", !show)
      }
   }
   
   ObjectUtils.extend(WebInstallListener, AbstractGenericEventHandler)
   
   Namespace.bindToNamespace("customizeyourweb", "WebInstallListener", WebInstallListener)
})()
}