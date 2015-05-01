/*global require*/
require([
	"esri/map",
	"esri/renderers/smartMapping",
	"esri/layers/FeatureLayer",
	"esri/renderers/SimpleRenderer",
	"esri/symbols/SimpleLineSymbol"
], function (Map, smartMapping, FeatureLayer, SimpleRenderer, SimpleLineSymbol) {
	var map, layer;

	map = new Map("map", {
		basemap: "hybrid",
		center: [-120.80566406246835, 47.41322033015946],
		zoom: 8,
		showAttribution: true
	});

	map.on("load", function () {
		layer = new FeatureLayer("http://services.arcgis.com/IYrj3otxNjPsrTRD/ArcGIS/rest/services/WSDOT%20-%20Roadway%20Characteristics/FeatureServer/1");
		map.addLayer(layer);
		document.getElementById("changeStyleButton").disabled = false;
	});

	var form = document.forms.styleForm;


	form.onsubmit = function () {
		var symbol = new SimpleLineSymbol();
		symbol.setColor(this.color.value);
		symbol.setWidth(this.width.value);
		var renderer = new SimpleRenderer(symbol);
		layer.setRenderer(renderer);
		layer.refresh();
		return false;
	};
});