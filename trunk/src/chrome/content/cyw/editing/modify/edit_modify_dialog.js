with(customizeyourweb){
(function(){
   const NUMERIC_VALUE_REG_EXP = /^(-?\d+)(.*)$/;
   const UNDEFINED_VALUE = "<Undefined>";
   const STYLE_PROPS = ["border", "border-width", "border-style"]
   
   function byId(id){
      return document.getElementById(id)
   }
   
   // Globals: shortcuts to important controls
   var attributeML = null
   var stringValueTB = null
   var colorValueCF = null
   var attributesLB = null
   
   var EditModifyDialogHandler = {
      elementWrapper: null,
      //key: html attr name; value: control obj for attr
      //Used to find corresponding control on simple tab when
      //synchronizing values from expert tab
      htmlAttrToControlMap: {},
      shortcutManager: new ShortcutManager(window, "keypress", true, false),
      //shortcut to the style obj of the targetElement
      compTargetStyle: null,
      targetElement: null,
      targetElementBackup: null,
      
      /*
       * Adds or updates attribute/value combination to attributes listbox on the expert tab
       */
      addToAttributesLB: function(attr, value){
         var attrItem = Listbox.getItemByValue(attributesLB, attr)
         if(attrItem==null){
            Listbox.appendMultiColumnItem(attributesLB, [attr, value], [attr, value], attr)
         }else{
            attrItem.value = attr
            Listbox.updateRow(attributesLB, attrItem, [attr, value], [attr, value])
         }
      },
      
      /*
       * Event handler for add button
       */
      doAdd: function(){
         var attr = attributeML.value
         var value = this.getExpertValue()
         this.addToAttributesLB(attr, value)
         attributeML.value=""
         attributeML.focus()
         this.getValueControl().value=""
         this.synchronizeExpert2Simple(attr, value)         
      },
      
      /*
       * Cancel event handler
       */
      doCancel: function(){
         this.elementWrapper.restore()
      },
      
      /*
       * Onload event handler
       */
      doOnload: function(){
         this.setGlobals()
         this.action = EditDialog.getAction()
         this.targetElement = EditDialog.getTargetElement()
         this.targetElementBackup = this.targetElement.cloneNode(false)
         this.elementWrapper = new ElementWrapper(this.targetElement)
         //Clone is given so the style doesn't change any more
         this.compTargetStyle = this.getCurrentStyle(this.targetElement)
         this.initShortcuts()
         this.initObservers()
         this.fillExpertAttributeMenulist(this.compTargetStyle)
         this.initHtmlAttributes()
         this.initSimpleStyles()
         this.initFromAction(this.action)
         this.initValidators(this.targetElement)
         //This must be after! initializing simple controls
         //TODO remove
//         this.initSimpleAttrEditedListener()
      },
      
      /*
       * Ok button event handler
       */
      doOk: function(){
         //fist blur active element to force synchronization between simple and expert values
         if(document.activeElement.blur)
            document.activeElement.blur()
         Dialog.setResult(DialogResult.OK)
         var action = Dialog.getNamedArgument("action")
         var attributes = {}
         var styles = {}
         var attrs = Listbox.getValues(attributesLB)
         for (var i = 0; i < attrs.length; i++) {
            var attr = attrs[i][0]
            var value = attrs[i][1]
            if(this.isStyle(attr)){
               styles[attr] = value
            }else{
               attributes[attr] = value
            }
         }
         action.setAttributes(attributes)
         action.setStyles(styles)
         action.setTargetDefinition(byId('targetdefinition').getTargetDefinition())
         byId('commonActionAttributes').setCommonAttributesOnAction(action)
         Dialog.setNamedResult("action", action)
         Dialog.setNamedResult("changeMemento", this.elementWrapper.getChangeMemento())
      },
      
      /*
       * Remove button event handler
       */
      doRemove: function(){
         if(!attributesLB.selectedItem)
            return
         // value must be fetched first as it will be deleted on removal
         var selectedAttr = attributesLB.selectedItem.value
         this.removeAttrFromAttrList(selectedAttr)
      },
      
      /*
       * Fills attributes menulist on expert tag with all computed style 
       * values of the target element 
       */
      fillExpertAttributeMenulist: function(compTargetStyle){
         var styleProps = new Array()
         for (var i = 0; i < compTargetStyle.length; i++) {
            styleProps.push(compTargetStyle.item(i))
         }
         styleProps.sort()
         ControlUtils.appendItemsToMenulist(attributeML, styleProps, styleProps)
      },
      
      /*
       * Fills the menulist mirroring the target selectbox in case 
       * the user selected a selectbox for modifying
       */
      fillHtmlSelectboxWithEntries: function(){
         var options = this.targetElement.options
         var htmlSelectML = byId('htmlSelectML')
         for (var i = 0; i < options.length; i++) {
            var option = options[i]
            var value = option.value?option.value:option.text
            ControlUtils.appendItemToMenulist(htmlSelectML, option.text, value)
         }
      },
      
      /*
       * Returns modifyed target style obj, which has an additional method
       * getPropertyValueExt which returns the offsetWidth/Height of the target element
       * instead of their style values.
       * Reason: When setting a width and re-read the value, the values are different  
       */
      getCurrentStyle: function(targetElement){
         var clonedTargetElem = targetElement.cloneNode(true)
         var targetWin = targetElement.ownerDocument.defaultView
         var cssStyle = targetWin.getComputedStyle(clonedTargetElem, "")
         //store values for width and height
         var width = targetElement.offsetWidth + "px"
         var height = targetElement.offsetHeight + "px"
         cssStyle.getPropertyValueExt = function(styleAttr){
            switch (styleAttr){
               case "width": return width
               case "height": return height
               default: return cssStyle.getPropertyValue(styleAttr)
            }
         }
         return cssStyle
      },
      
      /*
       * Returns the value of value control on the expert tab
       */
      getExpertValue: function(){
         return this.getValueControl().value 
      },
      
      /*
       * Returns the current visisble value control on the expert tab
       */
      getValueControl: function(){
         if(stringValueTB.collapsed==false){
            return stringValueTB
         }else if(colorValueCF.collapsed==false){
            return colorValueCF
         }else{
            throw new Error('All value controls invisible')
         }
      },
      
      /*
       * Event handler for selection of entry in the attributes table 
       * on the expert tab
       */
      handleSelectAttributesLB: function(){
         byId('removeCmd').setAttribute('disabled', 'false')
      },
      
      /*
       * Generic key event handler bound to the tabpanels to increment/decrement
       * the value of an control on cursor up/down in case the value is numeric  
       */
      incrementValue: function(keyEvent){
         var keyCode = keyEvent.keyCode
         //If not cursor up/down return
         if(keyCode != 38 && keyCode != 40)
            return
            
         var target = keyEvent.originalTarget
         //Target could also be inside binding
         var bindingParent = document.getBindingParent(target)
         if(bindingParent!=null)
            target = bindingParent
            
         var value = target.value
         //Reg splits numeric from the unit part
         var parsedValue = NUMERIC_VALUE_REG_EXP.exec(value)
         if(parsedValue==null)
            return
         var number = parseInt(parsedValue[1], 10)
         var unit = parsedValue[2]?parsedValue[2]:"px"
         if(keyCode==38)
            number--
         else
            number++
         target.value = number + unit
      },
      
      /*
       * Inits the dialog from the passed action
       */
      initFromAction: function(action){
         //Anonymous inner function to fill attributes and styles in the attributes listbox
         function appendToAttrLB(attrsOrStyles){
            for (var attr in attrsOrStyles) {
               var value = attrsOrStyles[attr]
               Listbox.appendMultiColumnItem(attributesLB, [attr, value], [attr, value], attr)
               this.synchronizeExpert2Simple(attr, value)
            } 
         }
         appendToAttrLB.apply(this, [action.getAttributes()])
         appendToAttrLB.apply(this, [action.getStyles()])
      },
      
      /*
       * Initializes the Html attributes on the simple tab
       * - determine which control rows to be displayed
       * - init controls with values from the target object (this is neccessary to determin whether a value has changed)
       */
      initHtmlAttributes: function(){
         var type = DomUtils.getElementType(this.targetElement)
         if(type == HtmlElementType.SELECT){
            this.fillHtmlSelectboxWithEntries()
         }
         var htmlAttrsRows = document.getElementsByAttribute("attrFor", "*")
         //As one row is used for multiple types the boundery is neccessary on the RegExp
         var matchTypeRegExp = new RegExp("\\b" + type + "\\b", "i")
         var found = false
         for (var i = 0; i < htmlAttrsRows.length; i++) {
            var row = htmlAttrsRows[i]
            if(!matchTypeRegExp.test(row.getAttribute("attrFor"))){
               continue
            }
            var controls = DomUtils.getElementsByAttribute(row, "attr", "*")
            for (var j = 0; j < controls.length; j++) {
               var control = controls[j]
               var attr = control.getAttribute('attr')
               this.htmlAttrToControlMap[attr] = control
               if(control.id=="simpleValueTB"){
                  value = this.targetElement[attr]
                  ControlUtils.appendItemToMenulist(control, value, value)
               }
               //TODO check if default value should be set or not
//               control[attr] = this.targetElement[attr]
            }
            row.collapsed = false
            found = true     
         }
         if(found){
            this.showHtmlAttributeGroupBox()
         }
      },
      
      /*
       * 
       */
      initObservers: function(){
         ControlUtils.observeControl(attributeML, function(control, controlValue){
            if(controlValue=="")
               byId('addCmd').setAttribute("disabled", true)
            else
               byId('addCmd').setAttribute("disabled", false)
         })
         ControlUtils.observeControl(stringValueTB, this.updateTargetElemFromExpert, this)
         var simpleStyleControls = document.getElementsByAttribute("styleProp", "*")
         for (var i = 0; i < simpleStyleControls.length; i++) {
            ControlUtils.observeControl(simpleStyleControls[i], this.updateTargetElemFromSimpleStyle, this)
         }
         var simpleAttrControls = document.getElementsByAttribute("attr", "*")
         for (var i = 0; i < simpleAttrControls.length; i++) {
            ControlUtils.observeControl(simpleAttrControls[i], this.updateTargetElemFromSimpleAttr, this)
         }
      },
      
      /*
       * Init shortcuts
       */
      initShortcuts: function(){
         this.shortcutManager.addShortcutForElement("valueRow", 'return', byId('addCmd')) 
         this.shortcutManager.addShortcutForElement("attributesLB", 'delete', byId('removeCmd')) 
      },
      
      /*
       * Init Listern which detects editing of any simple control
       */
      initSimpleAttrEditedListener: function(){
         var simpleAttrEditedHandler = Utils.bind(this.handleSimpleControlEdited, this)

         var textboxes = byId('attrGB').getElementsByTagName('textbox')
         for (var i = 0; i < textboxes.length; i++) {
            textboxes[i].addEventListener("input", function(event){
               event.target.customizeyourweb_synchronize2Expert = true
            }, true)
         }
         
         var menulists = byId('attrGB').getElementsByTagName('menulist')
         for (var i = 0; i < menulists.length; i++) {
            var handleEditMenulist = function(event){
               var menulist = event.target
               var synchronize = null
               if(menulist.editable){
                  //For editable menulist the label of the selected item becomes the value of the menulist!
                  synchronize = menulist.selectedIndex==-1 || menulist.selectedItem.value!="customizeyourweb_undefined"
               }else{
                  synchronize = menulist.value!="customizeyourweb_undefined"
               }
               menulist.customizeyourweb_synchronize2Expert = synchronize   
            }
            menulists[i].addEventListener("select", handleEditMenulist, true)
            menulists[i].addEventListener("input", handleEditMenulist, true)
         }
      },
      
      /*
       * Init the simple stlye controls on the simple tab with 
       * the values of the targetElement
       */
      initSimpleStyles: function(){
         var simpleStyleElems = XPathUtils.getElements("//*[@styleProp]")
         for (var i = 0; i < simpleStyleElems.length; i++) {
            var styleElem = simpleStyleElems[i]
            var styleProp = styleElem.getAttribute('styleProp')
            if(styleProp.indexOf("border")==0){
               styleProp = StringUtils.insertAt(styleProp, "-top", 6)
            }
            styleElem.value = this.compTargetStyle.getPropertyValueExt(styleProp)
         }
      },
      
      initValidators: function(targetElement){
         var okValidator = new TargetDefinitionXblValidator(byId('targetdefinition'), DomUtils.getOwnerWindow(targetElement))
         Dialog.addOkValidator(okValidator)
         okValidator.validate()
      },
      
      /*
       * Onblur event handler for attribute field initializing the value field
       * according the entered attribute
       */
      initValueField: function(){
         var attr = attributeML.value
         if(StringUtils.endsWith(attr, "color"))
            this.setValueControl("colorValueCF")
         else
            this.setValueControl("stringValueTB")
         this.getValueControl().value = this.compTargetStyle.getPropertyValueExt(attributeML.value)
      },
      
      /*
       * Checks whether an attribute is a style attribute or not
       */
      isStyle: function(attr){
         var convertedAttr = CssUtils.convertCssPropNameToCamelCase(attr)
         return this.compTargetStyle[convertedAttr]!=undefined
      },
      
      removeAttrFromAttrList: function(attr){
         var itemToRemove = Listbox.getItemByValue(attributesLB, attr)
         if(!itemToRemove)
            return
         attributesLB.removeItemAt(attributesLB.getIndexOfItem(itemToRemove))
         this.restorePropertyOrStyle(attr)
         this.synchronizeExpert2Simple(attr, null)
      },
      /*
       * Restores the attr/style of the target element and
       * returns the orginial value
       * TODO switch to element wrapper 
       */
      restorePropertyOrStyle: function(attr){
         if(this.isStyle(attr)){
            this.elementWrapper.restoreStyleProperty(attr)
         }else{
            this.elementWrapper.restoreProperty(attr)
         }
      },
      
      /*
       * set shortcuts for most used controls
       */
      setGlobals: function(){
         attributeML = byId('attributeML')
         stringValueTB = byId('stringValueTB')
         colorValueCF = byId('colorValueCF')
         attributesLB = byId('attributesLB')
      },
      
      /*
       * Sets a value for HTML attribute on the simple tab 
       */
      setSimpleAttrValue: function(attr, value){
         var simpleControl = this.htmlAttrToControlMap[attr]
         if(simpleControl){
            simpleControl.value = value
         }
      },
      
      /*
       * Sets value on simple style control if existent for that style prop
       */
      setSimpleStyleValue: function(attr, value){
         var elem = document.getElementsByAttribute("styleProp", attr)
         if(elem.length>0){
            elem[0].value = value
         }
      },         
      
      /*
       * Makes the appropriate value control visible 
       */
      setValueControl: function(controlId){
         stringValueTB.collapsed = true
         colorValueCF.collapsed = true
         switch (controlId){
            case "stringValueTB": 
               stringValueTB.collapsed = false
               break;
            case "colorValueCF": 
               colorValueCF.collapsed = false
               break;
         }
      },
      
      /*
       * Shows the group box with the HTML attributes on the simple tab 
       */
      showHtmlAttributeGroupBox: function(){
         byId('attrGB').collapsed = false
      },
      
      /*
       * Synchronize expert value with appropriate simple control
       */
      synchronizeExpert2Simple: function(attr, value){
         if(this.isStyle(attr)){
            value = value?value:""
            this.setSimpleStyleValue(attr, value)
         }else{
            value = value?value:UNDEFINED_VALUE
            this.setSimpleAttrValue(attr, value)
         }
      },
      
      /*
       * Onblur event handler for synchronizing values on simple tab
       * with attr listbox on expert tab
       */
      synchronizeSimple2Expert: function(event){
         var srcControl = event.target
         //Html input field also fires event but this will be ignored
         if(srcControl.tagName.toLowerCase().indexOf('html:')==0)
            return
            
         var value = srcControl.value
         if(srcControl.hasAttribute('styleProp')){
            var styleProp = srcControl.getAttribute('styleProp')
            Log.logDebug("value: " + value + "   compStyle: " + this.compTargetStyle.getPropertyValueExt(styleProp))
            if(this.compTargetStyle.getPropertyValueExt(styleProp)!=value){
               this.addToAttributesLB(styleProp, value)
            }else{
               this.removeAttrFromAttrList(styleProp)
            }
         }else if (srcControl.hasAttribute('attr')){
            var attr = srcControl.getAttribute('attr')
            if(value==UNDEFINED_VALUE){
               this.removeAttrFromAttrList(attr)
            }else{
               this.addToAttributesLB(attr, value)
            }
         }else{
            throw new Error('attr/style prop not set on simple control')
         }
      },
      
      /*
       * Value Change event handler for expert value field which updates the target element 
       * according the entered value
       */
      updateTargetElemFromExpert: function(control, controlValue){
         var attr = attributeML.value
         this._updateElement(attr, controlValue)   
      },
      
      /*
       * Value Change event handler for simple style fields which updates the target element 
       * according the entered value
       */
      updateTargetElemFromSimpleStyle: function(control, controlValue){
         var styleProp = control.getAttribute('styleProp')
         if(this.compTargetStyle.getPropertyValueExt(styleProp)!=controlValue){
            this._updateElement(styleProp, controlValue)
         }
      },

      /*
       * Value Change event handler for simple attr fields which updates the target element 
       * according the entered value
       */
      updateTargetElemFromSimpleAttr: function(control, controlValue){
         var attr = control.getAttribute('attr')
         if(controlValue==UNDEFINED_VALUE){
            this.elementWrapper.restoreProperty(attr)
         }else{
            this._updateElement(attr, controlValue)
         }
      },
      
      /*
       * Updates one (style)attr of the target element  
       */
      _updateElement: function(attr, value){
         Utils.executeDelayed("UPDATE_ELEMENT", 100, function(){
            if(StringUtils.isEmpty(attr)){
               return
            }
            if(ArrayUtils.contains(["true", "false"], value)){
               value = (new Boolean(value)).valueOf()
            }
            if(this.isStyle(attr)){
               this.elementWrapper.setStyle(attr, value, "important")
            }else{
               this.elementWrapper.setProperty(attr, value)
            }
         }, this)
      }      
   }

   Namespace.bindToNamespace("customizeyourweb", "EditModifyDialogHandler", EditModifyDialogHandler)
})()
}