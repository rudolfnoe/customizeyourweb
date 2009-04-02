(function(){with(customizeyourweb){
      
   function ModifyAction (targetDefinition){
      this.AbstractTargetedAction(targetDefinition)
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

      doActionInternal: function(cywContext){
         if(this.isTargetOptionalAndTargetMissing(cywContext)){
            return
         }
         var target = this.getTarget(cywContext)
         for(var attr in this.attributes){
            target[attr] = this.attributes[attr]
         }
         var styleObj = target.style
         for(var style in this.styles){
            var styleVal = this.styles[style]
            if(StringUtils.isEmpty(styleVal))
               styleObj.removeProperty(style)
            else
               styleObj.setProperty(style, this.styles[style], "important")
         }
      }

   }
   
   ObjectUtils.extend(ModifyAction, "AbstractTargetedAction", customizeyourweb)
   
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "ModifyAction", ModifyAction)
}})()