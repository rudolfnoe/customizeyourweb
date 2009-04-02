with (customizeyourweb) {
(function() {
	const ERROR_MESSAGE_STRINGBUNDLE_ID = "customizeyourweb_error_messages";
   const ERROR_MESSAGE_STRINGBUNDLE_PATH = "chrome://customizeyourweb/locale/error_messages.properties"
	const SCRIPT_ERROR_HANDLER_STORAGE_ID = "customizeyourweb_ScriptErrorHandler";
   const EVENT_TYPE_SCRIPT_ERROR = "scriptError"

	function ScriptErrorHandler() {
      this.eventSource = new GenericEventSource()
		// Error Map: key: script id, value: array of errors which occured
		// in the last script run
		this.scriptErrors = {}
	}

	//Static methods
	ScriptErrorHandler.addScriptError = function(scriptId, errorOrId, replaceParamArray, action, targetWin) {
		this.getInstance().addScriptError(scriptId, errorOrId, replaceParamArray, action, targetWin)
	}
   
   ScriptErrorHandler.addScriptErrorListener = function(eventHandler){
      this.getInstance().addScriptErrorListener(eventHandler)
   },
   
   ScriptErrorHandler.assureErrorMessageStringbundle = function(){
      if(document.getElementById(ERROR_MESSAGE_STRINGBUNDLE_ID))
         return
      var stringbundleset = DomUtils.appendElement(document.documentElement, "stringbundleset")
      var stringbundle = DomUtils.appendElement(stringbundleset, "stringbundle")
      stringbundle.setAttribute('id', ERROR_MESSAGE_STRINGBUNDLE_ID)
      stringbundle.setAttribute('src', ERROR_MESSAGE_STRINGBUNDLE_PATH)
   },

	ScriptErrorHandler.clearScriptErrors = function(scriptId) {
		this.getInstance().clearScriptErrors(scriptId)
	}

	ScriptErrorHandler.createError = function(errorId, replaceParamArray) {
		if (!ErrorConstants[errorId])
			throw new Error('unknown error id')
		var error = new Error(this.getErrorMessage(errorId, replaceParamArray))
		error.id = errorId
      error.severity = Severity.ERROR
		return error
	}

   ScriptErrorHandler.createWarning= function(errorId, replaceParamArray) {
		if (!ErrorConstants[errorId])
			throw new Error('unknown error id')
		return new Message(this.getErrorMessage(errorId, replaceParamArray), Severity.WARNING)
	}
   

	ScriptErrorHandler.getErrorMessage = function(errorId, replaceParamArray) {
      this.assureErrorMessageStringbundle()
		return Utils.getString(ERROR_MESSAGE_STRINGBUNDLE_ID, errorId, replaceParamArray)
	}

	ScriptErrorHandler.getErrorsForScript = function(scriptId) {
		return this.getInstance().getErrorsForScript(scriptId)
	}

   ScriptErrorHandler.getInstance = function() {
		var instance = Application.storage.get(SCRIPT_ERROR_HANDLER_STORAGE_ID, null)
		if (!instance) {
			instance = new ScriptErrorHandler()
			Application.storage.set(SCRIPT_ERROR_HANDLER_STORAGE_ID,	instance)
		}
		return instance
	},

	ScriptErrorHandler.logError = function(error, message) {
		Utils.logError(error, message)
	},

   //Member mthods
	ScriptErrorHandler.prototype = {
		constructor : ScriptErrorHandler,

		addScriptError : function(scriptId, errorOrId, replaceParamArray, action, targetWin) {
			var err = ObjectUtils.instanceOf(errorOrId, String) ? 
               ScriptErrorHandler.createError(errorOrId, replaceParamArray) : errorOrId
			if (action)
				err.actionId = action.getId()
         err.severity = Severity.ERROR
			this.getErrorsForScript(scriptId).push(err)
			// Make this configurable
			ScriptErrorHandler.logError(err)
         //Notify Listeners
         this.eventSource.notifyListeners({type:EVENT_TYPE_SCRIPT_ERROR, targetWin: targetWin})
		},
      
      addScriptErrorListener: function(eventHandler){
         this.eventSource.addEventListener(EVENT_TYPE_SCRIPT_ERROR, eventHandler)   
      },

		getErrorsForScript : function(scriptId) {
			if (!this.scriptErrors[scriptId])
				this.scriptErrors[scriptId] = []
			return this.scriptErrors[scriptId]
		},

		clearScriptErrors : function(scriptId) {
			delete this.scriptErrors[scriptId]
		}
	}

	Namespace.bindToNamespace("customizeyourweb", "ScriptErrorHandler", ScriptErrorHandler)
})()
}