/**
 * @class
 */
with(customizeyourweb){
(function(){
   /*
    * Command deleting and undoing deletion of actions
    * from the actions tree
    */
   function DeleteActionCommand(action, actionsTreeView, targetWindow, script){
      Assert.paramsNotNull(arguments)
      this.action = action
      this.actionsTreeView = actionsTreeView
      this.targetWindow = targetWindow
      this.script = script
      this.actionTreeItem = null
      this.parentTreeItem = null
      this.indexOfItem = -1
   }
   
   DeleteActionCommand.prototype = {
      constructor: DeleteActionCommand, 
      
      deleteFromTree: function(){
         this.actionTreeItem = this.actionsTreeView.getItemForAction(this.action)
         this.parentTreeItem = this.actionTreeItem.getParent()
         this.indexOfItem = this.parentTreeItem.getIndexOfChild(this.actionTreeItem)
         var newSelectedIndex = this.actionsTreeView.getSelectedIndex()-1
         Assert.isTrue(newSelectedIndex>=0)
         this.actionsTreeView.removeAction(this.action)
         if(this.actionsTreeView.getVisibleRowCount()>0){
            if(newSelectedIndex>=this.rowCount){
               newSelectedIndex = this.rowCount-1
            }
            this.actionsTreeView.setSelected(newSelectedIndex)
         }
      },
      
      undo: function(){
         this.actionsTreeView.addItem(this.actionTreeItem, this.parentTreeItem, this.indexOfItem)
         if(ObjectUtils.instanceOf(this.action, AbstractPreviewableAction)){
            var editContext = new EditContext(this.targetWindow)
            editContext.setScript(this.script)
            this.action.preview(editContext)
         }
      }
   }
   
   Namespace.bindToNamespace("customizeyourweb", "DeleteActionCommand", DeleteActionCommand)
})()
}