(function(){with(customizeyourweb){   
   var AbstractTargetedAction = customizeyourweb.AbstractTargetedAction
      
   function ClickAction (targetDefinition){
      this.AbstractTargetedAction(targetDefinition)
      this.modifierMask = 0 //No modifier pressing while clicking
      this.button = 0 //Default left click
   }
   
   ClickAction.prototype = {
      constructor: ClickAction,
      
      getButton: function(){
         return this.button
      },

      setButton: function(button){
         this.button = button
      },

      getModifierMask: function(){
         return this.modifierMask
      },
      
      setModifierMask: function(modifierMask){
         this.modifierMask = modifierMask
      },
      
      doActionInternal: function(cywContext){//Todo change
         if(this.isTargetOptionalAndTargetMissing(cywContext)){
            return
         }
         var target = this.getTarget(cywContext)
         function performEvent(type){
            var clickEvent = cywContext.getTargetDocument().createEvent("MouseEvents");
            clickEvent.initMouseEvent(type, //type
                                    true, //canBubble
                                    true, //cancelable
                                    cywContext.getTargetWindow(), //view
                                    1, //click count
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
         result += performEvent.apply(this, ["click"])
         result += performEvent.apply(this, ["mouseup"])
         
         if(result==0)
            throw new Error("Click Event not successfully dispatched")
      },
      
      doActionForCachedPageInternal: function(cywContext){
         this.doActionInternal(cywContext)
      }
      
      
   }
   
   ObjectUtils.extend(ClickAction, "AbstractTargetedAction", customizeyourweb)
   
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "ClickAction", ClickAction)

}})()