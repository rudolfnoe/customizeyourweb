/*
 * Customize Your Web
 * Version 0.1
 * Created by Rudolf Noe
 * 25.09.2008
*/
(function(){
   const NS = "customizeyourweb"
   var CywOverlay = {
      init: function(){
         try{
            window.customizeyourweb = new Object()
            with(customizeyourweb){
               //Load Script Loader
               var sm = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].
                           getService(Components.interfaces.mozIJSSubScriptLoader)
               sm.loadSubScript("chrome://customizeyourweb/content/common/script/ScriptLoader.js", customizeyourweb);
               
               //Load CywCommon which loads all common classes
               ScriptLoader.loadScript("chrome://customizeyourweb/content/cyw/CywCommon.js", NS)         
      
               //Load scripts for main window
               ScriptLoader.loadScript(CywCommon.CYW_CHROME_URL + "common/WhereToInsertEnum.js", NS)
               ScriptLoader.loadScripts(CywCommon.CYW_CHROME_URL + "editing/core/", NS, null, ["EditScriptHandler.js"])
               var excludeArr = ["TargetDefinitionXblHandler.js", "common_edit_dialog_include.js"] 
               ScriptLoader.loadScripts(CywCommon.CYW_CHROME_URL + "editing/common/", NS, null, 
                     excludeArr, true)
               var includeArr = [/.*Command.js/]
               ScriptLoader.loadScripts(CywCommon.CYW_CHROME_URL + "editing/", NS, includeArr, null, true)
               ScriptLoader.loadScript(CywCommon.CYW_CHROME_URL + "editing/core/EditScriptHandler.js", NS)
               ScriptLoader.loadScript(CywCommon.CYW_CHROME_URL + "editing/remove/RemovedElement.js", NS)
               ScriptLoader.loadScripts(CywCommon.CYW_CHROME_URL + "core/", NS, null, ["CywInitManager.js"], true)
               ScriptLoader.loadScript(CywCommon.CYW_CHROME_URL + "preferences/CywVersionManager.js", NS)
               ScriptLoader.loadScript(CywCommon.CYW_CHROME_URL + "preferences/ConfigDataConverter.js", NS)
               ScriptLoader.loadScript(CywCommon.CYW_CHROME_URL + "preferences/ScriptMigrator.js", NS)
               ScriptLoader.loadScript(CywCommon.CYW_CHROME_URL + "preferences/ScriptExporter.js", NS)
               ScriptLoader.loadScript(CywCommon.CYW_CHROME_URL + "preferences/ScriptImporter.js", NS)
               ScriptLoader.loadScript(CywCommon.CYW_CHROME_URL + "preferences/WebInstaller.js", NS)
               ScriptLoader.loadScript(CywCommon.CYW_CHROME_URL + "preferences/WebInstallListener.js", NS)
               ScriptLoader.loadScript(CywCommon.CYW_CHROME_URL + "core/CywInitManager.js", NS)
               ScriptLoader.loadScripts(CywCommon.CYW_CHROME_URL + "ui/", NS)
               
               //Load JQuery
               var jQueryLoader = new JQueryLoader(CywCommon.CYW_JQUERY_URL)
               jQueryLoader.loadJQuery(CywCommon.JQUERY_FILE_NAME, customizeyourweb)
               
               //Init CYW
               InitManager.init()
            }
   
         }catch(e){
            Components.utils.reportError(e.message + " Stack: " + e.stack)
         }
      }
   }
   
   //Add window event listener for init
	window.addEventListener('load',  {handleEvent: function(event){
      setTimeout(function(){CywOverlay.init()})
   }}, false);
})()
