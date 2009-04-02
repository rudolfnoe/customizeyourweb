with(customizeyourweb){
(function(){
   function TargetWinDefinition(includeUrlPatternStrings, excludeUrlPatternStrings){
      this.includeUrlPatterns = new ArrayList()
      this.excludeUrlPatterns = new ArrayList()
      if(includeUrlPatternStrings)
         this.setIncludeUrlPatterns(includeUrlPatternStrings)
      if(excludeUrlPatternStrings)
         this.setExcludeUrlPatterns(excludeUrlPatternStrings)
   }
   
   TargetWinDefinition.prototype = {
      constructor: TargetWinDefinition,
      
      getIncludeUrlPatternStrings: function(){
         return this._getPatternStrings(this.includeUrlPatterns)
      },

      getExcludeUrlPatternStrings: function(){
        return this._getPatternStrings(this.excludeUrlPatterns) 
      },
      
      _getPatternStrings: function(patternList){
         var result = new Array()
         for (var i = 0;i < patternList.size(); i++) {
            result.push(patternList.get(i).getString())            
         }
         return result
      },
      
      getMatchingWindows: function(win){
         var matchingWins = new Array()   
         DomUtils.iterateWindows(win, function(subWin){
            if(!this.matchUrl(subWin.location.href))
               return
            matchingWins.push(subWin)
         }, this)
         return matchingWins
      },
      
      getUrlPatternDescription: function(){
         if(this.includeUrlPatterns.size()==0)
            return ""
         return this.includeUrlPatterns.get(0).getString()
      },
      
      iterateMatchingWins: function(win, callbackFct, thisObj){
         var matchingWins = this.getMatchingWindows(win)
         for (var i = 0; i < matchingWins.length; i++) {
            callbackFct.apply(thisObj, [matchingWins[i]])
         }
      },

      matchUrl: function(url){
         var matchInclude = false
         for (var i = 0;i < this.includeUrlPatterns.size(); i++) {
            if(this.includeUrlPatterns.get(i).matchUrl(url)){
               matchInclude = true
               break
            }
         }
         if(!matchInclude)
            return false
            
         for (var i = 0;i < this.excludeUrlPatterns.size(); i++) {
            if(this.excludeUrlPattern.get(i).matchUrl(url))
               return false
         }
         return true
      },

      setExcludeUrlPatterns: function(patternsArray){
         this._setUrlPatterns(patternsArray, this.excludeUrlPatterns)
      },

      setIncludeUrlPatterns: function(patternsArray){
         this._setUrlPatterns(patternsArray, this.includeUrlPatterns)
      },
      
      _setUrlPatterns: function(newPatternsArray, patternsList){
         patternsList.clear()
         for (var i = 0; i < newPatternsArray.length; i++) {
            patternsList.add(new UrlPattern(newPatternsArray[i]))
         }
      },

      updateUrlPatternRegExp: function(){
          for (var i = 0;i < this.includeUrlPatterns.size(); i++) {
            this.includeUrlPatterns.get(i).updateRegExp()
         }
          for (var i = 0;i < this.excludeUrlPatterns.size(); i++) {
            this.excludeUrlPatterns.get(i).updateRegExp()
         }
      }
      
   }
   
   Namespace.bindToNamespace("customizeyourweb", "TargetWinDefinition", TargetWinDefinition)
})()
}