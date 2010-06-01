/**
 * Contains constants and loading of common subscripts
 */
(function(){
   var CywCommon = { 
		//Constants
		CHROME_CONTENT_URL: "chrome://customizeyourweb/content/",
		CYW_CHROME_URL: "chrome://customizeyourweb/content/cyw/",
      CYW_JQUERY_URL: "chrome://customizeyourweb/content/jquery/",
      JQUERY_FILE_NAME: "jquery-1.4.1.js",
      JQUERY_UI_FILE_NAME: "jquery-ui-1.7.2.custom.js",
      JQUERY_CSS_SUBPATH: "css/redmond/jquery-ui-1.7.2.custom.css",

		DEBUG_PREF_ID: "customizeyourweb.debug",
		//Id used to store the EditScriptHandler object in the Application storage
		CYW_EDIT_CONTEXT_STORAGE_ID: "CYW_EDIT_CONTEXT_STORAGE_ID",
		GUI_ID: "customizeyourweb@mouseless.de",
		PREF_OBSERVER: "CYW_PREF_OBSERVER",
		VERSION: null,
		
      createLogger: function(){
         var logger = new customizeyourweb.ConsoleLogger("customizeyourweb.logging.level", 5000)
         customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "Log", logger)
      },
      
      getJQueryUrl: function(){
         return this.CYW_JQUERY_URL + this.JQUERY_FILE_NAME 
      },
      
      /*
       * Loads all scripts needed in every context
       */
      init: function(){
			
         try{
   			//Load script loader all the rest
   			var tempScriptLoaderNS = new Object()
            var sm = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].
                        getService(Components.interfaces.mozIJSSubScriptLoader)
            sm.loadSubScript(this.CHROME_CONTENT_URL + "common/script/ScriptLoader.js", tempScriptLoaderNS);
   			var scriptLoader = tempScriptLoaderNS.ScriptLoader
            scriptLoader.loadBaseClasses(this.CHROME_CONTENT_URL + "common", "customizeyourweb")
   			var exclude = ["Shortcutmanager.js"]
   			scriptLoader.loadScripts(this.CHROME_CONTENT_URL+"common/", "customizeyourweb", null, exclude, true)
   			
   			//Load Customize Your Web Scripts
   			scriptLoader.loadScript(this.CYW_CHROME_URL+ "CywEnums.js")
   			scriptLoader.loadScript(this.CYW_CHROME_URL + "common/AbstractContext.js")
   			scriptLoader.loadScript(this.CYW_CHROME_URL + "common/error/ErrorConstants.js")
   			scriptLoader.loadScript(this.CYW_CHROME_URL + "common/error/ScriptErrorHandler.js")
   			scriptLoader.loadScript(this.CYW_CHROME_URL + "common/WhereToInsertEnum.js")
   			scriptLoader.loadScript(this.CYW_CHROME_URL+ "core/CywUtils.js")
   			scriptLoader.loadScript(this.CYW_CHROME_URL+ "core/CywContext.js")
            scriptLoader.loadScripts(this.CYW_CHROME_URL + "actions/", null, null, true)
   			scriptLoader.loadScript(this.CYW_CHROME_URL+ "editing/core/SidebarContext.js")
            
   			// Init version
   			this.VERSION = customizeyourweb.Utils.getExtension(this.GUI_ID).version
            
            //Create common Logger instance
            this.createLogger()
         }catch(e){
            Components.utils.reportError(e.message + " Stack: " + e.stack)
         }
   	}
      
	}
	
	CywCommon.init()
	
	//Bind first as it is used in imports
	
	customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "CywCommon", CywCommon)
})()