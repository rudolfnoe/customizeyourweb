with(customizeyourweb){
(function(){
   
   
   function Script (id){
      Assert.paramsNotNull(arguments)
   	this.id = id
   	this.actions = new ArrayList()
      this.applyToTopWindowsOnly = false
      this.disabled = false
      this.t_fileName = null
      this.guiId = Utils.createGUIId()
      //Timestamp of last editing
      //Used for selection on starting editing
      this.lastEdited = (new Date(1970, 1, 1)).getTime()
   	this.name = null
      this.targetWinDefinition = new TargetWinDefinition()
      //Version of CYW with which is this script written the last time
      this.version = null
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
      
      isApplyToTopWindowsOnly: function(){
         return this.applyToTopWindowsOnly
      },

      setApplyToTopWindowsOnly: function(applyToTopWindowsOnly){
         this.applyToTopWindowsOnly = applyToTopWindowsOnly
      },

      isDisabled: function(){
         return this.disabled
      },

      setDisabled: function(disabled){
         this.disabled = disabled
      },

      getFileName: function(){
         return this.t_fileName
      },

      setFileName: function(fileName){
         this.t_fileName = fileName
      },

      getGuiId: function(){
         return this.guiId
      },

      getId: function(){
         return this.id
      },

      setId: function(id){
         Assert.isFalse(isNaN(id), "Programm error: Id must be a numeric value")
         this.id = parseInt(id, 10)
      },
      
      getIdAsString: function(){
         return this.id + ""
      },

      getLastEdited: function(){
         return this.lastEdited
      },

      setLastEdited: function(lastEdited){
         this.lastEdited = lastEdited
      },

      getName: function(){
   		return this.name
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
      
      getVersion: function(){
         return this.version
      },

      setVersion: function(version){
         this.version = version
      },
      
      /*
       * Returns action by id
       */
      getActionById: function(actionId){
         Assert.notNull(actionId)
         var actionIter = new ActionIterator(this)
         while(actionIter.hasNext){
            var action = actionIter.next()
            if(action.getId()==actionId){
               return action
            }
         }
         return null
      },
      
      equals: function(otherScript){
         //Do not test constructor as this is not if script was cloned
         if(otherScript==null)
            return false
         return this.getGuiId()==otherScript.getGuiId()
      },
      
      getNextActionId: function(){
         var maxActionId = 0
         var actionIter = new ActionIterator(this)
         while(actionIter.hasNext()){
            var actionId = actionIter.next().getId()
            if(maxActionId<actionId){
               maxActionId = actionId
            }
         }
         return maxActionId + 1
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
      
      matchDomain: function(url){
         return this.targetWinDefinition.matchDomain(url)
      },
      
      matchesWinOrSubwin: function(win){
         return this.targetWinDefinition.matchesWinOrSubwin(win)
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
         cywContext.setScript(this)
         for (var i = 0;i < this.actions.size(); i++) {
            var action = this.actions.get(i)
            try{
               action.cleanUp(cywContext)
            }catch(e){
               ScriptErrorHandler.addScriptError(ErrorConstants.CLEAN_UP_FAILED, [action.getId(), e.message], 
                                                e, this.getId(), action.getId(), cywContext.getTargetWindow())
            }
         }
         CywUtils.logDebug("Script.cleanUp: Script " + this.getScriptLoggingName() + " cleaned up on " + cywContext.getPageEventType())
            
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
         CywUtils.logInfo("Script.runScript: Script " + this.getScriptLoggingName() + " runs on " + cywContext.getPageEventType())
         cywContext.setScript(this)
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
               ScriptErrorHandler.addScriptError(ErrorConstants.ACTION_FAILED, [action.getId(), e.message], 
                                                e, this.getId(), action.getId(), cywContext.getTargetWindow())
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