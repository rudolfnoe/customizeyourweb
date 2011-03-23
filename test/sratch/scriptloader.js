var start = (new Date()).getTime()
var sl = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader)
var cr = Components.classes["@mozilla.org/chrome/chrome-registry;1"].getService(Components.interfaces.nsIChromeRegistry)
var ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService)


var chromePath = "chrome://customizeyourweb/content/common/"
var recursive = true
var chromeBaseUri = ios.newURI(chromePath, null, null)
var chromeBaseFullUri = cr.convertChromeURL(chromeBaseUri)
var chromeBaseUrl = chromeBaseFullUri.resolve("")
var urlsToLoad = []
if(chromeBaseUrl.indexOf("jar:")==0){
   //url: jar:file:///C:/Dokumente%20und%20Einstellungen/Rudolf/Anwendungsdaten/Mozilla/Firefox/Profiles/0xuppogy.FF%204.0%20Beta%204/extensions/customizeyourweb@mouseless.de.xpi!/chrome/content/common/firefox/
   var xpiSplitterIndex = chromeBaseUrl.lastIndexOf("!")
   var xpiUrl = chromeBaseUrl.substring(4, xpiSplitterIndex)
   var xpiUri = ios.newURI(xpiUrl, null, null)
   var xpiFile = xpiUri.QueryInterface(Components.interfaces.nsIFileURL).file;
   var zr = Components.classes["@mozilla.org/libjar/zip-reader;1"].createInstance(Components.interfaces.nsIZipReader);   
   zr.open(xpiFile)
   var zipPath = chromeBaseUrl.substring(xpiSplitterIndex+2)
   var searchPath = zipPath+"*"
   if(!recursive){
      searchPath += "~" + zipPath + "*/*"
   }
   var ze = zr.findEntries(searchPath)
   var urlToLoadBasePath = chromeBaseUrl.substring(0, xpiSplitterIndex+2)
   while(ze.hasMore()){
      var zePath = ze.getNext()
      var zeo = zr.getEntry(zePath)
      if(zeo.isDirectory){
         continue
      }

      if(zePath.indexOf(".js")==zePath.length-3){
         urlsToLoad.push(urlToLoadBasePath + zePath)
      }
   }
}else{
   
}
var ns = {}
sl.loadSubScript("chrome://customizeyourweb/content/common/lang/ObjectUtils.js", ns) 
sl.loadSubScript("chrome://customizeyourweb/content/common/lang/debug/Assert.js", ns) 
for(var i=0; i<urlsToLoad.length; i++){
//print(urlsToLoad[i])
   sl.loadSubScript(urlsToLoad[i], ns) 
}

(new Date()).getTime()-start
//props(ns)

var chromeBaseFullUri = cr.convertChromeURL(chromeBaseUri)
var chromeBaseUrl = chromeBaseFullUri.resolve("")

var chromeBaseFile = chromeBaseFullUri.QueryInterface(Components.interfaces.nsIFileURL).file; 
var startIndexSubPath  = chromeBaseFile.path.length
var files = this.readFileEntries(chromeBaseFile, recursive)
for (var i = 0; i < files.length; i++) {
	var fullPath = files[i].path
	if((fullPath.lastIndexOf(".js")!=fullPath.length-3) ||
	     this.shouldBeExcluded(files[i].leafName, excludeArray))
	   continue
	this.loadScript(chromeBaseUri.resolve(fullPath.substring(startIndexSubPath+1)), scopeObj) 
}
