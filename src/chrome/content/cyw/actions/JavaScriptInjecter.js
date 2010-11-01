with(customizeyourweb){
(function(){
   /*
    * Injects JavaScript into content windows
    */
   var JavaScriptInjecter = {
      jQueryCode : null,
      jQueryUICode: null,
      
      /*
       * Reads JQueryCode from File 
       */
      getJQueryCode : function(){
         if(this.jQueryCode==null){
            this.jQueryCode = FileIO.readFromChrome(CywCommon.getJQueryUrl(), "UTF-8")
         }
         return this.jQueryCode
      },

      /*
       * Reads JQueryUI code from file 
       */
      getJQueryUICode : function(){
         if(this.jQueryUICode==null){
            var jQueryUIChromePath = CywCommon.getJQueryUIUrl()
            this.jQueryUICode = FileIO.readFromChrome(jQueryUIChromePath, "UTF-8")
         }
         return this.jQueryUICode
      },
      
      /*
       * Injects JS code into the content document
       */
      injectJavaScript: function(code, contentDoc){
         var scriptTag = contentDoc.createElement('script')
         scriptTag.setAttribute('type', 'text/javascript')
         var jQueryCode = contentDoc.createTextNode(code)
         scriptTag.appendChild(jQueryCode)
         $('head', contentDoc).get(0).appendChild(scriptTag)
      },
      
      /*
       * Injects JQuery into content document
       * @return: JQuery Object
       */
      injectJQuery: function(contentDoc){
         this.injectJavaScript(this.getJQueryCode(), contentDoc)
         var $injected = contentDoc.defaultView.wrappedJSObject.$
         $injected.noConflict(true)
         return $injected
      },

      /*
       * Injects JQuery UI into content document
       * @param contentDoc
       * @param $injected: reference to already injected jQuery object
       * @return: JQuery Object
       * 
       */
      injectJQueryUI: function(contentDoc, $injected){
         Assert.paramsNotNull(arguments)
         //inject css ui stylesheet
         DomUtils.assureStyleSheet(contentDoc, CywCommon.CYW_JQUERY_URL + CywCommon.JQUERY_CSS_SUBPATH)
         
         //inject jQuery UI
         var conentWin = contentDoc.defaultView.wrappedJSObject
         //jQuery UI expects global jQuery variable, therefor backup old
         var jQueryBackup = conentWin.jQuery
         conentWin.jQuery = $injected
         this.injectJavaScript(this.getJQueryUICode(), contentDoc)
         conentWin.jQuery = jQueryBackup
      }
   }

   Namespace.bindToNamespace("customizeyourweb", "JavaScriptInjecter", JavaScriptInjecter)
})()
}