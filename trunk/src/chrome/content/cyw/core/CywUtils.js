/*
 * Util-Functions of CYW
 * Rudolf Noé
 * 25.09.2008
 */
with(customizeyourweb){
(function(){

   var CywUtils = {
      
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