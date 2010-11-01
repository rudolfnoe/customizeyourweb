with(customizeyourweb){
(function(){
   var ScriptExporter = {
      /*
       * @param Script script: Script to export on disk
       */
      exportScriptsToDisk: function(scriptsArray){
         if(scriptsArray.length==1){
            var scriptFileName = CywConfig.createScriptFileName(scriptsArray[0])
         }else{
            var scriptFileName = ""
         }
         var saveAsNsIFile = this.getSaveAsFile(scriptFileName)
         if(saveAsNsIFile){
            this.writeFileToDisk(scriptsArray, saveAsNsIFile)
         }
         alert('Script(s) successfully exported.')
      },
      
      getSaveAsFile: function(scriptFileName){
         var nsIFilePicker = Components.interfaces.nsIFilePicker;
         var filePicker = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
         filePicker.init(window, "Save as", nsIFilePicker.modeSave);
         filePicker.appendFilters(nsIFilePicker.filterXML)
         var result = filePicker.show()
         if (result == nsIFilePicker.returnOK || result == nsIFilePicker.returnReplace){
            return filePicker.file;
         }else{
            return null
         }
      },
      
      writeFileToDisk: function(scriptsArray, saveAsNsIFile){
         var scriptsList = new ArrayList(scriptsArray)
         scriptsList.version = CywCommon.getCywVersion()
         var scriptContent = CywConfig.serializeScript(scriptsList, "CywScripts")
         if(!StringUtils.endsWith(saveAsNsIFile.path, ".xml")){
            saveAsNsIFile = FileIO.open(saveAsNsIFile.path+".xml")
         }
         FileIO.write(saveAsNsIFile, scriptContent, null, "UTF-8");
      }
   }

   Namespace.bindToNamespace("customizeyourweb", "ScriptExporter", ScriptExporter)
})()
}