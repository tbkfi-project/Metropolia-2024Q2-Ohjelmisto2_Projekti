'use strict';

import { versionNumber } from './main.js'

import * as Delivery from './packageDelivery.js'
import * as Selection from './packageSelection.js'
//import * as Results from './packageResults.js'

const players = [];
let gameData;


// UI: Clear active UI element
export function uiActiveClear() {
    if (document.querySelector("#uiActive")) {
        console.log("ui: Clearing uiActive element.");
        document.querySelector("#uiActive").remove();
    }
}

// UI: applicationPanel
export function uiPanel() {
    // Create DOM elements.
    const applicationPanelList = document.createElement("ul");
    applicationPanelList.setAttribute("id", "applicationPanelList");

    applicationPanel.appendChild(applicationPanelList);


    const elementListItem1 = document.createElement("li");
    elementListItem1.setAttribute("id", "GameLogo");
    const elementListItem1Img = document.createElement("img");
    elementListItem1Img.setAttribute("src", "/some/image.avif");
    elementListItem1Img.setAttribute("alt", "Pakettipilotti logo image.");

    elementListItem1.appendChild(elementListItem1Img);
    applicationPanelList.appendChild(elementListItem1);


    const elementListItem2 = document.createElement("li");
    elementListItem2.setAttribute("id", "GameName");
    const elementListItem2Paragraph = document.createElement("p");
    elementListItem2Paragraph.textContent = "Pakettipilotti";

    elementListItem2.appendChild(elementListItem2Paragraph);
    applicationPanelList.appendChild(elementListItem2);


    const elementListItem3 = document.createElement("li");
    elementListItem3.setAttribute("id", "GameVersion");
    const elementListItem3Paragraph = document.createElement("p");
    elementListItem3Paragraph.textContent = `${versionNumber}`;

    elementListItem3.appendChild(elementListItem3Paragraph);
    applicationPanelList.appendChild(elementListItem3);


    const elementListItem4 = document.createElement("li");
    elementListItem4.setAttribute("id", "BackendStatus");
    const elementListItem4Paragraph = document.createElement("p");
    elementListItem4Paragraph.textContent = "backend status";
    const elementListItem4Div = document.createElement("div");
    elementListItem4Div.setAttribute("id", "backendStatusOrb");

    elementListItem4.appendChild(elementListItem4Paragraph);
    elementListItem4.appendChild(elementListItem4Div);
    applicationPanelList.appendChild(elementListItem4);

    // Add DOM Eeventlisteners.


    // Style DOM elements.
    Object.assign(backendStatusOrb.style, {
        width: '1rem',
        height: '1rem',
        backgroundColor: 'green',
        borderRadius: '0.50rem',
        padding: '0'
    });
}

// UI: Main Menu
export function uiMainMenu() {
    uiActiveClear();

    // Create DOM elements.
    const elementSection = document.createElement("section");
    elementSection.setAttribute("id", "uiActive");
    const elementSectionHeading = document.createElement("h2");
    elementSectionHeading.textContent = "Päävalikko";
    const elementSectionUnorderedList = document.createElement("ul");

    elementSection.appendChild(elementSectionHeading);
    elementSection.appendChild(elementSectionUnorderedList);
    uiInterface.appendChild(elementSection);


    const elementListItem1 = document.createElement("li");
    const elementButton1 = document.createElement("button");
    elementButton1.textContent = "uusi peli";
    elementButton1.setAttribute("class", "ButtonMenuStartNew");

    elementListItem1.appendChild(elementButton1);
    elementSectionUnorderedList.appendChild(elementListItem1);


    const elementListItem2 = document.createElement("li");
    const elementButton2 = document.createElement("button");
    elementButton2.textContent = "pisteet";
    elementButton2.setAttribute("class", "ButtonMenuStartHiscore");

    elementListItem2.appendChild(elementButton2);
    elementSectionUnorderedList.appendChild(elementListItem2);

    // Add DOM Eeventlisteners.
    elementButton1.addEventListener('click', uiPlayerSelection);
    elementButton2.addEventListener('click', uiHiscores);

    // Style DOM elements.
    Object.assign(elementSection.style, {
        zIndex: '1',
        position: 'absolute',
        width: '60%',
        maxWidth: '500px',
        height: '50%',
        minHeight: '300px',
        maxHeight: '550px',
        backgroundColor: 'rgba(48,48,48,0.80)',
        color: 'white',
        borderRadius: '1rem',
        padding: '1.5rem'
    });

    Object.assign(elementSectionHeading.style, {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '5rem',
        padding: '0.5rem',
        fontSize: '3rem'
    });

    Object.assign(elementSectionUnorderedList.style, {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        height: '100%'
    });

    Object.assign(elementButton1.style, {
        width: '12rem',
        height: '4rem',
        margin: '0.75rem'
    });

    Object.assign(elementButton2.style, {
        width: '12rem',
        height: '4rem',
        margin: '0.75rem'
    });
}

