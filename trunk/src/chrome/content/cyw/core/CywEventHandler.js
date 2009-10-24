/*
 * customizeyourweb
 * This files contains all the event-handling and actions
 * Version 0.1
 * Created by Rudolf Noé
 * 25.09.2008
 */

(function(){with(customizeyourweb){
   
   var EventHandler = {
      blurActiveElement: function(keyEvent){
         var keyCode = keyEvent.which
         var isEscPressed = keyCode==KeyEvent.DOM_VK_ESCAPE && !KeyEventUtils.hasAltCtrlMetaModifier(keyEvent)  
         if(isEscPressed && UIUtils.isPopupOpen()){
            //escape is for closing 
            return ShortcutManager.DO_NOT_SUPPRESS_KEY
         }
         DomUtils.blurActiveElement(content)
      },

      giveFeedback:function(){
         Utils.getMostRecentBrowserWin().content.location.href="mailto:cyw_info@mouseless.de"
      },
      
		hideToolsMenu: function(){
         CywConfig.setPref("ui.hideToolsMenu", true)
         InitManager.initUI()
      },
      
      installScriptFromWeb: function(event){
         (new WebInstaller()).installScript(gContextMenu.target.href)   
      },
      
      onContentContextShowing: function(event){
      },
      
      openConfiguration : function(event) {
			openDialog(CywCommon.CYW_CHROME_URL + "/preferences/cyw_prefs.xul", "cyw_prefs", "all, chrome, centerscreen").focus()
		},
      
      openIssueList: function(){
         Utils.openUrlInNewTab("http://code.google.com/p/customizeyourweb/issues/list", true)   
      },
      
      toggleEditModeOnStatusbarClick: function(event){
         //toggle only on left click
         if(event.button == 0){
            EditScriptHandler.toggleEditMode()
         }
      }
	}

   
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "EventHandler", EventHandler)

}})()