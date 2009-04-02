//Probably throw away as FF offers this by default
(function(){with(customizeyourweb){
      
   function ZoomAction (){
      this.AbstractAction()
      this.zoomFactor = null
   }
   
   ZoomAction.prototype ={ 
      constructor: ZoomAction,

      getZoomFactor: function(){
         return this.zoomFactor
      },

      setZoomFactor: function(zoomFactor){
         this.zoomFactor = zoomFactor
      },
      
      doAction: function(cywContext){
         var browser = getBrowserFromContentWindow(cywContext.getTargetWindow())
         
      }    

   }
   
   ObjectUtils.extend(ZoomAction, "AbstractAction", customizeyourweb)
   
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "ZoomAction", ZoomAction)
}})()