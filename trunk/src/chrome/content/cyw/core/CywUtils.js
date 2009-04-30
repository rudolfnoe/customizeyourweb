/*
 * Util-Functions of CYW
 * Rudolf Noé
 * 25.09.2008
 */
with(customizeyourweb){
(function(){

   var CywUtils = {
      
      logDebugMessage: function(messageString){
         Log.logDebug("customizeyourweb: " + messageString)
      },
      
      isMlbActive: function(){
         return Utils.isExtensionInstalledAndEnabled("{c0bcf963-624b-47fe-aa78-8cc02434cf32}")  
      }
   }
   
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "CywUtils", CywUtils)

})()
}