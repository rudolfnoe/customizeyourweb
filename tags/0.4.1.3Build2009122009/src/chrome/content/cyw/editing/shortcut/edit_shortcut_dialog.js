with(customizeyourweb){
(function(){
   function byId(id){
      return document.getElementById(id)
   }
   
   var EditShortcutDialogHandler = {
      targetElement: null,
      
      doOnload: function(){
         try{
            var action = Dialog.getNamedArgument("action")
            var targetWindow = Dialog.getNamedArgument("targetWindow")
            this.targetElement = Dialog.getNamedArgument("targetElement")

            if(action.isTargeted()){
               byId('targetdefinition').initTargetDefintionField(targetWindow, this.targetElement, action.getTargetDefinition())
            }else{
               byId('targetdefinition').collapsed=true
            }
            
            if(action.getCombinedKeyCode()!=null){
               byId("keyCombinationKIB").setCombinedValue(action.getCombinedKeyCode())
            }
            
            if(action.getShortString()!=null){
               byId("shortstringinputbox").value = action.getShortString()
            }

            if(ObjectUtils.instanceOf(action, ShortcutAction)){
               if(this.targetElement && this.targetElement.tagName=="A"){
                  byId('linkTargetRow').collapsed=false
                  byId('linkTargetML').value = action.getLinkTarget()
               }else if(action.isEditableField(this.targetElement)){
                  byId('selectCB').collapsed=false
                  byId('selectCB').checked = action.getSelectText()?true:false
               }
            }else if(ObjectUtils.instanceOf(action, ToggleVisibilityShortcutAction)){
               byId('initStateRow').collapsed=false
               byId('initalStateML').value = action.getInitStateHidden()?"hidden":"visible"
               byId('keepSpaceRow').collapsed=false
               byId('keepSpaceML').value = action.isKeepSpaceIfHidden()
            }else if(ObjectUtils.instanceOf(action, MacroShortcutAction)){
               byId('macroNameTB').value = StringUtils.defaultString(action.getName())
               byId('macroRow').collapsed=false
            }else{
               throw new Error('unknown action')
            }
            
            this.initValidators(action.isTargeted(), targetWindow)
         }catch(e){
            Log.logError(e)
         }
      },
      
      doOk: function(){
         var action = Dialog.getNamedArgument("action")
         
         if(byId("keyCombinationKIB").isSet()){
            action.setCombinedKeyCode(byId("keyCombinationKIB").getCombinedValue())
         }else {
            action.setCombinedKeyCode(null)
         }
         action.setShortString(byId("shortstringinputbox").value)
         
         if(ObjectUtils.instanceOf(action, ShortcutAction)){
            action.setLinkTarget(byId('linkTargetML').value)
            if(action.isEditableField(this.targetElement))
               action.setSelectText(byId('selectCB').checked)
         }else if(ObjectUtils.instanceOf(action, ToggleVisibilityShortcutAction)){
            action.setInitStateHidden(byId('initalStateML').value=="hidden")
            action.setKeepSpaceIfHidden(byId('keepSpaceML').value=="true")
         }else if(ObjectUtils.instanceOf(action, MacroShortcutAction)){
            var macroName = byId('macroNameTB').value
            if(!StringUtils.isEmpty(macroName)){
               action.setName(macroName)
            }
         }
         
         if(action.isTargeted()){
            action.setTargetDefinition(byId('targetdefinition').getTargetDefinition())
         }
         Dialog.setNamedResult("action", action)
      },
      
      initValidators: function(isTargetedAction, targetWindow){
         var okValidator = new AndValidator()
         if(isTargetedAction){
            okValidator.addValidator(new TargetDefinitionXblValidator(byId('targetdefinition'), targetWindow))
         }
         var orValidator = new OrValidator()
         okValidator.addValidator(orValidator)
         orValidator.addValidator(ValidatorFactory.createKeyInputboxNotEmptyValidator(byId('keyCombinationKIB')))
         orValidator.addValidator(ValidatorFactory.createShortStringInputboxNotEmptyValidator(byId('shortstringinputbox')))
         
         Dialog.addOkValidator(okValidator)
         okValidator.validate()
      }
   }

   Namespace.bindToNamespace("customizeyourweb", "EditShortcutDialogHandler", EditShortcutDialogHandler)
})()
}