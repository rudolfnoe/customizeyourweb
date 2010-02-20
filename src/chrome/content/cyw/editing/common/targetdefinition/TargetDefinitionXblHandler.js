with(customizeyourweb){
(function(){
   const CURSOR_CHANGE_KEY_CODES = [KeyEvent.DOM_VK_LEFT, KeyEvent.DOM_VK_RIGHT, KeyEvent.DOM_VK_HOME, KeyEvent.DOM_VK_END];
   const VALUE_CHANGED_EVENT_TYPE = "VALUE_CHANGED_EVENT_TYPE";
   
   function TargetDefinitionXblHandler(targetDefinitionBinding){
      this.GenericEventSource()
      //Allows multi target defintions (true) or only single target definitions (false)
      this.allowMultiTargetDefinition = false
      this.oldTargetDefinitionRow = DomUtils.getElementByAnonId(targetDefinitionBinding, "oldTargetDefinitionRow")
      this.oldTargetDefinitionTB = DomUtils.getElementByAnonId(targetDefinitionBinding, "oldTargetDefinitionTB")
      this.targetDefinitionBinding = targetDefinitionBinding
      this.targetDefinitionML = DomUtils.getElementByAnonId(targetDefinitionBinding, "targetDefinitionML")
      this.targetDefinitionMLHandler = null,
      this.targetDefinitionStyleML = DomUtils.getElementByAnonId(targetDefinitionBinding, "targetDefinitionStyleML")
      this.targetElement = null 
      this.targetElementsHighlighter = null
      this.targetIsOptionalCB = DomUtils.getElementByAnonId(targetDefinitionBinding, "targetIsOptionalCB")
      this.targetNameTB = DomUtils.getElementByAnonId(targetDefinitionBinding, "targetNameTB")
      this.targetWindow = null
      
      //Manually add load listener for further initialization
      //Must be done after onload as there are dependencies to other bindings which must be fully constructed beforehand
      //Using "handler" tag in xbl didn't worked as it was called twice why whosoever
      window.addEventListener('load', Utils.bind(this.initialize, this), true)
   }
   
   TargetDefinitionXblHandler.prototype = {
      constructor: TargetDefinitionXblHandler,
      
      addValueChangedListener: function(eventHandler){
         this.addListener(VALUE_CHANGED_EVENT_TYPE, eventHandler)   
      },
      
      /*
       * Returns the current target definition object
       */
      getTargetDefinition: function(){
         if(!this.targetDefinitionMLHandler){
            return null
         }
         var targetDef = this.targetDefinitionMLHandler.getTargetDefinition()
         if(!StringUtils.isEmpty(this.targetNameTB.value)){
            targetDef.setTargetName(this.targetNameTB.value)
         }
         targetDef.setTargetOptional(this.targetIsOptionalCB.checked)
         return targetDef
      },
      
      getTargetElementsHighlighter: function(){
         if(this.targetElementsHighlighter==null){
            this.targetElementsHighlighter = new MultiElementHighlighter(null, true)
         }
         return this.targetElementsHighlighter
      },

      /*
       * If autoinit is false, this method is used to inialize the targetElement
       */
      setTargetElement: function(targetElement){
         this.targetElement = targetElement
      },

      /*
       * Used for autoinitialization for all edit dialogs except retargeting
       */
      autoInitByDialogArgument: function(){
         //Set targetwin first
         this.targetWindow = Dialog.getNamedArgument('targetWindow')
         var action = Dialog.getNamedArgument('action', true)
         if(action.getTargetDefinition()){
            this.setTargetDefinition(action.getTargetDefinition())
         }
         this.targetElement = Dialog.getNamedArgument('targetElement')
         if(this.targetElement){
            if(action.getTargetDefinition()){
               this.createTargetDefinitions()
            }else{
               this.createDefaultTargetDefinitions()
            }
         }
      },
      
      /*
       * Creates default targetDefinitions for retargeting
       */
      createDefaultTargetDefinitions: function(){
         Assert.notNull(this.targetElement, "targetElement is null")
         //Must be called first to initialize targetDefinitionMLHandler
         this.setTargetDefinition(AbstractTargetDefinitionFactory.createDefaultDefinition(this.targetElement))
         this.createTargetDefinitions()
      },
      
      /*
       * fills targetdefinition ML with possible target definitions
       */
      createTargetDefinitions: function(){
         Assert.notNull(this.targetElement, "targetElement is null")
         this.targetDefinitionML.removeAllItems()
         var targetDefinitions = this.targetDefinitionMLHandler.createDefinitions(this.targetElement)
         for (var i = 0; i < targetDefinitions.length; i++) {
            var defString = targetDefinitions[i].getDefinitionAsString()
            this.targetDefinitionML.appendItem(defString, defString)
         }
      },
      
      getTargetWin: function(){
         Assert.isTrue(this.targetWindow!=null, 'target win must be set first')
         return this.targetWindow
      },
      
      handleCursorPositionChange: function(event){
         var keyCode = event.keyCode
         if(CURSOR_CHANGE_KEY_CODES.indexOf(keyCode)==-1)
            return
         Utils.executeDelayed('ON_XPATH_CURSOR_POS_CHANGE', 500, function(){            
            this.targetDefinitionMLHandler.handleCursorPositionChange()
         }, this)            
      },
      
      handleDialogClose: function(){
         this.getTargetElementsHighlighter().unhighlight()
         //could be null if not initialized
         if(this.targetDefinitionMLHandler){
            this.targetDefinitionMLHandler.cleanUp()
         }
      },
      
      handleOptionalFlagChanged: function(){
         this.notifyValueChangedListener()   
      },
      
      handleTargetDefinitionInput: function(){
         Utils.executeDelayed('ON_TARGET_DEF_INPUT', 500, function(){
            this.targetDefinitionMLHandler.handleCursorPositionChange()
            this.highlightCurrentTargets()
            this.notifyValueChangedListener()
         }, this)
      },
      
      handleTargetDefinitionSelect: function(event){
         if(event.target.selectedIndex==-1)
            return
         this.setMessage("")
         this.getTargetElementsHighlighter().updateHighlighting(this.targetDefinitionMLHandler.getCurrentTargets())
         this.notifyValueChangedListener()
      },
      
      handleTargetDefinitionStyleSelect: function(){
         this.setTargetDefinitionMLHandler(this.targetDefinitionStyleML.value)
         if(this.targetElement==null)
            return
         this.createTargetDefinitions()
         this.setTargetDefinition(this.targetDefinitionMLHandler.createDefaultDefinition(this.targetElement))
      },
      
      highlightCurrentTargets: function(){
         this.getTargetElementsHighlighter().unhighlight()
         try{
            var targetElems = this.targetDefinitionMLHandler.getCurrentTargets()
         }catch(e){
            this.setMessage(e.message, Severity.ERROR)
            return
         }
         if(targetElems.length>1 && !this.allowMultiTargetDefinition){
            this.setMessage("Expression has non-unique result", Severity.ERROR)
         }else if (targetElems.length==0){
            this.setMessage("Expression has no result", Severity.ERROR)
            return
         }else{
            this.setMessage("")
         }
         this.getTargetElementsHighlighter().highlight(targetElems)
         targetElems[0].scrollIntoView()
      },
      
      initEventHandlers: function(){
         this.targetDefinitionStyleML.addEventListener("select", 
               Utils.bind(function(event){this.handleTargetDefinitionStyleSelect(event)}, this), true)
         ControlUtils.observeControl(this.targetDefinitionML, this.handleTargetDefinitionInput, this)
         window.addEventListener('unload', Utils.bind(this.handleDialogClose, this), true)   
      },
      
      initialize: function(){
         this.loadJQuery()
         //default is true
         var autoInit = DomUtils.getAttribute(this.targetDefinitionBinding, 'autoInit', "true")=="true"
         if(autoInit){
            this.autoInitByDialogArgument() 
         }
         this.initEventHandlers()
      },
      
      loadJQuery: function(){
         ScriptLoader.loadJQuery(CywCommon.CHROME_CONTENT_URL + "jquery/jquery-1.4.1.js", "customizeyourweb")
         ScriptLoader.loadScript(CywCommon.CHROME_CONTENT_URL + "jquery/jQueryViewport.js", "customizeyourweb")
      },
      
      notifyValueChangedListener: function(){
         this.notifyListeners({type:VALUE_CHANGED_EVENT_TYPE, value: this.getTargetDefinition()})   
      },
      
      setMessage: function(message, severity){
         Dialog.setMessageInHeader(message, severity)
         //TODO maybe change background color of field
      },
      
      setAllowMultiTargetDefinition: function(allowMultiTargetDef){
         this.allowMultiTargetDefinition = allowMultiTargetDef 
      },
      
      setOldTargetDefinition: function(targetDefinition){
         this.oldTargetDefinitionRow.collapsed = false
         this.oldTargetDefinitionTB.value = targetDefinition.getDefinitionAsString()
         this.setTargetNameAndOptionalFlag(targetDefinition)
      },
      
      setTargetDefinition: function(targetDefinition){
         this.targetDefinitionML.value = targetDefinition.getDefinitionAsString()
         this.setTargetDefinitionStyle(targetDefinition.getDefinitionStyle())
         this.setTargetNameAndOptionalFlag(targetDefinition)
         this.highlightCurrentTargets()
         this.notifyValueChangedListener()
      },
      
      setTargetNameAndOptionalFlag: function(targetDefinition){
         this.targetNameTB.value = StringUtils.defaultString(targetDefinition.getTargetName())
         this.targetIsOptionalCB.checked = targetDefinition.isTargetOptional()
      },
      
      setTargetDefinitionStyle: function(style){
         this.targetDefinitionStyleML.value = style
         this.setTargetDefinitionMLHandler(style)
      },
      
      setTargetDefinitionMLHandler: function(stlye){
         if(this.targetDefinitionMLHandler){
            this.targetDefinitionMLHandler.cleanUp()
         }
         var constructor = null
         if(stlye==TargetDefinitionStyle.XPATH)
            constructor = XPathTargetDefinitionXblHandler
         else if (stlye==TargetDefinitionStyle.SIMPLE)
            constructor = SimpleTargetDefinitionXblHandler
         else if (stlye==TargetDefinitionStyle.JQUERY)
            constructor = JQueryTargetDefinitionXblHandler
         else 
            throw new Error('unknown style')
         
         this.targetDefinitionMLHandler = 
            new constructor(this.targetDefinitionML, this.getTargetWin(), this.targetElement)
      },
      
      setTargetWindow: function(targetWindow){
         this.targetWindow = targetWindow
      }
      
   }
   
   ObjectUtils.extend(TargetDefinitionXblHandler, "GenericEventSource", customizeyourweb)
   
   Namespace.bindToNamespace("customizeyourweb", "TargetDefinitionXblHandler", TargetDefinitionXblHandler)
   
})()
}