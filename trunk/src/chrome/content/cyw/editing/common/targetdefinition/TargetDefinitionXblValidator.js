with(customizeyourweb){
(function(){
   function TargetDefinitionXblValidator(targetDefinitionField, targetWin){
      this.AbstractValidator()
      this.targetDefinitionField = targetDefinitionField
      this.targetWin = targetWin
      this.registerListener()
   }
   
   TargetDefinitionXblValidator.prototype = {
      constructor: TargetDefinitionXblValidator,
      TargetDefinitionXblValidator: TargetDefinitionXblValidator,
      
      isValid: function(){
         var targetDef = this.targetDefinitionField.getTargetDefinition()
         return (targetDef!=null && (targetDef.isTargetInPage(this.targetWin) || targetDef.isTargetOptional()))
      },
      
      registerListener: function(){
         this.targetDefinitionField.addValueChangedListener(Utils.bind(function(event){
            this.setValidState(this.isValid())
         }, this))
      }
   }
   
   ObjectUtils.extend(TargetDefinitionXblValidator, "AbstractValidator", customizeyourweb)
   
   Namespace.bindToNamespace("customizeyourweb", "TargetDefinitionXblValidator", TargetDefinitionXblValidator)
})()
}