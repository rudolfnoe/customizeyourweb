with(customizeyourweb){
(function(){
   const NUMERIC_VALUE_REG_EXP = /^(-?\d+)(.*)$/;
   const UNCHANGED_VALUE = "<Default>";
   const UPDATE_DELAY = 500;
   const STYLE_PROPS = ["border", "border-width", "border-style"];
   
   function byId(id){
      return document.getElementById(id);
   };
   
   // Globals: shortcuts to important controls
   var attributeML = null;
   var stringValueTB = null;
   var colorValueCF = null;
   var attributesLB = null;
   
   /*
    * Dialog handler of edit modify action
    * TODO: If no target element is selected on opening
    */
   var EditModifyDialogHandler = {
      //Edited Action
      action: null,
      
      //For detecting tab change
      currentSelectedTabIndex: null,
      
      //key: html attr name; value: control obj for attr
      //Used to find corresponding control on simple tab when
      //synchronizing values from expert tab
      htmlAttrToControlMap: {},
      
      shortcutManager: new ShortcutManager(window, "keypress", true, false),
      
      undoMemento: null,
      
      /*
       * Adds or updates attribute/value combination to attributes listbox on the expert tab
       */
      addToAttributesLB: function(attr, value){
         var attrItem = Listbox.getItemByValue(attributesLB, attr);
         if(attrItem==null){
            Listbox.appendMultiColumnItem(attributesLB, [attr, value], [attr, value], attr);
         }else{
            attrItem.value = attr;
            Listbox.updateRow(attributesLB, attrItem, [attr, value], [attr, value]);
         }
      },
      
      addUnchangedValueToColorFields : function(){
         var colorFields = document.getElementsByTagName('colorfield');
         for (var i = 0; i < colorFields.length; i++) {
            colorFields[i].insertColorAt(0, UNCHANGED_VALUE);
         }
      },
      
      /*
       * Event handler for add button on expert tab
       */
      doAdd: function(){
         var attr = attributeML.value;
         var value = this.getValueControl().value;
         this.addToAttributesLB(attr, value);
         attributeML.value="";
         attributeML.focus();
         this.getValueControl().value="";
         this.triggerUpdateTargetsDefault();
      },
      
      /*
       * Event handler for cancel button
       */
      doCancel: function(){
         if(this.undoMemento){
            this.action.undo(this.getEditContext(), this.undoMemento);
         }
      },
      
      /*
       * Onload event handler
       */
      doOnload: function(){
         try{
            this.setGlobals();
            this.action = EditDialog.getAction(true);
            this.targetElement = EditDialog.getTargetElement();
            
            //Init Targetdef Binding
            this.getTargetDefinitionBinding().setAllowMultiTargetDefinition(true);
            this.initTargetDefinitionBinding();
            
            this.fillExpertAttributeMenulist();
            if(!this.hasMultipleTargets()){
               this.initHtmlAttributes();
            }
            this.addUnchangedValueToColorFields();
            this.initSimpleStyles();

            this.initFromAction(this.action);
            //Shortcuts and listeners  Validators at the end!
            this.initShortcuts();
            this.initListeners();
            this.initValidators();
            //
            this.updateTargets(null, this.action);
         }catch(e){
            CywUtils.logError(e, "", true);
         }
      },
      
      /*
       * Ok button event handler
       */
      doOk: function(){
         var oldAction = this.action
         var newAction = ObjectUtils.deepClone(oldAction)
         this.synchronizeAction(newAction);
         this.updateTargets(oldAction, newAction)
         Dialog.setNamedResult("action", newAction);
         Dialog.setNamedResult("changeMemento", this.undoMemento);
         Dialog.setResult(DialogResult.OK);
      },
      
      /*
       * Remove button event handler
       */
      doRemove: function(){
         if(!attributesLB.selectedItem)
            return;
         var selectedAttr = attributesLB.selectedItem.value;
         this.removeAttrFromAttrList(selectedAttr);
         this.triggerUpdateTargetsDefault();
      },
      
      /*
       * Fills attributes menulist on expert tab with all computed style 
       * values of the target element 
       */
      fillExpertAttributeMenulist: function(){
         var pseudoStyle = window.getComputedStyle(document.documentElement, null)
         var styleProps = new Array();
         for (var i = 0; i < pseudoStyle.length; i++) {
            styleProps.push(pseudoStyle.item(i).toString());
         }
         //Add some styles manually
         styleProps.push("border");
         styleProps.push("border-color");
         styleProps.push("border-width");
         styleProps.push("border-style");
         styleProps.push("margin");
         styleProps.push("padding");
         styleProps.push("-moz-border-colors");
         styleProps.push("-moz-border-radius");

         //Moz-Styles are sorted at the end
         styleProps.sort(function(a, b){
            var aIsMozStyle = StringUtils.startsWith(a, "-moz");
            var bIsMozStyle = StringUtils.startsWith(b, "-moz");
            if(aIsMozStyle && !bIsMozStyle){
               return 1;
            }else if(bIsMozStyle && !aIsMozStyle){
               return -1;
            }else if(a == b){
               return 0;
            }else{
               return a<b?-1:1;
            }
         });
         ControlUtils.appendItemsToMenulist(attributeML, styleProps, styleProps);
      },
      
      /*
       * Fills the menulist mirroring the target selectbox in case 
       * the user selected a selectbox for modifying
       */
      fillHtmlSelectboxWithEntries: function(){
         var options = this.targetElement.options;
         var htmlSelectML = byId('htmlSelectML');
         for (var i = 0; i < options.length; i++) {
            var option = options[i];
            var value = option.value?option.value:option.text;
            ControlUtils.appendItemToMenulist(htmlSelectML, option.text, value);
         }
      },
      
      /*
       * Returns modifyed target style obj, which has an additional method
       * getPropertyValueExt which returns the offsetWidth/Height of the target element
       * instead of their style values.
       * Reason: When setting a width and re-read the value, the values are different  
       */
      getCurrentStyle: function(targetElement){
         var clonedTargetElem = targetElement.cloneNode(true);
         var targetWin = targetElement.ownerDocument.defaultView;
         var compTargetStyle = targetWin.getComputedStyle(clonedTargetElem, "");
         //store values for width and height
         var width = targetElement.offsetWidth + "px";
         var height = targetElement.offsetHeight + "px";
         compTargetStyle.getPropertyValueExt = function(styleAttr){
            switch (styleAttr){
               case "width": return width;
               case "height": return height;
               default: return compTargetStyle.getPropertyValue(styleAttr);
            }
         };
         return compTargetStyle;
      },
      
      getFirstSelectedTarget: function(){
         var targets = this.getCurrentTargets();
         if(targets && targets.length>0){
            return targets[0];
         }else{
            return null;
         }
      },
      
      /*
       * Returns the current visisble value control on the expert tab
       */
      getValueControl: function(){
         if(stringValueTB.collapsed==false){
            return stringValueTB;
         }else if(colorValueCF.collapsed==false){
            return colorValueCF;
         }else{
            throw new Error('All value controls invisible');
         }
      },
      
      /*
       * Event handler for selection of entry in the attributes table 
       * on the expert tab
       */
      handleSelectAttributesLB: function(){
         byId('removeCmd').setAttribute('disabled', 'false');
         var selectedListCells = Listbox.getSelectedListCells(attributesLB);
         var attr = attributeML.value = selectedListCells[0].getAttribute('label'); 
         this.setValueField(attr, selectedListCells[1].getAttribute('label'));
      },
      
      handleTargetDefChanged: function(event){
         this.triggerUpdateTargetsDefault();
      },
      
      /*
       * Generic key event handler bound to the tabpanels to increment/decrement
       * the value of an control on cursor up/down in case the value is numeric  
       */
      incrementValue: function(keyEvent){
         var keyCode = keyEvent.keyCode;
         //If not cursor up/down return
         if(keyCode != 38 && keyCode != 40)
            return;
            
         var target = keyEvent.originalTarget;
         //Target could also be inside binding
         var bindingParent = document.getBindingParent(target);
         if(bindingParent!=null)
            target = bindingParent;
            
         var value = target.value;
         //Reg splits numeric from the unit part
         var parsedValue = NUMERIC_VALUE_REG_EXP.exec(value);
         if(parsedValue==null)
            return;
         var number = parseInt(parsedValue[1], 10);
         if(keyCode==38)
            number--;
         else
            number++;
         var unit = parsedValue[2]?parsedValue[2]:"px";
         target.value = number + unit;
      },
      
      /*
       * Inits the dialog  from the passed action
       */
      initFromAction: function(action){
         //Anonymous inner function to fill attributes and styles in the attributes listbox
         function appendToAttrLB(attrsOrStyles){
            for (var attr in attrsOrStyles) {
               var value = attrsOrStyles[attr];
               Listbox.appendMultiColumnItem(attributesLB, [attr, value], [attr, value], attr);
            } 
         }
         appendToAttrLB.apply(this, [action.getAttributes()]);
         appendToAttrLB.apply(this, [action.getStyles()]);
         this.synchronizeExpert2Simple();
      },
      
      /*
       * Initializes the Html attributes on the simple tab
       * - determine which control rows to be displayed
       * - init controls with values from the target object (this is neccessary to determin whether a value has changed)
       */
      initHtmlAttributes: function(){
         var type = DomUtils.getElementType(this.targetElement);
         if(type == HtmlElementType.SELECT){
            this.fillHtmlSelectboxWithEntries();
         }
         var htmlAttrsRows = document.getElementsByAttribute("attrFor", "*");
         //As one row is used for multiple types the boundery is neccessary on the RegExp
         var matchTypeRegExp = new RegExp("\\b" + type + "\\b", "i");
         var found = false;
         for (var i = 0; i < htmlAttrsRows.length; i++) {
            var row = htmlAttrsRows[i];
            if(!matchTypeRegExp.test(row.getAttribute("attrFor"))){
               continue;
            }
            var controls = DomUtils.getElementsByAttribute(row, "attr", "*");
            for (var j = 0; j < controls.length; j++) {
               var control = controls[j];
               var attr = control.getAttribute('attr');
               this.htmlAttrToControlMap[attr] = control;
               if(control.id=="simpleValueML"){
                  var value = this.targetElement[attr];
                  ControlUtils.appendItemToMenulist(control, value, value);
               }
               control.setAttribute("defaultValue", value);
            }
            row.collapsed = false;
            found = true     ;
         }
         if(found){
            this.showHtmlAttributeGroupBox();
         }
      },
      
      /*
       * 
       */
      initListeners: function(){
         //Listener for selecting simple tab
         var selectSimpleTabListener = new EventHandlerAdapter(this.handleTabChanged, this);
         byId('tabpanels').addEventListener("select", selectSimpleTabListener, true);
         
         //Listener for Add-Button enabling
         ControlUtils.observeControl(attributeML, function(control, controlValue){
            if(controlValue=="")
               byId('addCmd').setAttribute("disabled", true);
            else
               byId('addCmd').setAttribute("disabled", false);
         });
         //Listener for updating window from expert tab
         ControlUtils.observeControl(stringValueTB, this.triggerUpdateTargetsFromExpert, this);
         ControlUtils.observeControl(byId('colorValueCF'), this.triggerUpdateTargetsFromExpert, this);
         
         //Listener for updating window from simple tab
         var simpleValueChangedListener = new EventHandlerAdapter(this.triggerUpdateTargetsFromSimple, this);
         var simpleStyleControls = document.getElementsByAttribute("styleProp", "*");
         for (var i = 0; i < simpleStyleControls.length; i++) {
            ControlUtils.observeControl(simpleStyleControls[i], simpleValueChangedListener);
         }
         var simpleAttrControls = document.getElementsByAttribute("attr", "*");
         for (var i = 0; i < simpleAttrControls.length; i++) {
            ControlUtils.observeControl(simpleAttrControls[i], simpleValueChangedListener);
         }
         
         this.getTargetDefinitionBinding().addValueChangedListener(new EventHandlerAdapter(this.handleTargetDefChanged, this));
      },
      
      /*
       * Init shortcuts
       */
      initShortcuts: function(){
         this.shortcutManager.addShortcutForElement("valueRow", 'return', byId('addCmd')) ;
         this.shortcutManager.addShortcutForElement("attributesLB", 'delete', byId('removeCmd')) ;
      },
      
      /*
       * Init the simple stlye controls on the simple tab with 
       * the values of the targetElement
       */
      initSimpleStyles: function(){
         var simpleStyleElems = XPathUtils.getElements("//*[@styleProp]");
         for (var i = 0; i < simpleStyleElems.length; i++) {
            var styleElem = simpleStyleElems[i];
            simpleStyleElems[i].value=UNCHANGED_VALUE;
//            var styleProp = styleElem.getAttribute('styleProp')
//            if(styleProp.indexOf("border")==0){
//               styleProp = StringUtils.insertAt(styleProp, "-top", 6)
//            }
//            styleElem.value = this.compTargetStyle.getPropertyValueExt(styleProp)
         }
      },
      
      initValidators: function(){
         var okValidator = new TargetDefinitionXblValidator(byId('targetdefinition'), EditDialog.getTargetWindow(), true);
         Dialog.addOkValidator(okValidator);
         okValidator.validate();
      },
      
      /*
       * Onblur event handler for attribute field initializing the value field
       * according the entered attribute
       */
      handleBlurAttributeField: function(){
         var attr = attributeML.value;
         //Determine if value is already set, if yes use this as default value;
         var defaultValue = null;
         var attributes = Listbox.getValues(attributesLB);
         for (var i = 0; i < attributes.length; i++) {
            if(attributes[i][0]==attr){
               defaultValue = attributes[i][1];
               break;
            }
         }
         //if no value was already set, use the computed style of the first selected element
         var firstSeletectedTarget = this.getFirstSelectedTarget();
         if(!defaultValue && firstSeletectedTarget){
            var currentStyle = this.getCurrentStyle(firstSeletectedTarget);
            this.getValueControl().value = currentStyle.getPropertyValueExt(attr);
         }
            
         if(defaultValue){
            this.setValueField(attr, defaultValue);
         }
      },
      
      removeAttrFromAttrList: function(attr){
         var itemToRemove = Listbox.getItemByValue(attributesLB, attr);
         if(!itemToRemove)
            return;
         attributesLB.removeItemAt(attributesLB.getIndexOfItem(itemToRemove));
      },
      
      /*
       * set shortcuts for most used controls
       */
      setGlobals: function(){
         attributeML = byId('attributeML');
         stringValueTB = byId('stringValueTB');
         colorValueCF = byId('colorValueCF');
         attributesLB = byId('attributesLB');
      },
      
      /*
       * Sets a value for HTML attribute on the simple tab 
       */
      setSimpleAttrValue: function(attr, value){
         var simpleControl = this.htmlAttrToControlMap[attr];
         if(simpleControl){
            simpleControl.value = value;
         }
      },
      
      /*
       * Sets value on simple style control if existent for that style prop
       */
      setSimpleStyleValue: function(attr, value){
         var elem = document.getElementsByAttribute("styleProp", attr);
         if(elem.length>0){
            elem[0].value = value;
         }
      },         
      
      /*
       * Makes the appropriate value control visible 
       */
      setValueControl: function(controlId){
         stringValueTB.collapsed = true;
         colorValueCF.collapsed = true;
         switch (controlId){
            case "stringValueTB": 
               stringValueTB.collapsed = false;
               break;
            case "colorValueCF": 
               colorValueCF.collapsed = false;
               break;
         }
      },
      
      /*
       * Shows the group box with the HTML attributes on the simple tab 
       */
      showHtmlAttributeGroupBox: function(){
         byId('attrGB').collapsed = false;
      },
      
      /*
       * Synchronizes action with current values
       */
      synchronizeAction:function(action){
         var attributes = {};
         var styles = {};
         var attrs = Listbox.getValues(attributesLB);
         for (var i = 0; i < attrs.length; i++) {
            var attr = attrs[i][0];
            var value = attrs[i][1];
            if(CssUtils.isStyleProperty(attr)){
               styles[attr] = value;
            }else{
               attributes[attr] = value;
            }
         }
         action.setAttributes(attributes);
         action.setStyles(styles);
         action.setTargetDefinition(byId('targetdefinition').getTargetDefinition());
         byId('commonActionAttributes').setCommonAttributesOnAction(action);
      },
      
      /*
       * Synchronize expert value with appropriate simple control
       * This takes place only on focusing the simple tab panel
       */
      synchronizeExpert2Simple: function(){
         try{
            var attributeLBItems = Listbox.getValues(attributesLB);
            for (var i = 0; i < attributeLBItems.length; i++) {
               var attributeLBItem = attributeLBItems[i];
               var attr = attributeLBItem[0];
               var value = attributeLBItem[1];
               if(CssUtils.isStyleProperty(attr)){
                  value = value?value:"";
                  this.setSimpleStyleValue(attr, value);
               }else{
                  value = value?value:UNCHANGED_VALUE;
                  this.setSimpleAttrValue(attr, value);
               }
            }
         }catch(e){
            CywUtils.logError(e, null, true);
         }
      },
      
      /*
       * Onblur event handler for synchronizing values on simple tab
       * with attr listbox on expert tab
       */
      synchronizeSimple2Expert: function(event  ){
         try{
            var srcControl = event.target;
            var value = event.value;
            if(srcControl.hasAttribute('styleProp')){
               var styleProp = srcControl.getAttribute('styleProp');
               if(value!=UNCHANGED_VALUE){
                  this.addToAttributesLB(styleProp, value);
               }else{
                  this.removeAttrFromAttrList(styleProp);
               }
            }else if (srcControl.hasAttribute('attr')){
               var attr = srcControl.getAttribute('attr');
               if(value==UNCHANGED_VALUE){
                  this.removeAttrFromAttrList(attr);
               }else{
                  this.addToAttributesLB(attr, value);
               }
            }else{
               throw new Error('attr/style prop not set on simple control');
            }
         }catch(e){
            CywUtils.logError(e, null, true);
         }
      },
      
      handleTabChanged: function(){
         var selectedTabIndex = byId('tabpanels').selectedIndex;
         if(selectedTabIndex == 0 && this.currentSelectedTabIndex!=0){
            this.currentSelectedTabIndex=0;
            this.synchronizeExpert2Simple();
         }else{
            this.currentSelectedTabIndex = selectedTabIndex;
         }
      },

      setValueField: function(attr, newValue){
         if(StringUtils.endsWith(attr, "color"))
            this.setValueControl("colorValueCF");
         else
            this.setValueControl("stringValueTB");
         this.getValueControl().value = newValue;
      },
     
      /*
       * Value Change event handler for expert value field which updates the target element 
       * according the entered value
       */
      triggerUpdateTargetsFromExpert: function(control, controlValue){
         Utils.executeDelayed("UPDATE_ELEMENT", UPDATE_DELAY, function(){
            var oldAction = this.action;
            var newAction = ObjectUtils.deepClone(this.action);
            this.synchronizeAction(newAction);
            var attr = attributeML.value;
            if(CssUtils.isStyleProperty(attr)){
               var styleOrAttrs = newAction.getStyles();
            }else{
               var styleOrAttrs = newAction.getAttributes();
            }
            if(StringUtils.isEmpty(controlValue)){
               delete styleOrAttrs[attr];
            }else{
               styleOrAttrs[attr]=controlValue;
            }
            CywUtils.logInfo("triggerUpdateTargetsFromExpert: " + attr + "=" + styleOrAttrs[attr]);
            this.updateTargets(oldAction, newAction)   ;
         }, this);
      },
      
      
      triggerUpdateTargetsFromSimple: function(control, controlValue){
         this.synchronizeSimple2Expert(control, controlValue);
         this.triggerUpdateTargetsDefault();
      },
         
      triggerUpdateTargetsDefault: function(){
//         CywUtils.logInfo("triggerUpdateTargetsDefault called");
         Utils.executeDelayed("UPDATE_ELEMENT", UPDATE_DELAY, function(){
            var oldAction = this.action;
            var newAction = ObjectUtils.deepClone(this.action);
            this.synchronizeAction(newAction);
            this.updateTargets(oldAction, newAction);
         }, this);
      },
      
      /*
       * Updates one (style)attr of the target element  
       */
      updateTargets: function(oldAction, newAction){
//         CywUtils.logInfo("updateTargets called");
         try{
            if(this.undoMemento){
               oldAction.undo(this.getEditContext(), this.undoMemento);
            }
            this.undoMemento = newAction.preview(this.getEditContext());
            this.action = newAction;
         }catch(e){
            CywUtils.logError(e, "updateTargets", true);
         }
         return;
      }      
   };
   ObjectUtils.injectFunctions(EditModifyDialogHandler, AbstractEditDialogHandler);
   Namespace.bindToNamespace("customizeyourweb", "EditModifyDialogHandler", EditModifyDialogHandler);
   
})()
}