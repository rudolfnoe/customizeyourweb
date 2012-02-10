with(customizeyourweb){
(function(){
   const CYW_SHORTCUT_MANAGER = "cywActionShortcutManager";
   const CYW_SHORTSTRING_MANAGER = "cywActionShortstringManager";
   const CONTEXT_IDS = [CYW_SHORTCUT_MANAGER, CYW_SHORTSTRING_MANAGER];
   
   function AbstractShortcutAction(){
      this.combinedKeyCode = null
      this.shortString = null
      this.t_shortcutManagerClientId = null
      //Reference to cywContext need as cyw is need on shortcut execution
      this.t_cywContext = null
   }
   
   //Static methods
   AbstractShortcutAction.getShortcutManager = function(targetWin){
      var contentWin = targetWin.top
      var scm = TabContextManager.getContext(contentWin, CYW_SHORTCUT_MANAGER)
      if(scm == null){
         scm = TabContextManager.setContext(contentWin, CYW_SHORTCUT_MANAGER, 
                                            new ShortcutManager(Firefox.getBrowserForContentWin(targetWin), "keydown", false));
      }
      return scm;
   }
   
   AbstractShortcutAction.getShortStringManager = function(targetWin){
      var contentWin = targetWin.top
      var ssm = TabContextManager.getContext(contentWin, CYW_SHORTSTRING_MANAGER)
      if(ssm == null){
         ssm = TabContextManager.setContext(contentWin, CYW_SHORTSTRING_MANAGER, 
            new ShortStringManager(Firefox.getBrowserForContentWin(targetWin), 
                                    CywConfig.getPref("shortcut.executionDelay"), 
                                    CywConfig.getPref("keys.blockKeyboardInputForEnteringShortString")));
      }
      return ssm;
   }
   
   //Member methods
   AbstractShortcutAction.prototype = {
      constructor: AbstractShortcutAction,

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
      
      /*REFACTOR Better names needed*/
      abstractPerform: function(cywContext){
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
      abstractPerformShortcut: function(keyboardEvent){
         var activeElement = DomUtils.getActiveElement(this.t_cywContext.getTargetWindow().top)
         //If focus is within editable field and no modifier is pressed do nothing
         if(DomUtils.isEditableElement(activeElement) && 
            !AbstractShortcutAction.getShortcutManager(this.t_cywContext.getTargetWindow()).hasModifier(keyboardEvent)){
            return
         }
         return this.abstractPerform(this.t_cywContext)
      },
      
      abstractPerformShortString: function(){
         return this.abstractPerform(this.t_cywContext)
      },

      clearAllShortcutManager: function(targetWin){
         var contentWin = targetWin.top
         for (var i = 0; i < CONTEXT_IDS.length; i++) {
            var scm = TabContextManager.getContext(contentWin, CONTEXT_IDS[i])
            if(scm != null){
               scm.clearAllShortcuts(this.getShortcutManagerClientId(targetWin))
            }
         }
      },
      
      destroyAllShortcutManager: function(targetWin){
         var contentWin = targetWin.top
         for (var i = 0; i < CONTEXT_IDS.length; i++) {
            var scm = TabContextManager.getContext(contentWin, CONTEXT_IDS[i])
            if(scm != null){
               scm.destroy();
               TabContextManager.removeContext(contentWin, CONTEXT_IDS[i]);
            }
         }
      },
      
      doActionForCachedPageInternal: function(cywContext){
         return this.doActionInternal(cywContext)
      },
      
      superCleanUp: function(cywContext){
         //TODO Mem leak
         this.t_cywContext = null
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
      
      getShortcutManagerClientId: function(targetWin){
         if(!this.t_shortcutManagerClientId){
            this.t_shortcutManagerClientId = targetWin.location.href + "_" + (new Date()).getTime()
         }
         return this.t_shortcutManagerClientId
      },
      
      performShortcut: function(){
         throw new Error('must be implemented')
      },
      
      registerShortcut: function(cywContext){
         this.t_cywContext = cywContext
         if(this.combinedKeyCode==null && this.shortString==null)
            throw new Error('either combinedKeyCode or shortString must be set')
         var targetWin = cywContext.getTargetWindow()
         var shortcutCliendId = this.getShortcutManagerClientId(targetWin)
         if(this.combinedKeyCode){
            var scm = AbstractShortcutAction.getShortcutManager(targetWin)
            scm.addShortcut(this.combinedKeyCode, this.abstractPerformShortcut, this, shortcutCliendId)
         }
         if(this.shortString){
            var ssm = AbstractShortcutAction.getShortStringManager(targetWin)
            ssm.addShortcut(this.shortString, this.abstractPerformShortString, this, shortcutCliendId)
         }
      }
   }

   Namespace.bindToNamespace("customizeyourweb", "AbstractShortcutAction", AbstractShortcutAction);
})()
}