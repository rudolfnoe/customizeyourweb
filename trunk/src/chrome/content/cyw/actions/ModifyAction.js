with(customizeyourweb){
(function(){
      
   function ModifyAction (id, targetDefinition){
      this.AbstractTargetedAction(id, targetDefinition)
      this.setAllowMultiTargets(true)
      this.attributes = {}
      this.styles = {}
   }
   
   ModifyAction.prototype ={ 
      constructor: ModifyAction,
      getAttributes: function(){
         return this.attributes
      },
      
      setAttributes: function(attributes){
         this.attributes = attributes
      },

      
      getStyles: function(){
         return this.styles
      },

      setStyles: function(styles){
         this.styles = styles
      },

      doActionForCachedPageInternal: function(cywContext){
         return this.doActionInternal(cywContext)   
      },
      
      doActionInternal: function(cywContext){
         if(this.isTargetOptionalAndTargetMissing(cywContext)){
            return false
         }
         this.modifyElements(cywContext, false)
         return true
      },
      
      modifyElements: function(abstractContext, /*boolean*/ suppressErrors){
         var targets = this.getTargets(abstractContext, suppressErrors)
         var multiElementWrapper = new MultiElementWrapper(targets)
         for(var attr in this.attributes){
            multiElementWrapper.setProperty(attr, this.attributes[attr])
         }
         for(var style in this.styles){
            multiElementWrapper.setStyle(style, this.styles[style], "important")
         }
         var changeMemento = multiElementWrapper.getChangeMemento()
         abstractContext.setActionChangeMemento(this.getId(), changeMemento)
         return changeMemento
      },
      
      preview: function(editContext){
         return this.modifyElements(editContext, true)
      },
      
      undo: function(editContext, undoMemento){
         var multiElementWrapper = new MultiElementWrapper(this.getTargets(editContext, true))
         multiElementWrapper.setChangeMemento(undoMemento)
         multiElementWrapper.restore()
      }
   }
   
   ObjectUtils.extend(ModifyAction, "AbstractTargetedAction", customizeyourweb)
   ObjectUtils.extend(ModifyAction, "IPreviewableAction", customizeyourweb)
   
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "ModifyAction", ModifyAction)
})()
}