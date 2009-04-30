with(customizeyourweb){
(function(){
   const EDIT_LISTVIEW_DIALOG_URL = CywCommon.CYW_CHROME_URL + "editing/shortcut/edit_listview_dialog.xul"
   function EditListViewCommand(){
   }
   
   EditListViewCommand.prototype = {
      doCreateAction: function(editContext){
         var targetElement = editContext.getTargetElement()
         var rootElement = this.getRootElement(targetElement)
         var action = null
         action = new ListViewAction(AbstractTargetDefinitionFactory.createDefaultDefinition(rootElement))
         action.setRepetitionBehavior(RepetitionBehavior.RUN_ALWAYS)
         action.setHighlightCss("background-color: " + Prefs.getPref("customizeyourweb.listview.bgcolor-focused"))
         action.setListItemsTagName(this.getListItemTagName(rootElement))   
         return this.editAction(action, rootElement, editContext.getTargetWindow())
      },
         
      doEditAction: function(editContext){
         return this.editAction(editContext.getAction(), editContext.getTargetElement(), editContext.getTargetWindow())
      },

      editAction: function(action, targetElement, targetWindow){
         var editDialog = new EditDialog(EDIT_LISTVIEW_DIALOG_URL, "EditListView", true, window, null, 
               {action: action, targetElement:targetElement, targetWindow: targetWindow})
         editDialog.show()
         action = editDialog.getNamedResult("action")
         if(action==null)
            return
         this.setAction(action)
         return this.getAction()
      },
      
      getListItemTagName: function(rootElement){
         var tn = rootElement.tagName
         if(tn=="TRBODY"){
            return "TR"
         }else if(ArrayUtils.contains(["OL", "UL", "DIR", "MENU"], tn)){
            return "LI"
         }else{
            var firstELementChild = DomUtils.getFirstChildByTagName(rootElement, "*")
            if(!firstELementChild)
               throw Error('root has no child elements')
            return firstELementChild.tagName
         }
      },
      
      getRootElement: function(targetElement){
         var tn = targetElement.tagName
         if(tn=="TABLE"){
            return DomUtils.getFirstChildBy(targetElement, function(childNode){
               return childNode.tagName=="TBODY"               
            }, true)
         }else{
            return targetElement
         }
      }
      
   }
   
   
   ObjectUtils.extend(EditListViewCommand, AbstractEditCommand)

   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "EditListViewCommand", EditListViewCommand)
})()
}