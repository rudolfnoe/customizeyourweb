/*
 * Util-Functions of CYW
 * Rudolf Noe
 * 25.09.2008
 */
with(customizeyourweb){
(function(){
   const MLB_GUI_ID = "{c0bcf963-624b-47fe-aa78-8cc02434cf32}"
   const CONSOLE_SERVICE = Components.classes["@mozilla.org/consoleservice;1"]
                  .getService(Components.interfaces.nsIConsoleService);   
   
   var CywUtils = {
      idCounter: 0,
      
      createSessionUniqueId: function(){
         return "customizeyourweb_" + this.idCounter++   
      },
      
      mlbActive: false,
      
      init: function(){
         this.setMlbActive()
      },
      
      loadJQuery: function(){
        ScriptLoader.loadJQuery(CywCommon.getJQueryUrl(), "customizeyourweb") 
      },
      
      logDebug: function(messageString){
         Log.logDebug("CYW Debug: " + messageString)
      },

      logError: function(error, messageString, printStackTrace){
         Log.logError(error, "CYW Error: " + (messageString?messageString:""), arguments.length>=3?printStackTrace:true)
      },

      logInfo: function(messageString){
         Log.logInfo("CYW Info: " + messageString)
      },
      
      logWarning: function(messageString){
         Log.logWarning("CYW Warning: " + messageString)
      },

      logPerf: function(eventDescription, timeConsumed){
         if(CywConfig.isPerfLogActive()){
            CONSOLE_SERVICE.logStringMessage("CYW: " + eventDescription + " Time consumed: " + timeConsumed)      
         }
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