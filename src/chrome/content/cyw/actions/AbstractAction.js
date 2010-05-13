with(customizeyourweb){
(function(){   
	
   function AbstractAction (){
   	this.id = null
      this.repetitionBehavior = RepetitionBehavior.RUN_ONCE_SUCCESSFULLY
      this.t_actionPerformedCount = 0
      this.t_undoMemento = null
   }
   
   AbstractAction.prototype = {
      constructor: AbstractAction,
   	
   	getId: function(){
   		return this.id
   	},
      
      setId: function(id){
         this.id = id
      },
      
      getRepetitionBehavior: function(){
         return this.repetitionBehavior
      },

      setRepetitionBehavior: function(repetitionBehavior){
         this.repetitionBehavior = repetitionBehavior
      },

      getUndoMemento: function(){
         if(this.t_undoMemento == null){
            this.t_undoMemento = {}
         }
         return this.t_undoMemento
      },
      
      /*
       * Assures that JQuery is available in content page
       */
      assureJQuery: function(cywContext){
         if(cywContext.isJQueryInjected()){
            return
         }
         var $injected = JavaScriptInjecter.injectJQuery(cywContext.getTargetDocument())
         cywContext.setJQuery($injected)
         return $injected
      },
      
      /*
       * Assures injectition of jQuery UI
       */
      assureJQueryUI: function(cywContext){
         var $injected = cywContext.getJQuery()
         if($injected==null){
            $injected = this.assureJQuery(cywContext)
         }
         if(!cywContext.isJQueryUIInjected()){
            JavaScriptInjecter.injectJQueryUI(cywContext.getTargetDocument(), $injected)
         }
         return $injected
      },
      
      cleanUp: function(cywContext){
         //empty default implementation
      },

      doAction: function(cywContext){
         this.doCommonAction(this.doActionInternal, cywContext)
   	},

      doActionForCachedPage: function(cywContext){
         this.doCommonAction(this.doActionForCachedPageInternal, cywContext)
   	},
      
      doCommonAction: function(actionMethod, cywContext){
         if(this.isMaxRepetitionAchieved()){
            return
         }
         var successful = actionMethod.apply(this, [cywContext])
         if(successful){
            this.t_actionPerformedCount++
         }
      },

      /*
       * Template method which must be overridden by subclasses
       * @param cywContext
       * @return boolean successful: Subclasse must indicate whether the action was successfully performed or not 
       */
      doActionInternal: function(cywContext){
   		Assert.fail('Not implemented')
   	},

      doActionForCachedPageInternal: function(cywContext){
   		//do noting by default as this is correct in the most cases
   	},
      
      equals: function(action){
         if(action!=null && action.getId()==this.getId())
            return true
         else
            return false
      },
      
      getDetailedDescription: function(){
         return null
      },
   	
      isContainer: function(){
         return false
      },
      
      isMaxRepetitionAchieved: function(){
         return this.repetitionBehavior == RepetitionBehavior.RUN_ONCE_SUCCESSFULLY &&
                  this.t_actionPerformedCount > 0
      },
      
      isTargeted: function(){
         return false   
      },
      
      toString: function(){
         var typeName = ObjectUtils.getType(this)
         var actionIndex = typeName.lastIndexOf('Action')
         var result = typeName.substring(0, actionIndex)
         if(this.id)
            result += " [" + this.getId() + "]"
         return result
      },
   	
   	undo: function(cywContext){
         //empty default implementation
   	}
   }
   
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "AbstractAction", AbstractAction)
   
   RepetitionBehavior = {
      RUN_ALWAYS: "RUN_ALWAYS",
      RUN_ONCE_SUCCESSFULLY: "RUN_ONCE_SUCCESSFULLY"
   }

})()
}