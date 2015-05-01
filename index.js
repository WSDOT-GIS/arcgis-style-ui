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

	map.on("load", function () {
		layer = new FeatureLayer("http://services.arcgis.com/IYrj3otxNjPsrTRD/ArcGIS/rest/services/WSDOT%20-%20Roadway%20Characteristics/FeatureServer/1");
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