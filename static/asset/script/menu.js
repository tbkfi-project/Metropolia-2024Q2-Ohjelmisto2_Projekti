'use strict';

/*  NAME                    TYPE                INFO
 *  players                 array               contains player information for the current game.
 *
 *  playersAdd()            function            adds a player to <players>, expects STRING.
 *  playersRemove()         function            removes a player from <players>, expects <player.name> STRING.
 *
 *  parcelSelect()          function            add parcel to active player's delivery list.
 *  parcelDeliver()         function            add parcel to active player's delivered list and do required calculations.
 *
 *
 *
*/ 

let players = [];

export function playersAdd(playerName) {
	const targetList = document.querySelector('.players');

    if (players.includes(playerName)) { // Username already taken
    	console.log(`error: player "${playerName}" already in list.`);
        alert('Nimimerkki on jo käytössä!');
        return false;
    } else {
        players.push(playerName);

		const entry = document.createElement('li');
		entry.setAttribute("id", playerName);
		entry.innerHTML = `<p>${playerName}</p><button class="playersRemove" value="${playerName}">del</button>`;

		const entryButton = entry.querySelector(`.playersRemove`);
		entryButton.addEventListener("click", () => {
    		playersRemove(entryButton.value);
		});

		targetList.appendChild(entry);
		console.log(`success: added ${playerName} to list.`);
		return true;
    }
}

export function playersRemove(playerName) {
	const targetList = document.querySelector('.players');
	const targetEntry = targetList.querySelector(`#${playerName}`);

    if (!players.includes(playerName)) { // Player not in list
    	console.log(`error: player "${playerName}" not in list.`);
        return false;
    } else {
    	const playerNameIndex = players.indexOf(playerName);
    	if (playerNameIndex != -1) {
    		players.splice(playerNameIndex, 1);
    	}
    
    targetList.removeChild(targetEntry)	
    console.log(`success: removed ${playerName} from list.`);
	return true;
    }
}

export function parcelSelect(playerName, parcelIndex) {
    
}

export function parcelDeliver(playerName, parcelIndex, deliveryMethod) {
    
}