// UI: Hiscores
async function uiHiscores() {
    uiActiveClear();
    const response = await fetch("http://127.0.0.1:3333/game/highscores");
    const responseJSON = await response.json();
    console.log(responseJSON["highscores"]);

    // Create DOM elements.
    const elementSection = document.createElement("section");
    elementSection.setAttribute("id", "uiActive");
    const elementHeading = document.createElement("h2");
    elementHeading.textContent = "Hiscores";
    const elementTable = document.createElement("table");
    const elementTableRow = document.createElement("tr");
    const elementTableHeader1 = document.createElement("th");
    elementTableHeader1.textContent = "sija";
    const elementTableHeader2 = document.createElement("th");
    elementTableHeader2.textContent = "nimimerkki";
    const elementTableHeader3 = document.createElement("th");
    elementTableHeader3.textContent = "pisteet";
    const elementTableHeader4 = document.createElement("th");
    elementTableHeader4.textContent = "sessio";
    const elementButton = document.createElement("button");
    elementButton.textContent = "palaa valikkoon";

    uiInterface.appendChild(elementSection);
    elementSection.appendChild(elementHeading);
    elementSection.appendChild(elementTable);
    elementTable.appendChild(elementTableRow);
    elementTableRow.appendChild(elementTableHeader1);
    elementTableRow.appendChild(elementTableHeader2);
    elementTableRow.appendChild(elementTableHeader3);
    elementTableRow.appendChild(elementTableHeader4);
    elementSection.appendChild(elementButton);


    for (let s = 0; s < responseJSON["highscores"].length; s++) {
        const elementTableRowPlayer = document.createElement("tr");
        const elementTableData1 = document.createElement("td");
        elementTableData1.textContent = s + 1;
        const elementTableData2 = document.createElement("td");
        elementTableData2.textContent = responseJSON["highscores"][s]["name"];
        const elementTableData3 = document.createElement("td");
        elementTableData3.textContent = responseJSON["highscores"][s]["score"];
        const elementTableData4 = document.createElement("td");
        elementTableData4.textContent = responseJSON["highscores"][s]["gameID"];

        elementTable.appendChild(elementTableRowPlayer);
        elementTableRowPlayer.appendChild(elementTableData1);
        elementTableRowPlayer.appendChild(elementTableData2);
        elementTableRowPlayer.appendChild(elementTableData3);
        elementTableRowPlayer.appendChild(elementTableData4);
    }

    // Add DOM Event Listeners
    elementButton.addEventListener("click", () => {
        uiMainMenu();
    });

    // Style DOM elements
    Object.assign(elementSection.style, {
        zIndex: '1',
        position: 'absolute',
        color: 'white',
    });

}

