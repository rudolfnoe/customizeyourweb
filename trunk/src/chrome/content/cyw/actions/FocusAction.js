with(customizeyourweb){
(function(){
      
   function FocusAction (id, targetDefinition){
   	this.AbstractTargetedAction(id, targetDefinition)
   }
   
   FocusAction.prototype ={ 
      constructor: FocusAction,
      doActionInternal: function(cywContext){
         if(this.isTargetOptionalAndTargetMissing(cywContext)){
            return false
         }
         var target = this.getTarget(cywContext)
         this.focusTarget(target)
         //Problem: User can change focus to other element between domcontent loaded and onload
//         if(cywContext.isDOMContentLoadedEvent()){
//            var win = cywContext.getTargetWindow()
//            var doc = win.document
//            var onpageshowFunc = Utils.bind(function(event){
//               if(doc.activeElement!=target)
//                  this.focusTarget(target)
//               win.removeEventListener("pageshow", onpageshowFunc, false)
//            }, this)
//            win.addEventListener("pageshow", onpageshowFunc, false)
//         }
         return true
      },
      
      doActionForCachedPageInternal: function(cywContext){
         return this.doActionInternal(cywContext)
      },
      
      focusTarget: function(target){
         if(DomUtils.isEditableIFrame(target)){
            target.contentDocument.defaultView.focus()
            var body = DomUtils.getBody(target.contentDocument)
            if(body){
               body.focus()
            }
         }else if (target.tagName=="IFRAME" || target.tagName=="FRAME"){
            target.contentDocument.defaultView.focus()
         }else{
            var elemWrapper = new ElementWrapper(target)
            if(!target.hasAttribute('tabindex')){
               elemWrapper.setProperty('tabIndex', 0)
            }
            target.focus()
            elemWrapper.restore()
         }
      }
   }
   
   ObjectUtils.extend(FocusAction, "AbstractTargetedAction", customizeyourweb)
   
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "FocusAction", FocusAction)
})()
}