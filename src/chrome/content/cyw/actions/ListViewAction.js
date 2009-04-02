(function(){with(customizeyourweb){   
   
   function ListViewAction (targetDefinition){
      this.AbstractTargetedAction(targetDefinition)
      this.focusOnLoad = true
      this.highlightCss = null
      this.listItemsTagName = null
      this.noOfHeaderRows = 0
      this.t_listViewHandler = null
   }
   
   ListViewAction.prototype = {
      constructor: ListViewAction,
      
      isFocusOnLoad: function(){
         return this.focusOnLoad
      },

      setFocusOnLoad: function(focusOnLoad){
         this.focusOnLoad = focusOnLoad
      },

      getListItemsTagName: function(){
         return this.listItemsTagName
      },

      setListItemsTagName: function(listItemsTagName){
         this.listItemsTagName = listItemsTagName
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

      doActionInternal: function(cywContext){//Todo change
         if(this.isTargetOptionalAndTargetMissing(cywContext)){
            return
         }
         var rootElement = this.getTarget(cywContext)
         var potListItems = rootElement.getElementsByTagName(this.listItemsTagName)
         var listItems = []
         for (var i = 0; i < potListItems.length; i++) {
            var listItem = node = potListItems[i]
            while(node = node.parentNode){
               if(node == rootElement){
                  listItems.push(listItem)
                  break
               }
               if(node.localName == this.listItemsTagName){
                  break
               }
            }
         }
         var listItems = listItems.slice(this.noOfHeaderRows)
         this.t_listViewHandler = new ListViewHandler(rootElement, listItems, this.highlightCss) 
         this.registerShortcut(cywContext)
         if(this.focusOnLoad){
            (new FocusAction(this.getTargetDefinition())).doAction(cywContext)
         }
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
   
}})()