with(customizeyourweb){
(function(){

   Handler = {
      validator: null,
      
      doOnload: function(){
         try{
            var items = []
            for (var i = 0; i < 5; i++) {
               items.push("Test"+i)   
            }
            this.autocompleteHandler = new Autocomplete(byId("myTextbox1"), new DefaultAutocompleteSearchHandler(items))
         }catch(e){
            Utils.logError(e)
         }
//         byId('myTextbox1').addEventListener("keypress", function(event){Utils.stopEvent(event)}, true)
//         byId('myMenulist1').addEventListener("keydown", function(event){Utils.stopEvent(event)}, true)
      },
      
      showPopup: function(){
        byId('testpup').openPopup(byId('myTextbox1'), "after_start") 
      }
   }
   Namespace.bindToNamespace("customizeyourweb", "Handler", Handler)

   function byId(id){
      return document.getElementById(id)
   }
   
   function SearchHandlerStub(){
   }
   
   SearchHandlerStub.prototype = {
      search: function(){
         var result = []
         for (var i = 0; i < 5; i++) {
            result.push(new SearchResultEntry("Test"+i, "TestValue" + i, i, i))   
         }
         return result
      }
   }
   
})()

}