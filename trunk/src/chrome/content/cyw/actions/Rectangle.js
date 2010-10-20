/**
 * @class
 */
with(customizeyourweb){
(function(){
   function Rectangle(x, y, width, height, unit){
      var unit = unit?unit:"px"
		this.x = x?x:0
		this.xUnit = unit
		this.y = y?y:0
		this.yUnit = unit
		this.width = width?width:0
		this.widthUnit = unit
		this.height= height?height:0
		this.heightUnit = unit
   }
   
   Rectangle.prototype = {
      constructor: Rectangle  
   };
   
   Namespace.bindToNamespace("customizeyourweb", "Rectangle", Rectangle)
})()
}