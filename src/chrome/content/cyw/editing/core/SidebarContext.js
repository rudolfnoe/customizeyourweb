//TODO refactor
(function(){
	function SidebarContext(editScriptHandler, scripts, targetWin) {
		this.editScriptHandler = editScriptHandler
		this.scripts = scripts
		this.targetWin = targetWin
	}
   
   SidebarContext.prototype = {
   }
	
	customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "SidebarContext", SidebarContext)
})()