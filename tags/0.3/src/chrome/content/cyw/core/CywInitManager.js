/*
 * customizeyourweb
 * Version 0.1
 * Created by Rudolf Noé
 * 25.09.2008
 */

with(customizeyourweb){
(function(){
	
   var initPageHandler = {handleEvent: function(event){PageEventHandler.initPage(event)}}
   
	var InitManager = {
		eventHandlersActive: false,
		intializedOnceDone: false,
      prefObserver: null,
		shortcutManager: new ShortcutManager(window, "keydown", true),
      
      assureAIOSCompatibility: function(){
         if(!Application.prefs.has("extensions.aios.collapse")){
            return
         }
         var sidebarCollapses = Application.prefs.getValue("extensions.aios.collapse", true)
         if(sidebarCollapses){
            Application.prefs.setValue("extensions.aios.collapse", false)
            setTimeout(function(){
               alert('The All-in-One Sidebar feature "Sidebar Collapsing" got disabled\n' +
                     'to ensure compatibility with Customize Your Web.\n' +
                     'Firefox will be restarted to load the new settings.')
               var appStartup = Components.classes["@mozilla.org/toolkit/app-startup;1"]
								.getService(Components.interfaces.nsIAppStartup);
					appStartup.quit(appStartup.eAttemptQuit | appStartup.eRestart);
               
            })
         }
      },
      
      disableAll: function(){
         this.initEventHandlers("removeEventListener")
         this.eventHandlersActive = false
         this.shortcutManager.clearAllShortcuts()
         this.getDisableCustomizeYourWebCommand().setAttribute("checked", "true")
      },
      
      enableAll: function(){
		   if(!this.eventHandlersActive){
            this.initEventHandlers("addEventListener")
            this.eventHandlersActive = true
         }
         this.getDisableCustomizeYourWebCommand().setAttribute("checked", "false")
			this.initShortCuts()
      },
      
      getDisableCustomizeYourWebCommand: function(){
         return document.getElementById('customizeyourweb_disableCustomizeYourWeb')
      },
		
		init: function(event){
         //Load configuration first
			CywConfig.init()
         this.intializedOnce()
         this.disableAll()
         var disabled = Prefs.getBoolPref("customizeyourweb.disabled")
         if(!disabled){
            this.enableAll()
         }
         this.initPermantentShortCuts()
         this.initUI()
         StatusbarManager.init()
		},
      
      initUI: function(){
         var hideToolsMenu = CywConfig.getPref("ui.hideToolsMenu")
         var toolsMenuitem = document.getElementById('customizeyourweb_tools_menu') 
         if(hideToolsMenu){
            toolsMenuitem.style.display = "none"
         }else{
            toolsMenuitem.style.display = "block"
         }
      },
      
      intializedOnce: function(){
			if(!this.intializedOnceDone){
   		   this.registerObservers()
            this.assureAIOSCompatibility()
            if(CywVersionManager.isFirstStartupAfterInstallation()){
               CywVersionManager.setUp()
            }else if(CywVersionManager.addonHasToBeMigrated()){
               CywVersionManager.doMigration()
            }
   		   this.intializedOnceDone = true
			}
      },
		
		registerObservers: function(){
			//Add preferences-observer
	      this.prefObserver = Utils.createObserverForInterface(InitManager)
	      Utils.registerObserver(CywCommon.PREF_OBSERVER, this.prefObserver)
		},
		
		initEventHandlers: function(addOrRemoveListenerFunction){
         var tabbrowser = document.getElementById("content"); // tabbrowser
         
         //load event listener
         tabbrowser[addOrRemoveListenerFunction]("DOMContentLoaded", initPageHandler, false);
         tabbrowser[addOrRemoveListenerFunction]("pageshow", initPageHandler, false);
		},
      
      initPermantentShortCuts: function(){
         this.setShortcut("customizeyourweb.keys.openConfiguration",  EventHandler.openConfiguration, EventHandler)
      },   
		
		initShortCuts: function (){
			this.shortcutManager.clearAllShortcuts()
			var prefix = "customizeyourweb.keys."
			this.setShortcut(prefix+"blurActiveElement",  EventHandler.blurActiveElement, EventHandler)			
			this.setShortcut(prefix+"toggleEditMode",  EditScriptHandler.toggleEditMode, EditScriptHandler)
//         this.shortcutManager.addShortcut("Alt+F2",  "openDialog('chrome://customizeyourweb/content/test/EditTableTest.xul', 'test', 'centerscreen=yes, modal=no')" )
		},
      
		observe: function(){
         this.init()
      },

      setShortcut: function(prefsKey, cmdFunction, cmdThisObj){
			var combinedKeyCode = Prefs.getCharPref(prefsKey);
			if(combinedKeyCode!="0"){
				this.shortcutManager.addShortcut(combinedKeyCode, cmdFunction, cmdThisObj);
			}
		},
		
      toggleEnableDisableAll: function(){
         var disabled = CywConfig.getPref("disabled")
         CywConfig.setPref("disabled", !disabled)
         this.init()
            
      }
	}
	
	customizeyourweb.Namespace.bindToNamespace("customizeyourweb","InitManager", InitManager)

})()
}


