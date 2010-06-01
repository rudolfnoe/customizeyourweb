with (customizeyourweb) {
	(function(){
		function CywContext(targetWindow, pageEventType, cachedPage){
			this.AbstractContext(targetWindow)
			//flag indicating whether the page is cached
			this.cachedPage = cachedPage ? cachedPage : false
			//The page event triggering the initialization
			this.pageEventType = pageEventType
		}
		
		//Statics
		//Name of the clipboard member, used for watching von property changes
		CywContext.CLIPBOARD_PROPERTY_NAME = "clipboard"
		
		CywContext.prototype = {
			constructor: CywContext,
			
			getPageEventType: function(){
				return this.pageEventType
			},
			
			isCachedPage: function(){
				return this.cachedPage
			},
			
			isDOMContentLoadedEvent: function(){
				return this.pageEventType && this.pageEventType == PageEvents.DOM_CONTENT_LOADED
			},
			
			isMutationEvent: function(){
				return this.pageEventType && this.pageEventType == PageEvents.MUTATION_EVENT
			}
		}
		ObjectUtils.extend(CywContext, "AbstractContext", customizeyourweb)
		customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "CywContext", CywContext)
		
	})()
}