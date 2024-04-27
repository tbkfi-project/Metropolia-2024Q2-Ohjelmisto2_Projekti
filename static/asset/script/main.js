"use strict";

import * as Map from './map.js'
import * as Screen2 from './screen2.js'

/**
 * Change displayed screen
 * @param {Number} screenID ID of wanted screen. (0 = '#screen1', 1 = '#screen2', 2 = '#screen3')
 */
function changeScreen(screenID) {
    const activeScreens = document.querySelectorAll('.active-screen');
    activeScreens.forEach((screen) => {
        screen.classList.remove('active-screen');
    });

    switch (screenID) {
        case 0:
            document.querySelector('#screen1').classList.add('active-screen');
            break;

        case 1:
            Screen2.clearPlayerList();
            document.querySelector('#screen2').classList.add('active-screen');
            break;

        case 2:
            document.querySelector('#screen3').classList.add('active-screen');
            break;

        default:
            break;
    }
}


/*-----------------*/
/* Event listeners */
/*-----------------*/

document.querySelector('#newgame-button').addEventListener('click', () => {
    changeScreen(1);
});

document.querySelector('#add-new-player').addEventListener('click', () => {
    const playerNameInputField = document.querySelector('#new-player-name-input');
    const newPlayerName = playerNameInputField.value;
    playerNameInputField.value = '';
    Screen2.addNewPlayerToList(newPlayerName);
});

document.querySelector('#delete-player').addEventListener('click', () => {
    Screen2.deletePlayersFromList();
});