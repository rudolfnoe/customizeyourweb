/**
 * Contains Code for migration to newer version
 */
 with(customizeyourweb){
(function(){
   
   var CywVersionManager = { 
      VERSION_PREF: "customizeyourweb.version",
      versionComparator: Components.classes["@mozilla.org/xpcom/version-comparator;1"]
                   .getService(Components.interfaces.nsIVersionComparator),
      
      versionsToBeMigrated: ["0.2Build20090808"],
                   
      addonHasToBeMigrated: function(){
         var newInstalledVersion = Utils.getExtension(CywCommon.GUI_ID).version
         var currentVersion = Prefs.getCharPref(this.VERSION_PREF)
         if(this.versionComparator.compare(newInstalledVersion, currentVersion)>0 &&
            !this.isFirstStartupAfterInstallation()){
            return true
         }else{
            return false
         }
      },
      
      doCommonMigration: function(){
         this.setVersionPref()
         setTimeout(customizeyourweb.CywVersionManager.showVersionInfoPage, 1000)
      },
      
      doMigration: function(){
         var currentVersion = Prefs.getCharPref(this.VERSION_PREF)
         for (var i = 0; i < this.versionsToBeMigrated.length; i++) {
            var versionToBeMigrated = this.versionsToBeMigrated[i]
            if(this.versionComparator.compare(versionToBeMigrated, currentVersion)>0){
               var mirgationFunctionName = "migrateToVersion_" + versionToBeMigrated.replace(/\./g,"_") 
               this[mirgationFunctionName]()
               CywUtils.logInfoMessage("Successfully migrated to version " + versionToBeMigrated)
            }
         }
         this.doCommonMigration()
      },
      
      isFirstStartupAfterInstallation: function(){
         return Prefs.getCharPref(this.VERSION_PREF).length==0   
      },
      
      migrateToVersion_0_2Build20090808: function(){
         ConfigDataConverter.convertToSeperateConfigFiles()   
      },
      
      setUp: function(){
         this.doCommonMigration()      
      },
      
      setVersionPref: function(){
         Prefs.setCharPref(this.VERSION_PREF, Utils.getExtension(CywCommon.GUI_ID).version)
      },
      
      showVersionInfoPage: function(){
         var newTab = Utils.openUrlInNewTab('http://whatsnew.customize-your-web.de')
         newTab.moveBefore(Application.activeWindow.tabs[0])
         newTab.focus();
      }
   }
   
   Namespace.bindToNamespace("customizeyourweb", "CywVersionManager", CywVersionManager)
})()
}