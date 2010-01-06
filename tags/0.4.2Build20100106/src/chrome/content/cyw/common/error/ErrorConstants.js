with(customizeyourweb){
(function(){
   var ErrorConstants = {
      ACTION_FAILED: "ACTION_FAILED",
      CLEAN_UP_FAILED: "CLEAN_UP_FAILED",
      NON_UNIQUE_TARGET_DEFINITION: "NON_UNIQUE_TARGET_DEFINITION",
      TARGET_NOT_FOUND: "TARGET_NOT_FOUND",
      TARGET_NOT_FOUND_ON_EDITING: "TARGET_NOT_FOUND_ON_EDITING"
   }

   Namespace.bindToNamespace("customizeyourweb", "ErrorConstants", ErrorConstants)
})()
}