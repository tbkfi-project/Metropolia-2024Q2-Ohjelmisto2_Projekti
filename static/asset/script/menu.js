'use strict';

export const players = [];

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
    let responseJSON;
    
    try {
        console.log("players (array):", playerList);
        const playersString = playerList.join(',');
        console.log("players (string):", playersString);
        const data = encodeURIComponent(playersString);
        console.log("data (tx):", data);
        
        const response = await fetch(`http://127.0.0.1:3333/game/new?players=${data}`);
        console.log("data (rx):", response);
        responseJSON = await response.json();
    } catch (error) {
        console.log(error);
    }
    console.log("data (rx):", responseJSON);
    return responseJSON;
}

export function parcelSelect(playerName, parcelIndex) {
    // TODO
}

export function parcelDeliver(playerName, parcelIndex, deliveryMethod) {
    // TODO
}
