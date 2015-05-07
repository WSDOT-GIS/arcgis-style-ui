﻿/*global define */

define(["./main"], function (StyleUI) {
	function StyleDialog(layerId, symbolType, defaultRenderer) {
		var dialog = document.createElement("dialog");
		if (!window.HTMLDialogElement && window.dialogPolyfill) {
			window.dialogPolyfill.registerDialog(dialog);
		}
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
		var styleUI = new StyleUI(layerId, symbolType, defaultRenderer);
		try {
			styleUI.form.method = "dialog";
		} catch (err) {
			styleUI.form.setAttribute("method", "dialog");
		}
		this.dialog.appendChild(styleUI.form);
		this.layer = null;
	}

	StyleDialog.prototype.setLayer = function (layer) {
		this.layer = layer;
	};

	/**
	 * Shows the dialog.
	 * @param {Layer} [layer] - If a layer is specified, the StyleDialog#setLayer function will be called before opening the dialog.
	 */
	StyleDialog.prototype.show = function (layer) {
		if (layer) {
			this.setLayer(layer);
		}
		this.dialog.showModal();
	};

	StyleDialog.prototype.close = function () {
		this.dialog.close();
	};

	return StyleDialog;
});