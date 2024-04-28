"use strict";

import * as Map from './map.js'
import * as Menu from './menu.js'



/*	LOCATION			NAME					INFO
 *	menu-main			new game				changes menu panel into "selection", where players are added.
 *	menu-main			hiscore					changes menu panel into "hiscores", where past leaderboard scores can be viewed.
 *
 *	menu-selection		add player				enables the button which adds a player to the <players> list.
 *	!menu-selection		start game				enables the button which starts the new game for <players>.
 *	!menu-selection		back					enables the button which goes back to main menu.
 *
 *  !menu-play           next player turn        enables the button which begins the next player's turn.
 *  !menu-play           select parcel           enables the buttons for each parcel option to add them to their delivery list. 
 *  !menu-play           deliver parcel          enables the buttons for each deliverable parcel (also includes transport method listeners!)
 *  
 *
 *
*/


const menuStart = document.querySelector("#menuStart");
const menuSelection = document.querySelector("#menuSelection");
const menuPlay = document.querySelector("#menuPlay");


// MENU, MAIN: NEW GAME
document.querySelector('.ButtonMenuStartNew').addEventListener('click', () => {
    menuStart.setAttribute("hidden", "");
    menuSelection.removeAttribute("hidden");
});

// MENU, MAIN: HISCORE


// MENU, SELECTION: ADD PLAYER
document.querySelector(".ButtonSelectionPlayerAdd").addEventListener('click', () => {
    const field = document.querySelector(".FieldSelectionPlayerAdd");
    const playerName = field.value.trim(); // .trim() -> removes leading&trailing whitespaces.
    
    if (playerName == "") {
        console.log("error: field is empty!");
        return false;
    } else {
        Menu.playersAdd(playerName);
        field.value = "";
        return true;
    }
});

// MENU, SELECTION: START GAME

// MENU, SELECTION: BACK
document.querySelector('.ButtonSelectionBack').addEventListener('click', () => {
    menuSelection.setAttribute("hidden", "");
    menuStart.removeAttribute("hidden");
});

