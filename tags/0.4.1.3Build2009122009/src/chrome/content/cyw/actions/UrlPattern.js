with(customizeyourweb){
(function(){
   function UrlPattern(string){
      this.string = string
      this.t_regExp = null
      this.updateRegExp()
   }
   
   UrlPattern.prototype = {
      constructor: UrlPattern,

      getRegExp: function(){
         return this.t_regExp
      },

      getString: function(){
         return this.string
      },
      
      matchUrl: function(url){
         return this.t_regExp.test(url)   
      }, 

      updateRegExp: function(){
         this.t_regExp = UrlUtils.convertUrlPatternToRegExp(this.string)   
      }
   }

   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "UrlPattern", UrlPattern)
}).apply(this)
}