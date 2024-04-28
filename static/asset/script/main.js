"use strict";

import * as Map from './map.js'
import * as Menu from './menu.js'


const applicationPanel = document.querySelector("#applicationPanel");
const screen = document.querySelector("#screen");

let gameData;


screenMainMenu()
screenApplicationPanel()

// Status orb: backend (20,000ms)
backendPing()
setInterval(backendPing, 200000); 


// SCREEN: Redraw
function screenRedraw() {
    if (document.querySelector("#Dynamic")) {
        console.log("info: Redraw triggered, #Dynamic present, removing.");
        document.querySelector("#Dynamic").remove();
    } else {
        console.log("info: Redraw triggered, #Dynamic not present, proceeding.");
    }
}

// SCREEN: Backend Status orb
function screenApplicationPanel() {
    console.log("screen: drawing application panel");

    // Create DOM elements.
    const elementListItem = document.createElement("li");
    elementListItem.setAttribute("id", "BackendStatus");
    
    const elementParagraph = document.createElement("p");
    elementParagraph.textContent = "server status";

    const elementOrb = document.createElement("div");
    elementOrb.setAttribute("id", "elementOrb");

    applicationPanel.appendChild(elementListItem);
    elementListItem.appendChild(elementParagraph);
    elementListItem.appendChild(elementOrb);

    // Add DOM Eeventlisteners.

    // Style DOM elements.
    elementOrb.style.width = '1rem';
    elementOrb.style.height = '1rem';

    elementOrb.style.backgroundColor = 'green';
    elementOrb.style.borderRadius = '0.50rem';
    elementOrb.style.padding = '0';
}

// SCREEN: Main Menu
function screenMainMenu() {
    screenRedraw();
    console.log("screen: drawing main menu");

    // Create DOM elements.
    const elementSection = document.createElement("section");
    elementSection.setAttribute("id", "Dynamic");
    
    const elementHeading = document.createElement("h2");
    elementHeading.textContent = "Päävalikko";

    const elementUnorderedList = document.createElement("ul");
    
    const elementListItem1 = document.createElement("li");
    const elementButton1 = document.createElement("button");
    elementButton1.textContent = "uusi peli";
    elementButton1.setAttribute("class", "ButtonMenuStartNew");
    
    const elementListItem2 = document.createElement("li");
    const elementButton2 = document.createElement("button");
    elementButton2.textContent = "pisteet";
    elementButton2.setAttribute("class", "ButtonMenuStartHiscore");

    screen.appendChild(elementSection);
    elementSection.appendChild(elementHeading);
    elementSection.appendChild(elementUnorderedList);
    
    elementListItem1.appendChild(elementButton1);
    elementUnorderedList.appendChild(elementListItem1);
    
    elementListItem2.appendChild(elementButton2);
    elementUnorderedList.appendChild(elementListItem2);

    // Add DOM Eeventlisteners.
    elementButton1.addEventListener('click', screenPlayerSelection);

    elementButton2.addEventListener('click', () => {console.log("TODO")} );

    // Style DOM elements.
    elementSection.style.zIndex = '1';
    elementSection.style.position = 'absolute';

    elementSection.style.width = '60%';
    elementSection.style.maxWidth = '500px';
    elementSection.style.height = '50%';
    elementSection.style.minHeight = '300px';
    elementSection.style.maxHeight = ' 550px';

    elementSection.style.backgroundColor = 'rgba(48,48,48, 0.80)';
    elementSection.style.color = 'white';
    elementSection.style.borderRadius = '1rem';
    elementSection.style.padding = '1.5rem';

    elementHeading.style.display = 'flex';
    elementHeading.style.justifyContent = 'center';
    elementHeading.style.alignItems = 'center';
    elementHeading.style.height = '5rem';
    elementHeading.style.padding = '0.5rem';
    elementHeading.style.fontSize = '3rem';

    elementUnorderedList.style.display = 'flex';
    elementUnorderedList.style.flexDirection = 'column';
    elementUnorderedList.style.alignItems = 'center';
    elementUnorderedList.style.width = '100%';
    elementUnorderedList.style.height = '100%';
    
    elementButton1.style.width = '12rem';
    elementButton2.style.width = '12rem';
    elementButton1.style.height = '4rem';
    elementButton2.style.height = '4rem';
    elementButton1.style.margin = '0.75rem';
    elementButton2.style.margin = '0.75rem';
}


