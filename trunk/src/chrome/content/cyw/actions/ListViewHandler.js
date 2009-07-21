with(customizeyourweb){
(function(){
   const EVENT_TYPES_FOR_ROOT = ["click", "focus", "blur"];
   const CURRENT_INDEX_ATTR = 'cyw_currentIndex';
   
   function ListViewHandler(rootElement, listItems, highlightCss, defaultLinkTarget){
      Assert.paramsNotNull(arguments)
      this.currentIndex = 0
      this.currentItemWrapper = null
      this.defaultLinkTarget = defaultLinkTarget
      this.focused = false
      this.highlightCss = highlightCss
      this.listItems = listItems
      this.rootElement = rootElement
      if(this.rootElement.hasAttribute(CURRENT_INDEX_ATTR))
         this.currentIndex = parseInt(this.rootElement.getAttribute(CURRENT_INDEX_ATTR), 10)
//      if(StringUtils.isEmpty(rootElement.tabIndex))
//         rootElement.tabIndex = 0
      this.scm = new ShortcutManager(rootElement, "keydown", true)
      //ElementWrappers for td-tags with non-transparent background
      this.currentTdTagWrappers = []
      this.registerMultipleEventListener(this.rootElement, EVENT_TYPES_FOR_ROOT, true)
      this.initShortcuts()
   }
   
   ListViewHandler.prototype = {
      checkBlur: function(){
         var focusedElement = document.commandDispatcher.focusedElement
         var isBlurred = true
         if(focusedElement){
            var compDocPosResult = this.rootElement.compareDocumentPosition( focusedElement )
            if((compDocPosResult & Node.DOCUMENT_POSITION_CONTAINED_BY)!=0 || this.rootElement == focusedElement){
               var isBlurred = false
            }
         }
         if(isBlurred) {
            this.updateHighlighting(-1)
         }
      },
      destroy: function(){
         this.unRegisterMultipleEventListener(this.rootElement, EVENT_TYPES_FOR_ROOT, true)
         this.scm.destroy()
         //set current index attribute to focus the same index on cached pages
         this.rootElement.setAttribute(CURRENT_INDEX_ATTR, this.currentIndex)
         this.updateHighlighting(-1)
      },
      focusListView: function(){
         if(!this.focused){
            this.updateHighlighting(this.currentIndex)
         }
      },
      getCurrentItem: function(){
         return this.listItems[this.currentIndex]
      },
      getFirstIndex: function(){
         return 0
      },
      getLastIndex: function(){
         return this.listItems.length-1
      },
      handleBlur: function(event){
         Utils.executeDelayed((new Date()).getTime(), 100, this.checkBlur, this, [event])
      },
      handleFocus: function(event){
         this.focusListView()
      },
      handleClick: function(event){
         var targetElement = event.target
         var element = DomUtils.getAncestorBy(targetElement, Utils.bind(function(parentNode){
            return (parentNode==this.rootElement || this.listItems.indexOf(parentNode)!=-1)?true:false
         }, this))
         if(element==null || element==this.rootElement)
            return
         this.updateHighlighting(this.listItems.indexOf(element))
         if(DomUtils.isEditableElement(targetElement)){
            //As focus will be on row change focus back to element 
            targetElement.focus()
         }
      },
      highlight: function(item){
         this.currentItemWrapper = new ElementWrapper(item)
         this.currentItemWrapper.setCss(this.highlightCss)
         if(this.isTableRowTag(item)){
            this.currentTdTagWrappers = []
            var tds = item.getElementsByTagName('TD')
            for (var i = 0; i < tds.length; i++) {
               var elemWrapper = new ElementWrapper(tds[i])
               this.currentTdTagWrappers[i] = elemWrapper
               elemWrapper.setStyle("background", "transparent", "important")
            }
         }
         this.currentItemWrapper.setProperty("tabIndex", 0)
         item.focus()
      },
      initShortcuts: function(){
         this.scm.addShortcut("Up", this.moveUp, this)
         this.scm.addShortcut("k", this.moveUp, this)
         this.scm.addShortcut("Down", this.moveDown, this)
         this.scm.addShortcut("j", this.moveDown, this)
         this.scm.addShortcut("Home", this.moveFirst, this)
         this.scm.addShortcut("End", this.moveLast, this)
         this.scm.addShortcut("Return", function(event){return this.openItemIn(event, this.defaultLinkTarget)}, this)
         this.scm.addShortcut("Ctrl+Return", function(event){
            return this.openItemIn(event, this.defaultLinkTarget==LinkTarget.CURRENT?LinkTarget.TAB:LinkTarget.CURRENT)
         }, this)
         this.scm.addShortcut("Space", this.toggleFirstCheckbox, this)
      },
      isFirst: function(index){
         return index==this.getFirstIndex()
      },
      isLast: function(index){
         return index==this.getLastIndex()
      },
      isTableRowTag: function(item){
         return item.tagName=="TR"
      },
      moveDown: function(){
         if(this.isLast(this.currentIndex))
            return
         this.updateHighlighting(this.currentIndex+1) 
      },
      moveFirst: function(){
         if(this.isFirst(this.currentIndex))
            return
         this.updateHighlighting(this.getFirstIndex())
      },
      moveLast: function(){
         if(this.isLast(this.currentIndex))
            return
         this.updateHighlighting(this.getLastIndex())
      },
      moveUp: function(){
         if(this.isFirst(this.currentIndex))
            return
         this.updateHighlighting(this.currentIndex-1) 
      },
      openItemIn: function(event, linkTarget){
         var ci = this.getCurrentItem()
         if(event.originalTarget != ci){//Focus is somewhere within the item
            return ShortcutManager.DO_NOT_SUPPRESS_KEY
         }
         var links = ci.getElementsByTagName('a')
         if(links.length==0){
            var mouseEvent = new MouseEvent("mousedown")
            mouseEvent.dispatch(ci)
            mouseEvent.setType("click")
            mouseEvent.dispatch(ci)
            mouseEvent.setType("mouseup")
            mouseEvent.dispatch(ci)
            return
         }
         (new LinkWrapper(links[0])).open(linkTarget)
      },
      toggleFirstCheckbox: function(){
         var ci = this.getCurrentItem()
         var firstCheckbox = XPathUtils.getElement(".//input[@type='checkbox']", ci)
         if(!firstCheckbox)
            return
         firstCheckbox.click() //to also trigger other eventhandler
         this.updateHighlighting(this.currentIndex)
      },
      unhighlight: function(){
         if(this.currentItemWrapper){
            this.currentItemWrapper.restore()
         }
         if(this.currentTdTagWrappers){
            for (var i = 0; i < this.currentTdTagWrappers.length; i++) {
               this.currentTdTagWrappers[i].restore()
            }
         }
      },
      updateHighlighting: function(newIndex){
         this.unhighlight()
         if(newIndex==-1){
            this.focused = false
            return
         }else{
            this.focused = true
         }
         this.currentIndex = newIndex
         this.highlight(this.listItems[newIndex])
      }
   }
   
   ObjectUtils.extend(ListViewHandler, AbstractGenericEventHandler)
   
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "ListViewHandler", ListViewHandler)
})()
}