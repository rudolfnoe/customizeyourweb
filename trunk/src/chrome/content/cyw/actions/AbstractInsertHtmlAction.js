with(customizeyourweb){
(function(){
   
   //Attr to identify the inserted HTML
   const MARKER_ATTR = 'cyw_html_marker_id'
      
   function AbstractInsertHtmlAction(id, targetDefinition, position){
      this.AbstractTargetedAction(id, targetDefinition)
      //Position where the element should be inserted relative to the target element
      this.position = position?position:WhereToInsertEnum.AFTER
   }
   
   /*
    * Static members
    * @param String html: the html to insert
    * @param DOMELement targetElement: the target element to which the html is inserted relativly (see param position
    * @param WhereToInsertEnum position
    * @param String markerId: Unique id by which the inserted html could be removed afterwards
    */
   AbstractInsertHtmlAction.insertHtml= function(html, targetElement, position, markerId){
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
         if(markerId)
            node.setAttribute(MARKER_ATTR, markerId)

         if(insertMode=="append")
            parentNode.appendChild(node)
         else
            parentNode.insertBefore(node, referenceNode)
      }
      DomUtils.removeElement(appenderElement)
      return insertedNodes
   }
   
   /*
    * Instance members
    */
   AbstractInsertHtmlAction.prototype ={ 
      constructor: AbstractInsertHtmlAction,

      getElementId: function(scriptId){
         if(!this.elementId){
            this.elementId = "cyw_id_" + scriptId + "_" + this.getId();
         }
         return this.elementId
      },

      getPosition: function(){
         if(this.whereToInsert!=null){
            this.position = this.whereToInsert
            delete this.whereToInsert
         }
         return this.position
      },

      setPosition: function(position){
         this.position = position
      },
      
      /*
       * Inserts the element defined by the given html
       * @param String html: Element to insert
       * @return DOMElement: the newly inserted element or null if nonen could be inserted
       */
      insertElement: function(html, cywContext, markerId){
         var insertedElements = this.insertHtml(html, cywContext, markerId)
         if(insertedElements.length==0){
            return null
         }else{
            return insertedElements[0]
         }
      },
      
      /*
       * Inserts arbitray html
       * @param String html: html to insert
       * @param AbstractContext abstractContext
       * @return Array of DOMElement: the newly inserted elements
       */
      insertHtml: function(html, abstractContext){
         var targetElement = this.getTarget(abstractContext)
         return AbstractInsertHtmlAction.insertHtml(html, targetElement, this.getPosition(), 
                                                      this.getElementId(abstractContext.getScriptId()))
      },
      
      /*
       * Initiates preview
       * @param targetWindow
       * @return Object: memento containing all information needed for undoing the modifications
       */
       preview: function(editContext){
         throw new Error('IPreviewableAction.preview must be implemented')
       },
       
       /*
        * Undos the modifications done by calling preview
        * @param EditContext
        * @param Object undoMemento see preview
        */
       undo: function(editContext, undoMemento){
         $('[' + MARKER_ATTR + '=' + this.getElementId() + ']', editContext.getTargetDocument()).remove()
       }
   }
   
   ObjectUtils.extend(AbstractInsertHtmlAction, "AbstractTargetedAction", customizeyourweb)
   ObjectUtils.extend(AbstractInsertHtmlAction, "IPreviewableAction", customizeyourweb)
   
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "AbstractInsertHtmlAction", AbstractInsertHtmlAction)
})()
}