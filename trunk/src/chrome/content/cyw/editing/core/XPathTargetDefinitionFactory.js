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
            id: this.createXPath(element, [predicateStrategies.id, predicateStrategies.defaultStrategy]),
            name: this.createXPath(element, [predicateStrategies.name, predicateStrategies.defaultStrategy]),
            href: this.createXPath(element, [predicateStrategies.href, predicateStrategies.defaultStrategy]),
            defaultXPath: this.createXPath(element, [predicateStrategies.defaultStrategy])
         }

         //TODO Check that exception handling!
         if(element.tagName=="A"){
            try{
               xPaths.text = XPathUtils.createXPath(element, [predicateStrategies.text, predicateStrategies.defaultStrategy])
            }catch(e){
               LOG.logDebug("XPathTargetDefinitionFactory.createDefinitions: Creation of XPath with text predicate failed: " + 
                     e.message + "   Stack: " + e.stack);
            }
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
      
      createXPath: function(element, predicateStrategyArr){
         try{
            return XPathUtils.createXPath(element, predicateStrategyArr)         
         }catch(e){
            //In case of pages with namespaces this can fail
            //TODO Find the reason for this, this is only a workaround
            CywUtils.logWarning("XPathTargetDefinition.createXPath: " + e.message)
            return null
         }
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