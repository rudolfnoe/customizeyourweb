with(customizeyourweb){
(function(){
   const TARGET_DEF_TOKEN_REPLACE_WITH_QUOTES_REG_EXP = /(^|\s)(\w*)[ ]*=[ ]*(?!")(\S+)/g;
   const TARGET_DEF_TOKEN_WITH_QUOTES_REG_EXP = /(\w*)[ ]*=[ ]*(".*?")/g;
   
   const UNIQUE_ATTRIBUTES = ["id", "href"];
   const NONE_UNIQUE_ATTRIBUTES = ["type", "name", "form", "src"];

   function SimpleTargetDefinitionFactory(){
   }
   
   //Static 
   SimpleTargetDefinitionFactory.instance = null
   
   SimpleTargetDefinitionFactory.getInstance = function(){
      if(!SimpleTargetDefinitionFactory.instance)
         SimpleTargetDefinitionFactory.instance = new SimpleTargetDefinitionFactory()
      return SimpleTargetDefinitionFactory.instance
   }

   SimpleTargetDefinitionFactory.prototype = {
      constructor: SimpleTargetDefinitionFactory,
      
      createDefaultDefinition: function(element){
         return this.createDefinitions(element)[0]
      },
      
      parseTargetDefinition: function(definitionString){
         var keyValueMap = this.tokenizeDefinitionString(definitionString)
         var targetDef = new SimpleTargetDefinition()
         for(var key in keyValueMap){
            var value = keyValueMap[key]
            if(key.toLowerCase()=="tag"){
               targetDef.setTagName(value)
               continue
            }else if(key.toLowerCase()=="pos"){
               targetDef.setPosition(value)
               continue
            }
            targetDef.addAttributeDefinition(key, value)
         }
         if(targetDef.getTagName()==null)
            throw new Error('tag name is mandatory')
         return targetDef
      },
      
      createDefinitions: function(element){
         var result = new Array()
         if(element.tagName=="A" || element.getAttribute('role')=="link")
            this.createTextContentDefinition(element, result)
         this.createDefinitionsWithUniqueAttrs(element, result)
         this.createDefinitionsWithNonUniqueAttrs(element, result)
         if(result.length==0)
            result.push(this.createSimpleTargetDefinition(element, []))
         return result
      },
      
      createDefinitionsWithNonUniqueAttrs: function(element, resultArray){
         var attrFound = false
         var appliedAttrs = []
         for (var i = 0; i < NONE_UNIQUE_ATTRIBUTES.length; i++) {
            var attrName = NONE_UNIQUE_ATTRIBUTES[i]
            if(!element.hasAttribute(attrName) && !element[attrName])
               continue
            attrFound = true
            appliedAttrs.push(attrName)
         }
         if(attrFound)
            resultArray.push(this.createSimpleTargetDefinition(element, appliedAttrs))
      },
      
      createDefinitionsWithUniqueAttrs: function(element, resultArray){
         for (var i = 0; i < UNIQUE_ATTRIBUTES.length; i++) {
            if(!element.hasAttribute(UNIQUE_ATTRIBUTES[i]))
               continue
            else{
               resultArray.push(this.createSimpleTargetDefinition(element, [UNIQUE_ATTRIBUTES[i]]))
            }
         }   
      },
      
      createSimpleTargetDefinition: function(element, attributeArray){
         var simpleTargetDef = new SimpleTargetDefinition(element.tagName)
         for (var i = 0; i < attributeArray.length; i++) {
            var attrName = attributeArray[i]
            var attrValue = SimpleTargetDefinition.getAttributeValue(element, attrName)
            simpleTargetDef.addAttributeDefinition(attrName, attrValue)
         }
         this.determinePosition(element, simpleTargetDef)
         return simpleTargetDef
      },
      
      createTextContentDefinition: function(element, resultArray){
         var textContent = SimpleTargetDefinition.getTextContent(element)
         if(StringUtils.isEmpty(textContent)){
            return
         }
         var simpleTargetDef = new SimpleTargetDefinition(element.tagName)
         simpleTargetDef.addAttributeDefinition("text", textContent)
         this.determinePosition(element, simpleTargetDef)
         resultArray.push(simpleTargetDef)
      },
      
      determinePosition: function(element, simpleTargetDef){
         var potTargets = simpleTargetDef.getTargets(element.ownerDocument.defaultView)
         Assert.isTrue(potTargets.length>0, 'potTargets are empty, SimpleTargetDef is: ' + simpleTargetDef.getDefinitionAsString())
         if(potTargets.length==1){
            return
         }
         var found = false
         for (var i = 0; i < potTargets.length; i++) {
            if(potTargets[i]==element){
               simpleTargetDef.setPosition(i+1)
               found = true
            }
         }
         if(!found)
            throw new Error('element not in potTargets')
      },
      
      tokenizeDefinitionString: function(definitionString){
         //Insert missing quotes
         definitionString = definitionString.replace(TARGET_DEF_TOKEN_REPLACE_WITH_QUOTES_REG_EXP, '$2="$3"')
         //check correctness
         var checkString =  definitionString.replace(TARGET_DEF_TOKEN_WITH_QUOTES_REG_EXP, '')
         if(!StringUtils.isEmpty(StringUtils.trim(checkString)))
            throw new Error('Incorrect syntax')
         //Remove whitespace
         definitionString = definitionString.replace(TARGET_DEF_TOKEN_WITH_QUOTES_REG_EXP, '$1=$2')
         var tokens =  definitionString.match(TARGET_DEF_TOKEN_WITH_QUOTES_REG_EXP)
         var keyValueMap = new Object()
         for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i]
            var indexOfEquals = token.indexOf('=')
            var key = token.substring(0, indexOfEquals)
            var value = token.substring(indexOfEquals+2, token.length-1)
            keyValueMap[key] = value
         }
         return keyValueMap
      }
      
   }
   
   ObjectUtils.extend(SimpleTargetDefinitionFactory, "AbstractTargetDefinitionFactory", customizeyourweb)
   
   Namespace.bindToNamespace("customizeyourweb", "SimpleTargetDefinitionFactory", SimpleTargetDefinitionFactory)
})()
}