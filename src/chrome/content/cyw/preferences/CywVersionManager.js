/**
 * Contains Code for migration to version 0.5
 */
 with(customizeyourweb){
(function(){
	
   var CywVersionManager = { 
   	VERSION_PREF: "customizeyourweb.version",
   	versionComparator: Components.classes["@mozilla.org/xpcom/version-comparator;1"]
                   .getService(Components.interfaces.nsIVersionComparator),
   	
      versionsToBeMigrated: ["0.1Build20090506"],
                   
   	addonHasToBeMigrated: function(){
   		var newInstalledVersion = Utils.getExtension(CywCommon.GUI_ID).version
   		var currentVersion = Prefs.getCharPref(this.VERSION_PREF)
   		if(this.versionComparator.compare(newInstalledVersion, currentVersion)>0){
   			return true
   		}else{
   			return false
   		}
   	},
   	
   	doMigration: function(){
   		var currentVersion = Prefs.getCharPref(this.VERSION_PREF)
   		for (var i = 0; i < this.versionsToBeMigrated.length; i++) {
   			var version = this.versionsToBeMigrated[i]
   			if(this.versionComparator.compare(version, currentVersion)>0){
   				var mirgationFunctionName = "migrateToVersion_" + version.replace(/\./g,"_") 
   				this[mirgationFunctionName]()
   				CywUtils.logInfoMessage("Successfully migrated to version " + version)
   			}
   		}
   		Prefs.setCharPref(this.VERSION_PREF, Utils.getExtension(CywCommon.GUI_ID).version)
   		setTimeout(customizeyourweb.CywVersionManager.showVersionInfoPage, 1000)
   	},
      
      migrateToVersion_0_1Build20090506: function(){
         var scripts = CywConfig.scripts
         for (var i = 0; i < scripts.size(); i++) {
            scripts.get(i).id=i+1
         }
         CywConfig.saveConfig()
         CywConfig.init()
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