(function(){with(customizeyourweb){
      
   function InsertHTMLAction (targetDefinition){
      this.AbstractTargetedAction(targetDefinition)
      this.htmlCode = null
      this.whereToInsert = null
   }
   
   InsertHTMLAction.prototype ={ 
      constructor: InsertHTMLAction,

      getHtmlCode: function(){
         return this.htmlCode
      },

      setHtmlCode: function(htmlCode){
         this.htmlCode = htmlCode
      },

      getWhereToInsert: function(){
         return this.whereToInsert
      },

      setWhereToInsert: function(whereToInsert){
         this.whereToInsert = whereToInsert
      },
      

      doActionInternal: function(cywContext){
         if(this.isTargetOptionalAndTargetMissing(cywContext)){
            return
         }
         InsertHTMLAction.insertHTML(this.getTarget(cywContext), this)
      }

   }
   
   //Static method for reuse
   InsertHTMLAction.insertHTML = function(targetElement, insertHtmlAction, htmlMarkerId){
      var insertMode = null, referenceNode = null
      var parentNode = targetElement.tagName=="BODY"?targetElement:targetElement.parentNode
      var whereToInsert = insertHtmlAction.whereToInsert
      if(whereToInsert==WhereToInsertEnum.LAST_CHILD){
         insertMode="append"
         parentNode=targetElement
      }else if(whereToInsert==WhereToInsertEnum.FIRST_CHILD){
         insertMode="insertBefore"   
         parentNode=targetElement
         referenceNode = targetElement.firstChild
      }else if(targetElement.tagName=="BODY"){
         insertMode = "append"
      }else if(whereToInsert==WhereToInsertEnum.AFTER){
         if(targetElement.nextSibling==null){
            insertMode = "append"
         }else{
            insertMode = "insertBefore"
            referenceNode = targetElement.nextSibling
         }
      }else if(whereToInsert==WhereToInsertEnum.BEFORE){
            insertMode = "insertBefore"
            referenceNode = targetElement
      }else{
         throw Error('Unkown insert point')
      }

      var doc = targetElement.ownerDocument
      var appenderElement = doc.createElement(parentNode.tagName)
      appenderElement.style.display = "none"
      appenderElement.innerHTML = insertHtmlAction.htmlCode
      
      while(appenderElement.firstChild){
         var node = DomUtils.removeElement(appenderElement.firstChild)
         if(node.nodeType==3){ //text nodes are encapsulated with a span to enable later removal on undo or edit
            var clonedNode = node.cloneNode(true)
            var span = targetElement.ownerDocument.createElement("span")
            span.appendChild(clonedNode)
            node = span
         }
         if(htmlMarkerId)
            node.setAttribute('cyw_html_marker_id', htmlMarkerId)

         if(insertMode=="append")
            parentNode.appendChild(node)
         else
            parentNode.insertBefore(node, referenceNode)
      }
      DomUtils.removeElement(appenderElement)
   }
   
   InsertHTMLAction.removeInsertedHtml = function(targetElement, htmlMarkerId){
      var oldNodes = DomUtils.getElementsByAttribute(targetElement.ownerDocument, "cyw_html_marker_id", htmlMarkerId)
      for (var i = 0; i < oldNodes.length; i++) {
         DomUtils.removeElement(oldNodes[i])            
      }
   }
   
   ObjectUtils.extend(InsertHTMLAction, "AbstractTargetedAction", customizeyourweb)
   
   
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "InsertHTMLAction", InsertHTMLAction)
}})()