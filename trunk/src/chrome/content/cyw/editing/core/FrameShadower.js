(function(){with(customizeyourweb){
	
	const SHADOWER_ID="CYWFrameShadower"
	
	function FrameShadower(targetWin) {
		this.targetWin = targetWin
	}
	
	FrameShadower.prototype = {
      shadow: function(){
      	var doc = this.targetWin.document
         //TODO This must be implemented correctly
         //First put inner frames on top
      	var iframes = doc.getElementsByTagName('iframe')
      	for (var i = 0; i < iframes.length; i++) {
            var iframe = iframes[i]
      		var style = this.targetWin.getComputedStyle(iframe, "")
      		if(style.position=="static"){
       			iframe.style.position="relative"
      		}
      		iframe.style.zIndex="2147483647"
      	}
         //Then shadow the rest of the frame
      	var shadower = doc.getElementById(SHADOWER_ID)
      	if(shadower==null){
      		shadower = this.createDiv()
      		var body = DomUtils.getBody(doc)
            body.appendChild(shadower)
      	}
      },
      
      unshadow: function(){
      	var doc = this.targetWin.document
      	var shadower = doc.getElementById(SHADOWER_ID)
      	if(shadower!=null){
         	shadower.parentNode.removeChild(shadower)
      	}
      },
      
      createDiv: function(){
         var doc = this.targetWin.document
         var div = doc.createElementNS("http://www.w3.org/1999/xhtml", "div");
         div.setAttribute('id',SHADOWER_ID)
         div.CYWIgnore = true;
         div.style.cssText = "position:absolute; top:0px; left:0px; background-color:#e7eaFF; opacity:0.6; z-index:2147483646"
         div.style.height = doc.height+"px"
         div.style.width = doc.width+"px"
         return div 
      }
	}

	
	customizeyourweb.Namespace.bindToNamespace("customizeyourweb", "FrameShadower", FrameShadower)

}})()