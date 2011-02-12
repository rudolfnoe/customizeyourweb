with(customizeyourweb){
(function(){
   function CombiHighlighter(){
      this.highlighters = ArrayUtils.cloneArray(arguments)
//TODO
      //      for (var i = 0; i < this.highlighters.length; i++) {
//            throw Error('arguments can only be highlighters')
//      }
   }
   
   CombiHighlighter.prototype = {
      constructor: CombiHighlighter,   
      highlight: function(element){
         var successful = true
         for (var i = 0; i < this.highlighters.length; i++) {
            var result = this.highlighters[i].highlight(element)
            if(!result)
               successful = false
         }
         return successful
      },

      unhighlight: function(element){
         for (var i = 0; i < this.highlighters.length; i++) {
            this.highlighters[i].unhighlight()   
         }
      }
   }
   
   Namespace.bindToNamespace("customizeyourweb", "CombiHighlighter", CombiHighlighter)
})()
}