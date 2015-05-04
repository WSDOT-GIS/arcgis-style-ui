/*global define*/
define([], function () {

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
		var prefixRe = /^esriS[LM]S(\w+)/i;
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

	function rgbArrayToHex(/**{number[]}*/ rgb) {
		return ["#", rgb.map(function (n) {
			return n.toString(16);
		}).join("")].join("");
	}


	/**
	 * Returns a hex string into an RGB color array.
	 */
	function hexToRgbArray(hexString) {
		var colorRe = /[0-9a-f]{2}/ig;
		var match = colorRe.exec(hexString);
		var parts = [], n;
		while (match) {
			n = parseInt(match[0], 16);
			parts.push(n);
			match = colorRe.exec(hexString);
		}
		return parts;
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
		input.type = type;
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
	 * Creates the line symbol controls.
	 * @param {Object} options
	 * @param {string} [options.color='#000000'] - Color in "#xxxxxx" hex format
	 * @param {number} [options.alpha=255] - Alpha value for the color. Valid values are from 0 to 255.
	 * @param {number} [options.width=1] - Line width.
	 * @returns {HTMLDocumentFragment}
	 */
	function createLineSymbolUI(options) {
		var output = document.createDocumentFragment();

		var colorFieldSet = document.createElement("fieldset");
		var legend = document.createElement("legend");
		legend.textContent = "Color";
		colorFieldSet.appendChild(legend);

		var frag = createInput({
			type: "color",
			name: "linecolor",
			required: "required",
			value: options && options.color ? options.color : "#000000"
		});
		colorFieldSet.appendChild(frag);


		frag = createInput({
			type: "range",
			name: "alpha",
			title: "alpha",
			min: 0,
			max: 255,
			step: 1,
			required: "required",
			value: options && (options.alpha || options.alpha === 0)  ? options.alpha : 255
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

	/**
	 * An UI control object.
	 * @param {external:Renderer} defaultRenderer
	 * @member {HTMLFormElement} form
	 * @class
	 */
	function RendererForm(defaultRenderer) {
		var form = document.createElement("form");
		this.form = form;
		form.dataset.defaultRenderer = defaultRenderer;

		var frag = createLineSymbolUI();
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

		form.onsubmit = function () {
			var renderer = {
				type: "simple",
				label: "",
				description: "",
				symbol: {
					type: "esriSLS",
					color: hexToRgbArray(form.linecolor.value).concat(Number(form.alpha.value)), //[56,168,0,255],
					width: Number(form.linewidth.value), //1.5,
					style: form.style.value //"esriSLSSolid"
				}
			};
			var evt = new CustomEvent("style-change", {
				detail: renderer
			});
			form.dispatchEvent(evt);
			return false;
		};

		form.onreset = function () {
			var renderer = JSON.parse(form.dataset.defaultRenderer);
			var evt = new CustomEvent("style-reset", {
				detail: renderer
			});
			form.dispatchEvent(evt);
		};
	}

	RendererForm.prototype.setDefaultRenderer = function (defaultRenderer) {
		if (defaultRenderer) {
			this.form.dataset.defaultRenderer = JSON.stringify(defaultRenderer);
		}
	}

	return RendererForm;
});