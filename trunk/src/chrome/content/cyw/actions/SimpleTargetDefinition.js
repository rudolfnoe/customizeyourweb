with(customizeyourweb){
(function(){
   const ATTRITBUTES_FOR_XPATH = "name, id, href";
   const SLASH_REPLACE_REG_EXP = /\//g
   const WORD_REG_EXP = /\w+/
   
   function SimpleTargetDefinition(tagName){
      //Map with attribute / value pairs
      this.attributeDefinitions = new Object()
      this.position = null
      this.tagName = tagName
   }
   
   //static methods
   SimpleTargetDefinition.getAttributeValue = function(element, attrName){
      if(attrName=="form"){
         return element.form?element.form.name:null
      }else if(attrName=="text"){
         return this.getTextContent(element) 
      }
      var attrValue = element.getAttribute(attrName)
      if(!attrValue)
         attrValue = element[attrName]
      return attrValue
   }
   
   SimpleTargetDefinition.getTextContent = function(element){
      //Remove whithespaces
      var result = element.textContent.replace("\n", " ")
      result = result.replace(/\t/g, "")
      if(!CywUtils.isMlbActive()){
         return result
      }
      var idSpans = DomUtils.getElementsByTagNameAndAttribute(element, "span", "mlb_binding_key", "*")
      if(idSpans.length==0){
         return result
      }else{
         var id = idSpans[0].textContent
         var indexOfId = result.lastIndexOf(id)
         return result.substring(0, indexOfId)
      }
   }
   
   //member mthods
   SimpleTargetDefinition.prototype = {
      constructor: SimpleTargetDefinition,
      SimpleTargetDefinition: SimpleTargetDefinition,
      
      getPosition: function(){
         return this.position
      },

      setPosition: function(position){
         this.position = position
      },

      getTagName: function(){
         return this.tagName
      },

      setTagName: function(tagName){
         this.tagName = tagName
      },

      addAttributeDefinition: function(attrName, value){
         this.attributeDefinitions[attrName] = value   
      },
      
      createXPathExp: function(){
         var xPathExp = "//" + this.tagName.toUpperCase()
         var attrCounter = 0
         for(var attrName in this.attributeDefinitions){
            if(ATTRITBUTES_FOR_XPATH.indexOf(attrName)==-1 && attrName!="text")
               continue
            if(attrCounter==0)
               xPathExp += "["
            else            
               xPathExp += " and"
            var attrValueDef = this.attributeDefinitions[attrName]
            if(attrName=="text"){
               var matches = attrValueDef.match(WORD_REG_EXP)
               if(matches.length==0){
                  xPathExp += "true()"
               }else {
                  xPathExp += ' contains(string(), "' + matches[0] + '")'   
               }
            }else if(this.isAttrValuePrefixDef(attrValueDef)){
               xPathExp += " starts-with(@" + attrName + ', "' +  this.getAttributeValueDefPrefix(attrValueDef) + '")'
            }else{   
               xPathExp += " @" + attrName + '="' +  attrValueDef + '"'
            }
            attrCounter++
         }
         if(attrCounter>0)
            xPathExp += "]"
         return xPathExp
      },
      
      getAttributeValueDefPrefix: function(attributeValueDefPrefix){
         if(!this.isAttrValuePrefixDef(attributeValueDefPrefix))
            throw new Error ('attr value is no prefixed one')
         return attributeValueDefPrefix.substring(0, attributeValueDefPrefix.length-1)
      },
      
      getDefinitionAsString: function(){
         var result = "tag=" + this.tagName
         for (var attrName in this.attributeDefinitions) {
            result += " " + attrName + '="' + this.attributeDefinitions[attrName] + '"'
         }
         if(this.position)
            result += " pos=" + this.position
         return result
      },

      getDefinitionStyle: function(){
         return TargetDefinitionStyle.SIMPLE
      },
      
      getTargetPreSetByXPath: function(targetWin){
         return XPathUtils.getElements(this.createXPathExp(), targetWin.document, XPathResult.ORDERED_NODE_ITERATOR_TYPE) 
      },
      
      getTargets: function(targetWin){
         var targetPreSet =  this.getTargetPreSetByXPath(targetWin)
         var resultSet = []
         for (var i = 0;i < targetPreSet.length; i++) {
            var potTarget = targetPreSet[i]
            var attrMatches = true
            for (var attrName in this.attributeDefinitions) {
               var attrValueDef = this.attributeDefinitions[attrName]
               if(ATTRITBUTES_FOR_XPATH.indexOf(attrName)!=-1)
                  continue
               var currentAttrValue = SimpleTargetDefinition.getAttributeValue(potTarget, attrName) 
               if(this.isAttrValuePrefixDef(attrValueDef)){
                  if(StringUtils.startsWith(currentAttrValue, this.getAttributeValueDefPrefix(attrValueDef))){
                     continue
                  }
               }else if(attrValueDef==currentAttrValue){
                  continue
               }
               attrMatches = false
               break
            }
            if(attrMatches)
               resultSet.push(potTarget)
         }
         if(this.position!=null){
            if(resultSet.length>=this.position)
               resultSet = new Array(resultSet[this.position-1])
            else
               resultSet = []
         }
         return resultSet
      },
      
      isAttrValuePrefixDef: function(attrValueDefinition){
         return StringUtils.endsWith(attrValueDefinition, '*')
      }
      
   }
   
   ObjectUtils.extend(SimpleTargetDefinition, "AbstractTargetDefinition", customizeyourweb)
   
   Namespace.bindToNamespace("customizeyourweb", "SimpleTargetDefinition", SimpleTargetDefinition)
})()
}