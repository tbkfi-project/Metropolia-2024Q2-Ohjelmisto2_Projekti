'use strict';

import { versionNumber } from './main.js'

import * as Delivery from './packageDelivery.js'
import * as Selection from './packageSelection.js'

let players = [];
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
    elementListItem1Img.setAttribute("src", "/static/asset/parcel.png");
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
    elementListItem3Paragraph.textContent = `version: ${versionNumber}`;

    elementListItem3.appendChild(elementListItem3Paragraph);
    applicationPanelList.appendChild(elementListItem3);


    const elementListItem4 = document.createElement("li");
    elementListItem4.setAttribute("id", "BackendStatus");
    const elementListItem4Paragraph = document.createElement("p");
    elementListItem4Paragraph.innerHTML = "backend status: <span style='color: SpringGreen;'>unknown</span>";
    elementListItem4Paragraph.setAttribute("id", "backendStatusOrb");

    elementListItem4.appendChild(elementListItem4Paragraph);
    applicationPanelList.appendChild(elementListItem4);

    // Add DOM Eeventlisteners.

    // Style DOM elements.
    elementListItem1Img.style.maxHeight = '2rem';
}

// UI: Main Menu
export function uiMainMenu() {
    uiActiveClear();

    // Create DOM elements.
    const elementSection = document.createElement("section");
    elementSection.setAttribute("id", "uiActive");
    const elementContainer = document.createElement('div');
    elementContainer.classList.add('container');
    const elementSectionHeading = document.createElement("h2");
    elementSectionHeading.textContent = "Päävalikko";
    const elementSectionUnorderedList = document.createElement("ul");
    elementSectionUnorderedList.classList.add('main-button-list')

    elementContainer.appendChild(elementSectionHeading);
    elementContainer.appendChild(elementSectionUnorderedList);
    elementSection.appendChild(elementContainer)
    uiInterface.appendChild(elementSection);


    const elementListItem1 = document.createElement("li");
    const elementButton1 = document.createElement("button");
    elementButton1.textContent = "Uusi peli";
    elementButton1.setAttribute("class", "ButtonMenuStartNew");

    elementListItem1.appendChild(elementButton1);
    elementSectionUnorderedList.appendChild(elementListItem1);


    const elementListItem2 = document.createElement("li");
    const elementButton2 = document.createElement("button");
    elementButton2.textContent = "Pisteet";
    elementButton2.setAttribute("class", "ButtonMenuStartHiscore");

    elementListItem2.appendChild(elementButton2);
    elementSectionUnorderedList.appendChild(elementListItem2);

    // Add DOM Eeventlisteners.
    elementButton1.addEventListener('click', uiPlayerSelection);
    elementButton2.addEventListener('click', uiHiscores);
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
    const elementContainer = document.createElement('div');
    elementContainer.classList.add('container');
    const elementHeading = document.createElement("h2");
    elementHeading.innerHTML = "<b>Hiscores</b>";
    const elementTable = document.createElement("table");
    elementTable.classList.add('highscore-table');
    const elementTableRow = document.createElement("tr");
    const elementTableHeader1 = document.createElement("th");
    elementTableHeader1.innerHTML = "<b>Sija</b>";
    const elementTableHeader2 = document.createElement("th");
    elementTableHeader2.innerHTML = "<b>Nimimerkki</b>";
    const elementTableHeader3 = document.createElement("th");
    elementTableHeader3.innerHTML = "<b>Pisteet</b>";
    const elementTableHeader4 = document.createElement("th");
    elementTableHeader4.innerHTML = "<b>Sessio</b>";
    const elementButton = document.createElement("button");
    elementButton.textContent = "Palaa päävalikkoon";
    elementButton.classList.add('highscore-return-btn');

    elementContainer.appendChild(elementHeading);
    elementContainer.appendChild(elementTable);
    elementTable.appendChild(elementTableRow);
    elementTableRow.appendChild(elementTableHeader1);
    elementTableRow.appendChild(elementTableHeader2);
    elementTableRow.appendChild(elementTableHeader3);
    elementTableRow.appendChild(elementTableHeader4);
    elementContainer.appendChild(elementButton);

    elementSection.appendChild(elementContainer);
    uiInterface.appendChild(elementSection);

    for (let s = 0; s < responseJSON["highscores"].length; s++) {
        const elementTableRowPlayer = document.createElement("tr");
        const elementTableData1 = document.createElement("td");

        switch (s) {
        case 0:
            elementTableData1.textContent = "🥇 " + (s + 1);
            elementTableData1.style.position = "relative";
            elementTableData1.style.left = "-30px"
            elementTableRowPlayer.style.color = "gold";
            break;
        case 1:
            elementTableData1.textContent = "🥈 " + (s + 1);
            elementTableData1.style.position = "relative";
            elementTableData1.style.left = "-30px";
            elementTableRowPlayer.style.color = "silver";
            break;
        case 2:
            elementTableData1.textContent = "🥉 " + (s + 1);
            elementTableData1.style.position = "relative";
            elementTableData1.style.left = "-30px";
            elementTableRowPlayer.style.color = "#CD7F32";
            break;
        default:
            elementTableData1.textContent = s + 1 + " ";}

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
}

// UI: Player selection
export function uiPlayerSelection() {
    uiActiveClear();

    // Create DOM elements.
    const elementSection = document.createElement("section");
    elementSection.setAttribute("id", "uiActive");
    const elementContainer = document.createElement('div');
    elementContainer.classList.add('container');
    const elementHeading1 = document.createElement("h2");
    elementHeading1.textContent = "Liity peliin";
    const elementUnorderedList1 = document.createElement("ul");
    elementUnorderedList1.classList.add('player-add-input-list')

    elementContainer.appendChild(elementHeading1);
    elementContainer.appendChild(elementUnorderedList1);
    elementSection.appendChild(elementContainer);
    uiInterface.appendChild(elementSection);


    const elementListItem1 = document.createElement("li");
    const elementInput = document.createElement("input");
    elementInput.setAttribute("name", "playerName");
    elementInput.setAttribute("class", "FieldSelectionPlayerAdd");
    elementInput.setAttribute("type", "text");
    elementInput.placeholder = 'Anna pelaajan nimi';

    elementListItem1.appendChild(elementInput);
    elementUnorderedList1.appendChild(elementListItem1);


    const elementListItem2 = document.createElement("li");
    const elementButton1 = document.createElement("button");
    elementButton1.textContent = "Lisää pelaaja";
    elementButton1.setAttribute("class", "ButtonSelectionPlayerAdd");

    elementListItem2.appendChild(elementButton1);
    elementUnorderedList1.appendChild(elementListItem2);


    const elementListItem3 = document.createElement("li");
    const elementButton2 = document.createElement("button");
    elementButton2.textContent = "Aloita peli";
    elementButton2.setAttribute("class", "ButtonSelectionStartGame");

    elementListItem3.appendChild(elementButton2);
    elementUnorderedList1.appendChild(elementListItem3);


    const elementListItem4 = document.createElement("li");
    const elementButton3 = document.createElement("button");
    elementButton3.textContent = "Palaa päävalikkoon";
    elementButton3.setAttribute("class", "ButtonSelectionBack");

    elementListItem4.appendChild(elementButton3);
    elementUnorderedList1.appendChild(elementListItem4);


    const elementUnorderedList2 = document.createElement("ul");
    const elementHeading2 = document.createElement("h3");
    elementHeading2.textContent = "Pelaajalista";

    elementUnorderedList2.setAttribute("class", "players");
    elementContainer.appendChild(elementUnorderedList2);

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
        if (players.length != 0) {
            try {
                gameData = await gameStartNew(players);

                // GAME PHASE 1: PARCEL SELECTION
                for (let i = 0; i < gameData["players"].length; i++) {
                    await Selection.turnStart(gameData, i);
                    alert("Vuorosi on päättynyt!");
                }
                // GAME PHASE 2: PARCEL DELIVERY
                await Delivery.startMultiplayer(gameData.players);

                // END SCREEN: RESULTS
                players = []
                uiResultScreen();

            } catch (error) {
                console.log(error);
            }
        } else {
            alert("Lisää pelaajat!");
        }
    });

    document.querySelector('.ButtonSelectionBack').addEventListener('click', () => {
        players.splice(0); // clear <players> before navigating back.
        uiMainMenu();
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
    const response = await fetch("http://127.0.0.1:3333/game/end_game");
    const responseJSON = await response.json();
    console.log(responseJSON["highscores"]);

    // Create DOM elements.
    const elementSection = document.createElement("section");
    elementSection.setAttribute("id", "uiActive");
    const elementContainer = document.createElement('div');
    elementContainer.classList.add('container');
    const elementHeading = document.createElement("h2");
    elementHeading.innerHTML = "<b>Tulokset</b>";
    const elementTable = document.createElement("table");
    elementTable.classList.add('end-screen-table');
    const elementTableRow = document.createElement("tr");
    const elementTableHeader1 = document.createElement("th");
    elementTableHeader1.innerHTML = "<b>Nimimerkki</b>";
    const elementTableHeader2 = document.createElement("th");
    elementTableHeader2.innerHTML = "<b>Pisteet</b>";
    const elementTableHeader3 = document.createElement("th");
    elementTableHeader3.innerHTML = "<b>Co2</b>";
    const elementTableHeader4 = document.createElement("th");
    elementTableHeader4.innerHTML = "<b>Matka (km)</b>";
    const elementTableHeader5 = document.createElement("th");
    elementTableHeader5.innerHTML = "<b>Aika (s)</b>";
    const elementButton = document.createElement("button");
    elementButton.textContent = "Palaa valikkoon";
    elementButton.classList.add('end-screen-return-btn');

    elementContainer.appendChild(elementHeading);
    elementContainer.appendChild(elementTable);
    elementTable.appendChild(elementTableRow);
    elementTableRow.appendChild(elementTableHeader1);
    elementTableRow.appendChild(elementTableHeader2);
    elementTableRow.appendChild(elementTableHeader3);
    elementTableRow.appendChild(elementTableHeader4);
    elementTableRow.appendChild(elementTableHeader5);
    elementContainer.appendChild(elementButton);
    elementSection.appendChild(elementContainer);
    uiInterface.appendChild(elementSection);

    const responseArray = Object.values(responseJSON);
    const innerArray = responseArray[0]

    innerArray.sort(function(a, b){
        return b.score - a.score;})
    console.log(responseArray)

    for (let s = 0; s < responseArray[0].length; s++) {
        const elementTableRowPlayer = document.createElement("tr");
        const elementTableData1 = document.createElement("td");

            switch (s) {
            case 0:
                elementTableRowPlayer.style.color = "gold";
                elementTableData1.textContent = "🥇 " + responseArray[0][s]["name"];
                elementTableData1.style.position = "relative";
                elementTableData1.style.left = "-30px"
                break;
            case 1:
                elementTableRowPlayer.style.color = "silver";
                elementTableData1.textContent = "🥈 " + responseArray[0][s]["name"];
                elementTableData1.style.position = "relative";
                elementTableData1.style.left = "-30px"
                break;
            case 2:
                elementTableRowPlayer.style.color = "#CD7F32";
                elementTableData1.textContent = "🥉 " + responseArray[0][s]["name"];
                elementTableData1.style.position = "relative";
                elementTableData1.style.left = "-30px"
                break;
            default:
                elementTableData1.textContent = responseArray[0][s]["name"];
                break;}

        if (!responseArray[0][s]["gameover"]) {
            const elementTableData2 = document.createElement("td");
            elementTableData2.textContent = responseArray[0][s]["score"];
            const elementTableData3 = document.createElement("td");
            elementTableData3.textContent = Math.ceil(responseArray[0][s]["co2_produced"]);
            const elementTableData4 = document.createElement("td");
            elementTableData4.textContent = Math.ceil(responseArray[0][s]["distance_traveled"]);
            const elementTableData5 = document.createElement("td");
            elementTableData5.textContent = Math.ceil(responseArray[0][s]["time_traveled"]);

            elementTableRowPlayer.appendChild(elementTableData1);
            elementTableRowPlayer.appendChild(elementTableData2);
            elementTableRowPlayer.appendChild(elementTableData3);
            elementTableRowPlayer.appendChild(elementTableData4);
            elementTableRowPlayer.appendChild(elementTableData5);

        } else {
            const elementTableData2 = document.createElement("td");
            elementTableData2.textContent = "GAME OVER";
            const elementTableData3 = document.createElement("td");
            elementTableData3.textContent = "GAME OVER";
            const elementTableData4 = document.createElement("td");
            elementTableData4.textContent = "GAME OVER";
            const elementTableData5 = document.createElement("td");
            elementTableData5.textContent = "GAME OVER";

            elementTableRowPlayer.appendChild(elementTableData1);
            elementTableRowPlayer.appendChild(elementTableData2);
            elementTableRowPlayer.appendChild(elementTableData3);
            elementTableRowPlayer.appendChild(elementTableData4);
            elementTableRowPlayer.appendChild(elementTableData5);
        }
        elementTable.appendChild(elementTableRowPlayer);
    }

    // Add DOM Event Listeners
    elementButton.addEventListener("click", () => {
        uiMainMenu();
    });
}
