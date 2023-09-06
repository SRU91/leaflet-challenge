const earthquakeDataURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
const mapContainer = L.map("map", {
  center: [37, -118],
  zoom: 6
});

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(mapContainer);

// Sets color based on depth
function depthColor(depth) {
  if (depth < 10) {
    return "#00FF00"; // Green
  } else if (depth < 30) {
    return "#FFFF00"; // Yellow
  } else if (depth < 50) {
    return "#FFA500"; // Orange
  } else {
    return "#FF0000"; // Red
  }
}

// Creates a legend
const legendControl = L.control({
  position: "bottomright"
});
legendControl.onAdd = function () {
  const legendDiv = L.DomUtil.create("div", "info legend");
  const depths = [-10, 10, 30, 50];
  for (let i = 0; i < depths.length; i++) {
    legendDiv.innerHTML +=
      '<i style="background:' + depthColor(depths[i] + 1) + '"></i> ' +
      depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
  }
  return legendDiv;
};
legendControl.addTo(mapContainer);

// Requests JSON data & places circle marker where earthquake has occurred
fetch(earthquakeDataURL)
  .then((response) => response.json())
  .then((data) => {
    L.geoJSON(data.features, {
      pointToLayer: function (feature, latlng) {
        const magnitude = feature.properties.mag;
        const depth = feature.geometry.coordinates[2];
        const location = feature.properties.place;

        const markerOptions = {
          radius: magnitude * 3,
          fillColor: depthColor(depth),
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8,
        };

        const marker = L.circleMarker(latlng, markerOptions)
          .bindPopup(`<strong>Location:</strong> ${location}<br><strong>Magnitude:</strong> ${magnitude}<br><strong>Depth:</strong> ${depth}`)
          .addTo(mapContainer);
      }
    });
  });
