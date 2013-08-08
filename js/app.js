$(document).ready(function() {
	var app = new App("Gavin", "Rehkemper");
});

var App = makeClass();
App.prototype.init = function() {
	$("#csvTextArea").click(function(evt) {
		if ($("#csvTextArea").val() === "Put CSV here.") {
			$("#csvTextArea").val("");
		}
	})
	$("#convertButton").click($.proxy(function(evt) {
		var csvObject = CSVToArray($("#csvTextArea").val());
		var util = new Util();

		var latName = util.getColName(csvObject, ['lat', 'Lat', 'LAT', 'latitude', 'Latitude', 'LATITUDE']);
		var lonName = util.getColName(csvObject, ['lng', 'Lng', 'LNG', 'lon', 'Lon', 'LON', 'longitude', 'Longitude', 'LONGITUDE']);
		console.log("latName:", latName);
		console.log("lonName:", lonName);

		var massagedData = util.massageData(csvObject);
		GeoJSON.parse(massagedData, {
			Point: [latName, lonName]
		}, function(geojson) {
			$("#resultTextArea").show();
			
			$("#resultTextArea").val(JSON.stringify(geojson));

			$.ajax({
				url: 'https://api.github.com/gists',
				headers: {
					"User-Agent": "csv-to-geojson",
					"Origin": "http://togeojson.com"
				},
				type: "POST",
				cache: false,
				processData: false,
				data: JSON.stringify({
					"description": "GEOJSON created by http://csv.togeojson.com",
					"public": true,
					"files": {
						"csv-to-geojson.geojson": {
							"content": JSON.stringify(geojson)
						}
					}
				})

			}).done(function(msg) {
				console.log("GIS CREATED:", msg);
				$("#gistLink").attr("href", msg.html_url);
				$("#gistLinkContainer").show();
			});
		});
	}, this));

};

var Util = makeClass();

Util.prototype.massageData = function(data) {
	if (data && data.length > 2) {
		var returnData = [];
		var dataNoHeader = $.extend(true, [], data);
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

Util.prototype.getColName = function(data, possibleColumnNames) {
	if (data && data.length > 2) {
		for (var i = 0; i < data[0].length; i++) {
			if (possibleColumnNames.indexOf(data[0][i]) !== -1) {
				return data[0][i];
			}
		}
		// data[0].forEach(function(columnName) {
		// 	if (possibleColumnNames.indexOf(columnName) !== -1) {
		// 		return columnName;
		// 	}
		// });
	}
}