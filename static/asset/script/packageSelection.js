"use strict";

import { uiActiveClear } from './menu.js'

let gameData;
let currentPlayer;
let currentPlayerName;
let parcelSelected = "";


async function turnEnd(currentTurnStart, currentTurnEnd, currentTurnLimit) {
    await new Promise( (resolve) => {
        const turnEndTimer = setInterval( () => { // setInterval repeats until 1: parcels selected, 2: time is up. -> ends the player's turn.
            console.log("turn elapsed:", Date.now() - currentTurnStart * 1000)

            if (parcelSelected.length === 5) {
                clearInterval(turnEndTimer);
                parcelSelected = ""
                uiActiveClear();
                
                resolve();
            } else if (Date.now() - currentTurnStart * 1000 > currentTurnLimit * 1000) {
                clearInterval(turnEndTimer);
                parcelSelected = ""
                uiActiveClear();
                
                const response = fetch(`http://127.0.0.1:3333/game/game_over?player=${gameData["players"][currentPlayer]["name"]}`);
                console.log("gameover", response);
                
                resolve();
            }
        }, 1000);
    });
}

export async function turnStart(data, i) {
    uiActiveClear();
    gameData = data;
    currentPlayer = i;
    currentPlayerName = gameData["players"][i]["name"];
    
    alert(currentPlayerName + ", vuorosi on alkamassa!");
    const response = await fetch("http://127.0.0.1:3333/game/start_new_time?seconds=30");
    const responseJSON = await response.json();
    const currentTurnStart = responseJSON["start_time"];
    const currentTurnEnd = responseJSON["end_time"];
    const currentTurnLimit = responseJSON["time_limit"];

    // Create DOM elements.
    const elementSection = document.createElement("section");
    elementSection.setAttribute("id", "uiActive");
    const elementHeading1 = document.createElement("h2");
    elementHeading1.textContent = "Valitse pakettisi!";
    const elementHeading2 = document.createElement("h3");
    elementHeading2.textContent = gameData["players"][i]["name"];
    const elementOrderedList = document.createElement("ul");

    uiInterface.appendChild(elementSection);
    elementSection.appendChild(elementHeading1);
    elementSection.appendChild(elementHeading2);
    elementSection.appendChild(elementOrderedList);


    for (let p = 0; p < gameData["parcels"].length; p++) {
        const parcelItem = gameData["parcels"][p]["item"];
        const parcelHeft = gameData["parcels"][p]["heft"];
        const parcelInfo = gameData["parcels"][p]["info"];
        //console.log(parcelInfo);
        //console.log(parcelHeft);
        //console.log(parcelItem);

        const elementListItem = document.createElement("li");
        elementListItem.setAttribute("id", p);
        const elementHeading3 = document.createElement("h4");
        elementHeading3.textContent = `${parcelItem}: ${parcelHeft}`;
        const elementParagraph = document.createElement("p");
        elementParagraph.textContent = parcelInfo;

        elementOrderedList.appendChild(elementListItem);
        elementListItem.appendChild(elementHeading3);
        elementListItem.appendChild(elementParagraph);


        // Add DOM EventListeners
        elementListItem.addEventListener("click", parcelSelectListener);    // Each parcel is chosen via this listener!
    }

    // Style DOM elements
    Object.assign(elementSection.style, {
        zIndex: '1',
        position: 'absolute',
        color: 'white',
    });

    // Wait for turn to be over
    await turnEnd(currentTurnStart, currentTurnEnd, currentTurnLimit);
}

async function parcelSelectListener(event) {
    const elementClicked = document.getElementById(this.id);
    elementClicked.removeEventListener("click", parcelSelectListener); // Remove the event listener from the clicked element

    if (parcelSelected.length < 5) { // dont add more than what is wanted
        parcelSelected += this.id;
        console.log(`${gameData["players"][currentPlayer]["name"]} added index ${this.id} to parcels:`, parcelSelected, parcelSelected.length);

        // Style DOM elements (after entry has been selected by player!)
        Object.assign(elementClicked.style, {
            color: 'red',
        });

        if (parcelSelected.length === 5) { // If all 5 parcels selected, notify backend.
            try {
                const response = await fetch(`http://127.0.0.1:3333/game/parcel_select?player=${gameData["players"][currentPlayer]["name"]}&indexes=${parcelSelected}`);
                console.log(response);
            } catch (error) {
                console.error("error: parcel selection", error);
            }
        }
    };
}
