function doOnload(){
   var ol = document.getElementsByTagName("ol")[0]
   if(ol==null)
      alert('ol not found')
   var items = DomUtils.getChildrenBy(ol, function(childNode){
      return childNode.nodeType==1 && childNode.tagName=="LI"
   })
   if(items.length==0)
      alert('no items found')
   
   var listview = new ListViewHandler(ol, items, "background-color:rgb(223, 247, 255)")
   var scm = new ShortcutManager(window, "keydown")
   scm.addShortcut("alt+shift+r", listview.focusListView, listview)
}