// UI: Player selection
export function uiPlayerSelection() {
    uiActiveClear();

    // Create DOM elements.
    const elementSection = document.createElement("section");
    elementSection.setAttribute("id", "uiActive");
    const elementHeading1 = document.createElement("h2");
    elementHeading1.textContent = "Liity peliin";
    const elementUnorderedList1 = document.createElement("ul");

    elementSection.appendChild(elementHeading1);
    uiInterface.appendChild(elementSection);
    elementSection.appendChild(elementUnorderedList1);


    const elementListItem1 = document.createElement("li");
    const elementInput = document.createElement("input");
    elementInput.setAttribute("name", "playerName");
    elementInput.setAttribute("class", "FieldSelectionPlayerAdd");
    elementInput.setAttribute("type", "text");

    elementListItem1.appendChild(elementInput);
    elementUnorderedList1.appendChild(elementListItem1);


    const elementListItem2 = document.createElement("li");
    const elementButton1 = document.createElement("button");
    elementButton1.textContent = "lisää pelaaja";
    elementButton1.setAttribute("class", "ButtonSelectionPlayerAdd");

    elementListItem2.appendChild(elementButton1);
    elementUnorderedList1.appendChild(elementListItem2);


    const elementListItem3 = document.createElement("li");
    const elementButton2 = document.createElement("button");
    elementButton2.textContent = "aloita peli";
    elementButton2.setAttribute("class", "ButtonSelectionStartGame");

    elementListItem3.appendChild(elementButton2);
    elementUnorderedList1.appendChild(elementListItem3);


    const elementListItem4 = document.createElement("li");
    const elementButton3 = document.createElement("button");
    elementButton3.textContent = "palaa valikkoon";
    elementButton3.setAttribute("class", "ButtonSelectionBack");

    elementListItem4.appendChild(elementButton3);
    elementUnorderedList1.appendChild(elementListItem4);


    const elementUnorderedList2 = document.createElement("ul");
    const elementHeading2 = document.createElement("h3");
    elementHeading2.textContent = "Pelaajalista";

    elementUnorderedList2.setAttribute("class", "players");
    elementSection.appendChild(elementUnorderedList2);

    // Add DOM Eeventlisteners.
    document.querySelector(".ButtonSelectionPlayerAdd").addEventListener('click', () => {
        const field = document.querySelector(".FieldSelectionPlayerAdd");
        const playerName = field.value.trim(); // .trim() -> removes leading & trailing whitespaces.

        if (playerName == "") {
            console.log("error: field is empty!");
        } else {
            playerListAddEntry(playerName);
            field.value = "";
        }
    });

    document.querySelector(".ButtonSelectionStartGame").addEventListener("click", async () => {
        try {
            gameData = await gameStartNew(players);

            // GAME PHASE 1: PARCEL SELECTION
            for (let i = 0; i < gameData["players"].length; i++) {
                await Selection.turnStart(gameData, i);
                alert("Vuorosi on päättynyt!");
            }
            // GAME PHASE 2: PARCEL DELIVERY
            Delivery.startMultiplayer(gameData.players);
            
            // GAME PHASE 3: PARCEL RESULTS
            
        } catch (error) {
            console.log(error);
        }
    });

    document.querySelector('.ButtonSelectionBack').addEventListener('click', () => {
        players.splice(0); // clear <players> before navigating back.
        uiMainMenu();
    });

    // Style DOM elements.
    Object.assign(elementSection.style, {
        zIndex: '1',
        position: 'absolute',
        width: '90%',
        height: '90%',
        backgroundColor: 'rgba(48,48,48,0.80)',
        color: 'white',
        borderRadius: '1rem',
        padding: '0'
    });

    Object.assign(elementHeading1.style, {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '5rem',
        padding: '0.5rem',
        fontSize: '3rem'
    });

    Object.assign(elementHeading2.style, {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '5rem',
        padding: '0.5rem',
        fontSize: '3rem'
    });

    Object.assign(elementUnorderedList1.style, {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        height: 'auto'
    });

    Object.assign(elementButton1.style, {
        width: '12rem',
        height: '4rem',
        margin: '0.75rem'
    });

    Object.assign(elementButton2.style, {
        width: '12rem',
        height: '4rem',
        margin: '0.75rem'
    });

    Object.assign(elementUnorderedList2.style, {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        height: 'auto'
    });
}

