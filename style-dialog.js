/*global define */

/**
 * A module that defines the StyleDialog class.
 * @module arcgis-style-ui/style-dialog
 */
define(["./main"], function (StyleUI) {


	/**
	 * An object that is used to show a dialog element for styling a layer.
	 * @constructor
	 * @param {string} layerId
	 * @param {string} symbolType
	 * @param {external:Renderer} defaultRenderer
	 * @alias module:arcgis-style-ui/style-dialog
	 * @property {HTMLDialogElement} dialog
	 * @property {module:arcgis-style-ui} styleUI
	 */
	function StyleDialog(layerId, symbolType, defaultRenderer) {
		var dialog = document.createElement("dialog");

		// If using a dialog polyfill, the dialog needs to be registered.
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

		Object.defineProperty(this, "dialog", {
			get: function () {
				return dialog;
			}
		});

		var styleUI = new StyleUI(layerId, symbolType, defaultRenderer);
		try {
			styleUI.form.method = "dialog";
		} catch (err) {
			styleUI.form.setAttribute("method", "dialog");
		}

		Object.defineProperty(this, "styleUI", {
			get: function () {
				return styleUI;
			}
		});

		this.dialog.appendChild(styleUI.form);
		this.layer = null;
	}

	/**
	 * Sets the current layer.
	 * @param {external:Layer} layer
	 */
	StyleDialog.prototype.setLayer = function (layer) {
		this.layer = layer;
	};

	/**
	 * Shows the dialog.
	 * @param {external:Layer} [layer] - If a layer is specified, the {@link module:arcgis-style-ui/style-dialog#setLayer|setLayer} function will be called before opening the dialog.
	 */
	StyleDialog.prototype.show = function (layer) {
		if (layer) {
			this.setLayer(layer);
		}
		this.dialog.showModal();
	};

	/**
	 * Closes the dialog.
	 */
	StyleDialog.prototype.close = function () {
		this.dialog.close();
	};

	return StyleDialog;
});