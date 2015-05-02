/*global require*/
require([
	"esri/map",
	"esri/renderers/jsonUtils",
	"esri/layers/FeatureLayer",
	"esri/renderers/SimpleRenderer",
	"esri/symbols/SimpleLineSymbol",
	"arcgis-style-ui"
], function (Map, rendererJsonUtils, FeatureLayer, SimpleRenderer, SimpleLineSymbol, ArcGisStyleUI) {
	var map, layer, styleUI;

	map = new Map("map", {
		basemap: "hybrid",
		center: [-120.80566406246835, 47.41322033015946],
		zoom: 8,
		showAttribution: true
	});

	var toggleLayer = function () {
		var id = this.value;
		var layer = map.getLayer(id);
		if (!layer) {
			layer = map.getGraphicsLayer(id);
		}
		if (layer) {
			if (this.checked) {
				layer.show();
			} else {
				layer.hide();
			}
		}
	};

	map.on("layer-add", function (evt) {
		var layer = evt.layer;
		var layerList = document.getElementById("layerList");
		var li = document.createElement("li");
		var checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.value = layer.id;
		checkbox.checked = layer.visible;
		checkbox.addEventListener("click", toggleLayer);
		li.appendChild(checkbox);
		li.appendChild(document.createTextNode(layer.title || layer.id));
		li.dataset.layerId = layer.id;
		layerList.insertBefore(li, layerList.firstChild);
	});

	map.on("load", function () {
		layer = new FeatureLayer("http://services.arcgis.com/IYrj3otxNjPsrTRD/ArcGIS/rest/services/WSDOT%20-%20Roadway%20Characteristics/FeatureServer/1", {
			id: "Speed_Limits"
		});
		map.addLayer(layer);

		var setLayerRenderer = function (evt) {
			var renderer = evt.detail;
			renderer = rendererJsonUtils.fromJson(renderer);
			layer.setRenderer(renderer);
			layer.refresh();
		};

		layer.on("load", function () {
			styleUI = new ArcGisStyleUI(JSON.stringify(layer.renderer.toJson()));
			document.querySelector(".toolbar").appendChild(styleUI.form);

			styleUI.form.addEventListener("style-change", setLayerRenderer);

			styleUI.form.addEventListener("style-reset", setLayerRenderer);
		});
	});
});