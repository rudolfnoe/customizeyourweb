(function(){with(customizeyourweb){
   const ERROR_ICON_PATH = "chrome://customizeyourweb/content/common/ui/resources/error.ico";
   const WARNING_ICON_PATH = "chrome://customizeyourweb/content/common/ui/resources/warning.ico";
   
   function AbstractActionTreeItem(action){
      this.action = action
      this.message = null
   }
   
   AbstractActionTreeItem.prototype = {
      AbstractActionTreeItem: AbstractActionTreeItem,

      getAction: function(){
         return this.action
      },

      setAction: function(action){
         this.action = action
      },
      
      getDescendantActions: function(){
         var result = new ArrayList()
         if(this.isContainer()){
             for (var i = 0;i < this.getChildren().size(); i++) {
               var child = this.getChildren().get(i)
               result.add(child.getAction())
               result.addAll(child.getDescendantActions())
            }
         }
         return result
      },
      
      getMessage: function(){
         return this.message
      },

      setMessage: function(message){
         this.message = message
         this.updateImgSrc()
      },
      
      clearMessage: function(){
         this.setMessage(null)
      },
      
      clone: function(){
         return this.superClone()   
      },
      
      getCellText: function(column){
         var cellText = this.action.toString()
         if(ObjectUtils.instanceOf(this.action, AbstractTargetedAction) && 
               !StringUtils.isEmpty(this.action.getTargetDefinition().getTargetName())){
            cellText += " | " + this.action.getTargetDefinition().getTargetName()
         }
         if(ObjectUtils.instanceOf(this.action, AbstractNamedAction) && 
            !StringUtils.isEmpty(this.action.getName())){
            cellText += " | " + this.action.getName()
         }
         return cellText
      },
      
      hasMessage: function(){
         return this.message!=null
      },
      
      updateImgSrc: function(){
         if(!this.message)
            this.setImageSrc(null)
         else if(this.message.isError())
            this.setImageSrc(ERROR_ICON_PATH)
         else if(this.message.isWarning)
            this.setImageSrc(WARNING_ICON_PATH)
         else
            this.setImageSrc(null)
      }
      
   }
   
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "AbstractActionTreeItem", AbstractActionTreeItem)
}})()
