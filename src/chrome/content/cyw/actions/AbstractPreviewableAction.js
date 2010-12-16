with(customizeyourweb){
(function(){
   /*
    * Mixin-Class which provides default preview undo behavior
    */
   function AbstractPreviewableAction(){
   }
   
   AbstractPreviewableAction.prototype = {
      constructor: AbstractPreviewableAction,   
      
      /*
       * Initiates preview
       * @param targetWindow
       * @return void
       */
       preview: function(editContext){
         throw new Error('AbstractPreviewableAction.preview must be implemented')
       },
       
       /*
        * Template method for undo functionality
        * Calls undoInternal as concrete method
        * @param EditContext
        * @return void
        */
       undo: function(editContext){
         Assert.notNull(this.undoInternal, "Template method undoInternal must be defined")
         var undoMemento = editContext.getActionChangeMemento(this.getId())
         if(!undoMemento){
            return
         }
         this.undoInternal(editContext, undoMemento)
       }
   }
   
   Namespace.bindToNamespace("customizeyourweb", "AbstractPreviewableAction", AbstractPreviewableAction)
})()
}