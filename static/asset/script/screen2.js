'use strict';

let newGamePlayerNamesArray = [];

/**
 * Add new player to the player list
 * @param {String} playerName New player name 
 */
export function addNewPlayerToList(playerName) {
    // If same named player already exists on the array
    if (newGamePlayerNamesArray.includes(playerName)) {
        alert('Pelaaja annetulla nimellä on jo luotu.');
        return;
    }

    const playerUlElement = document.querySelector('#screen2-player-list');
    const newLiElement = document.createElement('li');

    const pElement = document.createElement('p');
    pElement.textContent = playerName;
    newLiElement.appendChild(pElement);

    const checkboxElement = document.createElement('input');
    checkboxElement.type = 'checkbox';
    newLiElement.appendChild(checkboxElement);

    playerUlElement.appendChild(newLiElement);

    newGamePlayerNamesArray.push(playerName);
}

/**
 * Delete checked players from player list
 */
export function deletePlayersFromList() {
    const playersUlElement = document.querySelector('#screen2-player-list');
    const players = playersUlElement.querySelectorAll("li");

    players.forEach((player) => {
        if (player.querySelector('input[type=checkbox]').checked) {
            playersUlElement.removeChild(player);
            const playerName = player.querySelector('p').innerText;
            const playerIndex = newGamePlayerNamesArray.indexOf(playerName);

            if (playerIndex != -1) {
                newGamePlayerNamesArray.splice(playerIndex, 1);
            }
        }
    });
}

/**
 * Clear player list
 */
export function clearPlayerList() {
    const playersUlElement = document.querySelector('#screen2-player-list');
    playersUlElement.innerHTML = '';
    newGamePlayerNamesArray = [];
}
