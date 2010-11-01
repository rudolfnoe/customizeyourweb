with(customizeyourweb){
(function(){
   /*
    * Creates JQuery expressions as proposals for the target defintion
    */
   var JQuerySelectorFactory = {
      /*
       * Creates JQuery Selector expressions for an element and an array of
       * strategies
       * @param DOMElement element
       * @param Array strategies(opt): Array of DefaultSelectorStrategy or subclasses of it 
       * @return Array(String): selector strings for each strategy
       */
      createSelectors: function(element, strategies){
         strategies = strategies!=null?strategies:this.getDefaultStrategies()
         var result = new ArrayList()
         for (var i = strategies.length-1; i >= 0; i--) {
            var selector = strategies[i].createSelector(element)
            if(result.contains(selector)){
               continue;
            }
            result.addAtIndex(0, selector)
         }
         return result.toArray()
      },
      
      getDefaultStrategies: function(){
         return  [new AttributeSelectorStrategy("id"),
                     new AttributeSelectorStrategy("name"),
                     new AttributeSelectorStrategy("href"),
                     new TextContentSelectorStrategy(),
                     new DefaultSelectorStrategy()]; 
      }
      
   }

   Namespace.bindToNamespace("customizeyourweb", "JQuerySelectorFactory", JQuerySelectorFactory)
   
   /*
    * Superclass constructor of default selector strategy
    * A strategy implements an algorith to create a
    * jQuery selector for an element
    * The design differs from the one for XPath creation as here a stragety creates the
    * entire selector
    */
   function DefaultSelectorStrategy(){
      this.stopFurtherEvaluation = false
   }
   
   DefaultSelectorStrategy.prototype = {
      constructor: DefaultSelectorStrategy,
      
      /*
       * Appends a position selector to a given selector if it is not
       * unique within the given context element
       * @param DOMElement element: element for which the given selector within the given context should be unique
       * @param DOMElement, DOMDocument context: context within the selector results in the element as the unique matched element
       * @param String selector: selector which must be extended in case it is not special enough that element is the unique result
       * @retun String posSelector part: ":eq(<number>)" expression or null if no position selecotr is needed
       */
      getPositionSelector : function(element, context, selector) {
				var matchedElements = $(selector,context).toArray()
				if (matchedElements.length > 1) {
					for (var i = 0; i < matchedElements.length; i++) {
						if (matchedElements[i] == element) {
							return ":eq(" + i + ")"
						}
					}
				}
            return null
			},
      
      /*
		 * Creates JQuery selector for given element This method acts as a
		 * template method @param DOMElement element @return String: jQuery
		 * selector expresssion
		 */
      createSelector: function(element){
         var result = null
         var loopElem = element
         do{
            var predicate = this.getPredicate(loopElem) 
            result = loopElem.tagName + (predicate!=null?predicate:"") + (result==null ? "" : ">" + result); 
            if(this.isStopFurtherEvalutation(loopElem))
               break;
            loopElem = loopElem.parentNode;
         }while((loopElem.nodeName!='HTML') && !(loopElem instanceof HTMLDocument));
         return result
      },
      
      getPredicate: function(element){
         var elements = DomUtils.getChildrenBy(element.parentNode, function(node){
            return node.tagName == element.tagName
         })
         var pos = 0
         for (var i = 0; i < elements.length; i++) {
            if(elements[i]==element){
               pos = i
               break;
            }
         }
         if(elements.length>1){
            return ":eq(" + pos + ")"
         }else if(elements.length==1){
            return null
         }else{
            throw new Error('unexpected case')
         }
      },
      
      isStopFurtherEvalutation: function(){
         return this.stopFurtherEvaluation;
      }
      
   };
   Namespace.bindToNamespace("customizeyourweb", "DefaultSelectorStrategy", DefaultSelectorStrategy);
   
   const REPLACE_METACHAR_REGEXP = /([\[\]])/g;
   /*
    * A elector strategy which uses the value of an attribute
    * @param String attrName: Name of the attribute with which value the predicate should be created
    */
   function AttributeSelectorStrategy(attrName){
      Assert.notNull(attrName)
      this.attrName = attrName
   }
   
   AttributeSelectorStrategy.prototype = {
      constructor: AttributeSelectorStrategy,
      
      getPredicate: function(element){
         var result = null
         if(element.hasAttribute(this.attrName)){
            this.stopFurtherEvaluation = true
            var attrVal = element.getAttribute(this.attrName)
            //TODO Check which replacements are neccessary
//            attrVal = attrVal.replace(REPLACE_METACHAR_REGEXP, "\\\\$1")
            if(this.attrName.toLowerCase()=="id"){
               result = "#" + attrVal
            }else{
               result = "[" + this.attrName + "=" + attrVal + "]"
               var posSelector = this.getPositionSelector(element, element.ownerDocument, element.tagName + result)
               if(posSelector){
                  result += posSelector
               }
            }
         }else{
            this.stopFurtherEvaluation = false;
            result = this.DefaultSelectorStrategy_getPredicate(element);
         }
         return result
      },

      isStopFurtherEvalutation: function(){
         return this.stopFurtherEvaluation;
      }
      
   }
   ObjectUtils.extend(AttributeSelectorStrategy, "DefaultSelectorStrategy", customizeyourweb)
   Namespace.bindToNamespace("customizeyourweb", "AttributeSelectorStrategy", AttributeSelectorStrategy)
 
   /*
    * A selector creatation strategy basing on the text content of the element
    */
   function TextContentSelectorStrategy(){
   }
   
   TextContentSelectorStrategy.prototype = {
      constructor: TextContentSelectorStrategy,

      getPredicate: function(element){
         var textContent = element.textContent
         if(textContent){
            this.stopFurtherEvaluation = true
            var result = ":contains(" + textContent.match(/.*/) + ")"
            //set first row of text for search
            var posSelector = this.getPositionSelector(element, element.ownerDocument, element.tagName + result)
            if(posSelector){
               result += posSelector
            }
            return result
         }else{
            return null
         }
      },

      isStopFurtherEvalutation: function(){
         return this.stopFurtherEvaluation;   
      }
      
   }
   ObjectUtils.extend(TextContentSelectorStrategy, "DefaultSelectorStrategy", customizeyourweb)
   Namespace.bindToNamespace("customizeyourweb", "TextContentSelectorStrategy", TextContentSelectorStrategy)
})()
}