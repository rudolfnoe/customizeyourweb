with (customizeyourweb) {
	(function() {
      var WARNING_DIALOG_URL = "chrome://customizeyourweb/content/cyw/preferences/import_warning_dialog.xul"
      
		var ScriptImporter = {
         
         versionComparator: Components.classes["@mozilla.org/xpcom/version-comparator;1"]
                   .getService(Components.interfaces.nsIVersionComparator),
         
         checkVersions: function(xmlDoc){
            var versionElem = XPathUtils.getElement("CywScripts/version", xmlDoc)
            var scriptsCywVersion = versionElem.textContent
            //Deny import if imported version is greater than current version 
            if(this.versionComparator.compare(scriptsCywVersion, CywCommon.getCywVersion())>0){
               var message = 'The imported script not compatible with the current version of Customize Your Web. Please update to the newest version under www.customize-your-web.de'
               alert(message)
               throw new Error(message)
            }
         },
         
         deleteExsistingScripts: function(exsistingScripts){
            for (var i = 0; i < exsistingScripts.length; i++) {
               CywConfig.deleteScript(exsistingScripts[i].getId())
            }
         },
         
         getScriptsContentFromDisk : function() {
				var nsIScriptFile = this.getFileToOpen()
				if (!nsIScriptFile) {
					return
				}
				return FileIO.read(nsIScriptFile)
			},
         
         getExistingScripts: function(importedScripts){
            var existingScripts = []
            for (var i = 0; i < importedScripts.length; i++) {
               var importedScript = importedScripts[i]
               var existingScript = CywConfig.getScriptByGuiId(importedScript.getGuiId())
               if(existingScript){
                  existingScripts.push(existingScript)
               }
            }
            return existingScripts
         },

			getFileToOpen : function() {
				var nsIFilePicker = Components.interfaces.nsIFilePicker;
				var filePicker = Components.classes["@mozilla.org/filepicker;1"]
						.createInstance(nsIFilePicker);
				filePicker
						.init(window, "Import Script", nsIFilePicker.modeOpen);
				filePicker.appendFilters(nsIFilePicker.filterXML)
				var result = filePicker.show()
				if (result == nsIFilePicker.returnOK || result) {
					return filePicker.file;
				} else {
					return null
				}
			},
         
         importScripts: function(scriptsContent){
            var xmlDoc = XMLUtils.parseFromString(scriptsContent) 
            this.checkVersions(xmlDoc)
            var confirmed = this.isConfirmedImport(scriptsContent)
            if(!confirmed){
               return
            }
            var importedScripts = this.parseScript(scriptsContent)
            
            var existingScripts = this.getExistingScripts(importedScripts)
            if(existingScripts.length>0){
               var confirmedOverwrite = this.isConfirmedOverwrite(existingScripts.length)
               if(!confirmedOverwrite){
                  return
               }else{
                  this.deleteExsistingScripts(existingScripts)
               }
            }
            this.saveImportedScripts(importedScripts)
            alert('Scripts successfully imported.')
            return importedScripts
         },
         
         /*
          * For the format of the imported Script see ScriptExporter
          */
         importScriptsFromDisk: function(){
            var scriptsContent = this.getScriptsContentFromDisk()
            if(!scriptsContent){//Import was aborted
               return
            }
            return this.importScripts(scriptsContent)
         },         

         isConfirmedImport: function(scriptsContent){
            var warningDialog = new Dialog(WARNING_DIALOG_URL, "warningDialog", true, window, null, {scriptsContent: scriptsContent})
            warningDialog.show()
            return warningDialog.isCancel()?false:true
         },

         isConfirmedOverwrite: function(existingScriptsCount){
            var result = PromptService.confirmYesNo(window, "Overwrite Scripts?", "The imported file contains " + existingScriptsCount + " script(s) which already exist. Should these scripts be overridden?")
            return result == PromptReply.YES?true:false
         },
			
         /*
          * Returns array of Scripts
          */
			parseScript : function(scriptsContent) {
            try{
				   var scripts = CywConfig.parseScript(scriptsContent)
               var result = null
               //Also single Script import is possible
               if(ObjectUtils.instanceOf(scripts, Script)){
                  result = new Array(scripts)
               }else if (ObjectUtils.instanceOf(scripts, ArrayList)){
                  result = scripts.toArray()
               }else{
                  throw new Error('Wrong script file format.')
               }
            }catch(e){
               var message = "Scripts could not be imported due to parsing errors."
               CywUtils.logError(e, message)
               alert(message)
               throw new Error(message)
            }
            return result
			},
         
         saveImportedScripts: function(importedScripts){
            for (var i = 0; i < importedScripts.length; i++) {
               var importedScript = importedScripts[i] 
               importedScript.setId(CywConfig.getNextScriptId())
               CywConfig.saveScript(importedScript)
            }
         }
         
		}

		Namespace.bindToNamespace("customizeyourweb", "ScriptImporter",
				ScriptImporter)
	})()
}