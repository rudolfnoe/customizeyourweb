/**
 * @class
 */
with(customizeyourweb){
(function(){
   /*
    * Command deleting and undoing deletion of actions
    * from the actions tree
    */
   function DeleteActionCommand(action, actionsTreeView){
      Assert.paramsNotNull(arguments)
      this.action = action
      this.actionsTreeView = actionsTreeView
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
         this.actionsTreeView.removeAction(this.action)
      },
      
      undo: function(){
         this.actionsTreeView.addItem(this.actionTreeItem, this.parentTreeItem, this.indexOfItem)
      }
   }
   
   Namespace.bindToNamespace("customizeyourweb", "DeleteActionCommand", DeleteActionCommand)
})()
}