with(customizeyourweb){
(function(){
   const SRC_PATH_STATUS_ICON_NORMAL = "chrome://customizeyourweb/skin/cyw.ico";
   const SRC_PATH_STATUS_ICON_DISABLED = "chrome://customizeyourweb/skin/cyw_disabled.ico";
   const SRC_PATH_STATUS_ICON_ERROR = "chrome://customizeyourweb/skin/cyw_script_error.ico";
   const ERROR_ICON_STATE_TAB_CONTEXT = "CYW_STATUSBAR_MANAGER";
   
   var StatusbarManager = {
      listenerActive: false,
      
      getTabContext: function(contentWin){
         var tabContext = TabContextManager.getContext(contentWin, ERROR_ICON_STATE_TAB_CONTEXT)
         if(tabContext==null){
            tabContext = TabContextManager.setContext(contentWin, ERROR_ICON_STATE_TAB_CONTEXT,
                                                      new ErrorIconStateTabContext())
         }
         return tabContext
      },
      
      hideStatusbar: function(){
         CywConfig.setPref("ui.hideStatusbarIcon", true)
         this.showHideStatusIcon()
      },
      
      init: function(){
         this.showHideStatusIcon()
         this.setDisabledState()
         if(!this.listenerActive){
            this.registerEventListener()
            this.listenerActive = true
         }
      },
      
      onPagehide: function(event){
         var targetWin = event.originalTarget.defaultView
         var errorIconStateTabContext = this.getTabContext(targetWin)
         if(targetWin == targetWin.top){
            errorIconStateTabContext.clearErroneousWindows()
         }else{
            errorIconStateTabContext.removeErroneousWindow(targetWin)
         }
         this.setErrorState(errorIconStateTabContext.hasErroneousWindow())
      },
      
      onTabSelect: function(){
         Utils.executeDelayed("STATUSBAR_MANAGER_TAB_SELECT", 300, function(){
            this.setErrorState(this.getTabContext(content).hasErroneousWindow())
         }, this)
      },
      
      onScriptError: function(event){
         var targetWin = event.targetWin
         var errorIconStateTabContext = this.getTabContext(targetWin)
         errorIconStateTabContext.addErroneousWindow(targetWin)
         if(targetWin.top == content){
            this.setErrorState(true)
         }
      },
      
      registerEventListener: function(){
         ScriptErrorHandler.addScriptErrorListener(new EventHandlerAdapter(this.onScriptError, this))
         document.getElementById('content').addEventListener("pagehide", new EventHandlerAdapter(this.onPagehide, this), true)
         Application.activeWindow.events.addListener("TabSelect", new EventHandlerAdapter(this.onTabSelect, this))
      },
      
      setDisabledState: function(){
         var isCYWDisabled = CywConfig.getPref("disabled")
         var statusbarIcon = byId('customizeyourweb-statusbarIcon')
         if(isCYWDisabled){
            statusbarIcon.src = SRC_PATH_STATUS_ICON_DISABLED
         }else{
            statusbarIcon.src = SRC_PATH_STATUS_ICON_NORMAL
         }
      },
      
      setErrorState: function(isError){
         var statusbarIcon = byId('customizeyourweb-statusbarIcon')
         if(isError){
            statusbarIcon.src = SRC_PATH_STATUS_ICON_ERROR
         }else{
            statusbarIcon.src = SRC_PATH_STATUS_ICON_NORMAL
         }
      },
      
      showHideStatusIcon: function(){
         var hideIconInStatusbar = CywConfig.getPref("ui.hideStatusbarIcon")
         var statusbarPanel = byId('customizeyourweb-status-panel')
         if(hideIconInStatusbar){
            statusbarPanel.collapsed = true
         }else{
            statusbarPanel.collapsed = false
         }
      }
      
   }
   Namespace.bindToNamespace("customizeyourweb", "StatusbarManager", StatusbarManager)
   
   //private context class
   function ErrorIconStateTabContext(){
      this.erroneousWindows = new ArrayList()
   }
   
   ErrorIconStateTabContext.prototype = {
      constructor: ErrorIconStateTabContext,
      
      addErroneousWindow: function(contentWin){
         this.erroneousWindows.add(contentWin)
      },
      
      clearErroneousWindows: function(){
         this.erroneousWindows.clear()
      },
      
      hasErroneousWindow: function(){
         return this.erroneousWindows.size() > 0
      },
      
      removeErroneousWindow: function(contentWin){
         if(this.erroneousWindows.contains(contentWin)){
            this.erroneousWindows.remove(contentWin)
         }
      }
      
   }
   
   function byId(id){
      return document.getElementById(id)
   }
})()
}