with(customizeyourweb){
(function(){
   const COLUMNS_COUNT = 3;
   const COL_HIDDENS_PREF_KEY = "customizeyourweb.prefs.scriptTreeColHiddens";
   const COL_ORDINALS_PREF_KEY = "customizeyourweb.prefs.scriptTreeColOrdinals";
   const COL_SORT_ACTIVE_PREF_KEY = "customizeyourweb.prefs.scriptTreeColSortActive";
   const COL_SORT_DIRECTION_PREF_KEY = "customizeyourweb.prefs.scriptTreeColSortDirection";
   const COL_WIDTHS_PREF_KEY = "customizeyourweb.prefs.scriptTreeColWidths";
   
   function ScriptTreeView(tree, scripts){
      this.AbstractTreeView(tree, null, true)
      this.fixRezieTreeColBug45818346()
      this.restorePersistentColAttributes()
      this.initView(scripts)
      this.sortView()
      this.initListener()
   }
   ScriptTreeView.prototype = {
      getBindingParent: function(){
         return document.getBindingParent(this.getTree())
      },
      
      getPrefsForCol: function(prefKey){
         return Prefs.getCharPref(prefKey).split(',')
      },
      
      fixRezieTreeColBug45818346: function(){
         var tree = this.getTree()
         var colArray = tree.getElementsByTagName("xul:treecol")
         var cols = tree.getElementsByTagName("xul:treecols")[0]
         for (var i = 1; i < colArray.length; i++) {
            var splitter = document.createElementNS(Constants.XUL_NS, "splitter")
            splitter.className = "tree-splitter"
            cols.insertBefore(splitter, colArray[i])
         }
      },
      
      initView: function(scripts){
         for (var i = 0; i < scripts.size(); i++) {
            this.addItem(new ScriptTreeItem(scripts.get(i)))
         }
      },
      
      restorePersistentColAttributes: function(){
         var tree = this.getTree()
         var colOrdinals = this.getPrefsForCol(COL_ORDINALS_PREF_KEY)
         var colHiddens = this.getPrefsForCol(COL_HIDDENS_PREF_KEY)
         var colSortActive = this.getPrefsForCol(COL_SORT_ACTIVE_PREF_KEY)
         var colSortDirection = this.getPrefsForCol(COL_SORT_DIRECTION_PREF_KEY)
         var colWidths = this.getPrefsForCol(COL_WIDTHS_PREF_KEY)
         
         var cols = tree.getElementsByTagName("xul:treecol")
         var currentSortActiveCol = null
         var currentSortDirection = null
         for (var i = 0; i < cols.length; i++) {
            var col = cols[i]
            col.setAttribute("ordinal", colOrdinals[i])
            col.setAttribute("hidden", colHiddens[i])
            col.setAttribute("sortActive", colSortActive[i])
            col.setAttribute("sortDirection", colSortDirection[i])
            col.setAttribute("width", colWidths[i])
         }
      },
      
      getScripts: function(){
         var items = this.getRootItem().getChildren()
         var result = new ArrayList()
         for (var i = 0; i < items.size(); i++) {
            result.add(items.get(i).getScript())
         }
         return result
      },
      
      getSelectedScript: function(){
         var selectedItem = this.getSelectedItem()
         if(!selectedItem)
            return null
         else
            return selectedItem.getScript()
      },
      
      initListener: function(){
         window.addEventListener("unload", Utils.bind(this.setColsPersistAttributes, this), true)
      },
      
      isEditable: function(row, column){
         return column.editable
      },
      
      setColPref: function(prefKey, valuArr){
         Prefs.setCharPref(prefKey, valuArr.join(','))
      },
      
      setColsPersistAttributes: function(){
         var colHiddens = []
         var colOrdinals = []
         var colSortActives = []
         var colSortDirections = []
         var colWidths = []

         var tree = this.getTree()
         var cols = tree.getElementsByTagName("xul:treecol")
         for (var i = 0; i < cols.length; i++) {
            var col = cols[i]
            colHiddens.push(col.getAttribute("hidden"))
            colOrdinals.push(col.getAttribute("ordinal"))
            colSortActives.push(col.getAttribute("sortActive"))
            colSortDirections.push(col.getAttribute("sortDirection"))
            colWidths.push(col.getAttribute("width"))
         }
         this.setColPref(COL_HIDDENS_PREF_KEY, colHiddens)
         this.setColPref(COL_ORDINALS_PREF_KEY, colOrdinals)
         this.setColPref(COL_SORT_ACTIVE_PREF_KEY, colSortActives)
         this.setColPref(COL_SORT_DIRECTION_PREF_KEY, colSortDirections)
         this.setColPref(COL_WIDTHS_PREF_KEY, colWidths)
      },
      
      sortView: function(){
         var cols = this.getTree().columns
         for (var i = 0; i < cols.length; i++) {
            if(cols[i].element.getAttribute('sortActive') == 'true'){
               this.sort(cols[i], cols[i].element.getAttribute('sortDirection'))
               break
            }
         }
      }
   }
   ObjectUtils.extend(ScriptTreeView, AbstractTreeView)
   
   Namespace.bindToNamespace("customizeyourweb", "ScriptTreeView", ScriptTreeView)
})()
}