/*global define*/

define(function () {
	/**
	 * Converts an array of RGB or RGBA values into a hexadecimal string value.
	 * @param {number[]} rgb - An array of either three or four integers.
	 * @returns {string}
	 */
	function rgbArrayToHex(rgb) {
		return ["#", rgb.map(function (n) {
			var hex = n.toString(16);
			if (hex.length === 1) {
				hex = "0" + hex;
			}
			return hex;
		}).join("")].join("");
	}

	/**
	 * Converts an RGBA array into a hex color value for the RGB portion and an alpha value.
	 * @param {number[]} rgba
	 * @returns {Object}
	 */
	function rgbaArrayToHexAndAlpha(rgba) {
		var rgb, alpha = null, hex = null;
		if (rgba) {
			if (rgba.length === 4) {
				alpha = rgba.slice(3)[0];
				rgb = rgba.slice(0, -1);
			}
			hex = rgbArrayToHex(rgb);
		}
		return {
			color: hex,
			alpha: alpha
		};
	}


	/**
	 * Returns a hex string into an RGB color array.
	 * @param {string} hexString - A hexidecimal string of either RGB or RGBA values.
	 * @param {number} [alpha] - Additional alpha value. (If hexString already includes alpha, this parameter will be ignored.)
	 * @returns {number[]}
	 */
	function hexToRgbArray(hexString, alpha) {
		var colorRe = /[0-9a-f]{2}/ig;
		var match = colorRe.exec(hexString);
		var parts = [], n;
		while (match) {
			n = parseInt(match[0], 16);
			parts.push(n);
			match = colorRe.exec(hexString);
		}
		/*jshint eqnull:true*/
		if (typeof alpha != null && parts.length < 4) {
			parts.push(Number(alpha));
		}
		/*jshint eqnull:false*/

		return parts;
	}

	/**
	 * Module for converting between color representations.
	 * @exports color-utils
	 */
	return {
		rgbArrayToHex: rgbArrayToHex,
		rgbaArrayToHexAndAlpha: rgbaArrayToHexAndAlpha,
		hexToRgbArray: hexToRgbArray
	};
});