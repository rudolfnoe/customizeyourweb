(function() {
	/*
	 * Handles events regarding the log file e.g copy to clipboard or save Must
	 * be completly independent from other files as it should work in any case
	 */
	var ErrorLogHandler = {
		/*
		 * Implemented here to make sure it is working in every case
       * Currently not used as replaced by saveErrorLogToDisc
		 */
		copyErrorLogToClipboard : function() {
         var consoleContent = this.getConsoleContent();
			// Copy to clipboard
			const clipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"]
					.getService(Components.interfaces.nsIClipboardHelper);
			clipboardHelper.copyString(consoleContent);
		},
      
      getConsoleContent: function(){
         var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
               .getService(Components.interfaces.nsIConsoleService);
         var messages = {}
         var count = {}
         consoleService.getMessageArray(messages, count)
         var consoleContent = ""
         var messageArray = messages.value
         for (var i = 0; i < messageArray.length; i++) {
            consoleContent += messageArray[i].message + "\n"
         }
         return consoleContent
      },

		getSavePath : function() {
			var nsIFilePicker = Components.interfaces.nsIFilePicker;
			var filePicker = Components.classes["@mozilla.org/filepicker;1"]
					.createInstance(nsIFilePicker);
			filePicker.init(window, "Save Logfile", nsIFilePicker.modeSave);
         filePicker.defaultString = "CYW_Error_Log.txt"
         filePicker.appendFilters(nsIFilePicker.filterText)
			var result = filePicker.show()
			if (result == nsIFilePicker.returnOK || result==nsIFilePicker.returnReplace) {
				return filePicker.file;
			} else {
				return null
			}
		},

		saveErrorLogToDisc : function() {
         var path = this.getSavePath()
         if(path == null){
            return
         }
         this.writeFile(this.getConsoleContent(), path) 
		},

		/*
		 * Writes the file to disc @param string content: Content of the file
		 * @param nsIFile path: path where to write the file
		 */
		writeFile : function(content, path) {
			// file is nsIFile, data is a string
			var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
					.createInstance(Components.interfaces.nsIFileOutputStream);

			// use 0x02 | 0x10 to open file for appending.
			foStream.init(path, 0x02 | 0x08 | 0x20, 0666, 0);

         var converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"]
					.createInstance(Components.interfaces.nsIConverterOutputStream);
			converter.init(foStream, "UTF-8", 0, 0);
			converter.writeString(content);
			converter.close(); // this closes foStream
		}
	}

	if (!window.customizeyourweb) {
		window['customizeyourweb'] = new Object()
	}
	window.customizeyourweb.ErrorLogHandler = ErrorLogHandler
})()
