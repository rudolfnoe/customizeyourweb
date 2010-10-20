with(customizeyourweb){
(function(){
   function ScriptTreeItem(script){
      //marker for changed item
      this.dirty = false
      this.script = script
   }
   ScriptTreeItem.prototype = {
      isDirty: function(){
         return this.dirty
      },

      setDirty: function(dirty){
         this.dirty = dirty
      },
      
      getScript: function(){
         return this.script
      },

      getCellText: function(column){
         if(column.id=="treeColName"){
            return this.script.getName()
         }else if(column.id=="treeColUrlPattern"){
            return this.script.getUrlPatternDescription()
         }else if(column.id=="treeColDisabled"){
            return this.script.isDisabled()
         }else{
            return "Error: Unkown column id"
         }
      },
      
      getCellValue: function(column){
         if(column.id=="treeColDisabled")
            return this.script.isDisabled()
         throw new Error('unknonw column for getCellValue')
      },

      setCellValue: function(column, value){
         if(column.id=="treeColDisabled"){
            this.script.setDisabled(value=="true")
            this.dirty = true
            return
         }
         throw new Error('unknonw column for setCellValue')
      }
      
   }
   ObjectUtils.extend(ScriptTreeItem, "AbstractLeafTreeItem", customizeyourweb)

   Namespace.bindToNamespace("customizeyourweb", "ScriptTreeItem", ScriptTreeItem)
})()
}