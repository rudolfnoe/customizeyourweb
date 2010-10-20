/*
 * Util-Functions of CYW
 * Rudolf Noe
 * 25.09.2008
 */
with(customizeyourweb){
(function(){
   const MLB_GUI_ID = "{c0bcf963-624b-47fe-aa78-8cc02434cf32}"
   
   var CywUtils = {
      
      mlbActive: false,
      
      init: function(){
         this.setMlbActive()
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
      
      isFirefox4: function(){
         return Application.version.substring(0,1)>=4
      },

      isMlbActive: function(){
         return this.mlbActive
      },
      
      setMlbActive: function(){
         if(this.isFirefox4()){
            ServiceRegistry.getAddonManager().getAddonByID(MLB_GUI_ID, function(addon){
               CywUtils.mlbActive = addon && addon.isActive
            })
         }else{
            this.mlbActive = Utils.isExtensionInstalledAndEnabled(MLB_GUI_ID)
         }
      }
      
   }
   
   CywUtils.init()
   
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "CywUtils", CywUtils)

})()
}