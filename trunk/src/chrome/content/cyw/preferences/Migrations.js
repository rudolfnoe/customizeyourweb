with(customizeyourweb){
(function(){
   var Migrations = {
      backupExistingScriptFiles: function(backupDirName){
         var scriptDir = CywConfig.getConfigDir()
         scriptDir.append(backupDirName)
         var i = 1
         while(scriptDir.exists()){
            scriptDir = CywConfig.getConfigDir()
            scriptDir.append(backupDirName + "_v" + i++)
         }
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
      },
      
      /*
       * Converts the field name whereToInsert to position
       */
      convertScriptStructureForV0_5: function(){
         this.backupExistingScriptFiles("backup_for_mig_to_0_5")
         this.iterateAllActions(function(action){
            if(action.whereToInsert){
               action.setPosition(action.whereToInsert)
               delete action.whereToInsert
               return true
            }
         }, InsertHTMLAction)
         this.iterateAllActions(function(action){
            if(action.listItemsTagName){
               action.setListItemsJQuery(action.listItemsTagName)
               delete action.listItemsTagName
               return true
            }
         }, ListViewAction)
      },
      
      /*
       * Iterates all scripts with all actions.
       * @param Function funcPtr: pointer to callback function which will be called for every action. Signature callbackFunct(action, script)
       *                         If the callback function returns true the script will be persisted
       * @param Constructor Function filter: Constructors function which acts as a filter, only for the action provided in the 
       *                               filter the callback function will be called
       */
      iterateAllActions: function(funcPtr, filter){
         Assert.isTrue(typeof funcPtr == "function")
         var scripts = CywConfig.getScriptsAsArray()
         for (var i = 0; i < scripts.length; i++) {
            var persist = false
            var script = scripts[i]
            var scriptIterator = new ActionIterator(script.getActions())
            while(scriptIterator.hasNext()){
               var action = scriptIterator.next()
               if(filter && !(action instanceof filter)){
                  continue
               }
               if(funcPtr(action, script)===true){
                  persist = true   
               }
            }
            if(persist){
               CywConfig.saveScript(script)
            }
         }
      }
      
   }

   Namespace.bindToNamespace("customizeyourweb", "Migrations", Migrations)
})()
}