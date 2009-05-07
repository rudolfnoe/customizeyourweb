/*
 * customizeyourweb
 * Version 0.1
 * Created by Rudolf Noé
 * 25.09.2008
 */

with(customizeyourweb){
(function(){
   
   const PREF_KEY_NOT_FOUND = "PREF_KEY_NOT_FOUND";
   
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

      deleteScript: function(scriptId){
      	var found=false
         for (var i = 0; i < this.scripts.size(); i++) {
         	if(this.scripts.get(i).getId()==scriptId){
         		this.scripts.removeAtIndex(i)
         		found = true
         		break;
         	}
         }	
      	if(!found)
      	   throw new Error('Script with provided id not existent')
      	this.saveConfig()
      },
      
      init: function (){
          try{
             this.readEgConfig()
             this.updateUrlPatternRegEx()
          }catch(e){
             alert(e)
             throw e
          }
      },
      
      isAutoUpdateOnSave: function(){
         return this.getPref("autoUpatePageOnSave") 
      },
      
      getConfigFile: function(){
         var configFile = DirIO.getProfileDir()
         configFile.append("customizeyourweb_config")
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
      
      /*Returns array of cloned scripts which matches at least one url of 
       * the target win and it frames
       */
      getScriptsForTargetWin: function(targetWin){
         //assemble all urls
         var urls = new Array()
         DomUtils.iterateWindows(targetWin, function(subWin){urls.push(subWin.location.href)})
         
         var matchingScripts = new ArrayList()
         var containsCompareFct = function(objSearched, elementFromList){
            return objSearched.getId() == elementFromList.getId()
         }
         for (var scriptIndex = 0; scriptIndex < this.scripts.size(); scriptIndex++) {
            for (var urlIndex = 0; urlIndex < urls.length; urlIndex++) {
               var script = this.scripts.get(scriptIndex)
               if(script.matchUrl(urls[urlIndex]) && !matchingScripts.contains(script, containsCompareFct)){
                  matchingScripts.add(this.cloneScript(script))
               }
            }
         }
         return matchingScripts
      },
      
      readEgConfig: function(){
         var configFile = this.getConfigFile();
         var configContent =  FileIO.read(configFile)
         if(configContent.length==0)
            return
         this.scripts = JSerial.deserialize(configContent)
      },
      
      saveScript: function(aScript){
         if(aScript==null)
            throw new Error("Nullpointer: aScript is null")
         var newScript = true
         for (var i = 0; i < this.scripts.size(); i++) {
            var script = this.scripts.get(i)
            if(script.equals(aScript)){
               this.scripts.set(i, aScript)
               newScript = false
            }
         }
         if(newScript)
            this.scripts.add(aScript)
         this.saveConfig()
      },
      
      saveConfig: function(){
         for (var i = 0; i < this.scripts.size(); i++) {
            this.scripts.get(i).setPersisted(true)
         }
         var configFile = this.getConfigFile();
         var configContent = JSerial.serialize(this.scripts, "Scripts", "  ", true, "t_")
         FileIO.write(configFile, configContent);
      },
      
      setPref: function(key, value){
         var key = this.completePrefKey(key)
         Application.prefs.setValue(key, value)
         return value
      },

      setScripts: function(scripts){
         this.scripts = scripts
      },
      
      updateUrlPatternRegEx: function(){
         for (var i = 0; i < this.scripts.size(); i++) {
            this.scripts.get(i).updateUrlPatternRegExp()
         }
      }
      
   } 
   
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "CywConfig", CywConfig)
   
})()
}
