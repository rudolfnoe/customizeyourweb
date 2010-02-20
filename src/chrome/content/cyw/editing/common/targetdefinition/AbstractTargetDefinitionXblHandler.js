with (customizeyourweb) {
(function() {
	function AbstractTargetDefinitionXblHandler(targetDefinitionML, targetWin, targetElement) {
      this.targetDefinitionHighlighter = new MultiElementHighlighter("#208F1A", true)
		this.targetDefinitionML = targetDefinitionML
		this.targetElement = targetElement
		this.targetWin = targetWin
	}

	AbstractTargetDefinitionXblHandler.prototype = {
		constructor : AbstractTargetDefinitionXblHandler,

      getTargetDefinitionHighlighter: function(){
         return this.targetDefinitionHighlighter
      },

      setTargetDefinitionHighlighter: function(targetDefinitionHighlighter){
         this.targetDefinitionHighlighter = targetDefinitionHighlighter
      },

      getTargetDefinitionML : function() {
			return this.targetDefinitionML
		},

		setTargetDefinitionML : function(targetDefinitionML) {
			this.targetDefinitionML = targetDefinitionML
		},
      
      getTargetDefinitionValue: function(){
         return this.targetDefinitionML.value
      },
      
      getTargetDocument: function(){
         return this.getTargetWin().document
      },

      getTargetElement: function(){
         return this.targetElement
      },

      setTargetElement: function(targetElement){
         this.targetElement = targetElement
      },

      getTargetWin: function(){
         return this.targetWin
      },

      setTargetWin: function(targetWin){
         this.targetWin = targetWin
      },

      cleanUp : function() {
         this.getTargetDefinitionHighlighter().unhighlight()
		},

		createDefaultDefinition : function(targetElement) {
			throw Error("Must be implemented")
		},

		createDefinitions : function(targetElement) {
			throw Error("Must be implemented")
		},

		getCurrentTargets : function() {
			throw Error("Must be implemented")
		},

		getTargetDefinition : function() {
			throw Error("Must be implemented")
		},

		handleCursorPositionChange : function() {
		}

	}

	Namespace.bindToNamespace("customizeyourweb", "AbstractTargetDefinitionXblHandler", AbstractTargetDefinitionXblHandler)
})()
}