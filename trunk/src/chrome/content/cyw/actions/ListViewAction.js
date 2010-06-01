with(customizeyourweb){
(function(){   
   
   function ListViewAction (id, targetDefinition){
      this.AbstractTargetedAction(id, targetDefinition)
      //Do this second as default repetition behavior will be overridden
      this.AbstractShortcutAction()
      this.defaultLinkTarget = LinkTarget.CURRENT
      this.focusOnLoad = true
      this.highlightCss = null
      this.listItemsJQuery = null
      this.noOfHeaderRows = 0
      this.ommitEveryXthItem = 0
      this.linkNoToOpen = 1
      this.t_listViewHandler = null
      //Backup of all listitems to determine if the list was refreshed
      //only in this case the focus if at all should take place
      //See issue 51
      this.t_listItemsBackup = null
   }
   
   ListViewAction.prototype = {
      constructor: ListViewAction,
      
      getDefaultLinkTarget: function(){
         return this.defaultLinkTarget
      },

      setDefaultLinkTarget: function(defaultLinkTarget){
         this.defaultLinkTarget = defaultLinkTarget
      },

      isFocusOnLoad: function(){
         return this.focusOnLoad
      },

      setFocusOnLoad: function(focusOnLoad){
         this.focusOnLoad = focusOnLoad
      },

      getListItemsJQuery: function(){
         return this.listItemsJQuery
      },

      setListItemsJQuery: function(listItemsJQuery){
         this.listItemsJQuery = listItemsJQuery
      },

      getHighlightCss: function(){
         return this.highlightCss
      },

      setHighlightCss: function(highlightCss){
         this.highlightCss = highlightCss
      },

      getNoOfHeaderRows: function(){
         return this.noOfHeaderRows
      },

      setNoOfHeaderRows: function(noOfHeaderRows){
         this.noOfHeaderRows = noOfHeaderRows
      },

      getOmmitEveryXthItem: function(){
         return this.ommitEveryXthItem
      },

      setOmmitEveryXthItem: function(ommitEveryXthItem){
         this.ommitEveryXthItem = ommitEveryXthItem
      },
      
      getLinkNoToOpen: function(){
         return this.linkNoToOpen
      },

      setLinkNoToOpen: function(linkNoToOpen){
         this.linkNoToOpen = linkNoToOpen
      },

      determineListItems: function(rootElement){
         var potListItems = $(this.listItemsJQuery, rootElement).toArray()
         //For compatibility reasons to version prio the use of jQuery
         //values of simple tags like div, td are filtered in a way
         //that only to topmost decendant is taken for the list
         if(ArrayUtils.contains(["div", "span", "td", "table", "tr"], this.listItemsJQuery)){
            var listItemsFiltered1 = []
            for (var i = 0; i < potListItems.length; i++) {
               var listItem = node = potListItems[i]
               while(node = node.parentNode){
                  if(node == rootElement){
                     listItemsFiltered1.push(listItem)
                     break
                  }
                  if(node.localName == this.listItemsJQuery){
                     break
                  }
               }
            }
         }else{
            var listItemsFiltered1 = potListItems
         }
         //Now filter the number of Header Rows
         var listItemsFiltered2 = listItemsFiltered1.slice(this.noOfHeaderRows)
         //And in the case ommit some items
         var resultItems = []
         if(this.ommitEveryXthItem>=2){
            for (var i = 0; i < listItemsFiltered2.length; i++) {
               if((i+1)%this.ommitEveryXthItem==0){
                  continue
               }
               resultItems.push(listItemsFiltered2[i])
            }
         }else{
            resultItems = listItemsFiltered2
         }
         return resultItems
      },

      doActionInternal: function(cywContext){//Todo change
         if(this.isTargetOptionalAndTargetMissing(cywContext)){
            return false
         }
         var rootElement = this.getTarget(cywContext)
         var listItems = this.determineListItems(rootElement)
         this.t_listViewHandler = new ListViewHandler(rootElement, listItems, this.highlightCss, this.defaultLinkTarget, this.linkNoToOpen) 
         this.registerShortcut(cywContext)
         
         if(this.focusOnLoad && !ArrayUtils.equals(listItems, this.t_listItemsBackup)){
            (new FocusAction(null, this.getTargetDefinition())).doAction(cywContext)
         }
         this.t_listItemsBackup = listItems
         return true
      },
      
      cleanUp: function(cywContext){
         this.superCleanUp(cywContext)
         if(this.t_listViewHandler){
            this.t_listViewHandler.destroy()
         }
      },
      
      performShortcut: function(cywContext){
         this.t_listViewHandler.focusListView()
      }      
      
   }
   
   ObjectUtils.extend(ListViewAction, "AbstractShortcutAction", customizeyourweb)
   ObjectUtils.extend(ListViewAction, "AbstractTargetedAction", customizeyourweb)
   
   
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "ListViewAction", ListViewAction)
   
})()
}