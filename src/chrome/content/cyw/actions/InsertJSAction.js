with(customizeyourweb){
(function(){
      
   function InsertJSAction (id){
      this.AbstractAction(id)
      this.jsCode = null
   }
   
   InsertJSAction.prototype ={ 
      constructor: InsertJSAction,

      getJsCode: function(){
         return this.jsCode
      },

      setJsCode: function(jsCode){
         this.jsCode = jsCode
      },
      
      doActionInternal: function(cywContext){
         var win = cywContext.getTargetWindow()
         var sandbox = new Components.utils.Sandbox(win)
         sandbox.window = win
         sandbox.document = win.document
         sandbox.$ = $
         sandbox.__proto__= sandbox.window
         Components.utils.evalInSandbox("(function(){" + this.jsCode + "})()", sandbox)
         return true
      }     

   }
   
   ObjectUtils.extend(InsertJSAction, "AbstractAction", customizeyourweb)
   
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "InsertJSAction", InsertJSAction)
})()
}