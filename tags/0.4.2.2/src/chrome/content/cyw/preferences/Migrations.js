with(customizeyourweb){
(function(){
   var Migrations = {
      backupExistingScriptFiles: function(backupDirName){
         var scriptDir = CywConfig.getConfigDir()
         scriptDir.append(backupDirName)
         DirIO.create(scriptDir)
         var scriptFiles = CywConfig.getScriptFiles()
         for (var i = 0; i < scriptFiles.length; i++) {
            var scriptFile = scriptFiles[i]
            scriptFile.copyTo(scriptDir, scriptFile.leafName)
         }
      },
      
      convertScriptsConfgToUTF8: function(){
         this.backupExistingScriptFiles("backup_for_mig_to_0_4_1_3")
         var scriptFiles = CywConfig.getScriptFiles()
         for (var i = 0; i < scriptFiles.length; i++) {
            var scriptFile = scriptFiles[i]
            var scriptContent = FileIO.read(scriptFile)
            scriptContent = '<?xml version="1.0" encoding="UTF-8"?>\n' + scriptContent
            FileIO.write(scriptFile, scriptContent, null, "UTF-8");
         }
      }
   }

   Namespace.bindToNamespace("customizeyourweb", "Migrations", Migrations)
})()
}