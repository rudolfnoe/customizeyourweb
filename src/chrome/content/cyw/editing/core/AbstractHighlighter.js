with(customizeyourweb){
(function(){
   
   const HIGHLIGHT_CSS_URL = "chrome://customizeyourweb/content/cyw/editing/core/highlight.css"
   
   function AbstractHighlighter() {
      this.nodes = null
      this.targetElement = null
   }
   
   AbstractHighlighter.prototype = {
      AbstractHighlighter: AbstractHighlighter,
      
      getTargetElement: function(){
         return this.targetElement
      },

      setTargetElement: function(targetElement){
         this.targetElement = targetElement
      },

      getTargetWindow: function(){
         Assert.notNull(this.targetElement, "target element must be set first")
         return this.targetElement.ownerDocument.defaultView
      },

      assureAppendingNodes: function(element, body){
         var firstNode = this.getFirstNode()
         var needsAppend = !firstNode.parentNode || firstNode.ownerDocument != body.ownerDocument;
         if (needsAppend) {
            DomUtils.assureStyleSheet(element.ownerDocument, HIGHLIGHT_CSS_URL);
            for (var node in this.nodes) {
               try {
                  body.appendChild(this.nodes[node]);
               } catch (exc) {
                  CywUtils.logDebug('Appending highlighter nodes failed: ' + exc.message)
               }
            }
         }
      },
      
      cleanup: function(){
         //empty default implementation
      },
      
      createNodes: function(){
         throw new Error ('abstract method must be implemented')
      },
      
      drawHighlighter: function(infoSpanContent){
         throw new Error ('abstract method must be implemented')
      },
      
      getFirstNode: function(){
         var firstNode = null
         for(var firstNodeName in this.getNodes()){
            firstNode = this.getNodes()[firstNodeName]
            if(firstNode)
               break
         }
         return firstNode
      },
      
      getNodes: function(){
         if(this.nodes==null)
            this.nodes = this.createNodes()
         return this.nodes
      },
      
      highlight: function(element, infoSpanContent){
         if(element.cywIgnore || this.targetElement==element)
            return false
         if (DomUtils.ownerDocIsFrameset(element)){
            this.unhighlight();
            return false
         }
         this.removeStyleObserver()
         this.targetElement = element
         
         this.drawHighlighter(infoSpanContent)
         
         var body = DomUtils.getBody(element.ownerDocument)
         if (!body)
            return false
         this.assureAppendingNodes(element, body)
         // inject listener
         this.styleObserverId = ElementObserver.registerStyleObserver(element, ["width", "height"], this.drawHighlighter, this)
         return true
      },

      unhighlight : function() {
         if(this.targetElement==null){
            //nothing to unhighlight
            return
         }
         this.removeStyleObserver()
         var nodes = this.getNodes();
         for(var nodeName in nodes){
            DomUtils.removeElement(nodes[nodeName])
         }
         this.targetElement = null
      },
      
      removeStyleObserver: function(){
         if(this.styleObserverId){
            ElementObserver.unregisterObserver(this.styleObserverId)
         }
      }         

   }

   Namespace.bindToNamespace("customizeyourweb", "AbstractHighlighter", AbstractHighlighter)
})()
}