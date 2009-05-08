with(customizeyourweb){
(function(){   
   
   function Script (id){
      Assert.paramsNotNull(arguments)
   	this.id = id
      this.t_actionIdCounter = -1 
   	this.actions = new ArrayList()
      this.disabled = false
   	this.name = null
      this.targetWinDefinition = new TargetWinDefinition()
   	//Unique id of script to identify, timestamp is enough
   	this.loadEventType = LoadEventTypes.DOM_CONTENT_LOADED
      this.behaviorOnMutationEvent = RunBehaviorOnMutationEvent.RUN_ALWAYS 
      //Default is true as after reading config it should be true
   	this.setPersisted(true)
   }
   
   //static methods
   
   //creates new script for editing
   Script.createNewScript = function(id, contentUrl){
      Assert.paramsNotNull(arguments)
      Assert.isTrue(typeof id == "number", "Id must be of type number, instead ")
      var newScript = new Script(id)
      newScript.setIncludeUrlPatterns([contentUrl])
      newScript.setPersisted(false)
      return newScript
   }
   
   Script.prototype = {
   	constructor: Script,
   	
   	addAction: function(action){
         if(!action.getId())
            action.setId(this.getNextActionId())
   		this.actions.add(action)
   	},
      
      getBehaviorOnMutationEvent: function(){
         return this.behaviorOnMutationEvent
      },

      setBehaviorOnMutationEvent: function(behaviorOnMutationEvent){
         Assert.isTrue(ObjectUtils.containsValue(RunBehaviorOnMutationEvent, behaviorOnMutationEvent), 
            "behaviorOnMutationEvent must one of RunBehaviorOnMutationEvent")
         this.behaviorOnMutationEvent = behaviorOnMutationEvent
      },

      getActions: function(){
      	return this.actions
      },
      
      isDisabled: function(){
         return this.disabled
      },

      setDisabled: function(disabled){
         this.disabled = disabled
      },

      getName: function(){
   		return this.name
   	},
   	
      getId: function(){
         return this.id
      },
      
      getIdAsString: function(){
         return this.id + ""
      },

   	getLoadEventType: function(){
   		return this.loadEventType
   	},
   	
   	getIncludeUrlPatternStrings: function(){
         return this.targetWinDefinition.getIncludeUrlPatternStrings()
   	},

      getExcludeUrlPatternStrings: function(){
         return this.targetWinDefinition.getExcludeUrlPatternStrings()
   	},
      
      equals: function(otherScript){
         //Do not test constructor as this is not if script was cloned
         return this.getId()==otherScript.getId()
      },
      
      getNextActionId: function(){
         if(this.t_actionIdCounter==-1){
            this.t_actionIdCounter = 0
            var actionIter = new ActionIterator(this)
            while(actionIter.hasNext()){
               var actionId = actionIter.next().getId()
               if(this.t_actionIdCounter<actionId)
                  this.t_actionIdCounter = actionId            
            }
         }
         this.t_actionIdCounter++
         return this.t_actionIdCounter
      },
      
      getScriptLoggingName: function(){
         var logName = this.name
         if(!StringUtils.isEmpty(logName)){
            logName += " (id=%s)"
         }else{
            logName += "id=%s"
         }
         return logName.replace("%s", this.id)
      },
      
      getUrlPatternDescription: function(){
         return this.targetWinDefinition.getUrlPatternDescription()
      },
      
      hasIncludePattern: function(){
         return this.targetWinDefinition.hasIncludePattern()
      },

   	isPersisted: function(){
   		return this.t_persisted
   	},
      
      isRunNeverOnMutationEvent: function(cywContext){
         return cywContext.isMutationEvent() && this.behaviorOnMutationEvent == RunBehaviorOnMutationEvent.RUN_NEVER
      },
      
      matchUrl: function(url){
         return this.targetWinDefinition.matchUrl(url)
      },
      
      cleanUp: function(cywContext){
         //Do not clean up if it is a mutation event 
         //and the script should never run on mutation events 
         if(this.isRunNeverOnMutationEvent(cywContext)){
            return
         }
         for (var i = 0;i < this.actions.size(); i++) {
            var action = this.actions.get(i)
            try{
               action.cleanUp(cywContext)
            }catch(e){
               ScriptErrorHandler.addScriptError(this.getId(), ErrorConstants.CLEAN_UP_FAILED, 
                                                 [action.getId(), e.message], action, 
                                                 cywContext.getTargetWindow())
            }
         }
         CywUtils.logDebugMessage("Script " + this.getScriptLoggingName() + " cleaned up on " + cywContext.getPageEventType())
            
      },
   	
   	removeAction: function(actionId){
   		for (var i = 0; i < this.actions.size(); i++) {
   			var action = this.actions.get(i)
   			if(action.getId()==actionId){
   				this.actions.removeAtIndex(i)
   				break;
   			}
   		}
   	},
   	
   	runScript: function(cywContext){
         if(this.isRunNeverOnMutationEvent(cywContext)){
            return
         }
         CywUtils.logInfoMessage("Script " + this.getScriptLoggingName() + " runs on " + cywContext.getPageEventType())
         cywContext.setScriptId(this.getId())
         ScriptErrorHandler.clearScriptErrors(this.getId())
         var cachedPage = cywContext.isCachedPage()
   		for (var i = 0; i < this.actions.size(); i++) {
            var action = this.actions.get(i)
            try{
               if(cachedPage)
                  action.doActionForCachedPage(cywContext)
               else
   			      action.doAction(cywContext)
            }catch(e){
               if(Log.isDebug()){
                  CywUtils.logError(e)
               }
               ScriptErrorHandler.addScriptError(this.getId(), ErrorConstants.ACTION_FAILED, 
                                                   [action.getId(), e.message], action,
                                                   cywContext.getTargetWindow())
            }
   		}
   	},
   	
   	setActions: function(actions){
   		this.actions = actions
   	},
      
      setExcludeUrlPatterns: function(patternsArray){
         this.targetWinDefinition.setExcludeUrlPatterns(patternsArray)
      },

      setIncludeUrlPatterns: function(patternsArray){
         this.targetWinDefinition.setIncludeUrlPatterns(patternsArray)
      },
      
   	setName: function(name){
   		this.name = name
   	},
   	
   	setLoadEventType: function(loadEventType){
   		this.loadEventType = loadEventType
   	},
      
      setActionId: function(action){
         if(action.getId()>0)
            return
         action.setId(this.getNextActionId())
      },
   	
   	setPersisted: function(persited){
   		this.t_persisted = persited
   	},
   	
   	toString: function(){
   		return "Script (" + this.id + ")"
   	},
   	
   	updateUrlPatternRegExp: function(){
   		 this.targetWinDefinition.updateUrlPatternRegExp()
   	}
   }
   
   customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "Script", Script)

   var RunBehaviorOnMutationEvent = {
      RUN_ALWAYS: "RUN_ALWAYS",
      RUN_NEVER: "RUN_NEVER"
   }

})()
}