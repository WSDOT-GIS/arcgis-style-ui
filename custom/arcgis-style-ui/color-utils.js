define(function () {
	/**
	 * Converts an array of RGB or RGBA values into a hexadecimal string value.
	 * @param {number[]} rgb - An array of either three or four integers.
	 * @returns {string}
	 */
	function rgbArrayToHex(rgb) {
		return ["#", rgb.map(function (n) {
			return n.toString(16);
		}).join("")].join("");
	}


	/**
	 * Returns a hex string into an RGB color array.
	 * @param {string} hexString
	 * @returns {number[]}
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

	return {
		rgbArrayToHex: rgbArrayToHex,
		hexToRgbArray: hexToRgbArray
	};
});