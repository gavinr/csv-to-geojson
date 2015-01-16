// From: http://stackoverflow.com/a/1293163/2039

// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.




//Building a Closure around auxiliary functions
var csvToGeoJSON = function(){
    var getColName = function(data, possibleColumnNames) {
	if (data && data.length > 2) {
		var header=data[0]
		for (var i = 0; i < header.length; i++) {
			if (possibleColumnNames.indexOf(header[i]) !== -1) {
				return data[0][i];
			}
		}
	}
    }

    function CSVToArray(strData, strDelimiter) {
        // Check to see if the delimiter is defined. If not,
        // then default to comma.
        strDelimiter = (strDelimiter || ",");
        
        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp(
            (
                // Delimiters.
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

                // Quoted fields.
                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

                // Standard fields.
                "([^\"\\" + strDelimiter + "\\r\\n]*))"),
            "gi");


        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData = [
            []
        ];

        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches = null;


        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while (arrMatches = objPattern.exec(strData)) {

            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[1];

            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (
                strMatchedDelimiter.length &&
                    (strMatchedDelimiter != strDelimiter)) {

                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push([]);

            }


            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[2]) {

                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                var strMatchedValue = arrMatches[2].replace(
                    new RegExp("\"\"", "g"),
                    "\"");

            } else {

                // We found a non-quoted value.
                var strMatchedValue = arrMatches[3];

            }


            // Now that we have our value string, let's add
            // it to the data array.
            arrData[arrData.length - 1].push(strMatchedValue);
        }

        // Return the parsed data.
        return (arrData);
    }

    //Converts from an array of arrays to an array of map,
    //with the keys as the headers and the values as the csv value
    var massageData = function(data) {
	if (data && data.length > 2) {
	    var returnData = [];
	    var dataNoHeader = data.slice();
	    dataNoHeader.splice(0, 1);
	    dataNoHeader.forEach(function(item) {
		var returnItem = {}, i = 0;
		data[0].forEach(function(columnName) {
		    returnItem[columnName] = item[i];
		    i++;
		}, this);
		returnData.push(returnItem);
	    }, this);
	    return returnData;
	}
	return null;
    };

    //just parses lat/long to number
    var latLonColumnsToNumbers = function(data, latName, lonName) {
	data.forEach(function(item) {
	    if(item.hasOwnProperty(latName)) {
		item[latName] = parseFloat(item[latName]);
	    };
	    if(item.hasOwnProperty(lonName)) {
		item[lonName] = parseFloat(item[lonName]);
	    };
	});
	return data;
    }

    // now the real csvToGeoJSON function:
    return function(str, separator, latitudeHeaderList, longitudeHeaderList){
	var csvObject = CSVToArray(str, separator);
	
	var latName = getColName(csvObject, latitudeHeaderList || 
				 ['lat', 'Lat', 'LAT', 'latitude', 'Latitude', 'LATITUDE']);
	if(!latName) {console.error("Couldn't find Latitude header"); return;}
		
	var lonName = getColName(csvObject, longitudeHeaderList || 
				 ['lng', 'Lng', 'LNG', 'lon', 'Lon', 'LON', 'longitude', 'Longitude', 'LONGITUDE']);
	if(!lonName) {console.error("Couldn't find Longitude header"); return;}
        
	var massagedData = massageData(csvObject);
	// take that data and cast the lat and lon columns to numbers using parseFloat:
	massagedData = latLonColumnsToNumbers(massagedData, latName, lonName);
	
	return GeoJSON.parse(massagedData, {Point: [latName, lonName]});
    }
}();
