with(customizeyourweb){
(function(){
   function RemovedElement(element){
      this.element = element
      this.parentNode = element.parentNode
      this.nextSibling = element.nextSibling
   }
   
   RemovedElement.prototype = {
      constructor: RemovedElement   
   }
   
   Namespace.bindToNamespace("customizeyourweb", "RemovedElement", RemovedElement)
})()
}