Forked Version of [CSV To GeoJSON](https://github.com/gavreh/csv-to-geojson)
================
This is a fork of [CSV To GeoJSON](https://github.com/gavreh/csv-to-geojson). It has been packaged into a library to ease the integration with other projects. Just grab: 

* [GeoJSON](https://gemnasium.com/npms/geojson) 
* csvToGeoJSON.js in this repo

and you are ready to rock 'n' roll with:

```
csvToGeoJSON(str, [separator, latitudeHeaderList, longitudeHeaderList])
```

Forked CSV To GeoJSON
================

Need to convert some CSV points to GeoJSON? 
This is a simple project that helps you do that: it converts a CSV with latitude/longitude columns into GeoJSON Points. The remaining columns are converted to point properties.

Example/Production site: http://csv.togeojson.com/

How To install?
------
You need
* [GeoJSON](https://gemnasium.com/npms/geojson) 
* csvToGeoJSON.js 

When you have those where in your desired path, just load'em:

```
<script src="js/geojson.min.js"></script>
<script src="js/csvToGeoJSON.js"></script>
```

How do I use?
------

```
csvToGeoJSON(str, [separator, latitudeHeaderList, longitudeHeaderList])
```

* str: is the string containing the csv (format is "header1,header2\nvalue1.1, value2.1\nvalue1.2,value2.2")
* separator (optional, default ","): the csv separator character
* latitudeHeaderList (optional, default ['lat', 'Lat', 'LAT', 'latitude', 'Latitude', 'LATITUDE']): list of the candidates column header to use as latitude. csvToGeoJSON finds the header matching the first list elem. This column's values are used as latitude
* longitudeHeaderList (optional, default ['lng', 'Lng', 'LNG', 'lon', 'Lon', 'LON', 'longitude', 'Longitude', 'LONGITUDE']): list of the candidates column header to use as longitude

Example
------

```
> csvToGeoJSON("Cidade,Elevation,longitude,latitude\nBrasilia,1172,-47.8828,-15.7939\nPorto Alegre,10,-51.2300,-30.0331")
<{"type":"FeatureCollection",
  "features":[
     {"type":"Feature",
      "geometry":{"type":"Point",
                  "coordinates":[-47.8828,-15.7939]},
      "properties":{"Cidade":"Brasilia",
                    "Elevation":"1172"}},
     {"type":"Feature",
      "geometry":{"type":"Point",
                  "coordinates":[-51.23,-30.0331]},
      "properties":{"Cidade":"Porto Alegre",
                    "Elevation":"10"}}]}
```

Credit
------

* Using CSV to JSON function from http://stackoverflow.com/a/1293163/2039 (License http://creativecommons.org/licenses/by-sa/3.0/)
* Using JSON to GeoJSON package from [caseypt](https://github.com/caseypt) https://github.com/caseypt/geojson.js (licnese (c) 2012 Casey Thomas, MIT License)
* Packaging csvToGeoJSON into a library, [vgrocha](https://github.com/vgrocha)

Feedback
--------

File bug reports here on GitHub or contact [Gavin Rehkemper](http://github.com/gavreh) [(gavinrehkemper @ twitter)](http://twitter.com/gavinrehkemper) for anything else.

License
-------
http://creativecommons.org/licenses/by-sa/3.0/
