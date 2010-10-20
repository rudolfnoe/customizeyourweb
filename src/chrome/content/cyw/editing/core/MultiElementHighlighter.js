/*
 * Taken and modified from Firebug Copyright (c) 2007, Parakey Inc. All rights
 * reserved. see firebug-license.txt
 */
(function() {
with (customizeyourweb) {
   const edgeSize = 2

   function MultiElementHighlighter(color, showNumber) {
      this.AbstractHighlighter()
      this.color = color
      this.highlighters = []
      this.showNumber = showNumber
   }

   MultiElementHighlighter.prototype = {
      highlight: function(elements){
         for (var i = 0; i < elements.length; i++) {
            var highlighter = new FrameHighlighter(this.showNumber, this.color)
            this.highlighters.push(highlighter)
            highlighter.highlight(elements[i], i+1)
         }
      },
      
      unhighlight: function(){
         for (var i = 0; i < this.highlighters.length; i++) {
            this.highlighters[i].unhighlight()
         }
         this.highlighters = []
      },
      
      updateHighlighting: function(newElementsToHighlight){
         this.unhighlight()
         this.highlight(newElementsToHighlight)
      }
   };
   
   ObjectUtils.extend(MultiElementHighlighter, "AbstractHighlighter", customizeyourweb)

   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "MultiElementHighlighter", MultiElementHighlighter)

}
})()