"use strict";

import * as Map from './map.js'

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
            document.querySelector('#screen2').classList.add('active-screen');
            break;

        case 2:
            document.querySelector('#screen3').classList.add('active-screen');
            break;

        default:
            break;
    }
}