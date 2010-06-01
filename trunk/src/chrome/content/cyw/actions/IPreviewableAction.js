with(customizeyourweb){
(function(){
   /*
    * Interface for actions which have a preview
    */
   function IPreviewableAction(){
   }
   
   IPreviewableAction.prototype = {
      constructor: IPreviewableAction,   
      
      /*
       * Initiates preview
       * @param targetWindow
       * @return Object: memento containing all information needed for undoing the modifications
       */
       preview: function(editContext){
         throw new Error('IPreviewableAction.preview must be implemented')
       },
       
       /*
        * Undos the modifications done by calling preview
        * @param EditContext
        * @param Object undoMemento see preview
        */
       undo: function(editContext, undoMemento){
         throw new Error('IPreviewableAction.undo must be implemented')
       }
   }
   
   Namespace.bindToNamespace("customizeyourweb", "IPreviewableAction", IPreviewableAction)
})()
}