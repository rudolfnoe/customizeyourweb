doCreateActionTpl = function(){
   this.doCreateAction("sb_form_q", "delete")
}

function doAssertFirstModificationTpl(){
   var commands = []
   commands.push(new Command("waitForElementNotPresent", "sb_form_q"))
   IDEIncludeCommand.insertCommands(commands)
}

function doAssertNoModificationTpl(){
   var commands = []
   commands.push(new Command("assertElementPresent", "sb_form_q"))
   commands.push(new Command("assertElementPresent", "sw_pb"))
   IDEIncludeCommand.insertCommands(commands)
}

function doAssertRetargetModificationTpl(){
   IDEIncludeCommand.insertCommands([
      new Command("waitForElementNotPresent", "hp_sw_hdr")
   ])     
}

function doSecondModificationTpl(){
   var commands = []
   commands.push(new Command("type", "xbl=targetdefinition@targetDefinitionML", "tag=div id=sb_pb"))
   IDEIncludeCommand.insertCommands(commands)
}

function doAssertSecondModificationTpl(){
   var commands = []
   commands.push(new Command("waitForElementNotPresent", "sb_pb"))
   IDEIncludeCommand.insertCommands(commands)
}
   
function getRetargetLocator(){
   return "hp_sw_hdr"
}

function getEditWindowName(){
   return "CommonAttrEdit"
}


function hasPreviewBeforeSave(){
   return true
}
