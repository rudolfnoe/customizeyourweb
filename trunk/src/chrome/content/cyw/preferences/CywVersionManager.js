/**
 * Contains Code for migration to version 0.5
 */
(function(){with(customizeyourweb){
	
   var VersionManager = { 
   	VERSION_PREF: "customizeyourweb.version",
   	versionComparator: Components.classes["@mozilla.org/xpcom/version-comparator;1"]
                   .getService(Components.interfaces.nsIVersionComparator),
   	
      versionsToBeMigrated: ["0.5"],
                   
   	hasVersionToBeMigrated: function(){
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
   				CywUtils.logDebugMessage("Successfully migrated to version " + version)
   			}
   		}
   		Prefs.setCharPref(this.VERSION_PREF, Utils.getExtension(CywCommon.GUI_ID).version)
   		//setTimeout(customizeyourweb.VersionManager.showVersionInfoPage, 1000)
   	},
   	
   	showVersionInfoPage: function(){
   		var newTab = Utils.openUrlInNewTab('http://mlb.whatsnew.rudolf-noe.de')
   		newTab.moveBefore(Application.activeWindow.tabs[0])
         newTab.focus();
   	}
   	
   	
   	
   }
   
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "VersionManager", VersionManager)
}})()