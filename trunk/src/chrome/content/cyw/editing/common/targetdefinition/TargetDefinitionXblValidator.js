with(customizeyourweb){
(function(){
   /*
    * @param binding targetdefinition targetDefinitionBinding: bindingfield
    * @param DOMWindow targetWin: targetwin
    * @param boolean allowMultiTargetDef: allow the target definition to match multiple targets
    */
   function TargetDefinitionXblValidator(targetDefinitionBinding, targetWin, allowMultiTargetDef){
      this.AbstractValidator()
      this.targetDefinitionBinding = targetDefinitionBinding
      this.targetWin = targetWin
      //Default is false
      this.allowMultiTargetDef = arguments.length>=2?allowMultiTargetDef:false
      this.registerListener()
   }
   
   TargetDefinitionXblValidator.prototype = {
      constructor: TargetDefinitionXblValidator,
      TargetDefinitionXblValidator: TargetDefinitionXblValidator,
      
      isValid: function(){
         var targetDef = this.targetDefinitionBinding.getTargetDefinition()
         if(targetDef==null){
            return false
         }
         //Target is not in page and it is not optional
         try{            
            if (!targetDef.isTargetInPage(this.targetWin) && !targetDef.isTargetOptional()){
               return false
            }
            var targets = targetDef.getTargets(this.targetWin)
            if(targets.length > 1 && !this.allowMultiTargetDef){
               return false
            }
         }catch(e){
            //if target def is not valid return false
            return false
         }
         return true
      },
      
      registerListener: function(){
         this.targetDefinitionBinding.addValueChangedListener(Utils.bind(function(event){
            this.setValidState(this.isValid())
         }, this))
      }
   }
   
   ObjectUtils.extend(TargetDefinitionXblValidator, "AbstractValidator", customizeyourweb)
   
   Namespace.bindToNamespace("customizeyourweb", "TargetDefinitionXblValidator", TargetDefinitionXblValidator)
})()
}