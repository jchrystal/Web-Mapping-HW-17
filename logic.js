// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

var earthquakes;

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h2>Magnitude: " + feature.properties.mag + "</h2><hr><h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  
    function getColor(d) {
        return d > 5 ? '#f44141' :
            d > 4  ? '#f48241' :
            d > 3  ? '#f4a941' :
            d > 2  ? '#f4cd41' :
            d > 1   ? '#dff441' :
            d > 0   ? '#a1f442' :
                        '#FFEDA0';
    }

    earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
        var geojsonMarkerOptions = {
            radius: feature.properties.mag*10,
            fillColor: getColor(feature.properties.mag),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8};
        return L.circleMarker(latlng, geojsonMarkerOptions);
    }});

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoidHJhdmlzZG9lc21hdGgiLCJhIjoiY2poOWNrYjRkMDQ2ejM3cGV1d2xqa2IyeCJ9.34tYWBvPBM_h8_YS3Z7__Q"
    );

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoidHJhdmlzZG9lc21hdGgiLCJhIjoiY2poOWNrYjRkMDQ2ejM3cGV1d2xqa2IyeCJ9.34tYWBvPBM_h8_YS3Z7__Q"
    );

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
    Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
    center: [
        37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
    }).addTo(myMap);  

    function getColor(d) {
        return d > 5 ? '#f44141' :
            d > 4  ? '#f48241' :
            d > 3  ? '#f4a941' :
            d > 2  ? '#f4cd41' :
            d > 1   ? '#dff441' :
            d > 0   ? '#a1f442' :
                        '#FFEDA0';
    }

    // Setting up the legend
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
    
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1, 2, 3, 4, 5]
            labels = [];
    
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
    
        return div;
    };
    
    legend.addTo(myMap);


}
