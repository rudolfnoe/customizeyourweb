with(customizeyourweb){
(function(){
   
   function XPathTargetDefinitionFactory(){
   }
   
   //Static 
   XPathTargetDefinitionFactory.instance = null
   
   XPathTargetDefinitionFactory.getInstance = function(){
      if(!XPathTargetDefinitionFactory.instance)
         XPathTargetDefinitionFactory.instance = new XPathTargetDefinitionFactory()
      return XPathTargetDefinitionFactory.instance
   }
   
   XPathTargetDefinitionFactory.prototype = {
      constructor: XPathTargetDefinitionFactory,
      predicateStrategies: null,
      predicatePrecedence: ["id", "name", "href", "text", "defaultXPath"],
      
      createDefaultDefinition: function(element){
         return new XPathTargetDefinition(XPathUtils.createXPath(element))
      },

      createDefinitions: function(element){
         var predicateStrategies = this.getPredicateStrategies()
         var xPaths = {
            id: XPathUtils.createXPath(element, [predicateStrategies.id, predicateStrategies.defaultStrategy]),
            name: XPathUtils.createXPath(element, [predicateStrategies.name, predicateStrategies.defaultStrategy]),
            href: XPathUtils.createXPath(element, [predicateStrategies.href, predicateStrategies.defaultStrategy]),
            defaultXPath: XPathUtils.createXPath(element, [predicateStrategies.defaultStrategy])
         }

         if(element.tagName=="A"){
            try{
               //TODO check why this so often fails
               xPaths.text = XPathUtils.createXPath(element, [predicateStrategies.text, predicateStrategies.defaultStrategy])
            }catch(e){}
         }
         
         for(var xPathType in xPaths){
            if(xPathType!="defaultXPath" && xPaths[xPathType]==xPaths.defaultXPath)
               delete xPaths[xPathType]
         }

         var result = []
         for (var i = 0; i < this.predicatePrecedence.length; i++) {
            var xPath = xPaths[this.predicatePrecedence[i]]
            if(xPath!=null)
               result.push(new XPathTargetDefinition(xPath))
         }
         return result
      },
      
      getPredicateStrategies: function(){
         if(this.predicateStrategies==null){
            this.predicateStrategies = { 
               id: new AttributePredicateStrategy('id'),
               name: new AttributePredicateStrategy('name'),
               href: new AttributePredicateStrategy('href'),
               text: new TextContentPredicateStrategy(),
               defaultStrategy: new DefaultPredicateStrategy()
            }
         }
         return this.predicateStrategies
      }
      
   }
   
   ObjectUtils.extend(XPathTargetDefinitionFactory, "AbstractTargetDefinitionFactory", customizeyourweb)
   
   Namespace.bindToNamespace("customizeyourweb", "XPathTargetDefinitionFactory", XPathTargetDefinitionFactory)
})()
}