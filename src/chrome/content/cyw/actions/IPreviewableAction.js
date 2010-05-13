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
       * @return UndoMemento: containing all information needed for undoing the modifications
       */
       preview: function(targetWindow){
         throw new Error('IPreviewableAction.preview must be implemented')
       },
       
       /*
        * Undos the modifications done by calling preview
        * @param targetWin
        * @param undoMemento see preview
        */
       undo: function(targetWindow, undoMemento){
         throw new Error('IPreviewableAction.undo must be implemented')
       }
   }
   
   Namespace.bindToNamespace("customizeyourweb", "IPreviewableAction", IPreviewableAction)
})()
}