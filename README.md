Style UI for ArcGIS feature service
===================================

## Setup ##

Setup required modules using [Bower].

    $ bower install

This project is for designing a UI that will allow the user to change the styling of feature layers in a map.

## Inputs for feature geometry types ##

|         |Point             |Polyline          |Polygon           |
|---------|------------------|------------------|------------------|
|linestyle|:heavy_check_mark:|:heavy_check_mark:|:heavy_check_mark:|
|linecolor|:heavy_check_mark:|:heavy_check_mark:|:heavy_check_mark:|
|linewidth|:heavy_check_mark:|:heavy_check_mark:|:heavy_check_mark:|
|style    |:heavy_check_mark:|                  |:heavy_check_mark:|
|color    |:heavy_check_mark:|                  |:heavy_check_mark:|
|size     |:heavy_check_mark:|                  |                  |

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