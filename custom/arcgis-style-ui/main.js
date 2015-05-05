/*global define*/
define(["color-utils"], function (colorUtils) {

	/**
	 * @external Renderer
	 * @see {@link http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Renderer_objects/02r30000019t000000/|Renderer objects}
	 */

	/**
	 * Creates a select element for selecting line styles.
	 * @param {string} [defaultValue] - Determines which option will have the selected attribute set.
	 * @returns {HTMLSelectElement}
	 */
	function createLineStyleSelect(defaultValue) {
		var lineStyles = [
			"esriSLSSolid",
			"esriSLSDash",
			"esriSLSDot",
			"esriSLSDashDot",
			"esriSLSDashDotDot",
			"esriSLSNull",
		];
		return createSelect(lineStyles, {
			defaultValue: defaultValue,
			name: "linestyle"
		});
	}

	/**
	 * Creates a select element for selecting line styles.
	 * @param {string} [defaultValue] - Determines which option will have the selected attribute set.
	 * @returns {HTMLSelectElement}
	 */
	function createMarkerStyleSelect(defaultValue) {
		var lineStyles = [
			"esriSMSCircle",
			"esriSMSCross",
			"esriSMSDiamond",
			"esriSMSSquare",
			"esriSMSX",
			"esriSMSTriangle"
		];
		return createSelect(lineStyles, {
			defaultValue: defaultValue,
			name: "style"
		});
	}

	

	/**
	 * Creates a select element for selecting line styles.
	 * @param {string} [defaultValue] - Determines which option will have the selected attribute set.
	 * @returns {HTMLSelectElement}
	*/
	function createFillStyleSelect(defaultValue) {
		var lineStyles = [
			"esriSFSBackwardDiagonal",
			"esriSFSCross",
			"esriSFSDiagonalCross",
			"esriSFSForwardDiagonal",
			"esriSFSHorizontal",
			"esriSFSSolid",
			"esriSFSVertical",
			"esriSFSNull"
		];
		return createSelect(lineStyles, {
			defaultValue: defaultValue,
			name: "style"
		});
	}

	/**
	 * Creates a select element for selecting line styles.
	 * @param {string[]} values
	 * @param {Object} options
	 * @param {string} [options.defaultValue]
	 * @returns {HTMLSelectElement}
	 */
	function createSelect(values, options) {
		var prefixRe = /^esriS[LMF]S(\w+)/i;
		var capRe = /([a-z])([A-Z])/g;

		var select = document.createElement("select");
		select.name = options.name;
		values.forEach(function (name) {
			var option = document.createElement("option");
			// Remove the "esriS*S" prefix and separate words.
			var label = name.replace(prefixRe, "$1").replace(capRe, "$1 $2");
			option.value = name;
			if (options.defaultValue && name === options.defaultValue) {
				option.selected = name;
			}
			option.label = label;
			option.textContent = label;
			select.appendChild(option);
		});

		return select;
	}

	/**
	 * Options for the createInput function.
	 * @typedef {Object} CreateInputOptions
	 * @param {string} type
	 * @param {string} name
	 * @param {string} [label]
	 * @param {(string|number)} value
	 */

	/**
	 * Creates a document fragment with a label and associated input element.
	 * @param {CreateInputOptions} options - Values for the input element's attributes.
	 * @returns {HTMLDocumentFragment}
	 */
	function createInput(options) {
		var ignoredOptionsRe = /^(?:(?:type)|(?:name)|(?:label)|(?:id))$/;
		var type = options.type;
		var name = options.name;

		var frag = document.createDocumentFragment();

		var input = document.createElement("input");
		try {
			input.type = type;
		} catch (err) {
			// Setup fallback for browsers that do not support color input type.
			if (type === "color") {
				input.setAttribute("type", "color");
				input.setAttribute("pattern", /^#[0-9a-f]{6}$/i.source);
				input.title = "Color in hex. format (E.g. #FFFFFF)";
			}
		}
		input.name = name;
		input.id = options.id || name + Date.now();

		var label;
		if (options.label) {
			label = document.createElement("label");
			label.textContent = options.label;
			label.for = input.id;
		}


		var propName;

		for (propName in options) {
			if (options.hasOwnProperty(propName) && !ignoredOptionsRe.test(propName)) {
				input.setAttribute([propName], options[propName]);
			}

		}

		if (label) {
			frag.appendChild(label);
		}
		frag.appendChild(input);

		return frag;
	}

	/**
	 * Creates color and alpha controls.
	 * @param {Object} colorOptions
	 * @param {string} colorOptions.name
	 * @param {string} colorOptions.value
	 * @param {Object} alphaOptions
	 * @param {string} alphaOptions.name
	 * @param {string} alphaOptions.title
	 * @param {number} alphaOptions.value
	 * @returns {HTMLDocumentFragment}
	 */
	function createColorControls(colorOptions, alphaOptions) {
		var output = document.createDocumentFragment();

		// Initialize option variables if missing.
		if (!colorOptions) {
			colorOptions = {};
		}

		if (!alphaOptions) {
			alphaOptions = {};
		}

		var frag = createInput({
			type: "color",
			name: colorOptions.name || "color",
			required: "required",
			value: colorOptions.value || "#000000"
		});
		output.appendChild(frag);


		frag = createInput({
			type: "range",
			name: alphaOptions.name || "alpha",
			title: alphaOptions.title || "alpha",
			min: 0,
			max: 255,
			step: 1,
			required: "required",
			value: alphaOptions.value || alphaOptions.value === 0 ? alphaOptions.value : 255
		});
		output.appendChild(frag);


		return output;
	}

	/**
	 * Creates the line symbol controls.
	 * @param {Object} options
	 * @param {string} [options.linecolor='#000000'] - Color in "#xxxxxx" hex format
	 * @param {number} [options.linealpha=255] - Alpha value for the color. Valid values are from 0 to 255.
	 * @param {number} [options.width=1] - Line width.
	 * @returns {HTMLDocumentFragment}
	 */
	function createLineSymbolUI(options) {
		var output = document.createDocumentFragment();

		if (!options) {
			options = {};
		}

		var colorFieldSet = document.createElement("fieldset");
		var legend = document.createElement("legend");
		legend.textContent = "Color";
		colorFieldSet.appendChild(legend);

		var frag = createColorControls({
			name: "linecolor",
			value: options.linecolor
		}, {
			name: "linealpha",
			title: "linealpha",
			value: options.linealpha
		});

		colorFieldSet.appendChild(frag);

		output.appendChild(colorFieldSet);

		var lineFieldSet = document.createElement("fieldset");
		legend = document.createElement("legend");
		legend.textContent = "Line";
		lineFieldSet.appendChild(legend);
		output.appendChild(lineFieldSet);

		frag = createInput({
			type: "number",
			name: "linewidth",
			label: "Width",
			placeholder: "width",
			title: "width",
			required: "required",
			value: options && options.width ? options.width : 1,
			min: 0.5,
			step: 0.5,
			max: 10
		});
		lineFieldSet.appendChild(frag);

		lineFieldSet.appendChild(createLineStyleSelect());

		return output;
	}

	function createFillSymbolUI(options) {
		if (!options) {
			options = {};
		}

		var output = document.createDocumentFragment();

		// TODO: Options

		var frag = createLineSymbolUI();
		output.appendChild(frag);

		frag = createFillStyleSelect();
		output.appendChild(frag);

		frag = createColorControls();
		output.appendChild(frag);

		return output;
	}


	function createMarkerSymbolUI(options) {
		if (!options) {
			options = {};
		}

		var output = document.createDocumentFragment();

		// TODO: Options

		var frag = createLineSymbolUI();
		output.appendChild(frag);

		frag = createMarkerStyleSelect();
		output.appendChild(frag);

		frag = createColorControls();
		output.appendChild(frag);

		frag = createInput({
			type: "number",
			min: 0,
			name: "size",
			title: "size",
			label: "size",
			value: 1,
			required: "required"
		});

		output.appendChild(frag);

		return output;
	}

	/**
	 * An UI control object.
	 * @param {string} layerId
	 * @param {string} geometryType
	 * @param {external:Renderer} defaultRenderer
	 * @member {HTMLFormElement} form
	 * @class
	 */
	function RendererForm(layerId, geometryType, defaultRenderer) {
		var self = this;
		var form = document.createElement("form");
		this.form = form;

		if (defaultRenderer) {
			if (typeof defaultRenderer === "string") {
				form.dataset.defaultRenderer = defaultRenderer;
			} else if (typeof defaultRenderer.toJson === "function") {
				form.dataset.defaultRenderer = JSON.stringify(defaultRenderer.toJson());
			} else {
				form.dataset.defaultRenderer = JSON.stringify(defaultRenderer);
			}
		}

		var smsRE = /((point)|(sms))/gi;
		var sfsRE = /((polygon)|(sfs))/gi;

		var symbolType;

		var frag;
		if (smsRE.test(geometryType)) {
			frag = createMarkerSymbolUI();
			symbolType = "esriSMS";
		} else if (sfsRE.test(geometryType)) {
			frag = createFillSymbolUI();
			symbolType = "esriSFS";
		} else {
			frag = createLineSymbolUI();
			symbolType = "esriSLS";
		}
		
		form.appendChild(frag);

		var buttonContainer = document.createElement("div");
		buttonContainer.classList.add("container");
		form.appendChild(buttonContainer);

		var submitButton = document.createElement("button");
		submitButton.type = "submit";
		submitButton.textContent = "Update Style";
		buttonContainer.appendChild(submitButton);

		var resetButton = document.createElement("button");
		resetButton.type = "reset";
		resetButton.textContent = "Reset Style";
		buttonContainer.appendChild(resetButton);

		Object.defineProperty(this, "linesymbol", {
			get: function () {
				var symbol = {
					type: "esriSLS",
					color: colorUtils.hexToRgbArray(form.linecolor.value).concat(Number(form.linealpha.value)), //[56,168,0,255],
					width: Number(form.linewidth.value), //1.5,
					style: form.linestyle.value //"esriSLSSolid"
				};
				return symbol;
			}
		});

		Object.defineProperty(this, "symbol", {
			get: function () {
				var symbol;
				if (symbolType === "esriSLS") {
					symbol = self.linesymbol;
				} else {
					symbol = {
						type: symbolType,
						outline: self.linesymbol,
						color: colorUtils.hexToRgbArray(form.color.value).concat(Number(form.alpha.value)), //[56,168,0,255],
						width: Number(form.linewidth.value), //1.5
						style: form.style.value, //"esriSLSSolid"
						size: form.size ? Number(form.size.value) : null
					};
				}
				
				return symbol;
			}
		});

		Object.defineProperty(this, "renderer", {
			get: function () {
				var renderer = {
					type: "simple",
					label: "",
					description: "",
					symbol: self.symbol
				};
				return renderer;
			}
		});

		form.onsubmit = function () {
			var evt = new CustomEvent("style-change", {
				detail: {
					layerId: layerId,
					renderer: self.renderer
				},
				bubbles: true,
				cancelable: true
			});
			form.dispatchEvent(evt);
			return false;
		};

		form.onreset = function () {
			var renderer;
			if (form.dataset.defaultRenderer) {
				renderer = JSON.parse(form.dataset.defaultRenderer);
			}
			var evt = new CustomEvent("style-reset", {
				detail: {
					layerId: layerId,
					renderer: renderer
				},
				bubbles: true,
				cancelable: true
			});
			form.dispatchEvent(evt);
		};
	}

	return RendererForm;
});