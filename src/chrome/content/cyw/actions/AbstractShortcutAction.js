with(customizeyourweb){
(function(){
   const CYW_SHORTCUT_MANAGER = "cywActionShortcutManager";
   const CYW_SHORTSTRING_MANAGER = "cywActionShortstringManager";
   const CONTEXT_IDS = [CYW_SHORTCUT_MANAGER, CYW_SHORTSTRING_MANAGER]
   
   function AbstractShortcutAction(){
      this.AbstractAction()
      this.combinedKeyCode = null
      this.shortString = null
   }
   
   //Static methods
   AbstractShortcutAction.getShortcutManager = function(targetWin){
      var contentWin = targetWin.top
      var scm = TabContextManager.getContext(contentWin, CYW_SHORTCUT_MANAGER)
      if(scm == null)
         scm = TabContextManager.setContext(contentWin, CYW_SHORTCUT_MANAGER, 
                                            new ShortcutManager(Firefox.getBrowserForContentWin(targetWin), "keydown", false))
      return scm
   }
   
   AbstractShortcutAction.getShortStringManager = function(targetWin){
      var contentWin = targetWin.top
      var ssm = TabContextManager.getContext(contentWin, CYW_SHORTSTRING_MANAGER)
      if(ssm == null)
         ssm = TabContextManager.setContext(contentWin, CYW_SHORTSTRING_MANAGER, 
            new ShortStringManager(Firefox.getBrowserForContentWin(targetWin), 
                                    CywConfig.getPref("shortcut.executionDelay"), 
                                    CywConfig.getPref("keys.blockKeyboardInputForEnteringShortString")))
      return ssm
   }
   
   //Member methods
   AbstractShortcutAction.prototype = {
      constructor: AbstractShortcutAction,
      AbstractShortcutAction: AbstractShortcutAction,

      getCombinedKeyCode: function(){
         return this.combinedKeyCode
      },
   
      setCombinedKeyCode: function(combinedKeyCode){
         this.combinedKeyCode = combinedKeyCode
      },

      getShortString: function(){
         return this.shortString
      },

      setShortString: function(shortString){
         if(StringUtils.isEmpty(shortString)){
            this.shortString = null
         }else{
            this.shortString = shortString
         }
      },
      
      /*TODO refactor, in case renaming of methods for better understanding*/
      abstractPerform: function(cywContext){
         //TODO refactor!!!
         var result = this.performShortcut(cywContext)
         if(!result)
            return ShortcutManager.SUPPRESS_KEY
         else
            return result
      },
      
      /*
       * Template method which is called if a shortcut was pressed
       * Checks whether shortcut is performed (not if no modifier and editable field is active)
       * Calls performShortcut on subclass
       */
      abstractPerformShortcut: function(cywContext, keyboardEvent){
         var activeElement = DomUtils.getActiveElement(cywContext.getTargetWindow().top)
         //If focus is within editable field and no modifier is pressed do nothing
         if(DomUtils.isEditableElement(activeElement) && 
            !AbstractShortcutAction.getShortcutManager(cywContext.getTargetWindow()).hasModifier(keyboardEvent)){
            return
         }
         return this.abstractPerform(cywContext)
      },
      
      abstractPerformShortString: function(cywContext){
         return this.abstractPerform(cywContext)
      },

      clearAllShortcutManager: function(targetWin){
         var contentWin = targetWin.top
         var shortcutCliendId = targetWin.location.href
         for (var i = 0; i < CONTEXT_IDS.length; i++) {
            var scm = TabContextManager.getContext(contentWin, CONTEXT_IDS[i])
            if(scm != null){
               scm.clearAllShortcuts(shortcutCliendId)
            }
         }
      },
      
      destroyAllShortcutManager: function(targetWin){
         var contentWin = targetWin.top
         for (var i = 0; i < CONTEXT_IDS.length; i++) {
            var scm = TabContextManager.getContext(contentWin, CONTEXT_IDS[i])
            if(scm != null){
               scm.destroy()
               TabContextManager.removeContext(contentWin, CONTEXT_IDS[i])
            }
         }
      },
      
      doActionForCachedPageInternal: function(cywContext){
         this.doActionInternal(cywContext)
      },
      
      superCleanUp: function(cywContext){
         var targetWin = cywContext.getTargetWindow()
         if(targetWin.top == targetWin)
            this.destroyAllShortcutManager(targetWin)
         else
            this.clearAllShortcutManager(targetWin)
      },
      
      cleanUp: function(cywContext){
         //Must be delegated as this methode can be overridden by subclasses.
         this.superCleanUp(cywContext)
      },
      
      getDetailedDescription: function(){
         if(this.combinedKeyCode!=null && this.combinedKeyCode>0){
            return KeyInputbox.getStringForKeyCombination(this.combinedKeyCode)    
         }else if(this.shortString!=null){
            return this.shortString
         }else{
            return null
         }
      },
      
      performShortcut: function(){
         throw new Error('must be implemented')
      },
      
      registerShortcut: function(cywContext){
         if(this.combinedKeyCode==null && this.shortString==null)
            throw new Error('either combinedKeyCode or shortString must be set')
         var targetWin = cywContext.getTargetWindow()
         var shortcutCliendId = targetWin.location.href
         if(this.combinedKeyCode){
            var scm = AbstractShortcutAction.getShortcutManager(targetWin)
            scm.addShortcut(this.combinedKeyCode, function(keyboardEvent){return this.abstractPerformShortcut(cywContext, keyboardEvent)}, 
                     this, shortcutCliendId)
         }
         if(this.shortString){
            var ssm = AbstractShortcutAction.getShortStringManager(targetWin)
            ssm.addShortcut(this.shortString, function(){return this.abstractPerformShortString(cywContext)}, 
                     this, shortcutCliendId)
         }
      }
   }

   Namespace.bindToNamespace("customizeyourweb", "AbstractShortcutAction", AbstractShortcutAction)
})()
}