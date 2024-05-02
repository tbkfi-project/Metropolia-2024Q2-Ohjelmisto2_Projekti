import * as Map from './map.js'

/**
 * Get every parcel location from parcels array
 * @param {Array<Object>} parcels Array of parcel objects 
 * @returns {Array<Array<Number, Number>>} Array of parcel coords
 */
function getPackageLocations(parcels) {
    let parcelLocations = [];
    parcels.forEach(parcel => {
        parcelLocations.push(parcel.location);
    });
    return parcelLocations;
}

/**
 * Start package delivery for player
 * @param {Object} player Player data object
 */
export function start(player) {
    Map.clearMap();
    Map.createPlayerMarker(player.location);

    const packageCoords = getPackageLocations(player.parcels_picked);
    Map.addPackageDeliveryMarkers(packageCoords);
} 