// SCREEN: Player Selection
function screenPlayerSelection() {
    screenRedraw();
    console.log("screen: drawing player selection");

    // Create DOM elements.
    const elementSection = document.createElement("section");
    elementSection.setAttribute("id", "Dynamic");
    
    const elementHeading = document.createElement("h2");
    elementHeading.textContent = "Liity peliin";

    const elementUnorderedList = document.createElement("ul");
    const elementUnorderedList2 = document.createElement("ul");
    elementUnorderedList2.setAttribute("class", "players");

    const elementListItem1 = document.createElement("li");
    const elementInput = document.createElement("input");
    elementInput.setAttribute("name", "playerName");
    elementInput.setAttribute("class", "FieldSelectionPlayerAdd");
    elementInput.setAttribute("type", "text");

    const elementListItem2 = document.createElement("li");
    const elementButton1 = document.createElement("button");
    elementButton1.textContent = "lisää pelaaja";
    elementButton1.setAttribute("class", "ButtonSelectionPlayerAdd");
    
    const elementListItem3 = document.createElement("li");
    const elementButton2 = document.createElement("button");
    elementButton2.textContent = "aloita peli";
    elementButton2.setAttribute("class", "ButtonSelectionStart");

    const elementListItem4 = document.createElement("li");
    const elementButton3 = document.createElement("button");
    elementButton3.textContent = "palaa valikkoon";
    elementButton3.setAttribute("class", "ButtonSelectionBack");

    screen.appendChild(elementSection);
    elementSection.appendChild(elementHeading);
    elementSection.appendChild(elementUnorderedList);
    
    elementListItem1.appendChild(elementInput);
    elementUnorderedList.appendChild(elementListItem1);

    elementUnorderedList.appendChild(elementUnorderedList2);

    elementListItem2.appendChild(elementButton1);
    elementUnorderedList.appendChild(elementListItem2);

    elementListItem3.appendChild(elementButton2);
    elementUnorderedList.appendChild(elementListItem3);

    elementListItem4.appendChild(elementButton3);
    elementUnorderedList.appendChild(elementListItem4);

    // Add DOM Eeventlisteners.
    document.querySelector(".ButtonSelectionPlayerAdd").addEventListener('click', () => {
        const field = document.querySelector(".FieldSelectionPlayerAdd");
        const playerName = field.value.trim(); // .trim() -> removes leading&trailing whitespaces.
        
        if (playerName == "") {
            console.log("error: field is empty!");
        } else {
            Menu.playerListAddEntry(playerName);
            field.value = "";
        }
    });

    document.querySelector(".ButtonSelectionStart").addEventListener("click", async () => {
        gameData = await Menu.gameStartNew();
        console.log(gameData);
    });
    
    document.querySelector('.ButtonSelectionBack').addEventListener('click', screenMainMenu);

    // Style DOM elements.
    elementSection.style.zIndex = '1';
    elementSection.style.position = 'absolute';

    elementSection.style.width = '90%';
    elementSection.style.height = '90%';

    elementSection.style.backgroundColor = 'rgba(48,48,48, 0.80)';
    elementSection.style.color = 'white';
    elementSection.style.borderRadius = '1rem';
    elementSection.style.padding = '0';

    elementHeading.style.display = 'flex';
    elementHeading.style.justifyContent = 'center';
    elementHeading.style.alignItems = 'center';
    elementHeading.style.height = '5rem';
    elementHeading.style.padding = '0.5rem';
    elementHeading.style.fontSize = '3rem';

    elementUnorderedList.style.display = 'flex';
    elementUnorderedList.style.flexDirection = 'column';
    elementUnorderedList.style.alignItems = 'center';
    elementUnorderedList.style.width = '100%';
    elementUnorderedList.style.height = '100%';
    
    elementButton1.style.width = '12rem';
    elementButton2.style.width = '12rem';
    elementButton1.style.height = '4rem';
    elementButton2.style.height = '4rem';
    elementButton1.style.margin = '0.75rem';
    elementButton2.style.margin = '0.75rem';
}


// SCREEN: Parcel Picking
function screenParcelPicking() {
    screenRedraw();
    console.log("screen: drawing player selection");

    // Create DOM elements.
    const elementSection = document.createElement("section");
    elementSection.setAttribute("id", "Dynamic");
    
    const elementHeading = document.createElement("h2");
    elementHeading.textContent = "Liity peliin";

    const elementUnorderedList = document.createElement("ul");
    const elementListItem1 = document.createElement("li");
    const elementButton1 = document.createElement("button");
    elementButton1.textContent = "aloita vuorosi";
    elementButton1.setAttribute("class", "BLA");

    screen.appendChild(elementSection);
    elementSection.appendChild(elementHeading);
    elementSection.appendChild(elementUnorderedList);
    
    elementListItem1.appendChild(elementButton1);
    elementUnorderedList.appendChild(elementListItem1);

    // Add DOM Eeventlisteners.


    // Style DOM elements.

}
// SCREEN: Parcel Delivery

// SCREEN: Results Screen



async function backendPing() {
    const elementOrb = document.querySelector("#elementOrb");

    try {
        const response = await fetch("http://127.0.0.1:3333/game/ping");
        //console.log(response);
        const backendStatus = response.ok;

        if (backendStatus) {
            elementOrb.style.backgroundColor = "green";
        } else {
            elementOrb.style.backgroundColor = "red";
        }
    } catch (error) {
        console.error("error: ping backend", error);
    }
}


