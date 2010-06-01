with(customizeyourweb){
(function(){   
   
   function MacroShortcutAction (){
      this.AbstractShortcutAction()
      this.AbstractContainerAction()
      this.AbstractAction()
   }
   
   MacroShortcutAction.prototype = {
      constructor: MacroShortcutAction,
      
      doActionInternal: function(cywContext){
         this.registerShortcut(cywContext)
         return true
      },
      
      isContainer: function(){
         return true
      },
      
      performShortcut: function(cywContext){
         this.doChildActions(cywContext)
      }      
      
   }
   
   ObjectUtils.extend(MacroShortcutAction, "AbstractShortcutAction", customizeyourweb)
   ObjectUtils.extend(MacroShortcutAction, "AbstractContainerAction", customizeyourweb)
   ObjectUtils.extend(MacroShortcutAction, "AbstractNamedAction", customizeyourweb)   
   ObjectUtils.extend(MacroShortcutAction, "AbstractAction", customizeyourweb)
      
   
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "MacroShortcutAction", MacroShortcutAction)
   
})()
}