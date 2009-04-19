with(customizeyourweb){
(function(){
   
   const gripSize = 4

   function ResizeHighlighter() {
      this.GenericEventSource()
      this.AbstractHighlighter()
   }

   ResizeHighlighter.prototype = {
      
      addOrRemoveEventListeners: function(addOrRemove){
         var funcName = addOrRemove + "EventListener"
         var targetWin = this.targetElement.ownerDocument.defaultView
         targetWin[funcName]("mouseup", this, true)
         targetWin[funcName]("mousemove", this, true)
         targetWin[funcName]("mouseover", this, true)
      },
      
      createNodes : function() {
         var doc = this.getTargetWindow().document;

         function createGrip(name) {
            var div = doc.createElementNS("http://www.w3.org/1999/xhtml", "div");
            div.gripName = name 
            div.cywIgnore = true;
            div.className = "resizeGrip";
            div.style.cursor = name + "-resize"
            div.addEventListener("mousedown", this, true)
            return div;
         }

         var nodes = {}
         var nodeNames = ["n", "ne", "e", "se", "s", "sw", "w", "nw"]
         for (var i = 0; i < nodeNames.length; i++) {
            nodes[nodeNames[i]] = createGrip.apply(this, [nodeNames[i]])            
         }
         
         var span = doc.createElementNS("http://www.w3.org/1999/xhtml", "span");
         span.cywIgnore = true;
         span.className = "sizeInfoSpan"
         nodes.sizeInfoSpan = span
         
         return nodes
      },
      
      drawHighlighter: function(){
         var element = this.getTargetElement()
         var offset = DomUtils.getOffsetToBody(element);
         
         var x = offset.x, y = offset.y;
         var w = element.offsetWidth, h = element.offsetHeight;
         var gh = gripSize/2 + 2

         var nodes = this.getNodes(element);
         var xe = x + w - gh
         var xc = x + w/2 - gh
         var xw = x - gh
         var yn = y - gh
         var yc = y + h/2 - gh
         var ys = y + h - gh

         DomUtils.moveTo(nodes.n, xc, yn);
         DomUtils.moveTo(nodes.ne, xe, yn);
         DomUtils.moveTo(nodes.e, xe, yc);
         DomUtils.moveTo(nodes.se, xe, ys);
         DomUtils.moveTo(nodes.s, xc, ys);
         DomUtils.moveTo(nodes.sw, xw, ys);
         DomUtils.moveTo(nodes.w, xw, yc);
         DomUtils.moveTo(nodes.nw, xw, yn);
      },

      handleMousemove: function(event){
         Utils.stopEvent(event)
         if(this.resizeDirection=="h")
            this.setNewWidth(event.pageX)
         else if (this.resizeDirection=="v")
            this.setNewHeight(event.pageY)
         else {
            this.setNewWidth(event.pageX)
            this.setNewHeight(event.pageY)
         }
         var t = this.getTargetElement()
         var offsets = DomUtils.getOffsetToBody(t)
         DomUtils.moveTo(this.getNodes().sizeInfoSpan, offsets.x + t.offsetWidth, offsets.y)
         this.setSizeInfoText(t.offsetWidth, t.offsetHeight)
         this.removeSelection(event)         
      },

      handleMousedown: function(event){
         var offset = DomUtils.getOffsetToBody(this.getTargetElement())
         this.originalBounds = {
            x: offset.x,
            y: offset.y,
            w: this.getTargetElement().offsetWidth,
            h: this.getTargetElement().offsetHeight
         }
         this.gripName = event.target.gripName
         if(["ne", "nw", "se", "sw"].indexOf(this.gripName)!=-1)
            this.resizeDirection = "x"
         else if (["s", "n"].indexOf(this.gripName)!=-1)
            this.resizeDirection = "v"
         else if (["e", "w"].indexOf(this.gripName)!=-1)
            this.resizeDirection = "h"
         else
            throw new Error ("wrong resize direction")
         this.addOrRemoveEventListeners("add")
         var sizeInfoSpan = this.getNodes().sizeInfoSpan
         sizeInfoSpan.style.display = "inline"
         with(this.originalBounds){
            DomUtils.moveTo(sizeInfoSpan, x+w, y)
            this.setSizeInfoText(x, y)
         }
         this.notifyObservers("resizestart")
      },
      
      //To stop mouseoverevent for frame highlighter
      handleMouseover: function(event){
         Utils.stopEvent(event)
      },

      handleMouseup: function(event){
         this.addOrRemoveEventListeners("remove")
         this.removeSelection(event)
         Utils.stopEvent(event)
         this.getNodes().sizeInfoSpan.style.display = "none"
         this.notifyObservers("resizeend")
      },
      
      notifyObservers: function(type){
         var event = {type:type}
         event.target = this.targetElement
         this.notifyListeners(event)
      },
      
      removeSelection: function(event){
         event.target.ownerDocument.defaultView.getSelection().removeAllRanges()
      },
      
      setNewWidth: function(eventX){
         var newWidth = 0
         if(this.gripName.indexOf("w")!=-1){
            newWidth = this.originalBounds.x + this.originalBounds.w - eventX
         }else{
            newWidth = eventX - this.originalBounds.x 
         }
         this.targetElement.style.setProperty("width", newWidth+"px", "important")
      },
      
      setNewHeight: function(eventY){
         var newHeight = 0
         if(this.gripName.indexOf("n")!=-1){
            newHeight = this.originalBounds.y + this.originalBounds.h - eventY
         }else{
            newHeight = eventY - this.originalBounds.y 
         }
         this.targetElement.style.setProperty("height", newHeight+"px", "important")
      },
      
      setSizeInfoText: function(x, y){
         var span = this.getNodes().sizeInfoSpan
         span.innerHTML = "x: " + x + ", y: " + y
      }
      
   };
   
   ObjectUtils.extend(ResizeHighlighter, AbstractHighlighter)
   ObjectUtils.extend(ResizeHighlighter, AbstractGenericEventHandler)
   ObjectUtils.extend(ResizeHighlighter, GenericEventSource)

   Namespace.bindToNamespace("customizeyourweb", "ResizeHighlighter", ResizeHighlighter)
})()
}