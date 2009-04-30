with(customizeyourweb){
(function(){
   function ScriptTreeItem(script){
      this.script = script 
   }
   ScriptTreeItem.prototype = {
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
            return
         }
         throw new Error('unknonw column for setCellValue')
      },
      
      getScript: function(){
         return this.script
      }
   }
   ObjectUtils.extend(ScriptTreeItem, "AbstractLeafTreeItem", customizeyourweb)

   Namespace.bindToNamespace("customizeyourweb", "ScriptTreeItem", ScriptTreeItem)
})()
}