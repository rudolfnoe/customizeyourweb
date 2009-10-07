/*
 * customizeyourweb
 * Version 0.1
 * Created by Rudolf Noé
 * 25.09.2008
 */

with(customizeyourweb){
(function(){
   
   const PREF_KEY_NOT_FOUND = "PREF_KEY_NOT_FOUND";
   const FILENAME_INCOMPATIBLE_CHARS_REGEXP = /[^a-z0-9]{1,}/ig
   
   var CywConfig = {
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
            fileName +=   "_" + includePatternStrings[0].replace(FILENAME_INCOMPATIBLE_CHARS_REGEXP, "_")
         }
         if(fileName.length>250){
            fileName = fileName.substring(0, 250)
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
         scriptFile.append(fileName)
         if(scriptFile && scriptFile.exists()){
            FileIO.remove(scriptFile)
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
      },
      
      isAutoUpdateOnSave: function(){
         return this.getPref("autoUpatePageOnSave") 
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
         //TODO think about wether this is senseful
         var value = Application.prefs.getValue(key, PREF_KEY_NOT_FOUND)
         if(value==PREF_KEY_NOT_FOUND){
            throw new Error('Pref value for key "' + key + '" not found')
         }
         return value
      },
      
      getScriptFiles: function(){
         return DirIO.read(this.getConfigDir(), false)
      },
      
      getScripts: function(){
         return this.scripts
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
      
      /*Returns array of cloned scripts which "matches" at least one url of 
       * the target win and it frames. Matches includes both matching the URL pattern or having the same domain
       */
      getScriptsForEditing: function(targetWin){
         //assemble all urls
         var urls = []
         DomUtils.iterateWindows(targetWin, function(subWin){urls.push(subWin.location.href)})
         
         var matchingScripts = new Set()
         var containsCompareFct = function(objSearched, elementFromList){
            return objSearched.getId() == elementFromList.getId()
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
            var fileName = scriptFile.leafName
            if(!StringUtils.endsWith(fileName, ".xml") || 
               fileName == "customizeyourweb_config.xml"){
                  continue
            }
            var scriptContent =  FileIO.read(scriptFile)
            try{
               var script = this.parseScript(scriptContent)
            }catch(e){
               CywUtils.logError(e, "Script could not be loaded due to parsing errors: " + scriptFile.path)
            }
            script.updateUrlPatternRegExp()
            script.setFileName(fileName)
            
            this.scripts.add(script)
            scriptsLoaded++
         }
         CywUtils.logDebug("CYW: " + scriptsLoaded + " Scripts loaded successfully")
         
      },
      
      saveScript: function(aScript){
         if(aScript==null)
            throw new Error("Nullpointer: aScript is null")
         aScript.updateUrlPatternRegExp()
         var newScript = true
         for (var i = 0; i < this.scripts.size(); i++) {
            var script = this.scripts.get(i)
            if(script.equals(aScript)){
               this.scripts.set(i, aScript)
               newScript = false
            }
         }
         if(newScript){
            this.scripts.add(aScript)
         }else{
            this.deleteScriptFromDisk(aScript)
         }
         
         aScript.setPersisted(true)
         //Set script file name
         var scriptFileName = this.createScriptFileName(aScript)
         aScript.setFileName(scriptFileName)
         aScript.setVersion(CywUtils.getCywVersion())
         
         //Create and write context
         var scriptContent = this.serializeScript(aScript, "Script")
         this.writeScript(scriptFileName, scriptContent)
      },
      
      serializeScript: function(script, rootTag){
         Assert.paramsNotNull(arguments)
         return JSerial.serialize(script, rootTag, "  ", true, "t_")
      },
      
      setPref: function(key, value){
         var key = this.completePrefKey(key)
         Application.prefs.setValue(key, value)
         return value
      },

      writeScript: function(fileName, scriptXML){
         var scriptFile = this.getConfigDir()
         scriptFile.append(fileName)
         FileIO.create(scriptFile)
         FileIO.write(scriptFile, scriptXML);
         CywUtils.logDebug("Script " + fileName + " is written to disk.")
      }

      
   } 
   
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "CywConfig", CywConfig)
   
})()
}
