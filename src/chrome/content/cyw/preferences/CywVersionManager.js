/**
 * Contains Code for migration to newer version
 */
 with(customizeyourweb){
(function(){
   
   //Restriction on Windows, only 250 because it is counted without extension
   const MAX_FILE_PATH_LENGTH = 250;

   var CywVersionManager = { 
      VERSION_PREF: "customizeyourweb.version",
      versionComparator: Components.classes["@mozilla.org/xpcom/version-comparator;1"]
                   .getService(Components.interfaces.nsIVersionComparator),
      
      versionsToBeMigrated: ["0.2Build20090808", "0.3Build20091007", "0.4.1.3Build20091220", "0.5Build20100228"],
                   
      addonHasToBeMigrated: function(){
         var newInstalledVersion = CywCommon.getCywVersion()
         var currentVersion = Prefs.getCharPref(this.VERSION_PREF)
         if(this.versionComparator.compare(newInstalledVersion, currentVersion)>0 &&
            !this.isFirstStartupAfterInstallation()){
            return true
         }else{
            return false
         }
      },

      /*
       * Backups existing script files before migration in subdirectory 
       */
      backupExistingScriptFiles: function(backupDirName){
         var scriptDir = CywConfig.getConfigDir()
         scriptDir.append(backupDirName)
         var i = 1
         while(scriptDir.exists()){
            scriptDir = CywConfig.getConfigDir()
            scriptDir.append(backupDirName + "_v" + i++)
         }
         DirIO.create(scriptDir)
         var backupDirPathLength = scriptDir.path.length 
         var scriptFiles = CywConfig.getScriptFiles()
         for (var i = 0; i < scriptFiles.length; i++) {
            var scriptFile = scriptFiles[i]
            //Check for too long names which causes errors on backup on windows
            var leafNameLength = scriptFile.leafName.length
            var tooLong = backupDirPathLength + leafNameLength - MAX_FILE_PATH_LENGTH
            var leafName = scriptFile.leafName
            if(tooLong > 0){
               leafName = leafName.substring(0, leafNameLength-tooLong) + ".xml"
            }
            scriptFile.copyTo(scriptDir, leafName)
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
               CywUtils.logInfo("Successfully migrated to version " + versionToBeMigrated)
            }
         }
         this.doCommonMigration()
      },
      
      getVersionsToBeMigrated: function(){
         return this.versionsToBeMigrated;
      },
      
      isFirstStartupAfterInstallation: function(){
         return Prefs.getCharPref(this.VERSION_PREF).length==0   
      },
      
      /*
       * Convert to seperate script config files 
       */
      migrateToVersion_0_2Build20090808: function(){
         ConfigDataConverter.convertToSeperateConfigFiles()   
      },
      
      /*
       * 1. Write version id to script files
       * 2. Delete persistent Script.fileName Member (is transient)
       */
      migrateToVersion_0_3Build20091007: function(){
         this.backupExistingScriptFiles("backup_for_mig_to_0_3Build20091007")
         var modifiedScripts = ScriptMigrator.migrateToVersion_0_3Build20091007(CywConfig.getScriptsAsArray())
         CywConfig.saveScripts(modifiedScripts)
      },
      
      /*
       * Convert script files to UTF-8 
       */
      migrateToVersion_0_4_1_3Build20091220: function(){
         this.backupExistingScriptFiles("backup_for_mig_to_0_4_1_3Build20091220")
         var scriptFiles = CywConfig.getScriptFiles()
         for (var i = 0; i < scriptFiles.length; i++) {
            var scriptFile = scriptFiles[i]
            var scriptContent = FileIO.read(scriptFile)
            var xmlProcInstruction = '<?xml version="1.0" encoding="UTF-8"?>'
            if(!StringUtils.startsWith(scriptContent, xmlProcInstruction)){
               scriptContent = xmlProcInstruction + '\n' + scriptContent
            }
            FileIO.write(scriptFile, scriptContent, null, "UTF-8");
         }
      },
      
      /*
       * @see ScriptMigrator migrateToVersion_0_5Build20100228
       */
      migrateToVersion_0_5Build20100228: function(){
         this.backupExistingScriptFiles("backup_for_mig_to_0_5Build20100228")
         var modifiedScripts = ScriptMigrator.migrateToVersion_0_5Build20100228(CywConfig.getScriptsAsArray())
         CywConfig.saveScripts(modifiedScripts)
      },
      
      setUp: function(){
         this.doCommonMigration()      
      },
      
      setVersionPref: function(){
         Prefs.setCharPref(this.VERSION_PREF, CywCommon.getCywVersion())
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