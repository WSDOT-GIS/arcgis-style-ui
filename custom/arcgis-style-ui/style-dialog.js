/*global define*/

define(["./main"], function (StyleUI) {
	function StyleDialog() {
		var self = this;
		var dialog = document.createElement("dialog");
		document.body.appendChild(dialog);

		var header = document.createElement("div");
		header.classList.add("header");

		dialog.appendChild(header);

		var closeButton = document.createElement("button");
		closeButton.type = "button";
		closeButton.textContent = "X";
		closeButton.classList.add("close-button");
		closeButton.addEventListener("click", function () {
			dialog.close();
		});

		header.appendChild(closeButton);

		this.dialog = dialog;
		var styleUI = new StyleUI();
		styleUI.form.method = "dialog";
		this.dialog.appendChild(styleUI.form);
		this.layer = null;
	}

	StyleDialog.prototype.setLayer = function (layer) {
		this.layer = layer;
	};

	/**
	 * 
	 * @param {Layer} [layer]
	 */
	StyleDialog.prototype.show = function (layer) {
		if (layer) {
			this.setLayer(layer);
		}
		this.dialog.showModal();
	};

	StyleDialog.prototype.close = function () {

	};

	return StyleDialog;
});