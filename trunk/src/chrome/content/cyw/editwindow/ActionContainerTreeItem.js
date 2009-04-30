with(customizeyourweb){
(function(){
   
   function ActionContainerTreeItem(action, open){
      this.AbstractActionTreeItem(action)
      this.AbstractContainerTreeItem(open)
   }
   
   ActionContainerTreeItem.prototype = {
      constructor: ActionContainerTreeItem,
      ActionContainerTreeItem:ActionContainerTreeItem
   }
   
   ObjectUtils.extend(ActionContainerTreeItem, "AbstractActionTreeItem", customizeyourweb)
   ObjectUtils.extend(ActionContainerTreeItem, "AbstractContainerTreeItem", customizeyourweb)
   
	customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "ActionContainerTreeItem", ActionContainerTreeItem)
})()
}
