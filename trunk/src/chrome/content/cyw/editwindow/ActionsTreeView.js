with(customizeyourweb){
(function(){
   
	function ActionsTreeView(tree, script){
      this.AbstractTreeView(tree, new ActionsRootTreeItem(), false)
      this.clipboard = null
      this.script = script
   }
   
   ActionsTreeView.prototype = {
      addOrUpdateAction: function(action){
         /*
          * if action already in tree update item
          */
         var existingItem = this.getItemForAction(action)
         if(existingItem!=null){
            this.updateAction(action)
            return
         }else{
            /*    determine new parent action
             *    if action is container add container item
             *    else add leaf item
             */
            var parentItem = this._determineParentItem()
            //assure that container is open
            this.openContainer(parentItem)
            if(action.isContainer()){
               this.addItem(new ActionContainerTreeItem(action, true), parentItem)
            }else{
               this.addItem(new ActionLeafTreeItem(action), parentItem)
            }            
         }
      },
  
      _addActions: function(actionList, parentItem){
         for (var i = 0; i < actionList.size(); i++) {
            var action = actionList.get(i)
            if(action.isContainer()){
               var newParent = new ActionContainerTreeItem(action, true)
               this.addItem(newParent, parentItem)
               this._addActions(action.getActions(), newParent)
            }else{
               this.addItem(new ActionLeafTreeItem(action), parentItem)
            }
         }
      },
      
      copyAction: function(){
         var selectedItem = this.getSelectedItem()
         if(!selectedItem || selectedItem == this.getRootItem()){
            return
         }
         var clonedItem = selectedItem.clone()
         clonedItem.setParent(null)
         this.clipboard = clonedItem
         Assert.isTrue(this.clipboard!=null, "Clipboard is null")
      },
      
      cutAction: function(){
         var selectedItem = this.getSelectedItem()
         if(!selectedItem || selectedItem == this.getRootItem()){
            return
         }
         this.clipboard = (this.removeSelected(true))[0]
      },
      
      _determineParentItem: function(){
         /*
          * if nothing selected return rootitem
          * else if selecteditem is container item/action return item
          * else return parent of selected item
          */
         var selectedItem = this.getSelectedItem()
         if(!selectedItem){
            return this.getRootItem()
         }else if(selectedItem.isContainer()){
            return selectedItem
         }else{
            return selectedItem.parent
         }
      },
      
      //TODO make it right
      getActions: function(){
         function getChildActions(item){
            if(!item.isContainer())
               throw new Error('item must be container action')
            var result = new ArrayList()
            var children = item.getChildren()
            for (var i = 0;i < children.size(); i++) {
               var childItem = children.get(i)
               var childAction = childItem.getAction()
               result.add(childAction)
               if(childItem.isContainer()){
                  childAction.setActions(getChildActions(childItem))
               }
            }
            return result
         }
         return getChildActions(this.getRootItem())
      },
      
      getItemForAction: function(action, item){
         if(item==null)
            return this.getItemForAction(action, this.getRootItem())
         if(!item.isContainer())
            throw new Error("item must be container")
         var childItems = item.getChildren()
         for (var i = 0;i < childItems.size(); i++) {
            var childItem = childItems.get(i)
            if(action.equals(childItem.getAction()))
               return childItem
            if(childItem.isContainer()){
               var result = this.getItemForAction(action, childItem)
               if(result)
                  return result
            }
         }
         return null
      },
      
      getSelectedAction : function() {
			var selectedItem = this.getSelectedItem()
			if (selectedItem)
				return selectedItem.getAction()
			else
				return null
		},
      
      _moveSelected: function(upDown){
         var selectedItem = this.getSelectedItem()
         var parent = selectedItem.getParent()
         if(!selectedItem || !parent){
            return
         }
         var swapItem = null
         if(upDown=="down"){
            swapItem = parent.getNextSibling(selectedItem)
         }else{
            swapItem = parent.getPreviousSibling(selectedItem)
         }
         if(!swapItem){
            return
         }
         this.swapItems(selectedItem, swapItem)
         //adapt selection
         this.setSelected(this.getIndexForItem(selectedItem))
      },
      
      moveSelectedDown: function(){
         this._moveSelected("down")
      },

      moveSelectedUp: function(){
         this._moveSelected("up")
      },
      
      notifyActionUpdate:function(action){
         this.notifyUpdate(this.getItemForAction(action))
      },
      
      pasteClipboard: function(){
         if(this.clipboard == null){
            return
         }
         var selectedItem = this.getSelectedItem()
         if(!selectedItem.isContainer()){
            return
         }else if(!selectedItem.isContainerOpen()){
            this.openContainer(selectedItem)
         }
         //Clone it to allow multiple successive pastes
         var clonedClipboard = this.clipboard.clone()
         
         //Set new id if action is already in tree
         var clipboardActions = clonedClipboard.getDescendantActions()
         clipboardActions.addAtIndex(0, clonedClipboard.getAction())
          for (var i = 0;i < clipboardActions.size(); i++) {
            var clipboardAction = clipboardActions.get(i) 
            if(this.getItemForAction(clipboardAction)){
               //action with same id is already in tree
               clipboardAction.setId(this.script.getNextActionId())
            }
         }

         this.addItem(clonedClipboard, selectedItem)
         //Adjust selection
         this.setSelectedItem(selectedItem)
      },
      
      removeAction: function(action){
         this.removeItem(this.getItemForAction(action))
      },
      
      setActions: function(actions, scriptErrorArray){
         this._addActions(actions, this.getRootItem())
         this.setScriptErrors(scriptErrorArray)
      },
      
      setImageSrc: function(action, imgSrc){
         this.getItemForAction(action).setImageSrc(imgSrc)
      },
      
      setScriptErrors: function(errorArray){
         var actionIdToErrorMap = {}
         for (var i = 0; i < errorArray.length; i++) {
            var err = errorArray[i]
            if(err.actionId)
               actionIdToErrorMap[err.actionId] = err
         }
         this.iterateTree(function(item){
            var actionError = actionIdToErrorMap[item.getAction().getId()]
            if(actionError)
               item.setMessage(Message.createFromError(actionError))
         }, true)
      },
      
      updateAction: function(action){
         var treeViewItem = this.getItemForAction(action)
         if(treeViewItem==null)
            throw new Error('Action not in treeview')
         treeViewItem.clearMessage()   
         treeViewItem.setAction(action)
         this.notifyUpdate(treeViewItem)
      }
      
   }
   ObjectUtils.extend(ActionsTreeView, "AbstractTreeView", customizeyourweb)
	
   Namespace.bindToNamespace("customizeyourweb", "ActionsTreeView", ActionsTreeView)
   
   function ActionsRootTreeItem(){
      this.ActionContainerTreeItem(null, true)
   }
   
   ActionsRootTreeItem.prototype = {
      constructor: ActionsRootTreeItem,
      
      getAction: function(){
         null
      },

      setAction: function(action){
         throw new Error('not implemented')
      },
      
      getCellText: function(column){
         return "Root"
      },
      
      hasMessage: function(){
         return false
      },
      
      updateImgSrc: function(){
      }
   }
   ObjectUtils.extend(ActionsRootTreeItem, "ActionContainerTreeItem", customizeyourweb)
   //Must be public for cloning
   Namespace.bindToNamespace("customizeyourweb", "ActionsRootTreeItem", ActionsRootTreeItem)

})()
}
