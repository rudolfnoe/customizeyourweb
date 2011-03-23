with(customizeyourweb){
(function(){
   var TestScriptActions = {
      scm: null,
      init: function(){
         this.scm = new ShortcutManager(window, "keydown", true)
         this.scm.addShortcut("Ctrl+Alt+Shift+R", this.reloadConfig, this)
      },
      
      reloadConfig: function(){
         CywConfig.init()
      }
   }
   
   TestScriptActions.init()

   Namespace.bindToNamespace("customizeyourweb", "TestScriptActions", TestScriptActions)
})()
}