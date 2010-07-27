with (customizeyourweb) {
	(function() {
		function RemovedElement(element) {
			this.element = element
			this.parentNode = element.parentNode
			this.nextSibling = element.nextSibling
		}

		RemovedElement.prototype = {
			constructor : RemovedElement,

			undoRemoval: function() {
            //Check for next sibling is in document (and not also removed)
				if (this.nextSibling && this.nextSibling.parentNode) {
					this.parentNode.insertBefore(this.element, this.nextSibling)
				} else {
					this.parentNode.appendChild(this.element)
				}
			}
		}

		Namespace.bindToNamespace("customizeyourweb", "RemovedElement",
				RemovedElement)
	})()
}