with(customizeyourweb){
(function(){   
   var AbstractTargetedAction = customizeyourweb.AbstractTargetedAction
      
   function ClickAction (id, targetDefinition){
      this.AbstractTargetedAction(id, targetDefinition)
      this.button = 0 //Default left click
      this.doubleClick = false //flag indicating a double click
      this.modifierMask = 0 //No modifier pressing while clicking
   }
   
   ClickAction.prototype = {
      constructor: ClickAction,
      
      getButton: function(){
         return this.button
      },

      setButton: function(button){
         this.button = button
      },

      isDoubleClick: function(){
         return this.doubleClick
      },

      setDoubleClick: function(doubleClick){
         this.doubleClick = doubleClick
      },

      getModifierMask: function(){
         return this.modifierMask
      },
      
      setModifierMask: function(modifierMask){
         this.modifierMask = modifierMask
      },
      
      doActionInternal: function(cywContext){//Todo change
         if(this.isTargetOptionalAndTargetMissing(cywContext)){
            return false
         }
         var target = this.getTarget(cywContext)
         function performEvent(type){
            var clickEvent = cywContext.getTargetDocument().createEvent("MouseEvents");
            clickEvent.initMouseEvent(type, //type
                                    true, //canBubble
                                    true, //cancelable
                                    cywContext.getTargetWindow(), //view
                                    (this.doubleClick?2:1), //click count
                                    0, 0, 0, 0, //screenX, screenY, clientX, clientY,
                                    this.modifierMask & Event.CONTROL_MASK, 
                                    this.modifierMask & Event.ALT_MASK, 
                                    this.modifierMask & Event.SHIFT_MASK, 
                                    this.modifierMask & Event.META_MASK,
                                    this.button,
                                    null) //relatedTarget
            return target.dispatchEvent(clickEvent)?1:0
         }
         var result = performEvent.apply(this, ["mouseover"])
         result += performEvent.apply(this, ["mousedown"])
         if(this.doubleClick){
            result += performEvent.apply(this, ["dblclick"])
         }else{
            result += performEvent.apply(this, ["click"])
         }
         result += performEvent.apply(this, ["mouseup"])
         
         if(result==0)
            throw new Error("Click Event not successfully dispatched")
         return true
      },
      
      doActionForCachedPageInternal: function(cywContext){
         return this.doActionInternal(cywContext)
      }
      
      
   }
   
   ObjectUtils.extend(ClickAction, "AbstractTargetedAction", customizeyourweb)
   
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "ClickAction", ClickAction)

})()
}