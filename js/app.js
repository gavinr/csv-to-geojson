$(document).ready(function() {
	$("#csvTextArea").click(function(evt) {
		if ($("#csvTextArea").val() === "Put CSV here.") {
			$("#csvTextArea").val("");
		}
	})
	
	$("#convertButton").click($.proxy(function(evt) {
			
		var geojson = csvToGeoJSON($("#csvTextArea").val());
		
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
		})
		.done(function(msg) {
			$("#gistLink").attr("href", msg.html_url);
			$("#gistLinkContainer").show();
		});
	
	}, this));
	
});