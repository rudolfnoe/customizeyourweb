with(customizeyourweb){
(function(){
   /*
    * Migrates old versions of scripts to the current version
    */
   var ScriptMigrator = {
      /*
       * Migrates scripts to the current version
       * @param Array scripts: Array of scripts to be migrated
       * @param String srcVersion: Version of the scripts to be migrated, 
       * @return void: Incoming scripts array is unchanged
       */
      migrateToCurrentVersion: function(scripts, srcVersion){
         Assert.paramsNotNull(arguments)
         var migratedToVersions = CywVersionManager.getVersionsToBeMigrated()
         var vc = ServiceRegistry.getVersionComparator()
         for (var i = 0; i < migratedToVersions.length; i++) {
            var migratedToVersion = migratedToVersions[i]
            if(vc.compare(migratedToVersion, srcVersion)>0){
               var migrationFunctionName = "migrateToVersion_" + migratedToVersion.replace(/\./g,"_")
               if(this[migrationFunctionName]){
                  this[migrationFunctionName](scripts)
                  CywUtils.logInfo("Scripts successfully migrated to version " + migratedToVersion)
               }
            }
         }
      },
      
      migrateToVersion_0_3Build20091007: function(scripts){
         for (var i = 0;i < scripts.length; i++) {
            scripts[i].fileName = null
         }
         return scripts
      },
      
      migrateToVersion_0_5Build20100228: function(scripts){
         //Change whereToInsert member into position
         var modifiedScripts = new Set(this.convertScripts(scripts, function(action){
            if(action.whereToInsert){
               action.setPosition(action.whereToInsert)
               delete action.whereToInsert
               return true
            }
         }, InsertHTMLAction))
         
         //Change listItemsTagName member into listItemsJQuery 
         modifiedScripts.addAll(this.convertScripts(scripts, function(action){
            if(action.listItemsTagName){
               action.setListItemsJQuery(action.listItemsTagName)
               delete action.listItemsTagName
               return true
            }
         }, ListViewAction))
         
         return modifiedScripts.toArray()
      },
      
      /*
       * Iterates scripts with all actions.
       * @param Array[Script] scripts: Array of scripts to be converted
       * @param Function funcPtr: pointer to callback function which will be called for every action. Signature callbackFunct(action, script)
       *                         If the callback function returns true the script will be persisted
       * @param Constructor Function filter: Constructors function which acts as a filter, only for the action provided in the 
       *                               filter the callback function will be called
       * @return Array[Scrtipt): Array of modified scripts
       */
      convertScripts: function(scripts, funcPtr, filter){
         Assert.paramsNotNull(arguments)
         Assert.isTrue(typeof funcPtr == "function")
         var modifiedScripts = []
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
                  modifiedScripts.push(script)   
               }
            }
         }
         return modifiedScripts
      }
      
   }

   Namespace.bindToNamespace("customizeyourweb", "ScriptMigrator", ScriptMigrator)
})()
}