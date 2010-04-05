with(customizeyourweb){
(function(){
   function byId(id){
      return document.getElementById(id)
   }
   
   var EditClickDialogHandler = {
      doOnload: function(){
         var action = EditDialog.getAction()
         byId('buttonML').value = action.getButton()
         byId('doubleClickCB').checked = action.isDoubleClick() 
         var modifierMask = action.getModifierMask()
         byId('ctrlCB').checked = (modifierMask & Event.CONTROL_MASK)?true:false
         byId('altCB').checked = (modifierMask & Event.ALT_MASK)?true:false
         byId('shiftCB').checked = (modifierMask & Event.SHIFT_MASK)?true:false
         byId('metaCB').checked = (modifierMask & Event.META_MASK)?true:false
         this.initValidators(EditDialog.getTargetWindow())
      },
      
      doOk: function(){
         Dialog.setResult(DialogResult.OK)
         var action = Dialog.getNamedArgument("action")
         action.setButton(byId('buttonML').value)
         action.setDoubleClick(byId('doubleClickCB').checked) 
         var modifierMask = (byId('ctrlCB').checked?Event.CONTROL_MASK:0) +
                              (byId('altCB').checked?Event.ALT_MASK:0) +
                              (byId('shiftCB').checked?Event.SHIFT_MASK:0) +
                              (byId('metaCB').checked?Event.META_MASK:0)
         action.setModifierMask(modifierMask)
         action.setTargetDefinition(byId('targetdefinition').getTargetDefinition())
         Dialog.setNamedResult("action", action)
      },
      
      handleClick: function(event){
         byId('buttonML').value = event.button
         byId('doubleClickCB').checked = (event.detail==2) 
         byId('ctrlCB').checked = event.ctrlKey
         byId('altCB').checked = event.altKey
         byId('shiftCB').checked = event.shiftKey
         byId('metaCB').checked = event.metaKey
      },
      
      initValidators: function(targetWindow){
         var okValidator = new TargetDefinitionXblValidator(byId('targetdefinition'), targetWindow)
         Dialog.addOkValidator(okValidator)
         okValidator.validate()
     }
   }

   Namespace.bindToNamespace("customizeyourweb", "EditClickDialogHandler", EditClickDialogHandler)
})()
}