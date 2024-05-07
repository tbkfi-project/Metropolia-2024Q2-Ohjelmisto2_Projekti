"use strict";

import { uiActiveClear } from './menu.js'

let gameData;
let currentPlayer;
let currentPlayerName;
let parcelSelected = "";


async function turnEnd(currentTurnStart, currentTurnEnd, currentTurnLimit) {
    await new Promise((resolve) => {
        const turnEndTimer = setInterval(() => { // setInterval repeats until 1: parcels selected, 2: time is up. -> ends the player's turn.
            console.log("turn elapsed:", Date.now() - currentTurnStart * 1000)

            // Turn clock
            let timeNow = Math.floor((currentTurnEnd * 1000 - Date.now()) / 1000);
            document.querySelector("#TurnClock").textContent = "Aikaa jäljellä: " + timeNow
            if (timeNow <= 20 && timeNow > 10) {
                document.querySelector("#TurnClock").style.color = "yellow";
            } else if (timeNow <= 10 && timeNow != 0) {
                document.querySelector("#TurnClock").style.color = "red";
            } else if (timeNow == 0) {
                document.querySelector("#TurnClock").style.color = "grey";
            }


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
                gameData["players"][currentPlayer]["gameover"] = true;
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

    alert(currentPlayerName + ", on vuorosi valita paketit!");
    const response = await fetch("http://127.0.0.1:3333/game/start_new_time?seconds=30");
    const responseJSON = await response.json();
    const currentTurnStart = responseJSON["start_time"];
    const currentTurnEnd = responseJSON["end_time"];
    const currentTurnLimit = responseJSON["time_limit"];

    // Create DOM elements.
    const elementSection = document.createElement("section");
    elementSection.setAttribute("id", "uiActive");
    const elementContainer = document.createElement('div');
    elementContainer.classList.add('container');
    const elementHeading1 = document.createElement("h2");
    elementHeading1.textContent = "Valitse pakettisi!";
    const elementHeading2 = document.createElement("h3");
    elementHeading2.textContent = gameData["players"][i]["name"];
    const elementOrderedList = document.createElement("ul");
    elementOrderedList.classList.add('parcel-selection-list');

    // TurnClock
    const elementClock = document.createElement("section");
    elementClock.setAttribute("id", "TurnClock");
    const elementClockText = document.createElement("p");
    elementClockText.textContent = "Aikaa jäljellä: " + currentTurnLimit;

    elementContainer.appendChild(elementHeading1);
    elementContainer.appendChild(elementHeading2);

    elementContainer.appendChild(elementClock);
    elementClock.appendChild(elementClockText);
    elementClock.style.color = "SpringGreen";

    elementContainer.appendChild(elementOrderedList);
    elementSection.appendChild(elementContainer);
    uiInterface.appendChild(elementSection);


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
        elementHeading3.textContent = `${parcelItem}. Paino: ${parcelHeft} kg`;
        const elementParagraph = document.createElement("p");
        elementParagraph.textContent = parcelInfo;

        elementOrderedList.appendChild(elementListItem);
        elementListItem.appendChild(elementHeading3);
        elementListItem.appendChild(elementParagraph);


        // Add DOM EventListeners
        elementListItem.addEventListener("click", parcelSelectListener);    // Each parcel is chosen via this listener!
    }

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
        elementClicked.classList.add('selected-parcel');

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
