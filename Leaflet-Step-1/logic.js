var quake_url ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson"; 


d3.json(quake_url).then(function(data){
    console.log(data)

    createFeatures(data.features); 
}); 
   // bindind the place and the data 
  function createFeatures(earthquakedata)  {
   
    function onEachFeature(feature, layer){
        layer.bindPopup("<h3>" + feature.properties.place + "</h3>"+  new Date(feature.properties.time)+ "<p>" + "Magnitude: " + feature.properties.mag); 
    }

    function getcolor(feature){
        if (feature.geometry.coordinates[2]> 90) 
            return "red"
        else if (feature.geometry.coordinates[2]> 70)
            return "orange"
        else if (feature.geometry.coordinates[2]> 50)
            return "yellow"
        else if (feature.geometry.coordinates[2] > 30)
            return "green"
        else if (feature.geometry.coordinates[2] > 10)
            return "blue"
        else return "purple"
        
    }
    var earthquakes = L.geoJSON(earthquakedata, {
        
        pointToLayer: function(feature, latlng){

            return L.circleMarker(latlng)
        }, 
        style: function(feature){
            return {
               // radius: feature.geometry.coordinates[2]
               radius: feature.properties.mag*4,
               opacity: 1, 
               fillOpacity: 1, 
               fillColor: getcolor(feature), 
               color: "white", 
               weight: 0.3
            
            } 
        },

        onEachFeature: onEachFeature }); 
        
    createMap(earthquakes)
}; 

function createMap(earthquakes){ 
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 15,
  zoomOffset: -1,
  id: "mapbox/satellite-streets-v11",
  accessToken: API_KEY
});


var baseMaps = {
    "Base Map": streetmap,
    
  };
  
  var overlayMaps = {
    "Earthquakes": earthquakes
  }; 
    
  
  // Creating map object
  var myMap = L.map("map", {
    
    center: [30, -60],
    zoom: 3, 
    layers: [streetmap, earthquakes]
  }); 
  

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          grades = [-10, 10, 30, 50, 70, 90],
          colors = ["purple", "blue", "green", "yellow", "orange", "red"];
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + colors[i] + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
  
  legend.addTo(myMap);



} ; 

