/*
 * customizeyourweb
 * Version 0.1
 * Created by Rudolf Noe
 * 25.09.2008
 */

with(customizeyourweb){
(function(){
   
   const PREF_KEY_NOT_FOUND = "PREF_KEY_NOT_FOUND";
   const FILENAME_INCOMPATIBLE_CHARS_REGEXP = /[^a-z0-9]{1,}/ig;
   
   var CywConfig = {
      //Flag indicating wether performance log is activated
      perfLogActive: false,
      scripts: new ArrayList(),
      
      
      cloneScript: function(script){
         return ObjectUtils.deepClone(script)
      },
      
      completePrefKey: function(key){
         if(key.indexOf("customizeyourweb.")!=0)
            key = "customizeyourweb." + key
         return key
      },
      
      createScriptFileName: function(script){
         var fileName = this.createScriptPrefix(script)
         if(!StringUtils.isEmpty(script.getName())){
            fileName += "_" + script.getName()
         }
         var includePatternStrings = script.getIncludeUrlPatternStrings()
         if(includePatternStrings.length>0){
            fileName +=   "_" + includePatternStrings[0]
         }
         fileName = fileName.replace(FILENAME_INCOMPATIBLE_CHARS_REGEXP, "_")
         if(fileName.length>60){
            fileName = fileName.substring(0, 60)
         }
         fileName += ".xml"
         return fileName
      },
      
      createScriptPrefix: function(script){
         return "Script_" + script.getId()
      },

      deleteScriptFromDisk: function(script){
         var fileName = script.getFileName()
         var scriptFile = this.getConfigDir()
         scriptFile.append(fileName);
         if(scriptFile && scriptFile.exists()){
            FileIO.remove(scriptFile);
            CywUtils.logDebug("Script " + fileName + " has been deleted.")
         }else if(script.isPersisted()){
            throw new Error('Deletion of Script File "' + fileName + '" failed.')
         }
            
      },

      deleteScript: function(scriptId){
      	var found=false
         for (var i = 0; i < this.scripts.size(); i++) {
            var script = this.scripts.get(i)
         	if(script.getId()==scriptId){
         		this.scripts.removeAtIndex(i)
               this.deleteScriptFromDisk(script)
         		found = true
         		break;
         	}
         }	
      	if(!found)
      	   throw new Error('Script with provided id not existent')
      	
      },
      
      parseScript: function(scriptContent){
         return JSerial.deserialize(scriptContent) 
      },
      
      init: function (){
          try{
             this.readConfig()
          }catch(e){
             alert(e)
             throw e
          }
          this.initPerfLogActive()
      },
      
      isAutoUpdateOnSave: function(){
         return this.getPref("autoUpatePageOnSave") 
      },
      
      isPerfLogActive: function(){
         return this.perfLogActive 
      },
      
      getConfigDir: function() {
         var configDir = DirIO.getProfileDir()
         configDir.append("customizeyourweb_config")
         if(!configDir.exists()){
            DirIO.create(configDir)
         }
         return configDir
      },
      
      getConfigFile: function(){
         var configFile = this.getConfigDir()
         configFile.append("customizeyourweb_config.xml")
         if(!configFile.exists()){
            FileIO.create(configFile)
         }
         return configFile;
      },
      
      getPref: function(key){
         var key = this.completePrefKey(key)
         Assert.isTrue(Application.prefs.has(key), 'Pref value for key "' + key + '" not found.') 
         return Application.prefs.getValue(key, null)
      },
      
      getScriptFiles: function(){
         var scriptFiles = []
         var allFiles = DirIO.read(this.getConfigDir(), false)
         for (var i = 0; i < allFiles.length; i++) {
            var file = allFiles[i]
            var fileName = file.leafName            
            if(StringUtils.endsWith(fileName, ".xml") && 
               fileName != "customizeyourweb_config.xml"){
                  scriptFiles.push(file)
            }
         }
         return scriptFiles
      },
      
      getScripts: function(){
         return this.scripts
      },
      
      getScriptsAsArray: function(){
         return this.scripts.toArray()
      },
      
      /* 
       * Return arraylist of scripts matching the provied url
       */
      getActiveScriptsForUrl: function(url){
         var scripts = this.getScripts()
         var result = new Array()
         for (var i = 0; i < scripts.size(); i++) {
            var script = scripts.get(i)
            if(script.matchUrl(url) && !script.isDisabled()){
               result.push(this.cloneScript(script))
            }
         }
         return result
      },
      
      getNextScriptId: function(){
         var nextScriptId = 0
         for (var i = 0; i < this.scripts.size(); i++) {
            var script = this.scripts.get(i)
            if(script.getId() > nextScriptId){
               nextScriptId = script.getId() 
            }
         }
         return nextScriptId + 1
      },
      
      //Checks wether script with given guiId already exists
      getScriptByGuiId: function(guiId){
         for (var i = 0; i < this.scripts.size(); i++) {
            var script = this.scripts.get(i)
            if(script.getGuiId()==guiId){
               return script
            }
         }
         return null
      },
      
      //Return script by id
      getScriptById: function(scriptId){
         for (var i = 0; i < this.scripts.size(); i++) {
            var script = this.scripts.get(i)
            if(script.getId()==scriptId){
               return script
            }
         }
         return null
      },
      
      /*Returns array of cloned scripts which "matches" at least one url of 
       * the target win and it frames. Matches includes both matching the URL pattern or having the same domain
       */
      getScriptsForEditing: function(targetWin){
         //assemble all urls
         var urls = []
         DomUtils.iterateWindows(targetWin, function(subWin){urls.push(subWin.location.href)})
         
         var matchingScripts = new Set()
         var containsCompareFct = function(objSearched, elementFromList){
            return objSearched.getId() == elementFromList.getId();
         }
         for (var scriptIndex = 0; scriptIndex < this.scripts.size(); scriptIndex++) {
            for (var urlIndex = 0; urlIndex < urls.length; urlIndex++) {
               var script = this.scripts.get(scriptIndex)
                
               if((script.matchUrl(urls[urlIndex]) || script.matchDomain(urls[urlIndex]))&&
                  //checking in condition only to avoid unneccessary cloning of scripts
                  !matchingScripts.contains(script, containsCompareFct)){   
                  matchingScripts.add(this.cloneScript(script)) 
               }
            }
         }
         return matchingScripts
      },
      
      readConfig: function(){
         this.scripts = new ArrayList()
         var scriptFiles = this.getScriptFiles()
         var scriptsLoaded = 0
         for (var i = 0; i < scriptFiles.length; i++) {
            var scriptFile = scriptFiles[i]
            var scriptContent =  FileIO.read(scriptFile, "UTF-8")
            try{
               var script = this.parseScript(scriptContent)
            }catch(e){
               CywUtils.logError(e, "Script could not be loaded due to parsing errors: " + scriptFile.path)
            }
            script.updateUrlPatternRegExp()
            script.setFileName(scriptFile.leafName)
            
            this.scripts.add(script);
            scriptsLoaded++
         }
         CywUtils.logDebug("CYW: " + scriptsLoaded + " Scripts loaded successfully")
         
      },
      
      saveScript: function(aScript){
         Assert.notNull(aScript)
         try{
            aScript.updateUrlPatternRegExp()
            var newScript = true
            for (var i = 0; i < this.scripts.size(); i++) {
               var script = this.scripts.get(i)
               if(script.equals(aScript)){
                  this.scripts.set(i, aScript);
                  newScript = false
               }
            }
            if(newScript){
               this.scripts.add(aScript)
            }else{
               this.deleteScriptFromDisk(aScript)
            }
            aScript.setLastEdited((new Date()).getTime())
            aScript.setPersisted(true)
            //Set script file name
            var scriptFileName = this.createScriptFileName(aScript)
            aScript.setFileName(scriptFileName)
            aScript.setVersion(CywCommon.getCywVersion())
            
            //Create and write context
            var scriptContent = this.serializeScript(aScript, "Script")
            //Add xml processing for encoding
            this.writeScript(scriptFileName, scriptContent)
         }catch(e){
            CywUtils.logError(e, "Error on saving script", true)
            throw e
         }
      },
      
      /*
       * Save all provided scripts
       * @param Array[Script] scriptArr
       */
      saveScripts: function(scriptArr){
         for (var i = 0; i < scriptArr.length; i++) {
            this.saveScript(scriptArr[i])
         }   
      },
      
      serializeScript: function(script, rootTag){
         Assert.paramsNotNull(arguments)
         return  '<?xml version="1.0" encoding="UTF-8"?>\n' + 
                  JSerial.serialize(script, rootTag, "  ", true, "t_")
      },
      
      setPref: function(key, value){
         var key = this.completePrefKey(key)
         Application.prefs.setValue(key, value)
         return value
      },
      
      initPerfLogActive: function(){
         this.perfLogActive =  this.getPref("logging.performance")
      },
      
      /*
       * Updates only one specific action and saves the changes to disk
       * @param scriptId
       * @param actionId
       * @param changedPropertiesMap: Object containing the properties of the changed action
       */
      updateAction: function(scriptId, actionId, changedPropertiesMap){
         Assert.paramsNotNull(arguments)
         var script = this.getScriptById(scriptId)
         if(!script){
            throw new Error('Unkown script Id')
         }
         var action = script.getActionById(actionId)
         for(var prop in changedPropertiesMap){
            PresentationMapper.setPropertyInModel(action, prop, changedPropertiesMap[prop])
         }
         this.saveScript(script)
      },

      writeScript: function(fileName, scriptXML){
         var scriptFile = this.getConfigDir()
         scriptFile.append(fileName)
         FileIO.create(scriptFile)
         FileIO.write(scriptFile, scriptXML, null, "UTF-8");
         CywUtils.logDebug("Script " + fileName + " is written to disk.");
      }

      
   };
   
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "CywConfig", CywConfig)
   
})()
}
