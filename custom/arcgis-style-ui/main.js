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
	 * @typedef {Object} CreateInputOptions
	 * @param {string} type
	 * @param {string} name
	 * @param {string} label
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
		var labelText = options.label || name;

		var frag = document.createDocumentFragment();
		var label = document.createElement("label");
		label.textContent = labelText;

		var input = document.createElement("input");
		input.type = type;
		input.name = name;
		input.id = options.id || name + Date.now();
		label.for = input.id;

		var propName;

		for (propName in options) {
			if (options.hasOwnProperty(propName) && !ignoredOptionsRe.test(propName)) {
				input.setAttribute([propName], options[propName]);
			}

		}

		frag.appendChild(label);
		frag.appendChild(input);

		return frag;
	}

	/**
	 * An UI control object.
	 * @param {external:Renderer} defaultRenderer
	 * @member {HTMLFormElement} form
	 * @class
	 */
	function LineSymbolUI(defaultRenderer) {
		var form = document.createElement("form");
		this.form = form;
		form.dataset.defaultRenderer = defaultRenderer;


		var frag = createInput({
			type: "color",
			name: "linecolor",
			label: "Line Color",
			required: "required"
		});
		form.appendChild(frag);

		frag = createInput({
			type: "number",
			name: "linewidth",
			label: "Line Width",
			placeholder: "width",
			title: "width",
			required: "required",
			value: 1,
			min: 0.5,
			step: 0.5,
			max: 10
		});
		form.appendChild(frag);

		frag = createInput({
			type: "range",
			name: "alpha",
			min: 0,
			max: 255,
			step: 1,
			required: "required",
			value: 255
		});
		form.appendChild(frag);

		form.appendChild(createLineStyleSelect());

		var submitButton = document.createElement("button");
		submitButton.type = "submit";
		submitButton.textContent = "Update Style";
		form.appendChild(submitButton);

		var resetButton = document.createElement("button");
		resetButton.type = "reset";
		resetButton.textContent = "Reset Style";
		form.appendChild(resetButton);

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

	return {
		LineSymbolUI: LineSymbolUI
	};
});