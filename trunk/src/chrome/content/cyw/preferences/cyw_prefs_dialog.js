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
      deletedScripts: [],
      
      doOnload: function(){
      	Prefs.loadPrefs(document);
         this.initEventListener()
      },
      
      getScriptsTree: function(){
         return byId('scriptsTree')
      },
      
      getScriptsTreeView: function(){
         return this.getScriptsTree().getTreeView()
      },
      
      initEventListener: function(){
         this.getScriptsTreeView().addListener("remove", function(event){
            this.deletedScripts.push(event.item.getScript())
         }, this)
      },
      
      removeScript: function (){
         var selectedIndex = this.getScriptsTree().currentIndex
         if(selectedIndex==-1){
            return
         }
      	var removedItem = this.getScriptsTreeView().removeSelected(true)
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
         //Save changed items
         this.getScriptsTreeView().iterateTree(function(item){
            if(item.isDirty()){
               CywConfig.saveScript(item.getScript())
            }
         }, true)
         //Remove deleted Scripts
         for (var i = 0; i < this.deletedScripts.length; i++) {
            CywConfig.deleteScript(this.deletedScripts[i].getId())
         }
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


