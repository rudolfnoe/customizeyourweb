with(customizeyourweb){
(function(){
   const EDIT_MODIFY_DIALOG_URL = CywCommon.CYW_CHROME_URL + "editing/modify/edit_modify_dialog.xul"
   
   function EditModifyCommand(){
      //A change memento object of the MultiElementWrapper class acodring the memento pattern of 
      //the Gang of Four
      this.changeMemento = null
      this.targetElement = null
   }
   
   EditModifyCommand.prototype = {
      constructor: EditModifyCommand,

      setChangeMemento: function(changeMemento){
         this.changeMemento = [changeMemento]
      },

      setTargetElement: function(targetElement){
         this.targetElement = targetElement
      },

      doCreateAction: function(editContext){
         var action = new ModifyAction(editContext.getTargetDefinition()) 
         return this.editAction(action, editContext)
      },
      
      doEditAction: function(editContext){
         return this.editAction(editContext.getAction(), editContext)
      },
      
      editAction: function(action, editContext){
         this.targetElement = editContext.getTargetElement()
         var editDialog = new EditDialog(EDIT_MODIFY_DIALOG_URL, "EditModify", true, window, null, 
                                  {action: action, targetElement:this.targetElement, targetWindow:editContext.getTargetWindow()})
         editDialog.show()
         if(editDialog.getResult()==DialogResult.OK){
            this.changeMemento = [editDialog.getNamedResult("changeMemento")]
            this.setAction(editDialog.getNamedResult("action"))
            return this.getAction()
         }else{
            return null
         }
      },
      
      undo: function(){
         if(this.targetElement){
            var elementWrapper = new MultiElementWrapper([this.targetElement])
            elementWrapper.setChangeMemento(this.changeMemento)
            elementWrapper.restore()
         }
      }
   }
   ObjectUtils.extend(EditModifyCommand, "AbstractEditCommand", customizeyourweb)

   Namespace.bindToNamespace("customizeyourweb", "EditModifyCommand", EditModifyCommand)
})()
}