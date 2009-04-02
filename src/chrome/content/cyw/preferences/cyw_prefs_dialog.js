/* 

  customizeyourweb
  Version 0.1
  Created by Rudolf Noé
*/
//Imports
//TODO put in closure
 with(customizeyourweb){
(function(){
   const STRINGBUNDLE_ID = "jsStrings"
   
   var CywPrefsDialogHandler = { 
      
      doOnload: function(){
      	Prefs.loadPrefs(document);
      },
      
      getScriptsTree: function(){
         return byId('scriptsTree')
      },
      
      removeScript: function (){
         var selectedIndex = this.getScriptsTree().currentIndex
      	this.getScriptsTree().getTreeView().removeSelected(true)
         this.getScriptsTree().focusTree()
      },
      
      doOk: function (){
         try{
            //validateUserInput()
         }catch(e){
            alert(e)
            return false
         }
         Prefs.savePrefs(document);
      	CywConfig.setScripts(this.getScriptsTree().getTreeView().getScripts())
      	CywConfig.saveEgConfig()
         Utils.notifyObservers(CywCommon.PREF_OBSERVER);
      }
   }
   
   Namespace.bindToNamespace("customizeyourweb", "CywPrefsDialogHandler", CywPrefsDialogHandler);
   
})()
}
//TODO make it right
//Helper function
function byId(id){
   return document.getElementById(id)
}


