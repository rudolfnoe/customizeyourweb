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
				if (this.nextSibling) {
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