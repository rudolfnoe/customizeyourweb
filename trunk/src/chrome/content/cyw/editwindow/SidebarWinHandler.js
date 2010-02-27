with(customizeyourweb){
(function(){

	const EDIT_WIN_SHORTCUTS = "EDIT_WIN_SHORTCUTS";
   const ACTION_SELECTION_CHANGEND_EVENT = "ACTION_SELECTION_CHANGEND_EVENT";
	
   var unloadHandler = {handleEvent: function(){CywSidebarWinHandler.handleUnexpectedUnload()}}
   
   function byId(id){
      return document.getElementById(id)
   }
   
	var CywSidebarWinHandler = {
      //Variables
      actionsTreeView: null,
      //Id for script which is currently edited
      currentScriptId: null,
      //Backup of currently edited script for detecting changes
      currentScriptBackup: null,
      eventManager: new GenericEventSource(),
      idToScriptMap: new Map(),
      includeUrlPatternsELB: null,
      excludeUrlPatternsELB: null,
      shortcutManager: new ShortcutManager(window, "keydown", true),
      sidebarContext: null,
      
      
      //Functions
      /*
       * Add or updates action
       * @param AbstractAction action
       * @param AbstractAction parentAction: Container action which acts as parent for action
       * @param Window actionTargetWindow: Window the action belongs to
       * @retuns if add or update was successfull 
       */
      addOrUpdateAction: function(action, actionTargetWindow){
      	if(byId('includePatterns').itemCount==0){
      		this.setUrlPatternWithMostLikely(actionTargetWindow)
      	}
         var currentScript = this.getCurrentScript()
      	if(!currentScript.matchUrl(actionTargetWindow.location.href)){
            var message = "Action could not be added as URL of window doesn't match with the url patterns defined for this script."
      		this.setMessage(message, Severity.ERROR)
      		return false
      	}
      	this.setMessage("")
         currentScript.setActionId(action)
         this.actionsTreeView.addOrUpdateAction(action)
         return true
      },
      
      addScriptToML: function(script, isAppliedScript){
         this.idToScriptMap.put(script.getIdAsString(), script)
         var scriptLabel = ""
         if(script.isPersisted()){
            if(isAppliedScript){
               scriptLabel = "[+] "
            }else{
               scriptLabel = "[--] "
            }
            if(script.getName()!=null && script.getName().length>0){
               scriptLabel += script.getName() + " - "
            }
            scriptLabel += script.getUrlPatternDescription()
         }else{
            scriptLabel = "New Script" 
         }
         var newItem = byId('scripts').appendItem(scriptLabel, script.getIdAsString(), null)
      },

      addActionSelectionChangedListener: function(callbackFuncOrEventHandler, thisObj){
         this.eventManager.addListener(ACTION_SELECTION_CHANGEND_EVENT, callbackFuncOrEventHandler, thisObj)
      },

      addShortcut: function(tabSCM, keyCombination, shortcutTarget){
         tabSCM.addShortcut(keyCombination, shortcutTarget, null, EDIT_WIN_SHORTCUTS)
         this.shortcutManager.addShortcut(keyCombination, shortcutTarget, null, EDIT_WIN_SHORTCUTS)
      },
      
      cancel: function(sidebarClosedAbnormal){
         if(this.isSaveScriptOnModification()){
            this.saveScript(sidebarClosedAbnormal)
         }else{
            if(this.isScriptModified())
               this.reloadContentIfWanted(this.getTargetWin(), this.currentScriptBackup)
            this.getEditScriptHandler().cancelEditing(!sidebarClosedAbnormal)
         }
      },
      
      checkTargetDefinitionForAction: function(event){
         var actionTreeViewItem = event.item
         if(actionTreeViewItem.hasMessage() || !ObjectUtils.instanceOf(actionTreeViewItem, AbstractActionTreeItem)){
               return
         }
         var action = actionTreeViewItem.getAction()
         if(!ObjectUtils.instanceOf(action, AbstractTargetedAction) ||
            ObjectUtils.instanceOf(action, RemoveAction) ||
            ObjectUtils.instanceOf(action, CutAction)){
               return
         }
         
         var targetWinDefinition = new TargetWinDefinition(this.includeUrlPatternsELB.getValues(), this.excludeUrlPatternsELB.getValues())
         var targetFound = false
         targetWinDefinition.iterateMatchingWins(this.getTargetWin(), function(subWin){
            if(action.isTargetInPage(subWin)){
               targetFound = true
            }
         }, this)
         if(!targetFound){
            actionTreeViewItem.setMessage(
               ScriptErrorHandler.createWarning(ErrorConstants.TARGET_NOT_FOUND, [action.getTargetDefinition().getDefinitionAsString()]))
         }else{
            actionTreeViewItem.clearMessage()
         }
      },
      
      clearIncludeAndExcludePatterns: function(){
         this.includeUrlPatternsELB.setItems([], [])
         this.excludeUrlPatternsELB.setItems([], [])
      },
      
      copyAction: function(){
         this.actionsTreeView.copyAction()   
      },
      
      cutAction: function(){
         this.actionsTreeView.cutAction()   
      },
      
      deleteScript: function(){
      	var confirm = PromptService.confirmYesNo(window, "Delete Script?", "Would you like to delete the currently selected script?")
      	if(confirm==PromptReply.NO)
      	   return
      	var scriptML = byId('scripts')
      	var scriptId = scriptML.value
      	this.getEditScriptHandler().deleteScript(scriptId)
         this.reloadContentIfWanted(this.getTargetWin(), this.idToScriptMap.get(scriptId))
         
         //clean up
      	this.idToScriptMap.remove(scriptId) 
      	//First init win with script to set currentScriptId
      	var selIndex = scriptML.selectedIndex
         if(selIndex < scriptML.itemCount-1){
            var newSelItem = scriptML.getItemAtIndex(selIndex+1)
         }else{
            var newSelItem = scriptML.getItemAtIndex(selIndex-1)
         }
         this.initWinWithScript(newSelItem.value)
         //Then ajust ML 
      	scriptML.removeItemAt(selIndex)
         //Select new item in the list
      	scriptML.selectedItem = newSelItem
         
      },
      
      doOnload: function(){
         this.initWindow()
         window.addEventListener("beforeunload", unloadHandler, true)
      },
      
      editAction: function(){
         var selectedAction = this.actionsTreeView.getSelectedAction()
         var modifiedAction = null
         try{
            var modifiedAction = this.getEditScriptHandler().doEditAction(selectedAction, this.getCurrentScript())
         }catch(e){
            Log.logError(e)
            this.setMessage(e.message, Severity.ERROR)
         }
         if(modifiedAction!=null)
            this.actionsTreeView.updateAction(modifiedAction)
      },

      
      focusControl: function(id){
         byId(id).focus()
      },
      
      getActions: function(){
         return this.actionsTreeView.getActions() 
      },
      
      getSidebarContextForSaving: function(){
         //Update idToScriptMap
      	var currentScript = this.getCurrentScript()
      	this.idToScriptMap.put(currentScript.getIdAsString(), currentScript)
      	var scripts = new ArrayList(this.idToScriptMap.values())
      	this.sidebarContext.scripts = scripts
      	this.sidebarContext.currentScriptId = currentScript.getIdAsString()
      	this.sidebarContext.currentScriptBackup = this.currentScriptBackup
      	return this.sidebarContext
      },
      
      getCurrentScript: function(){
         try{
         	var currentScript = this.idToScriptMap.get(this.currentScriptId)
            currentScript.setName(byId('name').value)
            currentScript.setDisabled(byId('scriptDisabled').checked)
            currentScript.setIncludeUrlPatterns(this.includeUrlPatternsELB.getValues())
            currentScript.setExcludeUrlPatterns(this.excludeUrlPatternsELB.getValues())
            currentScript.setActions(this.actionsTreeView.getActions())
            currentScript.setLoadEventType(byId('loadEventType').value)
            currentScript.setBehaviorOnMutationEvent(byId('behaviorOnMutationEvent').value)
            currentScript.setApplyToTopWindowsOnly(byId('onlyToTopWindowCB').checked)
            return currentScript
         }catch(e){
            CywUtils.logError(e)
            throw e
         }
      },
      
      getEditScriptHandler: function(){
         return this.sidebarContext.editScriptHandler
      },
      
      getSelectedAction: function(){
         return this.actionsTreeView.getSelectedAction()   
      },
      
      getTargetWin: function(){
         return this.sidebarContext.targetWin
      },
      
      handleActionTreeSelect: function(event){
         byId('dialogheader').clearMessage()
      	var actionTree = event.target
         var selectedAction = this.actionsTreeView.getSelectedAction()
         //it could be that selection is empty
         if(selectedAction){
            byId('editActionCmd').setAttribute('disabled', "false")
            byId('copyActionCmd').setAttribute('disabled', "false")
            byId('cutActionCmd').setAttribute('disabled', "false")
            byId('moveUpCmd').setAttribute('disabled', "false")
            byId('moveDownCmd').setAttribute('disabled', "false")
            byId('removeActionCmd').setAttribute('disabled', "false")
         }else{
            byId('copyActionCmd').setAttribute('disabled', "true")
            byId('cutActionCmd').setAttribute('disabled', "true")
            byId('moveUpCmd').setAttribute('disabled', "true")
            byId('moveDownCmd').setAttribute('disabled', "true")
            byId('removeActionCmd').setAttribute('disabled', "true")
            byId('editActionCmd').setAttribute('disabled', "true")
         }
         
         var selectedItem = this.actionsTreeView.getSelectedItem()
         if(selectedItem && selectedItem.isContainer()){
            byId('pasteActionTreeClipboardCmd').setAttribute('disabled', "false")
         }else{
            byId('pasteActionTreeClipboardCmd').setAttribute('disabled', "true")
         }

         if(selectedAction && selectedItem.hasMessage()){
            var message = selectedItem.getMessage()
            byId('dialogheader').setMessage(message.getText(), message.getSeverity())
         }
               
         if(selectedAction==null || 
            !ObjectUtils.instanceOf(selectedAction, AbstractTargetedAction) ||
            ObjectUtils.instanceOf(selectedAction, RemoveAction)){
            this.getEditScriptHandler().unhighlightActionTargets()
         }else{
            var targetFound = this.getEditScriptHandler().highlightActionTargets(this.getCurrentScript(), selectedAction.getTargetDefinition())
            if(!targetFound && !selectedItem.hasMessage()){
               var errorMessage = ScriptErrorHandler.getErrorMessage(ErrorConstants.TARGET_NOT_FOUND, 
                  [selectedAction.getTargetDefinition().getDefinitionAsString()])
               byId('dialogheader').setWarningMessage(errorMessage)
            }
         }

         //Notify listeners
         this.notifyListeners({type:ACTION_SELECTION_CHANGEND_EVENT, selectedAction:selectedAction})
          
      },
      
      handleUrlPatternsChanged: function(){
         if(this.includeUrlPatternsELB.getItemCount()==0)
            this.getEditScriptHandler().unshadowFrames()
         else
            this.getEditScriptHandler().shadowFrames(new TargetWinDefinition(this.includeUrlPatternsELB.getValues(), this.excludeUrlPatternsELB.getValues()))
      },
            
      handleScriptSelect: function(event){
         var scriptsML = event.target
         var selectedScriptId = scriptsML.value
         if(this.currentScriptId!=selectedScriptId){
            if(this.isSaveScriptOnModification()){
               this.getEditScriptHandler().applyScript(this.getCurrentScript())
            }
            this.initWinWithScript(selectedScriptId)
         }
         var selectedScript = this.idToScriptMap.get(selectedScriptId)
         byId('deleteScriptCmd').setAttribute('disabled', !selectedScript.isPersisted())
      },
      
      handleUnexpectedUnload: function(){
         this.cancel(true)   
      },
      
      initShortcuts: function(){
      	var scm = this.getEditScriptHandler().getShortcutManager()
      	scm.clearAllShortcuts(EDIT_WIN_SHORTCUTS)
         this.shortcutManager.clearAllShortcuts(EDIT_WIN_SHORTCUTS)
         this.addShortcut(scm, "shift+alt+p", Utils.bind(function(){this.focusControl("scripts")}, this))
         this.addShortcut(scm, "shift+alt+l", Utils.bind(function(){this.selectScript()}, this))
         this.addShortcut(scm, "shift+alt+u", Utils.bind(function(){this.focusControl("includePatterns")}, this))
         this.addShortcut(scm, "shift+alt+a", Utils.bind(function(){this.focusControl("actionsTreeView")}, this))
         this.addShortcut(scm, "shift+alt+e", new CommandShortcut(byId('editActionCmd')))
         this.addShortcut(scm, "shift+alt+r", new CommandShortcut(byId('removeActionCmd')))
         this.addShortcut(scm, "shift+alt+d", new CommandShortcut(byId('deleteScriptCmd')))
         this.addShortcut(scm, "shift+alt+s", Utils.bind(function(){this.saveScript(false)}, this))
         this.addShortcut(scm, "ctrl+s", Utils.bind(function(){this.saveScript(false)}, this))
         this.addShortcut(scm, "shift+alt+c", Utils.bind(function(){this.cancel(false)}, this))
         
         //Element specifc shortcuts
         this.shortcutManager.addShortcutForElement('actionsTreeView', "ctrl+c", new CommandShortcut(byId('copyActionCmd')))
         this.shortcutManager.addShortcutForElement('actionsTreeView', "ctrl+x", new CommandShortcut(byId('cutActionCmd')))
         this.shortcutManager.addShortcutForElement('actionsTreeView', "Return", new CommandShortcut(byId('editActionCmd')))
         this.shortcutManager.addShortcutForElement('actionsTreeView', "ctrl+up", new CommandShortcut(byId('moveUpCmd')))
         this.shortcutManager.addShortcutForElement('actionsTreeView', "ctrl+down", new CommandShortcut(byId('moveDownCmd')))
         this.shortcutManager.addShortcutForElement('actionsTreeView', "ctrl+v", new CommandShortcut(byId('pasteActionTreeClipboardCmd')))
         this.shortcutManager.addShortcutForElement('actionsTreeView', "Delete", new CommandShortcut(byId('removeActionCmd')))
      },
      
      initWindow: function(){
         //Store sidebar context
         this.sidebarContext = Application.storage.get(CywCommon.CYW_EDIT_CONTEXT_STORAGE_ID, null)
         if(this.sidebarContext==null)
            throw new Error('No edit context in application storage')
         
         //initShortcuts
         this.initShortcuts()
         
         //Fill scripts menulist
         var scripts = this.sidebarContext.scripts
         var scriptML = byId('scripts')
         ControlUtils.clearMenulist(scriptML)
         var firstMatchingScriptIndex = -1
         this.sortScripts(scripts)
         for (var i = 0; i < scripts.size(); i++) {
            var script = scripts.get(i)
            var isAppliedScript = script.matchesWinOrSubwin(this.getTargetWin())
            if(firstMatchingScriptIndex == -1 && isAppliedScript){
               firstMatchingScriptIndex = i
            }
            this.addScriptToML(script, isAppliedScript)
         }
                  
         //Fill proposals menulist
         var targetWin = this.sidebarContext.targetWin
         var urlPatternProposalsML = byId('urlPatternProposals')
         DomUtils.iterateWindows(targetWin, function(subWin){
            var urlPatterns = UrlUtils.createUrlPatterns(subWin.location.href)
            urlPatterns.reverse()
            ControlUtils.appendItemsToMenulist(urlPatternProposalsML, urlPatterns, urlPatterns)
         })
         //set crop center for better view
         DomUtils.iterateDescendantsByTagName(urlPatternProposalsML, "menuitem", function(menuitem){
            menuitem.setAttribute('crop', "center")
         })
         
         
         //Create Include pattersn edit listbox
         var menulistCellEditor = new GenericMenulistCellEditor(byId('urlPatternProposals')) 
         this.includeUrlPatternsELB = new EditListbox(byId('includePatterns'), menulistCellEditor)
         this.includeUrlPatternsELB.addListener("*", this.handleUrlPatternsChanged, this)
         
         //Create exclude pattern edit listbox
         this.excludeUrlPatternsELB = new EditListbox(byId('excludePatterns'), menulistCellEditor)
         this.excludeUrlPatternsELB.addListener("*", this.handleUrlPatternsChanged, this)

         var selectedScriptId = null
         if(this.sidebarContext.currentScriptId!=null){
            selectedScriptId = this.sidebarContext.currentScriptId
         }else if(firstMatchingScriptIndex != -1){
            selectedScriptId = scripts.get(firstMatchingScriptIndex).getIdAsString()
         }else{
            selectedScriptId = scripts.get(scripts.size()-1).getIdAsString()
         }
         
         //First init win so that init is not done twice via selection of menulist
         this.initWinWithScript(selectedScriptId, this.sidebarContext.currentScriptBackup)
         ControlUtils.selectMenulistByValue(scriptML, selectedScriptId)
      },
      
      //TODO is called twice during on load, one time directly and one time via the script select handler
      //TODO check function as sequential dependencies
      initWinWithScript: function(scriptId, scriptBackup){
         this.currentScriptId = scriptId
         //get script by id
         var currentScript = this.idToScriptMap.get(scriptId)
         
         //set name and id
         byId('name').value = StringUtils.defaultString(currentScript.getName())
         byId('scriptId').value = StringUtils.defaultString(currentScript.getIdAsString())
         
         //set disabled flag
         byId('scriptDisabled').checked = currentScript.isDisabled()
         
         //set other options
         byId('loadEventType').value = currentScript.getLoadEventType()
         byId('behaviorOnMutationEvent').value = currentScript.getBehaviorOnMutationEvent()
         byId('onlyToTopWindowCB').checked = currentScript.isApplyToTopWindowsOnly()
         
         //setting of include/exclude patterns
         this.clearIncludeAndExcludePatterns()
         if(currentScript.isPersisted()){
            var includePatternStrings = currentScript.getIncludeUrlPatternStrings()
            this.includeUrlPatternsELB.setItems(includePatternStrings, includePatternStrings)
            var excludePatternStrings = currentScript.getExcludeUrlPatternStrings()
            this.excludeUrlPatternsELB.setItems(excludePatternStrings, excludePatternStrings)
         }else if(byId('includePatterns').itemCount==0 && !DomUtils.containsFrames(this.sidebarContext.targetWin)){
            this.setUrlPatternWithMostLikely(this.sidebarContext.targetWin)
         }
         
         //fill actions tree
         this.actionsTreeView = new ActionsTreeView(byId('actionsTreeView'), currentScript)
         //TODO rethink about that
         this.actionsTreeView.addListener("add", this.checkTargetDefinitionForAction, this)   
         this.actionsTreeView.addListener("update", this.checkTargetDefinitionForAction, this)
         this.actionsTreeView.setActions(currentScript.getActions(), ScriptErrorHandler.getErrorsForScript(scriptId))
         
         //After actions tree is filled shadowing fo

         //Save backup for detecting changes
         if(scriptBackup!=null)
            this.currentScriptBackup = scriptBackup
         else
            this.currentScriptBackup = ObjectUtils.deepClone(this.getCurrentScript())
            
      },
      
      isSaveScriptOnModification: function(){
         if(this.isScriptModified()){
            var result = PromptService.confirmYesNo(window, "Save Script?", "Would you like to save the modified script?")
            if(result==PromptReply.YES){
               return true
            }
         }
         return false
      },
      
      isScriptModified: function(){
         return !ObjectUtils.deepEquals(this.currentScriptBackup, this.getCurrentScript())
      },
      
      moveDown: function(){
         this.actionsTreeView.moveSelectedDown()
      },

      moveUp: function(){
         this.actionsTreeView.moveSelectedUp()
      },
      
      notifyListeners: function(event){
         this.eventManager.notifyListeners(event)
      },
      
      pasteActionTreeClipboard: function(){
         this.actionsTreeView.pasteClipboard()   
      },
      
      reloadContentIfWanted: function(win, script){
         if(CywConfig.isAutoUpdateOnSave())
            this.getEditScriptHandler().reloadPage(win, script)
      },
      
      removeUnloadHandler: function(){
         window.removeEventListener("beforeunload", unloadHandler, true)
      },
      
      removeAction: function(action){
         if(action)
            this.actionsTreeView.removeAction(action)
         else
            this.actionsTreeView.removeSelected(true)
      },
      
      retargetSelectedAction: function(newTargetDefinition){
         var selectedAction = this.actionsTreeView.getSelectedAction()   
         if(!selectedAction || !ObjectUtils.instanceOf(selectedAction, AbstractTargetedAction))
            return
         selectedAction.setTargetDefinition(newTargetDefinition)
         this.actionsTreeView.notifyActionUpdate(selectedAction)
      },
      
      saveScript: function(sidebarClosedAbnormal){
         this.includeUrlPatternsELB.stopEditing()
         this.getEditScriptHandler().saveScript(this.getCurrentScript(), sidebarClosedAbnormal)
      },
      
      selectScript: function(){
          var selectDialog = new Dialog(CywCommon.CYW_CHROME_URL+"editwindow/select_script_dialog.xul", "SelectScript", true, window, "all")
          selectDialog.show()
          var selectedScript = selectDialog.getNamedResult("script") 
          if(!selectedScript)
            return
          this.addScriptToML(selectedScript)
          ControlUtils.selectMenulistByValue(byId('scripts'), selectedScript.getIdAsString())
      },
      
      setUrlPatternWithMostLikely: function(win){
         var mostLikelyPattern = UrlUtils.getMostLikelyPattern(win.location.href)
         byId('includePatterns').appendItem(mostLikelyPattern, mostLikelyPattern)
      },
      
      setMessage: function(message, severity){
         byId('dialogheader').setMessage(StringUtils.defaultString(message), severity)
      },
      
      /*
       * Sort scripts according the following rules
       * - Matching scripts before not matching scripts
       * - Within group according last edited timestamp in decending order
       * - "New Script" always at the end
       */
      sortScripts: function(scripts){
         var targetWin = this.getTargetWin()
         scripts.sort(function(scriptA, scriptB){
            aIsApplied = scriptA.matchesWinOrSubwin(targetWin)      
            bIsApplied = scriptB.matchesWinOrSubwin(targetWin)
            if(!scriptA.isPersisted()){
               return 1
            }else if(!scriptB.isPersisted()){
               return -1
            }else if(aIsApplied!=bIsApplied){
               return aIsApplied?-1:1
            }else{
               return scriptB.getLastEdited() - scriptA.getLastEdited()
            }
         })
      },
      
      updateAction: function(action){
         this.setMessage(null)
         this.actionsTreeView.updateAction(action)
      }
      
   }
   
	customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "CywSidebarWinHandler", CywSidebarWinHandler)
})()
}
