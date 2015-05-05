/*global require*/
require([
	"esri/map",
	"esri/renderers/jsonUtils",
	"esri/layers/FeatureLayer",
	"esri/renderers/SimpleRenderer",
	"esri/symbols/SimpleLineSymbol",
	"arcgis-style-ui/style-dialog"
], function (Map, rendererJsonUtils, FeatureLayer, SimpleRenderer, SimpleLineSymbol, StyleDialog) {
	var map, layer;

	map = new Map("map", {
		basemap: "hybrid",
		center: [-120.80566406246835, 47.41322033015946],
		zoom: 8,
		showAttribution: true
	});

	function getMapLayer(layerId) {
		var layer = map.getLayer(layerId);
		if (!layer) {
			layer = map.getGraphicsLayer(layerId);
		}
		return layer ||  null;
	}

	var toggleLayer = function () {
		var id = this.value;
		var layer = getMapLayer(id);
		if (layer) {
			if (this.checked) {
				layer.show();
			} else {
				layer.hide();
			}
		}
	};

	function updateStyle(evt) {
		var layer = evt.detail.layerId;
		layer = getMapLayer(layer);
		var renderer = evt.detail.renderer;
		renderer = rendererJsonUtils.fromJson(renderer);
		layer.setRenderer(renderer);
		layer.refresh();
	}

	/**
	 * Opens the dialog for changing the associated layer's style.
	 * @this {HTMLInputElement} - An HTML button
	 */
	var openChangeStyleControls = function () {
		var id = this.value;
		var layer = getMapLayer(id);
		var dialog = new StyleDialog(id, layer.geometryType, layer.renderer);
		dialog.dialog.addEventListener("style-change", updateStyle);
		dialog.dialog.addEventListener("style-reset", updateStyle);
		dialog.show();
	};

	map.on("layer-add", function (evt) {
		var layer, layerList, li, checkbox, changeStyleButton;
		layer = evt.layer;
		layerList = document.getElementById("layerList");

		li = document.createElement("li");

		checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.value = layer.id;
		checkbox.checked = layer.visible;
		checkbox.addEventListener("click", toggleLayer);

		li.appendChild(checkbox);
		li.appendChild(document.createTextNode(layer.title || layer.id));
		li.dataset.layerId = layer.id;

		if (layer.setRenderer) {

			changeStyleButton = document.createElement("button");
			changeStyleButton.classList.add("set-style-button");
			changeStyleButton.type = "button";
			changeStyleButton.textContent = "Style…";
			changeStyleButton.value = layer.id;
			changeStyleButton.addEventListener("click", openChangeStyleControls);
			li.appendChild(changeStyleButton);
		}

		layerList.insertBefore(li, layerList.firstChild);
	});

	map.on("load", function () {
		layer = new FeatureLayer("http://services.arcgis.com/IYrj3otxNjPsrTRD/ArcGIS/rest/services/WSDOT%20-%20Roadway%20Characteristics/FeatureServer/1", {
			id: "Speed_Limits"
		});
		map.addLayer(layer);
	});
});