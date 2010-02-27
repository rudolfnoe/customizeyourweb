with(customizeyourweb){
(function(){
      
   function AbstractInsertElementAction(targetDefinition, position){
      this.AbstractTargetedAction(targetDefinition)
      //Position where the element should be inserted relative to the target element
      this.position = position?position:WhereToInsertEnum.AFTER
      this.t_elementId = null
   }
   
   /*
    * Static members
    */
   AbstractInsertElementAction.insertElement = function(html, targetElement, position, markerId){
      Assert.paramsNotNull(arguments)
      var target = $(targetElement) 
      var htmlElement = $(html, targetElement.ownerDocument)
      
      switch (position) {
         case WhereToInsertEnum.AFTER:
            target.after(htmlElement)
            break
         case WhereToInsertEnum.BEFORE:
            target.before(htmlElement)
            break
         case WhereToInsertEnum.FIRST_CHILD:
            if(target.children().length>0){
               target.find(":first-child").before(htmlElement)
            }else{
               target.append(htmlElement)
            }
            break
         case WhereToInsertEnum.LAST_CHILD:
            target.append(htmlElement)
            break
         default:
            throw new Error('Wrong insertion point')
      }
      var insertedElement = htmlElement.get(0)
      if(markerId){
         insertedElement.setAttribute('id', markerId)
      }
      return insertedElement 
   }
   
   /*
    * Instance members
    */
   AbstractInsertElementAction.prototype ={ 
      constructor: AbstractInsertElementAction,

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
         return AbstractInsertElementAction.insertElement(html, targetElement, this.position, markerId)
      }
   }
   
   ObjectUtils.extend(AbstractInsertElementAction, "AbstractTargetedAction", customizeyourweb)
   
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "AbstractInsertElementAction", AbstractInsertElementAction)
})()
}