with(customizeyourweb){
(function(){   
   
   function ToggleVisibilityShortcutAction (targetDefinition){
      this.AbstractShortcutAction()
      this.AbstractTargetedAction(targetDefinition)
      this.combinedKeyCode = null
      this.targetWrapper = null
      this.initStateHidden = true
      this.currentStateHidden = this.initStateHidden
      this.keepSpaceIfHidden = false
   }
   
   ToggleVisibilityShortcutAction.prototype = {
      constructor: ToggleVisibilityShortcutAction,
      
      getCombinedKeyCode: function(){
         return this.combinedKeyCode
      },
   
      setCombinedKeyCode: function(combinedKeyCode){
         this.combinedKeyCode = combinedKeyCode
      },

      isCurrentStateHidden: function(){
         return this.currentStateHidden
      },

      getInitStateHidden: function(){
         return this.initStateHidden
      },

      setInitStateHidden: function(initStateHidden){
         this.initStateHidden = initStateHidden
      },

      isKeepSpaceIfHidden: function(){
         return this.keepSpaceIfHidden
      },

      setKeepSpaceIfHidden: function(keepSpaceIfHidden){
         this.keepSpaceIfHidden = keepSpaceIfHidden
      },
      
      getTargetWrapper: function(targetElement){
         if(!this.targetWrapper){
            this.targetWrapper = new ElementWrapper(targetElement)
         }
         return this.targetWrapper
      },

      doActionInternal: function(cywContext){
         this.registerShortcut(cywContext)
         if(this.isTargetOptionalAndTargetMissing(cywContext)){
            return
         }
         var targetElement = this.getTarget(cywContext) 
         if(this.initStateHidden)
            this.hideElement(targetElement)
         else
            this.showElement(targetElement)
      },
      
      hideElement: function(targetElement){
         if(this.isKeepSpaceIfHidden()){
            this.getTargetWrapper(targetElement).setStyle("visibility", "hidden", "important")
         }else{
            this.getTargetWrapper(targetElement).setStyle("display", "none", "important")
         }
         this.currentStateHidden = true
      },
      
      performShortcut: function(cywContext){
         if(this.isTargetOptionalAndTargetMissing(cywContext)){
            return
         }
         var targetElement = this.getTargetWithoutError(cywContext)
         if(!targetElement)
            return
         if(this.isCurrentStateHidden())
            this.showElement(targetElement)
         else
            this.hideElement(targetElement)
      },
      
      showElement: function(targetElement){
         this.getTargetWrapper(targetElement).restore()
         this.currentStateHidden = false
      }
      
   }
   
   ObjectUtils.extend(ToggleVisibilityShortcutAction, "AbstractShortcutAction", customizeyourweb)
   ObjectUtils.extend(ToggleVisibilityShortcutAction, "AbstractTargetedAction", customizeyourweb)   
   
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "ToggleVisibilityShortcutAction", ToggleVisibilityShortcutAction)
   
})()
}