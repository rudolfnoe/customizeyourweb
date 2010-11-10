/**
 * @class
 */
with(customizeyourweb){
(function(){
   
   const PROMPT_SERVICE =   Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                        .getService(Components.interfaces.nsIPromptService);
   /*
    * Shows tip of the day with functionality to not show it again
    */
   var TipDialog = {
      /*
       * Shows tip which can be hidden to show next time
       * @param String message
       * @param DOMWindow parentWin
       * @return boolean: true=don't show again, false=show again
       */
      showTip: function(message, parentWin){
         Assert.paramsNotNull(arguments)
         var checkState = {value: false}
         var retValue = PROMPT_SERVICE.confirmCheck(parentWin, "Customize Your Web Tip", message, "Don't show this tip again.", checkState)
         return retValue && checkState.value
      }
   }
   
   Namespace.bindToNamespace("customizeyourweb", "TipDialog", TipDialog)
})()
}