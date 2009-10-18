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
      
      init: function(){
         var browser = Firefox.getBrowser()
         browser.addEventListener("click", this, true)
      },
      
      ignoreClick: function(event){
         if(!event.target || !event.target.tagName || event.target.tagName != "A" || 
            event.button !=0 ){ //other than left click){
            return true
         }
         var href = event.target.href
         if(!StringUtils.startsWith(href, "http://www.customize-your-web.de") || 
            !StringUtils.contains("/download/file.php?", href) ||
            event.target.className != "postlink"){
            return true
         }
         var textContent = event.target.textContent
         if(!StringUtils.contains(".xml", textContent)){
            return true
         }
         return false
      }
   }
   
   ObjectUtils.extend(WebInstallListener, AbstractGenericEventHandler)
   
   Namespace.bindToNamespace("customizeyourweb", "WebInstallListener", WebInstallListener)
})()
}