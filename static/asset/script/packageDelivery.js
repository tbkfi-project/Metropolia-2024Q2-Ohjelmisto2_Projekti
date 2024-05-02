import * as Map from './map.js'

export function start(player) {
    Map.clearMap();
    Map.createPlayerMarker(player.location);
} 