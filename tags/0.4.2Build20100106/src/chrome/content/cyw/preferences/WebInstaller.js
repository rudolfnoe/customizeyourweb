with (customizeyourweb) {
	(function() {
		function WebInstaller() {
		}

		WebInstaller.prototype = {
			reqeust : null,
			// signels that an request is pending
			pending : false,

			installScript : function(href) {
				if (this.pending) {
					throw new Error('A request is pending!')
				}
				this.triggerDownload(href)
			},

			handleDownloadError : function() {
            alert('An error occurred on trying to download the script.')
			},
			
         handleDownloadSuccess : function(event) {
            var scriptsContent = this.request.getResponseText()
            if(scriptsContent==null){
               this.handleDownloadError()
               return
            }
            ScriptImporter.importScripts(scriptsContent)
			},

			triggerDownload : function(href) {
				if (this.request == null) {
					this.request = new HttpRequest()
					this.request.addEventListener(HttpRequest.EVENT_TYPE.ON_SUCCESS, Utils.bind(
									this.handleDownloadSuccess, this))
					this.request.addEventListener(HttpRequest.EVENT_TYPE.ON_ERROR, Utils.bind(
									this.handleDownloadError, this))
				}
				this.request.send(HttpRequest.METHOD.GET, href, true)
			}
		}
		Namespace.bindToNamespace("customizeyourweb", "WebInstaller", WebInstaller)
	})()
}