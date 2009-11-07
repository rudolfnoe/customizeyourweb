/*
 * customizeyourweb
 * Version 0.1
 * Created by Rudolf Noé
 * 25.09.2008
 */
with(customizeyourweb){
(function(){
	const CYW_NAMESPACE = "de_mouseless_CYW"
   const EVENT_TYPES_LISTENING = ["pagehide", "DOMNodeInserted", "DOMNodeRemoved"]
   
	function PageEventHandler(targetWin, applicableScripts){
      this.AbstractGenericEventHandler(false)
      this.appliedScripts = []
      this.applicableScripts = applicableScripts
      this.pageEventHandler = new SuspendableEventHandler(this)
      //debug info
      this.nodesAdded = 0 
      this.nodesRemoved = 0 
      this.reinitDelay = CywConfig.getPref("reinitDelayAfterDomChanged")
      this.targetWin = targetWin
      this.timerId = (new Date()).getTime()
   }
   
   //Statics 
   PageEventHandler.initPage = function(event){
		var targetWin = event.originalTarget.defaultView
      Log.logDebug(event.type + " " + targetWin.location.href)
      if(EditScriptHandler.isEditing(targetWin)){
         return
      }
      var applicableScripts = CywConfig.getActiveScriptsForUrl(targetWin.location.href)
      if(applicableScripts.length>0){
         var pageEventHandler = new PageEventHandler(targetWin, applicableScripts)
         pageEventHandler.handleLoadEvent(event)
      }
   },
   
   PageEventHandler.setPageData = function(win, pageData){
      var topWin = win.top
      win.top.de_mouseless_CYW = pageData
   }
   
      
   PageEventHandler.prototype = {
      cleanUpScript: function(eventType){
         this.suspend()
         for (var i = 0; i < this.appliedScripts.length; i++) {
            this.appliedScripts[i].cleanUp(new CywContext(this.targetWin, eventType))
         }
         this.resume()
      },
      
      commonCleanUp: function(eventType){
         this.cleanUpScript(eventType)
         Utils.clearExecuteDelayedTimer(this.timerId)
      },
      
      evaluateAppliedScripts: function(event){
         var appliedScripts = []
         for (var i = 0; i < this.applicableScripts.length; i++) {
            var script = this.applicableScripts[i]
            var applyScript = false
            if( (script.getLoadEventType()==event.type) || 
                (this.isPageshowEvent(event) && !this.isDomContentLoadedFired())){
                  applyScript=true
            }
               
            if(applyScript){
               appliedScripts.push(script)
            }
         }
         return appliedScripts
      },
      
      getPageData: function(){
         return this.targetWin[CYW_NAMESPACE]?this.targetWin[CYW_NAMESPACE].pageData:null   
      },

      handleLoadEvent: function(event){
         this.appliedScripts = this.evaluateAppliedScripts(event)
         if(this.appliedScripts.length==0){
            return
         }
         this.runAppliedScripts(event.type, event.persisted)
         if(this.isDomContentLoadedEvent(event)){
            this.setDomContentLoadedFlag()
         }
         this.registerAllEventListener()
      },
      
      handleDOMNodeInserted: function(event){
         this.nodesAdded++
//         CywUtils.logDebug("Node added: " + event.relatedNode.innerHTML)
         this.handleMutationEvent(event)
      },
      
      handleDOMNodeRemoved: function(event){
         this.nodesRemoved++
         this.handleMutationEvent(event)
      },
      
      handleMutationEvent: function(event){
         if(this.isIgnoreMutationEvent(event)){
            return
         }
         Utils.executeDelayed(this.timerId, this.reinitDelay, function(){
//            CywUtils.logDebug('delayed reinit total nodes added: ' + this.nodesAdded + ", total nodes removed: " + this.nodesRemoved)
            //var perfTimer = new PerfTimer()
            this.cleanUpScript(PageEvents.MUTATION_EVENT)
//            if(perfTimer){
//               Log.logDebug("Cleanup took " + perfTimer.stop() + "msec.")
//            }
            this.runAppliedScripts(PageEvents.MUTATION_EVENT, false)
         }, this)
      },
      
      handlePageEditEvent: function(event){
         //If not the same tab do nothing
         if(event.targetWin.top!=this.targetWin.top){
            return
         }
         var eventType = event.type
         if(eventType==EditScriptHandler.Events.EDIT_START){
            this.handlePageEditStart()
         }else if(eventType==EditScriptHandler.Events.EDIT_END){
            this.handlePageEditEnd()
         }else{
            throw new Error('unknown edit event type')
         }
      },
      
      handlePageEditEnd: function(){
         //TODO check if this is correct
         this.runAppliedScripts(PageEvents.MUTATION_EVENT, false)
         this.registerPageEventsListener()
      },

      handlePageEditStart: function(){
         this.commonCleanUp(null)
         this.unregisterPageEventsListener()
      },
      
      handlePagehide: function(event){
//         Log.logDebug(event.type + " " + event.target.location.href)
         this.commonCleanUp(event.type)
         this.unregisterAllEventListener()
      },
      
      isDomContentLoadedEvent: function(event){
         return event.type==LoadEventTypes.DOM_CONTENT_LOADED
      },
      
      isDomContentLoadedFired: function(){
         var pageData = this.getPageData()
         return pageData?pageData.isDomContentLoadedFired():false
      },
      
      isIgnoreMutationEvent: function(event){
         if(!event.relatedNode){
            return true
         }
         var relatedNode = event.relatedNode
         //Avoid infinite loop caused by init of mouseless browsing
         if(relatedNode.hasAttribute('MLB_idSpanFlag') ||
            //ignore events cause from editable iframes
            relatedNode.ownerDocument.designMode=="on"){
               return true
         }else{
               return false   
         }
      },
      
      isPageshowEvent: function(event){
         return event.type==LoadEventTypes.PAGE_SHOW
      },
      
      registerAllEventListener: function(){
         EditScriptHandler.addEditListener(this.handlePageEditEvent, this)
         this.registerPageEventsListener()
      },
      
      registerPageEventsListener: function(){
         this.registerMultipleEventListener(this.targetWin, EVENT_TYPES_LISTENING, true)
      },
      
      runAppliedScripts: function(eventType, persisted){
         //suspend event listening during script running as it could cause mutation events
         this.suspend()
         //var perfTimer = new PerfTimer()
         for (var i = 0; i < this.appliedScripts.length; i++) {
//            CywUtils.logDebug('Script ' + this.appliedScripts[i] + "applied on " +  eventType)
            this.appliedScripts[i].runScript(new CywContext(this.targetWin, eventType, persisted))
         }
//         if(perfTimer){
//            Log.logDebug("Script init took " + perfTimer.stop() + "msec.")
//         }
         //Resume handling of mutation events
         this.resume()
      },
      
      setDomContentLoadedFlag: function(){
         if(!this.isDomContentLoadedFired()){
            this.setPageData(new PageData(true))
         }
      },
      
      setPageData: function(pageData){
         var egNamespaceObj = Namespace.bindToNamespace(CYW_NAMESPACE, "pageData", pageData, this.targetWin)      
      },
      
      unregisterAllEventListener: function(){
         EditScriptHandler.removeEditListener(this.handlePageEditEvent, this)
         this.unregisterPageEventsListener()
      },
      
      unregisterPageEventsListener: function(){
         this.unRegisterMultipleEventListener(this.targetWin, EVENT_TYPES_LISTENING, true)
      }
	}
   ObjectUtils.extend(PageEventHandler, AbstractGenericEventHandler)
   
   Namespace.bindToNamespace("customizeyourweb", "PageEventHandler", PageEventHandler)
   
   function PageData(domContentLoadedFired){
      this.domContentLoadedFired = domContentLoadedFired   
   }
   
   PageData.prototype = {
      constructor: PageData,

      isDomContentLoadedFired: function(){
         return this.domContentLoadedFired
      },

      setDomContentLoadedEventFired: function(domContentLoadedFired){
         this.domContentLoadedFired = domContentLoadedFired
      }
      
   }
   
   PageEvents = {
      DOM_CONTENT_LOADED: "DOMContentLoaded",
      PAGE_SHOW: "pageshow",
      PAGE_HIDE: "pagehide",
      MUTATION_EVENT: "MUTATION_EVENT"
   }
   Namespace.bindToNamespace("customizeyourweb", "PageEvents", PageEvents)
})()
}