// UI: Player selection (add player)
export function playerListAddEntry(playerName) {
	const playerList = document.querySelector('.players');

    if (players.includes(playerName)) {
    	console.log(`error: player "${playerName}" already in list.`);
        alert('Nimimerkki on jo käytössä!');
        return false;
    } else {
		const elementListItem = document.createElement("li");
		elementListItem.setAttribute("id", playerName);
		
		const elementParagraph = document.createElement("p");
		elementParagraph.textContent = playerName
		
		const elementButton = document.createElement("button");
		elementButton.setAttribute("class", "playersRemove");
		elementButton.setAttribute("value", playerName);
		elementButton.textContent = "del";

        elementButton.addEventListener("click", () => {
    		playerListRemoveEntry(elementButton.value);
		});

        elementListItem.appendChild(elementParagraph);
        elementListItem.appendChild(elementButton);
        playerList.appendChild(elementListItem);
        
        players.push(playerName);
		console.log(`success: added ${playerName} to list.`, players);
		return true;
    }
}

// UI: Player selection (remove player)
export function playerListRemoveEntry(playerName) {
	const playerList = document.querySelector('.players');
	const target = playerList.querySelector(`#${playerName}`);

    if (!players.includes(playerName)) {
    	console.log(`error: player "${playerName}" not in list.`);
        return false;
    } else {
    	const playerNameIndex = players.indexOf(playerName);
    	if (playerNameIndex != -1) {
    		players.splice(playerNameIndex, 1);
    	}
    
        playerList.removeChild(target)
        console.log(`success: removed ${playerName} from list.`);
	    return true;
    }
}

export async function gameStartNew(playerList) {
    try {
        console.log("players (array):", playerList);
        const playersString = playerList.join(',');
        console.log("players (string):", playersString);
        const data = encodeURIComponent(playersString);
        console.log("data (tx):", data);
        
        const response = await fetch(`http://127.0.0.1:3333/game/new?players=${data}`);
        console.log("data (rx):", response);
        const responseJSON = await response.json();
        console.log("data (rx):", responseJSON);
        return responseJSON;
    } catch (error) {
        console.log(error);
    }
}

// UI: Results Screen
async function uiResultScreen() {
    uiActiveClear();
    const response = await fetch("");
    const responseJSON = await response.json();

    // Create DOM elements.
    const elementSection = document.createElement("section");
    elementSection.setAttribute("id", "uiActive");
    const elementHeading = document.createElement("h2");
    elementHeading.textContent = "Pisteet";
    const elementTable = document.createElement("table");
    const elementTableRow = document.createElement("tr");
    const elementTableHeader1 = document.createElement("th");
    elementTableHeader1.textContent = "nimimerkki";
    const elementTableHeader2 = document.createElement("th");
    elementTableHeader2.textContent = "pisteet";
    const elementButton = document.createElement("button");
    elementButton.textContent = "palaa alkuun";

    uiInterface.appendChild(elementSection);
    elementSection.appendChild(elementHeading);
    elementSection.appendChild(elementTable);
    elementSection.appendChild(elementButton);


    for (let s = 0; s < responseJSON["players"].length; s++) {
        const elementTableRowPlayer = document.createElement("tr");
        const elementTableData1 = document.createElement("td");
        elementTableData1.textContent = responseJSON["players"][s]["name"];
        const elementTableData2 = document.createElement("td");
        elementTableData2.textContent = responseJSON["players"][s]["score"];

        elementTable.appendChild(elementTableRowPlayer);
        elementTableRowPlayer.appendChild(elementTableData1);
        elementTableRowPlayer.appendChild(elementTableData2);
        elementTableRowPlayer.appendChild(elementTableData3);
    }

    // Add DOM Event Listeners
    elementButton.addEventListener("click", () => {
        uiMainMenu();
    });

    // Style DOM elements
    Object.assign(elementSection.style, {
        zIndex: '1',
        position: 'absolute',
        color: 'white',
    });
}
