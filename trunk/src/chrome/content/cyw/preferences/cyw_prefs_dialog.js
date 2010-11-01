/* 

  customizeyourweb
  Version 0.1
  Created by Rudolf Noe
*/
//Imports
 with(customizeyourweb){
(function(){
   const STRINGBUNDLE_ID = "jsStrings"
   
   /*
    * Handler for prefs dialog
    * ENHANCEMENT: Add config option for default target def style 
    * ENHANCEMENT: Add id to script overview 
    */
   var CywPrefsDialogHandler = {
      //Shortcutmanager for ScriptsTree-Element
      scriptsTreeScm: null,
      
      doOnload: function(){
      	Prefs.loadPrefs(document);
         this.initShortcuts()
      },
      
      exportScripts: function(){
         var selectedScripts = this.getScriptsTreeView().getSelectedScripts()
         if(selectedScripts.length==0){
            alert("Nothing selected!")
            return
         }
         ScriptExporter.exportScriptsToDisk(selectedScripts)
      },
      
      getScriptsTree: function(){
         return byId('scriptsTree')
      },
      
      getScriptsTreeView: function(){
         return this.getScriptsTree().getTreeView()
      },
      
      importScripts: function(){
         var importedScripts = ScriptImporter.importScriptsFromDisk()
         if(importedScripts){//Import was not aborted
            for (var i = 0; i < importedScripts.length; i++) {
               this.getScriptsTreeView().addOrReplaceScript(importedScripts[i])
            }
         }
      },
      
      initShortcuts: function(){
         if(this.scriptsTreeScm==null){
            this.scriptsTreeScm = new ShortcutManager(byId('scriptsTree').getTreeElement()),
            this.scriptsTreeScm.addShortcut("DELETE", this.deleteScripts, this)
         }
      },
      
      deleteScripts: function (){
         var selectedIndex = this.getScriptsTree().currentIndex
         if(selectedIndex==-1){
            return
         }
         var result = PromptService.confirmYesNo(window, "Delete Scripts", "Should the selected scripts be permanently deleted?")
         if(result!=PromptReply.YES){
            return
         }
      	var removedItems = this.getScriptsTreeView().removeSelected(true)
         for (var i = 0; i < removedItems.length; i++) {
            CywConfig.deleteScript(removedItems[i].getScript().getId())
         }
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
         Utils.notifyObservers(CywCommon.PREF_OBSERVER);
      },
      
      loadKeyListbox: function(){
         loadKeyListbox('keyListBox')
      },  
      
      saveKeyListbox: function(){
         saveKeyListbox('keyListBox');
      }
   }
   
   Namespace.bindToNamespace("customizeyourweb", "CywPrefsDialogHandler", CywPrefsDialogHandler);
   
})()
}
//Helper function
function byId(id){
   return document.getElementById(id)
}


