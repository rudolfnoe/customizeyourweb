with(customizeyourweb){
(function(){
      
   function AbstractInsertHtmlAction(targetDefinition, position){
      this.AbstractTargetedAction(targetDefinition)
      //Position where the element should be inserted relative to the target element
      this.position = position?position:WhereToInsertEnum.AFTER
      this.t_elementId = null
   }
   
   /*
    * Static members
    */
   AbstractInsertHtmlAction.insertElement = function(html, targetElement, position, markerId){
      Assert.paramsNotNull([html, targetElement, position])
      var insertMode = null, referenceNode = null
      var parentNode = targetElement.tagName=="BODY"?targetElement:targetElement.parentNode
      if(position==WhereToInsertEnum.LAST_CHILD){
         insertMode="append"
         parentNode=targetElement
      }else if(position==WhereToInsertEnum.FIRST_CHILD){
         insertMode="insertBefore"   
         parentNode=targetElement
         referenceNode = targetElement.firstChild
      }else if(targetElement.tagName=="BODY"){
         insertMode = "append"
      }else if(position==WhereToInsertEnum.AFTER){
         if(targetElement.nextSibling==null){
            insertMode = "append"
         }else{
            insertMode = "insertBefore"
            referenceNode = targetElement.nextSibling
         }
      }else if(position==WhereToInsertEnum.BEFORE){
            insertMode = "insertBefore"
            referenceNode = targetElement
      }else{
         throw Error('Unkown insert point')
      }

      var doc = targetElement.ownerDocument
      var appenderElement = doc.createElement(parentNode.tagName)
      appenderElement.style.display = "none"
      appenderElement.innerHTML = html
      
      var insertedNodes = [] 
      while(appenderElement.firstChild){
         var node = DomUtils.removeElement(appenderElement.firstChild)
         if(node.nodeType==3){ //text nodes are encapsulated with a span to enable later removal on undo or edit
            var clonedNode = node.cloneNode(true)
            var span = targetElement.ownerDocument.createElement("span")
            span.appendChild(clonedNode)
            node = span
         }
         insertedNodes.push(node)
         if(htmlMarkerId)
            node.setAttribute('cyw_html_marker_id', htmlMarkerId)

         if(insertMode=="append")
            parentNode.appendChild(node)
         else
            parentNode.insertBefore(node, referenceNode)
      }
      DomUtils.removeElement(appenderElement)
      if(insertedNodes.length==0){
         return null
      }else if (insertedNodes.length==1){
         return insertedNodes[0]
      }else{
         return insertedNodes
      }
   }
   
   /*
    * Instance members
    */
   AbstractInsertHtmlAction.prototype ={ 
      constructor: AbstractInsertHtmlAction,

      getElementId: function(){
         if(!this.elementId){
            this.elementId = CywUtils.createSessionUniqueId()
         }
         return this.elementId
      },

      getPosition: function(){
         return this.position
      },

      setPosition: function(position){
         this.position = position
      },
      
      /*
       * Inserts the element defined by the given html
       * @param String html: Element to insert
       * @return DOMElement: the newly inserted element
       */
      insertElement: function(html, cywContext, markerId){
         var targetElement = this.getTarget(cywContext)
         return AbstractInsertHtmlAction.insertElement(html, targetElement, this.position, markerId)
      }
   }
   
   ObjectUtils.extend(AbstractInsertHtmlAction, "AbstractTargetedAction", customizeyourweb)
   
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "AbstractInsertHtmlAction", AbstractInsertHtmlAction)
})()
}