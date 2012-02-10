with(customizeyourweb){
(function(){
   var SelectScriptDialogHandler = {
      
      doCancel: function(){
      },
      
      doOk: function(){
         var selectedScript = this.getScriptsTree().getTreeView().getSelectedScript()
         if(selectedScript==null){
            alert('No script was selected.')
            return false
         }
         Dialog.setNamedResult("scriptId", selectedScript.getId())
      },
      
      getScriptsTree: function(){
         return byId('scriptsTree')
      }
      
   }
   Namespace.bindToNamespace("customizeyourweb", "SelectScriptDialogHandler", SelectScriptDialogHandler)

   //Helper functions
   function byId(id){
      return document.getElementById(id)
   }   

})()
}