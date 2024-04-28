'use strict';

/*  NAME                        TYPE                INFO
 *  players                     array               contains player information for the current game.
 *
 *  playerListAddEntry()        function            adds a player to <players>, expects STRING.
 *  playerListRemoveEntry()     function            removes a player from <players>, expects <player.name> STRING.
 *
 *  parcelListAddEntry()        function            add parcel to active player's delivery list.
 *  parcelListDeliverEntry()    function            add parcel to active player's delivered list and do required calculations.
 *
 *
 *
*/

let players = [];

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
		console.log(`success: added ${playerName} to list.`);
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


export function parcelSelect(playerName, parcelIndex) {
    
}

export function parcelDeliver(playerName, parcelIndex, deliveryMethod) {
    
}
