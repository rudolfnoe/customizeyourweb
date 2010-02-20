with(customizeyourweb){
(function(){
      
   function AbstractInsertElementAction(targetDefinition, position){
      this.AbstractTargetedAction(targetDefinition)
      //Position where the element should be inserted relative to the target element
      this.position = position?position:WhereToInsertEnum.AFTER
   }
   
   AbstractInsertElementAction.prototype ={ 
      constructor: AbstractInsertElementAction,

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
      insertElement: function(html, cywContext){
         var target = $(this.getTarget(cywContext)) 
         var htmlElement = $(html, cywContext.getTargetDocument())
         
         switch (this.position) {
            case WhereToInsertEnum.AFTER:
               target.after(htmlElement)
               break
            case WhereToInsertEnum.BEFORE:
               target.before(htmlElement)
               break
            case WhereToInsertEnum.FIRST_CHILD:
               target.find(":first-child").before(htmlElement)
               break
            case WhereToInsertEnum.LAST_CHILD:
               target.append(htmlElement)
               break
            default:
               throw new Error('Wrong insertion point')
         }
         return htmlElement.get(0)
      }
   		
   }
   
   ObjectUtils.extend(AbstractInsertElementAction, "AbstractTargetedAction", customizeyourweb)
   
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "AbstractInsertElementAction", AbstractInsertElementAction)
})()
}