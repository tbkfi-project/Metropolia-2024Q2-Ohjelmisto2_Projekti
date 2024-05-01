'use strict';

let map;
let playerMarker;
let packageMarkers = [];
let travelLine;
const startLocation = [60.3187626, 24.9655689]; // Helsinki-Vantaa airport

/**
 * Creates and shows new map with player marker
 */
export function show() {
    map = L.map('map').setView(startLocation, 5);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 10,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    playerMarker = L.marker(startLocation).addTo(map);
    playerMarker._icon.classList.add('player-marker'); // Add class that changes marker color from blue to red
    document.querySelector('#map').style.zIndex = '1';
}

/**
 * Changes player marker location on map
 * @param {Array<Number, Number>} location Array with coordinates [Latitude, Longitude]
 */
export function changePlayerMarkerLocation(location) {
    playerMarker.setLatLng(location);
    map.setView(location, 5);

    // Finds marker of the package that the player has flew to and changes it to gray
    packageMarkers.forEach((marker) => {
        const markerCoords = marker.getLatLng();
        if (markerCoords.lat === location[0] && markerCoords.lng === location[1]) {
            marker.setStyle({ color: 'gray' });
            return;
        }
    });

    if (travelLine && map.hasLayer(travelLine)) {
        travelLine.remove();
    }
}

/**
 * Add package delivery markers to coords
 * @param {Array<Array<Number, Number>>} locations Array of coordinate arrays [Latitude, Longitude]
 */
export function addPackageDeliveryMarkers(locations) {
    locations.forEach((location) => {
        const newPackageMarker = L.circleMarker(location, {
            color: 'blue'
        }).addTo(map);

        packageMarkers.push(newPackageMarker);
    });
}

/**
 * Draw travel line between player marker and target.
 * The function will automatically remove existing travel line if one exist.
 * @param {Array<Number, Number>} target Array with coordinates [Latitude, Longitude]
 */
export function showTravelLine(target) {
    // If travel line already exist on the map it will be removed before creating a new one
    if (travelLine && map.hasLayer(travelLine)) {
        travelLine.remove();
    }

    map.setView(target, 3);
    travelLine = L.polyline([playerMarker.getLatLng(), target], { color: 'blue' }).addTo(map);
}