/*
 * Event handler during editing a script
 */
with(customizeyourweb){
(function(){
   
   //Constants
   //Tab context id for edit handler
   const CYW_EDIT_HANDLER = "CYW_EDIT_HANDLER";
   //Broadcaster id for the values of the sidebar
   const CYW_SIDEBAR_ID = 'viewCustomizeYourWebEditScriptSidebar';
   const CYW_SIDEBAR_URL = "chrome://customizeyourweb/content/cyw/editwindow/EditScript.xul";
   //Command ids which not need to have one target element selected
   const TARGETLESS_COMMANDS = ["customizeyourweb_insertJSCmd", "customizeyourweb_macroShortcutCmd"];
   //Name of the 
   
   //Ccomand id to EditCommand map
   //only exceptions are configured
   var CommandMap = {
      customizeyourweb_pasteBeforeCmd: EditPasteCommand,
      customizeyourweb_pasteAfterCmd: EditPasteCommand,
      customizeyourweb_pasteFirstChildCmd: EditPasteCommand,
      customizeyourweb_pasteLastChildCmd: EditPasteCommand,
      customizeyourweb_macroShortcutCmd: EditShortcutCommand,
      customizeyourweb_toggleVisibilityShortcutCmd: EditShortcutCommand
   }
   
   //Action to EditCommand map
   //only execeptions are configured
   var Action2CommandMap = {
      MacroShortcutAction: EditShortcutCommand,
      ToggleVisibilityShortcutAction: EditShortcutCommand
   }
   
   /*
    * Calls the the handleTabFocusGained/Lost methods if tab select changes
    * and sets the currently active edit handler
    */ 
   Application.activeWindow.events.addListener("TabSelect", function(event){
      Utils.executeDelayed('CYW_TabSelect', 300, function(){
         if(EditScriptHandler.activeEditHandler!=null){
            EditScriptHandler.activeEditHandler.handleTabFocusLost()
            EditScriptHandler.activeEditHandler = null
         }
         if (EditScriptHandler.hasEditHandler(content)) {
            EditScriptHandler.activeEditHandler = editHandler = EditScriptHandler.getEditHandler(content) 
            editHandler.handleTabFocusGained()
         }
      })
   })
   
   /*
    * Constructor for EditScriptHandler
    * For every tab which is currently edited a seperate EditScriptHandler will be instantiated
    * and stored in the tab context
    */
   function EditScriptHandler(targetWin){
      //List of highlighters which highlight elements which are the target of the currently
      //seleceted action in the sidebar
      this.actionTargetHighlighters = null
      //The currently with the mouseoverhighlighter selected target in the content win
      this.currentTarget = null
      //Command history for Undo
      this.editCommandHistory = new Array()
      //The edit context all data neccessary for the EditXXXCommands
      //this data is mainly set by the edit handler
      this.editContext = new EditContext()
      //Flag indicatin wether this edit handler is active or not
      this.editModeActive = false
      //Highlighter for mouseover event
      this.mouseOverHighlighter = null
      //Context in which information from the sidebar is stored, needed for tab change handling
      this.sidebarContext = null
      //Sidebar load listener
      this.sidebarLoadListener = Utils.bind(function(){this.registerActionSelectionListener()}, this)
      //The edit handler extends the AbstractGenericEventHandler
      //To suspend the edit handler during the editing of command 
      //a suspendableEvenHandler wraps the edit handler
      this.suspendableEventHandler = new SuspendableEventHandler(this)
      //The current target win
      //TODO What happens if content win changes?
      this.targetWin = targetWin
   }
   
   //"Static" members and methods
   
   //Static to hold the active EditHandler
   EditScriptHandler.activeEditHandler = null

   //Event listener manager
   EditScriptHandler.eventListener = new GenericEventSource()
   
   EditScriptHandler.Events = {
      EDIT_START: "EDIT_START",
      EDIT_END: "EDIT_END"
   }
   
   //Static for adding edit listener
   EditScriptHandler.addEditListener = function(callbackFunc, thisObj){
      this.eventListener.addListener(this.Events.EDIT_START, callbackFunc, thisObj)
      this.eventListener.addListener(this.Events.EDIT_END, callbackFunc, thisObj)
   },
   
   //Single method called by every edit command
   EditScriptHandler.doCreateAction = function(event){
      try{
         this.getEditHandler().doCreateAction(event.target.id)
      }catch(e){
         //As commands executed via the CommandWrapper are not logged this is a workaround
         Log.logError(e)
      }
   }
   
   /*
    * Retrieves the edit handler for the provided content win from the 
    * tab context or creates a new one and stores this in the tab context
    */
   EditScriptHandler.getEditHandler= function(contentWin){
      var contentWin = contentWin?contentWin:content
      var editHandler = TabContextManager.getContext(contentWin, CYW_EDIT_HANDLER)
      if(editHandler==null){
         editHandler = new EditScriptHandler(contentWin)
         TabContextManager.setContext(contentWin, CYW_EDIT_HANDLER, editHandler)
      }
      return editHandler
   }
   
   /*
    * Return true if a edit handler for a context win exists
    */
   EditScriptHandler.hasEditHandler = function(contentWin){
      return TabContextManager.getContext(contentWin, CYW_EDIT_HANDLER)!=null
   }
   
   EditScriptHandler.isEditing = function(contentWin){
      return TabContextManager.hasContext(contentWin, CYW_EDIT_HANDLER)   
   },
   
   EditScriptHandler.notifyEditListener = function(eventType, targetWin){
      this.eventListener.notifyListeners({type:eventType, targetWin:targetWin})
   }
   
   //Remove edit listener
   EditScriptHandler.removeEditListener = function(callbackFunc, thisObj){
      this.eventListener.removeListener(this.Events.EDIT_START, callbackFunc, thisObj)
      this.eventListener.removeListener(this.Events.EDIT_END, callbackFunc, thisObj)
   }
   
   //Trigger edit dialog for retargeting an action
   //TODO check if this can be integrated in the normal doCreateAction
   EditScriptHandler.retargetAction = function(){
      this.getEditHandler(content).retargetAction()
   }

   /*
    * Toggles the edit mode of the currently selected content win
    */
   EditScriptHandler.toggleEditMode = function(){
      this.getEditHandler(content).toggleEditMode()
   }
   
   //Instance methods
   EditScriptHandler.prototype = {
      //De/Register the edithandler for all relevant events
      addRemoveEventHandlers: function(addOrRemove){
         var isAdd = addOrRemove=="add"
         if(isAdd){
            functionName = "addEventListener"
         }else{
            functionName = "removeEventListener"
         }
         var browserForTab = getBrowser().getBrowserForDocument(this.targetWin.document)
         browserForTab[functionName]("pagehide", this.suspendableEventHandler, true)
         browserForTab[functionName]("mouseover", this.suspendableEventHandler, false)
         browserForTab[functionName]("click", this.suspendableEventHandler, true)
         browserForTab[functionName]("contextmenu", this.suspendableEventHandler, true)
         //context menu
         getEgMenuPopup()[functionName]("popupshowing", this.suspendableEventHandler, true)
         
         getSidebar()[functionName]("load", this.sidebarLoadListener, true)
         //Registering for change of edit contexts clipboard property content to de/activate paste commands
         if(isAdd){
            this.addContextClipboardObserver()
         }else{
            this.removeContextClipboardObserver()
         }
      },
      
      /*
       * Saves the provided script but does not disable the edit handler
       * Called when user changes selected script in sidebar win and saves
       * the previous edited script on inquiry
       */
      applyScript: function(script){
         CywConfig.saveScript(script)
      },
      
      /*
       * Disables the edithandler without saving the currently edited script
       * @param (Boolean) isHideSidebar: Flag indicating whether the sidebar should be closed or not  
       */
      cancelEditing: function(isHideSidebar){
         this.disableEditHandler(isHideSidebar) 
      },
      
      checkCurrentWinMatchesToCurrentScript: function(){
         var targetWin = this.getActionTargetWin()
         var currentScript = getSidebarWinHandler().getCurrentScript()
         return currentScript.matchUrl(targetWin.location.href) || !currentScript.hasIncludePattern()
      },
      
      /*
       * Creates edit command obj from the "pure name" like "Click", "Focus" of the command
       */
      createEditCommand: function(pureName){
         var commandClassName = "Edit" + pureName + "Command"
         return new customizeyourweb[commandClassName]()
      },
      
      /*
       * Calls doCreateAction with the resize command id
       * Is call from the resize highighlighter on resize end
       */
      createResizeAction: function(){
         this.doCreateAction("customizeyourweb_resizeCmd") 
      },
      
      createMouseoverHighlighter: function(){
         var resizeHighlighter = new ResizeHighlighter()
         resizeHighlighter.addListener("resizestart", this.setResizeCommandData, this)
         resizeHighlighter.addListener("resizeend", this.createResizeAction, this)
         return new CombiHighlighter(resizeHighlighter, new FrameHighlighter(true))
      },
      
      /*
       * Creates WrapperCommand with the appropriate EditCommand out of action
       * The EditCommand constructor is determined either by locking it up in 
       * the Action2CommandMap (for exceptions) or is derived from the name.
       * By convention the name of the constructor of an edit command consists of
       * "Edit" + <PureNameOfAction> + "Command". The pure name of an action is the leading
       * part of the action constructor name without the suffix "Action" 
       */
      createWrapperCommandFromAction: function(action){
         var actionType = ObjectUtils.getType(action)
         var editCommandConstructor = Action2CommandMap[actionType]
         var editCommand = null
         if(editCommandConstructor!=null){
            editCommand = new editCommandConstructor()
         }else{
            var pureName = actionType.substring(0, actionType.lastIndexOf("Action"))
            editCommand = this.createEditCommand(pureName)
         }
         return new WrapperCommand(editCommand, getSidebarWinHandler())
      },
      
      /*
       * Creates WrapperCommand from commandId
       */
      createWrapperCommandFromCommandId: function(commandId){
         if(CommandMap[commandId]!=null){
            var editCommand = new CommandMap[commandId]()
         }else{
            var pureName = commandId.substring("customizeyourweb_".length, commandId.lastIndexOf("Cmd"))
            editCommand = this.createEditCommand(StringUtils.firstUpper(pureName))
         }
         return new WrapperCommand(editCommand, getSidebarWinHandler())
      },
      
      deleteScript: function(scriptId){
         CywConfig.deleteScript(scriptId)
      },
      
      disableEditHandler: function(isHideSidebar){
         //clean up contexts
         TabContextManager.removeContext(this.targetWin, CYW_EDIT_HANDLER)
         this.setApplicationEditContext(null)
         
         //clean up edit handler
         EditScriptHandler.activeEditHandler = null
         this.addRemoveEventHandlers("remove")
         this.shortcutManager.destroy()
         
         //reset paste obeserver
         this.setPastingEnabled(false)
         
         //unhighlight everything
         this.unhighlightAllHighlighters()
         this.unshadowFrames()
         
         //prepare contentwin for further browsing
         EditScriptHandler.notifyEditListener(EditScriptHandler.Events.EDIT_END, this.targetWin)
         
         if(isHideSidebar){
            hideSidebar()
         }
      },
      
      /*
       * Edits a selected action
       */
      doEditAction: function(action, script){
         if(action.isTargeted()){
            //if targeted action highlighing is done by the dialog
            this.unhighlightAllHighlighters()
         }
         var wrapperCommand = this.createWrapperCommandFromAction(action)
         var actionTargetWin = this.getActionTargetWin()
         this.initEditContextForEditAction(action, script)
         var modifiedAction = wrapperCommand.doEditAction(this.editContext)
         if(modifiedAction!=null){
            //Editing ended sucessful
            this.editCommandHistory.push(wrapperCommand)
            this.updateCurrentTarget(modifiedAction, actionTargetWin)
         }
         this.highlightCurrentTarget()
         return modifiedAction
      },
      
      doCreateAction: function(commandId){
         if(this.currentTarget==null && TARGETLESS_COMMANDS.indexOf(commandId)==-1)
           return
         if(this.currentTarget!=null){
            var match = this.checkCurrentWinMatchesToCurrentScript()
            if(!match){
               alert("Action could not be added because the URL of the target window \n" +
                     "doesn't match with the url patterns defined for the current script.")
               return
            }
         }
         DomUtils.blurActiveElement(this.targetWin)
         this.unhighlightAllHighlighters()
         var wrapperCommand = this.createWrapperCommandFromCommandId(commandId)
         this.initEditContextForCreateAction(commandId)
         var newAction = wrapperCommand.doCreateAction(this.editContext)
         if(newAction){
            //If creation successfull
            var successful = getSidebarWinHandler().addOrUpdateAction(newAction, this.getActionTargetWin())
            if(successful){
               this.editCommandHistory.push(wrapperCommand)
               this.updateCurrentTarget(newAction, this.getActionTargetWin())
            }else{
               wrapperCommand.undo(this.editContext)
            }
         }
         this.highlightCurrentTarget()
      },
      
      enableEditHandler: function(){
         this.prepareContentWinForEditing()
         //set currently active handler
         EditScriptHandler.activeEditHandler = this
         this.initEditHandler()

         //Find scripts
         var scripts = CywConfig.getScriptsForTargetWin(this.targetWin)
         //Add new script
         scripts.add(Script.createNewScript(this.targetWin.location.href))
         
         //init sidebar stuff
         if(isSidebarWinOpen()){
            this.registerActionSelectionListener()
         }
         this.initSidebarContext(scripts)
         initSidebarWin()
         
      },
      
      getCurrentScript: function(){
         return this.currentScript
      },
      
      getPasteObserver: function(){
         return byId('customizeyourweb_pasteBC')
      },
      
      getShortcutManager: function(){
         return this.shortcutManager
      },
      
      getActionTargetWin: function(){
         if(this.currentTarget){
            return DomUtils.getOwnerWindow(this.currentTarget)
         }else{
            return this.targetWin
         }
      },
      
      handleActionSelectionChanged: function(event){
         var selectedAction = event.selectedAction
         if(selectedAction && selectedAction.isTargeted()){
            byId('customizeyourweb_retargetActionCmd').setAttribute('disabled', "false")
         }else{
            byId('customizeyourweb_retargetActionCmd').setAttribute('disabled', "true")
         }
      },
      
      handleClick: function(event){
         Utils.stopEvent(event)
         var target = event.target
         if(event.altKey){
            this.retargetAction(target)
         }else{
            getEgMenuPopup().openPopupAtScreen(event.screenX-20, event.screenY-10, true)
         }
      },
      
      //Suppress popup of standard context menu
      handleContextmenu: function(event){
         event.preventDefault()
      },

      handleMouseover: function(event){
         Utils.executeDelayed("HANDLE_MOUSEOVER", 50, function(){
            if(getEgMenuPopup().state=="open")
               getEgMenuPopup().hidePopup()
            //CywUtils.logDebugMessage("Target: " + event.target.tagName)
            this.unhighlightActionTargets()
            var newTarget = event.target
            if(this.isContainedInEditableIframe(newTarget)){
               newTarget = newTarget.ownerDocument.defaultView.frameElement 
            }

            this.setCurrentTarget(newTarget)
            //Focus content win to enable shortcuts automatically
            //TODO make configurable
            newTarget.ownerDocument.defaultView.focus()
         }, this)
      },
      
      handlePagehide: function(){
         //TODO is this still neccessary?
      },
      
      /*
       * Initialization on tab focus gain
       */
      handleTabFocusGained: function(){
         this.setPastingEnabled(this.editContext.getClipboard()!=null)
         this.setApplicationEditContext(this.sidebarContext)
         initSidebarWin()           
      },
      
      /*
       * Initialization on tab focus lost
       */
      handleTabFocusLost: function(){
         if(this.editModeActive && isSidebarWinOpen()){
            this.sidebarContext = getSidebarWinHandler().getSidebarContextForSaving()
            hideSidebar()
         }
      },
      
      highlightActionTargets: function(script, targetDefinition){
         //Suspend eventhandling as scrolling cut cause new events
         this.suspendEventHandling()
         this.unhighlightAllHighlighters()
         var newHighlighters = new Array()
         var found = false
         var first = true
         DomUtils.iterateWindows(this.targetWin, function(subWin){
            if( (!script.matchUrl(subWin.location.href)) ||
                (!targetDefinition.isTargetInPage(subWin)) ){
               return
            }
            found = true
            var targetElement = targetDefinition.getTarget(subWin)
            var highlighter = new FrameHighlighter()
            highlighter.highlight(targetElement)
            if(first){
               targetElement.scrollIntoView()
               first = false
            }
            newHighlighters.push(highlighter)
         })
         this.actionTargetHighlighters = newHighlighters
         //As highlighting action targets might lead to scrolling which is presumably done asychronously
         //the resumeing of the eventhandling must be delayed
         setTimeout(Utils.bind(this.resumeEventHandling, this), 500)
         return found
      },
      
      highlightCurrentTarget: function(){
         if(this.currentTarget!=null){
            //suspending event handling as highlighting can cause new events
            this.suspendEventHandling()
            this.mouseOverHighlighter.highlight(this.currentTarget)
            //resume eventhandling a little bit later as overwise mouseover event is
            //handled which could set back highlight to previous element
            setTimeout(Utils.bind(this.resumeEventHandling, this), 100)
         }
      },
      
      initEditHandler: function(){
         this.editModeActive = true
         this.addRemoveEventHandlers("add")
         this.initShortcuts();
         this.mouseOverHighlighter = this.createMouseoverHighlighter()
      },
      
      addContextClipboardObserver: function(){
         Utils.watchProperty(this.editContext, CywContext.CLIPBOARD_PROPERTY_NAME, function(newValue){
            if(newValue!=null)
               var disabled = "false"
            else 
               var disabled = "true"
            this.getPasteObserver().setAttribute('disabled', disabled)
         }, this) 
      },
      
      /*
       * Inits the edit context
       */
      initEditContextForEditAction: function(action, script){
         var targetElement = null
         var targetWindow = null
         if(action.isTargeted()){
            //Determine the target element
            var targetDef = action.getTargetDefinition()
            var targetElements = new ArrayList();
            var targetWindows = new ArrayList();
            DomUtils.iterateWindows(this.targetWin, function(subWin){
               if(script.matchUrl(subWin.location.href)){
                  targetWindows.add(subWin)
                  if(targetDef.isTargetInPage(subWin)){
                     targetElements.addAll(targetDef.getTargets(subWin))
                  }
            }
            })
            //TODO check, could be more than 1
            if(targetElements.size()>0){
               targetElement = targetElements.get(0)
               targetWindow = targetElement.ownerDocument.defaultView 
            }else if(targetWindows.size()>0){
               targetWindow = targetWindows.get(0) 
            }else{
               Assert.fail("Target window could not be determined!")
            }
         }
         this.editContext.setAction(action)
         this.editContext.setTargetElement(targetElement)
         this.editContext.setTargetWindow(targetWindow)
      },
      
      initEditContextForCreateAction: function(commandId){
         this.editContext.setCommand(document.getElementById(commandId))
         this.editContext.setTargetElement(this.currentTarget)
         this.editContext.setTargetWindow(this.getActionTargetWin())
         var targetDefinition = null
         if(this.currentTarget)
           targetDefinition = AbstractTargetDefinitionFactory.createDefaultDefinition(this.currentTarget)
         this.editContext.setTargetDefinition(targetDefinition)
      },
      
      initShortcuts: function(){
         var selectedBrowser = Firefox.getActiveBrowser()
         this.shortcutManager = new ShortcutManager(selectedBrowser, "keydown", true)
         //Naviation
         this.shortcutManager.addShortcut("right", Utils.bind(function(){this.navigateWithKeys("nextSibling")}, this))
         this.shortcutManager.addShortcut("down", Utils.bind(function(){this.navigateWithKeys("nextSibling")}, this))
         this.shortcutManager.addShortcut("left", Utils.bind(function(){this.navigateWithKeys("previousSibling")}, this))
         this.shortcutManager.addShortcut("up", Utils.bind(function(){this.navigateWithKeys("previousSibling")}, this))
         this.shortcutManager.addShortcut("ctrl+up", Utils.bind(function(){this.navigateWithKeys("parentNode")}, this))
         this.shortcutManager.addShortcut("ctrl+left", Utils.bind(function(){this.navigateWithKeys("parentNode")}, this))
         this.shortcutManager.addShortcut("ctrl+down", Utils.bind(function(){this.navigateWithKeys("firstChild")}, this))
         this.shortcutManager.addShortcut("ctrl+right", Utils.bind(function(){this.navigateWithKeys("firstChild")}, this))
         this.shortcutManager.addShortcut("ctrl+z", Utils.bind(this.undoLastCommand, this))
         this.shortcutManager.addShortcut("c", Utils.bind(function(){this.doCreateAction("customizeyourweb_clickCmd")}, this))
         this.shortcutManager.addShortcut("f", Utils.bind(function(){this.doCreateAction("customizeyourweb_focusCmd")}, this))
         this.shortcutManager.addShortcut("h", Utils.bind(function(){this.doCreateAction("customizeyourweb_insertHTMLCmd")}, this))
         this.shortcutManager.addShortcut("i", new CommandWrapper('customizeyourweb_ifElementExistsCmd'))
         this.shortcutManager.addShortcut("j", Utils.bind(function(){this.doCreateAction("customizeyourweb_insertJSCmd")}, this))
         this.shortcutManager.addShortcut("l", Utils.bind(function(){this.doCreateAction("customizeyourweb_listViewCmd")}, this))
         this.shortcutManager.addShortcut("m", Utils.bind(function(){this.doCreateAction("customizeyourweb_modifyCmd")}, this))
         this.shortcutManager.addShortcut("o", Utils.bind(function(){this.doCreateAction("customizeyourweb_macroShortcutCmd")}, this))
         this.shortcutManager.addShortcut("r", Utils.bind(function(){this.doCreateAction("customizeyourweb_removeCmd")}, this))
         this.shortcutManager.addShortcut("delete", Utils.bind(function(){this.doCreateAction("customizeyourweb_removeCmd")}, this))
         this.shortcutManager.addShortcut("s", Utils.bind(function(){this.doCreateAction("customizeyourweb_shortcutCmd")}, this))
         this.shortcutManager.addShortcut("t", new CommandWrapper('customizeyourweb_retargetActionCmd'))
         this.shortcutManager.addShortcut("ctrl+c", Utils.bind(function(){this.doCreateAction("customizeyourweb_copyCmd")}, this))
         this.shortcutManager.addShortcut("ctrl+x", Utils.bind(function(){this.doCreateAction("customizeyourweb_cutCmd")}, this))
         this.shortcutManager.addShortcut("ctrl+v", new CommandWrapper('customizeyourweb_pasteAfterCmd'))
         this.shortcutManager.addShortcut("ctrl+shift+v", new CommandWrapper('customizeyourweb_pasteBeforeCmd'))
         this.shortcutManager.addShortcut("F1", this.showShortcutHelpPanel, this)
         this.shortcutManager.addShortcut("CONTEXT_MENU", this.openEditPopupMenuByContextKey, this)
      },
      
      initSidebarContext: function(scripts){
         this.sidebarContext = new SidebarContext(this, scripts, this.targetWin)
         this.setApplicationEditContext(this.sidebarContext)
      },
      
      isContainedInEditableIframe: function(element){
         return element.ownerDocument.designMode=="on"
      },
      
      navigateWithKeys: function(direction){
         if(this.currentTarget==null){
            var win = this.targetWin
            while(DomUtils.isFramesetWindow(win)){
               win = win.frames[0]
            }
            this.currentTarget = DomUtils.getBody(win.document)
         }
         switch (direction){
            case "parentNode":
               var tagName = this.currentTarget.tagName
               if(tagName=="BODY" || tagName=="HTML"){
                  var ownerWindow = DomUtils.getOwnerWindow(this.currentTarget) 
                  if(ownerWindow.frameElement != null &&
                     ownerWindow.frameElement.tagName == "IFRAME"){
                     this.currentTarget = ownerWindow.frameElement
                     break
                  }else{
                     return
                  }
               }
               this.currentTarget = this.currentTarget.parentNode
               break
            case "firstChild":
               var firstChild = DomUtils.getFirstChildBy(this.currentTarget, function(node){
                  return node.nodeType == 1
               })
               if(firstChild!=null)
                  this.currentTarget = firstChild
               break
            case "nextSibling":
               var sibling = DomUtils.getNextElementSibling(this.currentTarget)
               if(sibling)
                  this.currentTarget = sibling
               break
            case "previousSibling":
               var sibling = DomUtils.getPreviousElementSibling(this.currentTarget)
               if(sibling)
                  this.currentTarget = sibling
               break
            default:
               throw new Error('Wrong parameter value for direction')
         }
         this.highlightCurrentTarget()
      },
      
      openEditPopupMenuByContextKey: function(){
         if(!this.currentTarget){
            return
         }
         getEgMenuPopup().openPopup(this.currentTarget, "after_start", 0, 0, true)
      },

      prepareContentWinForEditing: function(){
         DomUtils.blurActiveElement(this.targetWin)
         EditScriptHandler.notifyEditListener(EditScriptHandler.Events.EDIT_START, this.targetWin)
      },
      
      registerActionSelectionListener: function(){
        getSidebarWinHandler().addActionSelectionChangedListener(this.handleActionSelectionChanged, this) 
      },
      
      reloadPage: function(win, script){
         if(script.matchUrl(win.location.href)){
            win.location.reload()
            return
         }
         for (var i = 0; i < win.frames.length; i++) {
            this.reloadPage(win.frames[i], script)
         }
      },
      
      removeContextClipboardObserver: function(){
         Utils.unwatchProperty(this.editContext, CywContext.CLIPBOARD_PROPERTY_NAME)
      },
      
      resumeEventHandling: function(){
         this.suspendableEventHandler.resume()
      },

      //TODO disable if not action is selected
      //TODO make it undoable
      retargetAction: function(newTarget){
         newTarget = newTarget?newTarget:this.currentTarget
         var newTargetWindow = DomUtils.getOwnerWindow(newTarget)
         var selectedAction = getSidebarWinHandler().getSelectedAction()
         var errorMessage = null
         if(!selectedAction)
            errorMessage = "No action for retargeting is selected"
         else if (!selectedAction.isTargeted())
            errorMessage = "Selected action is not a targeted action"
         if(errorMessage){
            getSidebarWinHandler().setMessage(errorMessage, Severity.ERROR)
            return
         }
         this.unhighlightMouseOverHighlighter()   
         var dialog = new CommonAttributesEditDialog(selectedAction, newTargetWindow, newTarget) 
         dialog.show()
         if(dialog.isOk()){
            var updatedAction = dialog.getAction()
            this.currentTarget = updatedAction.getTargetDefinition().getTarget(newTargetWindow)
            this.highlightCurrentTarget()
            getSidebarWinHandler().updateAction(updatedAction)
         }
      },
      
      setApplicationEditContext: function(context){
         Application.storage.set(CywCommon.CYW_EDIT_CONTEXT_STORAGE_ID, context)
      },
      
      setCurrentTarget: function(newTarget){
         var successful = this.mouseOverHighlighter.highlight(newTarget)
         if(successful)
            this.currentTarget = newTarget
         return successful
      },
      
      setPastingEnabled: function(enabled){
         this.getPasteObserver().setAttribute("disabled", enabled?"false":"true")
      },
      
      setResizeCommandData: function(event){
         var commandData = {}
         commandData.offsetWidth = this.currentTarget.offsetWidth
         commandData.offsetHeight = this.currentTarget.offsetHeight
         this.editContext.setCommandData(commandData)
      },

      saveScript: function(script, sidebarClosedAbnormal){
         CywConfig.saveScript(script)
         this.disableEditHandler(!sidebarClosedAbnormal)
         if(CywConfig.isAutoUpdateOnSave())
            this.reloadPage(this.targetWin, script)
      },
      
      shadowFrames: function(script){
         this.unshadowFrames()
         var shadowers = new Array()
         DomUtils.iterateWindows(this.targetWin, function(win){
            if(!script.matchUrl(win.location.href)){
               var body = DomUtils.getBody(win.document)
               if(body){
                  var newShadower = new FrameShadower(win)
                  newShadower.shadow()
                  shadowers.push(newShadower)
               }
            }
         })
         this.frameShadowers = shadowers
      },
      
      showShortcutHelpPanel: function(){
         var tabpanelContainer = DomUtils.getElementByAnonId(getBrowser(), "panelcontainer")
         byId('customizeyourweb_shortcut_help_panel').openPopup(tabpanelContainer, "overlap")   
      },
      
      suspendEventHandling: function(){
         this.suspendableEventHandler.suspend()
      },
      
      toggleEditMode: function(){
         if(this.editModeActive){
            if(isSidebarWinOpen())
               getSidebarWinHandler().cancel(false)
            else
               this.disableEditHandler(false)
         }else{
            this.enableEditHandler()
         }
      },
      
      undoLastCommand: function(){
         var lastCommand = this.editCommandHistory.pop() 
         if(lastCommand==null)
            return
         lastCommand.undo(this.editContext)
      },
      
      unhighlightAllHighlighters: function(){
         this.unhighlightActionTargets()
         this.unhighlightMouseOverHighlighter()
      },
      
      unhighlightActionTargets: function(){
         if(this.actionTargetHighlighters==null)
            return
         var highlighter = null
         while(highlighter = this.actionTargetHighlighters.pop()){
            highlighter.unhighlight()
         }
      },
      
      unhighlightMouseOverHighlighter: function(){
         if(this.mouseOverHighlighter){
            this.mouseOverHighlighter.unhighlight()
         }
      },
      
      unshadowFrames: function(){
         if(this.frameShadowers==null)
           return
         for (var i = 0; i < this.frameShadowers.length; i++) {
            this.frameShadowers[i].unshadow()
         }
      },
     
      updateCurrentTarget: function(action, actionTargetWin){
         if(action.isTargeted() && action.isTargetInPage(actionTargetWin)){
            this.currentTarget = action.getTargetDefinition().getTarget(actionTargetWin)
         }else{
            this.currentTarget = null
         }
      }
      
   }
   ObjectUtils.extend(EditScriptHandler, AbstractGenericEventHandler)
   
   //TODO Refactor this
   //Helper methods
   function getSidebar(){
      return document.getElementById("sidebar")
   }
   
   function getSidebarWin(){
      return getSidebar().contentWindow;
   }
   
   function getSidebarWinHandler() {
      var sidebarWindow = getSidebarWin() 
      // Verify that our sidebar is open at this moment:
      if (sidebarWindow && sidebarWindow.location.href == CYW_SIDEBAR_URL) {
         return sidebarWindow.customizeyourweb.CywSidebarWinHandler
      } else {
         return null
      }
   }
   //Make this method also public
   EditScriptHandler.getSidebarWinHandler=getSidebarWinHandler
   
   function getEgMenuPopup(){
      return document.getElementById('cywEditPopup')
   }
   
   function hideSidebar() {
      if (isSidebarWinOpen()){
         getSidebarWinHandler().removeUnloadHandler()
         toggleSidebar(CYW_SIDEBAR_ID)
      }
   }
   
   function initSidebarWin() {
      if (isSidebarWinOpen())
         getSidebarWinHandler().initWindow()
      else
         showSidebar()
   }

   function isSidebarWinOpen(){
      return document.getElementById(CYW_SIDEBAR_ID).getAttribute('checked')=="true"
   }

   function showSidebar(){
      toggleSidebar(CYW_SIDEBAR_ID, true)
   }
   
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "EditScriptHandler", EditScriptHandler)
   
   //Helper functions
   function byId(id){
      return document.getElementById(id)
   }
})()
}