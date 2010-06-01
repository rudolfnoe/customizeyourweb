with(customizeyourweb){
(function(){
   const EDIT_LISTVIEW_DIALOG_URL = CywCommon.CYW_CHROME_URL + "editing/shortcut/edit_listview_dialog.xul"
   function EditListViewCommand(){
   }
   
   EditListViewCommand.prototype = {
      doCreateAction: function(editContext){
         var targetElement = editContext.getTargetElement()
         var rootElement = this.getRootElement(targetElement)
			editContext.setTargetElement(rootElement)
         var action = null
         action = new ListViewAction(editContext.getNextActionId(), AbstractTargetDefinitionFactory.createDefaultDefinition(rootElement))
         action.setRepetitionBehavior(RepetitionBehavior.RUN_ALWAYS)
         action.setHighlightCss("background-color: " + Prefs.getPref("customizeyourweb.listview.bgcolor-focused"))
         action.setListItemsJQuery(this.getListItemTagName(rootElement))   
         return this.editAction(action, editContext)
      },
         
      doEditAction: function(action, editContext){
         return this.editAction(action, editContext)
      },

      editAction: function(action, editContext){
         var editDialog = new EditDialog(EDIT_LISTVIEW_DIALOG_URL, "EditListView", action, editContext)
         editDialog.show()
         return editDialog.getActionResult()
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
   
   
   ObjectUtils.extend(EditListViewCommand, "AbstractEditCommand", customizeyourweb)

   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "EditListViewCommand", EditListViewCommand)
})()
}