Style UI for ArcGIS feature service
===================================

This project is for designing a UI that will allow the user to change the styling of feature layers in a map.

[Demo](http://wsdot-gis.github.io/arcgis-style-ui/)

## Setup ##

Setup required modules using [Bower]. This will download files from [NPM].

    $ bower install

## Utilized features that may require polyfills ##

This module uses some browser features that are not supported by all browsers.

* CustomEvent
* `<dialog>` element

## Inputs for feature geometry types (Simple Marker/Line/Fill Symbols only) ##

<!-- Table is Github-flavored markdown markup -->

|         |Point             |Polyline          |Polygon           |
|---------|------------------|------------------|------------------|
|linestyle|:heavy_check_mark:|:heavy_check_mark:|:heavy_check_mark:|
|linecolor|:heavy_check_mark:|:heavy_check_mark:|:heavy_check_mark:|
|linewidth|:heavy_check_mark:|:heavy_check_mark:|:heavy_check_mark:|
|style    |:heavy_check_mark:|                  |:heavy_check_mark:|
|color    |:heavy_check_mark:|                  |:heavy_check_mark:|
|size     |:heavy_check_mark:|                  |                  |

### Valid `style` values ###



## Symbols ##

### Simple Line Symbol ###

* style
* color
* width

### Simple Marker Symbol ###

* style
* size
* outline - Line Symbol
    * style
    * color
    * width
* color

### Simple Fill Symbol ###

* style
* outline - Line symbol
    * style
    * color
    * width
* color

[Bower]:http://bower.io
[NPM]:https://www.npmjs.com/