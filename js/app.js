/*global Papa, GeoJSON, L */
var csvTextArea = document.getElementById('csvTextArea');
var csvInputForm = document.getElementById('csvInputForm');
var resultTextArea = document.getElementById('resultTextArea');
// var gistLink = document.getElementById("gistLink");
// var gistLinkContainer = document.getElementById("gistLinkContainer");
var pretty = document.getElementById('pretty');
var layer = null;

const map = L.map('leafletMap', {
  center: [47.41322, -1.219482],
  zoom: 8
});
L.esri.basemapLayer('Topographic').addTo(map);

csvInputForm.addEventListener('submit', function (evt) {
  evt.preventDefault();

  var csvObject = Papa.parse(csvTextArea.value.trim(), { dynamicTyping: true }).data;
  var latName = getColName(csvObject, ['lat', 'Lat', 'LAT', 'latitude', 'Latitude', 'LATITUDE']);
  var lonName = getColName(csvObject, [
    'lng',
    'Lng',
    'LNG',
    'lon',
    'Lon',
    'LON',
    'longitude',
    'Longitude',
    'LONGITUDE',
  ]);

  GeoJSON.parse(
    latLonColumnsToNumbers(massageData(csvObject), latName, lonName),
    {
      Point: [latName, lonName],
    },
    function (geojson) {
      var result = JSON.stringify(geojson, null, pretty.checked ? 2 : undefined);
      resultTextArea.value = result;
      document.querySelectorAll('.invisible').forEach((el) => {
        el.classList.remove('invisible');
      });
      addGeoJSONData(geojson,map);

      // post(uncache('https://api.github.com/gists'), true)
      //   .data({
      //     'description': 'GEOJSON created by http://csv.togeojson.com',
      //     'public': true,
      //     'files': {
      //       'csv-to-geojson.geojson': {
      //         'content': result
      //       }
      //     }
      //   })
      //   .done(function(msg) {
      //     gistLink.setAttribute('href', msg.html_url);
      //     gistLinkContainer.style.display = '';
      //   });
    }
  );
});

function massageData(data) {
  if (!data || !data.length) return null;
  var firstRow = data[0];
  var map = data.map(function (item) {
    var returnItem = {},
      i = 0;
    firstRow.forEach(function (columnName) {
      returnItem[columnName] = item[i++];
    });
    return returnItem;
  });
  //get rid of header
  map.shift();
  return map;
}

function latLonColumnsToNumbers(data, latName, lonName) {
  return data.map(function (item) {
    if (Object.hasOwn(item,'latname')) {
      item[latName] = parseFloat(item[latName]);
    }
    if (Object.hasOwn(item,'lonName')) {
      item[lonName] = parseFloat(item[lonName]);
    }
    return item;
  });
}

function getColName(data, possibleColumnNames) {
  if (!data || !data.length) return null;
  for (var i = 0; i < data[0].length; i++) {
    if (possibleColumnNames.indexOf(data[0][i]) !== -1) {
      return data[0][i];
    }
  }
  return null;
}

// function post(url) {
//   var request = new XMLHttpRequest();
//   request.open('POST', url, true);
//   request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
//   return {
//     data: function(data) {
//       request.send(JSON.stringify(data));
//       return this;
//     },
//     done: function(done) {
//       request.onload = function() {
//         done(request.responseText);
//       };
//       return this;
//     }
//   };
// }

// function uncache(url) {
//   return url + (url.match(/[?]/) ? '&' : '?') + '_now=' + Date.now();
// }
function addGeoJSONData(geojsonData, mapObject) {
  if (layer){
    mapObject.removeLayer(layer);
  }
  layer = L.geoJSON(geojsonData, {
    onEachFeature: function (feature, layer) {
      let popupString = '';
      for (let key in feature.properties) {
        popupString = `${popupString}<strong>${key}</strong>: ${feature.properties[key]}<br />`;
      }
      layer.bindPopup(popupString);
    },
  });
  mapObject.fitBounds(layer.getBounds());
  layer.addTo(mapObject);
}