/*
 * Util-Functions of CYW
 * Rudolf Noe
 * 25.09.2008
 */
with(customizeyourweb){
(function(){

   var CywUtils = {
      idCounter: 0,
      
      createSessionUniqueId: function(){
         return "customizeyourweb_" + this.idCounter++   
      },
      
      getCywVersion: function(){
         return Utils.getExtension(CywCommon.GUI_ID).version   
      },
      
      loadJQuery: function(){
        ScriptLoader.loadJQuery(CywCommon.CHROME_CONTENT_URL + "jquery/jquery-1.4.1.js", "customizeyourweb") 
      },
      
      logDebug: function(messageString){
         Log.logDebug("CYW: " + messageString)
      },
      
      logError: function(error, messageString){
         Log.logError(error, "CYW: " + messageString)
      },

      logInfo: function(messageString){
         Log.logInfo("CYW: " + messageString)
      },
      

      isMlbActive: function(){
         return Utils.isExtensionInstalledAndEnabled("{c0bcf963-624b-47fe-aa78-8cc02434cf32}")  
      }
   }
   
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "CywUtils", CywUtils)

})()
}