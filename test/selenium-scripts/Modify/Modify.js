doCreateActionTpl = function(){
   this.doCreateAction("as_q", "m")
}

function doFirstModificationTpl(){
   IDEIncludeCommand.insertCommands(
      [new Command("type", "widthML", "200px")]
   )
}

function doAssertFirstModificationTpl(){
   IDEIncludeCommand.insertCommands([
      new Command("assertStyle", "as_q@width", "200px")
   ])
}

function doAssertNoModificationTpl(){
   IDEIncludeCommand.insertCommands([
      new Command("assertStyle", "as_q@width", ""),
      new Command("assertStyle", "as_q@height", "")
   ])
}

function doAssertRetargetModificationTpl(){
   IDEIncludeCommand.insertCommands([
      new Command("assertStyle", "as_epq@width", "200px")
   ])     
}

function doSecondModificationTpl(){
   IDEIncludeCommand.insertCommands([
      new Command("type", "heightML", "50px")
   ])
}

function doAssertSecondModificationTpl(){
   IDEIncludeCommand.insertCommands([
      new Command("assertStyle", "as_q@width", "200px"),
      new Command("assertStyle", "as_q@height", "50px")
   ])
}
   
function getRetargetLocator(){
   return "as_epq"
}

function getEditWindowName(){
   return "EditModify"
}

function hasPreviewBeforeSave(){
   return true
}

function hasPreviewInDialog(){
   return true
}


