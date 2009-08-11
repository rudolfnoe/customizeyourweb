/*
 * Customize Your Web
 * Version 0.1
 * Created by Rudolf Noé
 * 25.09.2008
*/
with(customizeyourweb){
(function(){
   try{
      //Load needed scripts
      ScriptLoader.loadScript(CywCommon.CYW_CHROME_URL + "common/WhereToInsertEnum.js", "customizeyourweb")
      ScriptLoader.loadScripts(CywCommon.CYW_CHROME_URL + "editing/core/", "customizeyourweb", null, ["EditScriptHandler.js"])
      ScriptLoader.loadScripts(CywCommon.CYW_CHROME_URL + "editing/common/", "customizeyourweb", null, 
            ["TargetDefinitionXblHandler.js", "common_edit_dialog_include.js"], true)
      var includeArray = [/.*Command.js/]
      ScriptLoader.loadScripts(CywCommon.CYW_CHROME_URL + "editing/", "customizeyourweb", includeArray, null, true)
      ScriptLoader.loadScript(CywCommon.CYW_CHROME_URL + "editing/core/EditScriptHandler.js", "customizeyourweb")
      ScriptLoader.loadScripts(CywCommon.CYW_CHROME_URL + "core/", "customizeyourweb", null, ["CywInitManager.js"], true)
      ScriptLoader.loadScript(CywCommon.CYW_CHROME_URL + "preferences/CywVersionManager.js", "customizeyourweb")
      ScriptLoader.loadScript(CywCommon.CYW_CHROME_URL + "preferences/ConfigDataConverter.js", "customizeyourweb")
      ScriptLoader.loadScript(CywCommon.CYW_CHROME_URL + "core/CywInitManager.js", "customizeyourweb")
      ScriptLoader.loadScripts(CywCommon.CYW_CHROME_URL + "ui/", "customizeyourweb")
   }catch(e){
      Components.utils.reportError(e.message + " Stack: " + e.stack)
   }

   //Add window event listener for init
	window.addEventListener('load',  {handleEvent: function(event){customizeyourweb.InitManager.init(event)}}, false);
})()
}