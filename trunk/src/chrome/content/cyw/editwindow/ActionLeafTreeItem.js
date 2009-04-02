(function(){with(customizeyourweb){
   
   function ActionLeafTreeItem(action){
      this.AbstractActionTreeItem(action)
   }
   
   ActionLeafTreeItem.prototype = {
      constructor: ActionLeafTreeItem
   }
   
   ObjectUtils.extend(ActionLeafTreeItem, "AbstractActionTreeItem", customizeyourweb)
   ObjectUtils.extend(ActionLeafTreeItem, "AbstractLeafTreeItem", customizeyourweb)
   
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "ActionLeafTreeItem", ActionLeafTreeItem)
}})()