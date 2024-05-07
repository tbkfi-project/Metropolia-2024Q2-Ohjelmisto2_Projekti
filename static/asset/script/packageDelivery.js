import * as Map from './map.js'

let playerParcels = [];
let playerName = null;
let currentlySelectedParcelForDelivery = { // Contains data about currently opened delivery option for parcel
    liElement: null,
    data: null,
}
let turnOver = false; // Changes to true when current player turn is over
let time_left = 100

/**
 * Remove currently active screen
 */
function clearActiveScreen() {
    const activeScreen = document.querySelector('#uiActive');
    if (activeScreen) {
        activeScreen.remove();
    }
}

/**
 * Get every parcel location from parcels array
 * @param {Array<Object>} parcels Array of parcel objects 
 * @returns {Array<Array<Number, Number>>} Array of parcel coords
 */
function getPackageLocations(parcels) {
    let parcelLocations = [];
    parcels.forEach(parcel => {
        parcelLocations.push(parcel.location);
    });
    return parcelLocations;
}

/**
 * Add click listener to the parcel element.
 * When element is clicked "delivery" option will be displayed.
 * @param {Node} liElement Li element that will get the click listener.
 * @param {Object} parcel The Li elements parcel
 */
function addParcelElementClickListener(liElement, parcel) {

    function elementClicked() {
        this.removeEventListener('click', elementClicked); // Remove the click listener from the element

        const parcelCoords = parcel.location;
        Map.showTravelLine(parcelCoords); // Add "Travel line" between the player and parcel delivery location

        liElement.innerHTML = '';
        liElement.appendChild(createTravelUlElement(parcel)); // Add the travel options to the li element. The function will return new ul element

        // Store data about currently opened delivery option for parcel
        currentlySelectedParcelForDelivery = {
            liElement: liElement,
            data: parcel,
        }
    }

    liElement.addEventListener('click', elementClicked);
}

/**
 * Call parcel delivery endpoint
 * @param {String} playerName Player name
 * @param {Number} parcelIndex Parcel Index
 * @param {Number} flightType Flight type (number) 
 */
async function callParcelDeliveryEndpoint(playerName, parcelIndex, flightType) {
    try {
        const response = await fetch(`http://127.0.0.1:3333/game/parcel_deliver?player=${playerName}&index=${parcelIndex}&airplane=${flightType}`);
        if (!response.ok) {
            return {
                error: Error(`Response was not 200. Returned response code was: ${response.status}`),
                data: null,
            };
        }

        const json = await response.json();
        return {
            error: null,
            data: json,
        };
    } catch (error) {
        return {
            error: error,
            data: null
        };
    }
}

/**
 * Check if player has delivered all parcels
 * @param {Array<Object>} parcels Array of parcel objects
 * @returns {Boolean}
 */
function checkIfAllParcelsAreDelivered(parcels) {
    return parcels.every((parcel) => {
        return parcel.delivered;
    });
}

/**
 * Start parcel delivery
 * @param {Object} parcel Deliverable parcel object
 * @param {Number} flightType Flight type (number)  
 */
async function deliverParcel(parcel, flightType) {
    if (!playerName) {
        console.warn('Player name was null');
        return;
    }

    try {

        const { error, data } = await callParcelDeliveryEndpoint(playerName, playerParcels.indexOf(parcel), flightType);

        if (error) {
            console.error('Error occurred in callParcelDeliveryEndpoint()', error);
            return;
        }

        if (data) {
            if (data.game_over) {
                alert('Aikasi loppui kesken toimituksen!');
                turnOver = true;
                return;
            }

            document.querySelector('#uiActive').remove(); // Remove current delivery screen so it can be regenerated with new data

            const parcels = data.parcels;
            if (checkIfAllParcelsAreDelivered(parcels) && data.time_left > 0) {
                alert('Toimitit kaikki paketit annetussa ajassa! Vuorosi loppuu.');
                turnOver = true;
                return;
            } else {
                playerParcels = parcels;
                createDeliveryScreen(parcels); // Create new parcel delivery screen
                Map.changePlayerMarkerLocation(parcel.location);
            }
        }

    } catch (error) {
        console.error('Unexpected error occurred', error);
    }
}

/**
 * Remove 'travel-type-ul'-class from currently selected parcel element
 * @param {Node} liElement Li element with 'travel-type-ul'-class  
 * @param {Object} parcel The Li elements parcel
 */
function restoreCurrentlySelectedParcelElement(liElement, parcel) {
    if (liElement != null && parcel != null) {
        liElement.classList.remove('travel-type-ul');

        liElement.innerHTML = '';
        liElement.textContent = `${parcel.item}, ${parcel.destination_country}`; // Example 'Foliota, Sweden'
        addParcelElementClickListener(liElement, parcel); // Add click listener to the element
    }
}

/**
 * Create and return new travel ul element
 * @param {Object} parcel Parcel object
 * @returns {Node} New travel ul element. Contains travel options.
 */
function createTravelUlElement(parcel) {
    restoreCurrentlySelectedParcelElement(
        currentlySelectedParcelForDelivery.liElement,
        currentlySelectedParcelForDelivery.data,
    );

    const travelUlElement = document.createElement('ul');
    travelUlElement.classList.add('travel-type-ul');

    // Create travel options between 1 and 3
    for (let i = 1; i < 4; i++) {
        const travelLiElement = document.createElement('li');

        // If player clicks any of the travel options
        travelLiElement.addEventListener(('click'), () => {
            let flightType = 1;
            let text = travelLiElement.textContent;

            if (text.includes('Rahtikone,')) {
                flightType = 1
            } else if (text.includes('Matkustajakone,')) {
                flightType = 2
            } else {
                flightType = 3
            }

            deliverParcel(parcel, flightType);
        });

        switch (i) {
            case (1):
                travelLiElement.textContent = `Rahtikone, ${(parcel.travel_time.cargo_plane).toFixed(1)}s`;
                travelLiElement.style.background = 'green';
                break;
            case (2):
                travelLiElement.textContent = `Matkustajakone, ${(parcel.travel_time.passenger_plane).toFixed(1)}s`;
                travelLiElement.style.background = 'yellow';
                break;
            case (3):
                travelLiElement.textContent = `Yksityiskone, ${(parcel.travel_time.private_jet).toFixed(1)}s`;
                travelLiElement.style.background = 'red';
                break;
        }

        travelUlElement.appendChild(travelLiElement);
    }

    return travelUlElement;
}

/**
 * Create parcel delivery screen
 * @param {Array<Object>} parcels Array of parcel objects
 */
function createDeliveryScreen(parcels) {
    const uiInterface = document.querySelector('#uiInterface');
    const parcelDeliveryScreenContainer = document.createElement('div');
    parcelDeliveryScreenContainer.id = 'uiActive';
    parcelDeliveryScreenContainer.classList.add('parcel-delivery-screen-container');

    const parcelDeliveryScreen = document.createElement('div');
    parcelDeliveryScreen.classList.add('parcel-delivery-screen');

    const playerNameAndTimerDisplay = document.createElement('div')
    playerNameAndTimerDisplay.classList.add('name-and-timer')
    parcelDeliveryScreen.appendChild(playerNameAndTimerDisplay)

    const playerNameDisplay = document.createElement('p')
    playerNameDisplay.classList.add('nameDisplay')
    const playerTimerDisplay = document.createElement('p')
    playerTimerDisplay.classList.add('timerDisplay')
    playerNameDisplay.innerText = `Vuorossa: ${playerName}`
    playerTimerDisplay.innerText = `Aikaa jäljellä: ${time_left}`
    playerNameAndTimerDisplay.appendChild(playerNameDisplay)
    playerNameAndTimerDisplay.appendChild(playerTimerDisplay)

    const ulElement = document.createElement('ul');
    ulElement.classList.add('parcel-delivery-list');
    parcelDeliveryScreen.appendChild(ulElement);

    // Create new li element for every parcel
    parcels.forEach((parcel) => {
        if (parcel.delivered) {
            // TODO. How we will show parcels that are delivered
        } else {
            const liElement = document.createElement('li');
            liElement.textContent = `${parcel.item}, ${parcel.destination_country}, ${(parcel.distance_to_player).toFixed(1)}km`; // Example 'Foliota, Sweden'

            // Add click listener to the element
            addParcelElementClickListener(liElement, parcel)

            ulElement.appendChild(liElement);
        }

    });

    parcelDeliveryScreenContainer.appendChild(parcelDeliveryScreen);
    uiInterface.appendChild(parcelDeliveryScreenContainer);

    if (time_left > 50) {
        document.querySelector(".timerDisplay").style.color = "springgreen";
    } else if (time_left <= 50 && time_left > 25) {
        document.querySelector(".timerDisplay").style.color = "yellow";
    } else if (time_left <= 25 && time_left != 0) {
        document.querySelector(".timerDisplay").style.color = "maroon";
    } else if (time_left == 0) {
        document.querySelector(".timerDisplay").style.color = "grey";
    }
}

/**
 * Start package delivery for player
 * @param {String} nameOfThePlayer Player name
 * @param {Array<Object>} parcels Player parcels
 * @param {Array<Number, Number} playerLocation Array with coordinates [Latitude, Longitude] 
 */
function start(nameOfThePlayer, parcels, playerLocation) {
    alert(`${nameOfThePlayer}, on vuorosi toimittaa paketit!`);
    playerParcels = parcels; // Store player parcels
    playerName = nameOfThePlayer;
    clearActiveScreen(); // Clear active screen
    Map.clearMap(); // Clear game map from all markers and polylines
    Map.createPlayerMarker(playerLocation); // Create player marker to the start location

    const packageCoords = getPackageLocations(playerParcels); // Get all package delivery locations
    Map.addPackageDeliveryMarkers(packageCoords); // Add the package delivery markers to the coords

    Map.changeScreenType('game'); // Change map screen type

    createDeliveryScreen(playerParcels); // Create and show delivery screen

    clock()
}

async function clock() {
    const timer = setInterval(async () => {

        if (turnOver) {
            clearInterval(timer)
        }

        const response = await fetch(
            `http://127.0.0.1:3333/game/time_left?player=${playerName}`)
        const responseJSON = await response.json()
        time_left = Math.floor(responseJSON['time_left'])

        if (time_left < 0 && !turnOver) {
            time_left = 0
            alert('Aikasi loppui kesken toimituksen! Hävisit pelin!');
            turnOver = true;
            fetch(`http://127.0.0.1:3333/game/game_over?player=${playerName}`);
            clearInterval(timer);
        }
        try {

            if (time_left > 50) {
                document.querySelector(
                    ".timerDisplay").style.color = "springgreen";
            } else if (time_left <= 50 && time_left > 25) {
                document.querySelector(".timerDisplay").style.color = "yellow";
            } else if (time_left <= 25 && time_left != 0) {
                document.querySelector(".timerDisplay").style.color = "maroon";
            } else if (time_left == 0) {
                document.querySelector(".timerDisplay").style.color = "grey";
            }

            const playerNameDisplay = document.querySelector(".nameDisplay")
            const playerTimerDisplay = document.querySelector(".timerDisplay")
            playerNameDisplay.textContent = `Vuorossa: ${playerName}`
            playerTimerDisplay.textContent = `Aikaa jäljellä:  ${time_left}`
        } catch (r) {
            console.log(r)
        }
    }, 1000)
}

/**
 * Fetch player parcels from endpoint
 * @param {String} playerName Name of the player 
 */
async function getPlayerParcels(playerName) {
    try {
        const response = await fetch(`http://127.0.0.1:3333/game/player_parcel_list?player=${playerName}`);

        if (!response.ok) {
            return {
                error: Error(`Response was not 200. Returned response code was: ${response.status}`),
                data: null,
            };
        }

        const json = await response.json();
        return {
            error: null,
            data: json,
        };
    } catch (error) {
        return {
            error: error,
            data: null,
        };
    }
}

/**
 * Reset game timer before next player starts delivery
 */
async function resetPlayerTimer() {
    try {
        const response = await fetch('http://127.0.0.1:3333/game/start_new_time?seconds=100');
        time_left = 100
        if (!response.ok) {
            return {
                error: Error(`Response was not 200. Returned response code was: ${response.status}`),
                success: false,
            };
        }

        return {
            error: null,
            success: true,
        };
    } catch (error) {
        return {
            error: error,
            success: false,
        };
    }
}

/**
 * Turn waiter. Used to set startMultiplayer() to sleep until current player turn is over.
 */
async function turnWaiter() {
    return new Promise(resolve => {
        const interval = setInterval(() => {
            if (turnOver) {
                setTimeout(() => turnOver = false,1050);
                clearInterval(interval);
                resolve();
            }
        }, 500);
    });
}

/**
 * Remove players from array that has 'gameover: true'
 * @param {Array<Object>} players Array of player objects
 * @returns {Array<Object>}
 */
function removeGameEndedPlayers(players) {
    let playingPlayers = [];

    players.forEach((player) => {
        if (!player.gameover) {
            playingPlayers.push(player);
        }
    })

    return playingPlayers;
}

/**
 * Start multiplayer game
 * @param {Array<Object>} playerArray Array of players
 */
export async function startMultiplayer(playerArray) {
    const players = removeGameEndedPlayers(playerArray);
    for (let i = 0; i < players.length; i++) {
        const { timerError, success } = await resetPlayerTimer();

        try {
            if (timerError) {
                console.error('Error occurred in resetPlayerTimer()', timerError);
                turnOver = true;
                return;
            }
        } catch (error) {
            console.error('Unexpected error occurred', error);
            turnOver = true;
        }

        const { parcelError, data } = await getPlayerParcels(players[i].name);

        try {
            if (parcelError) {
                console.error('Error occurred in getPlayerParcels()', parcelError);
                turnOver = true
                return;
            }

            if (data) {
                const parcels = data.parcels;
                start(players[i].name, parcels, players[i].location);
            }
        } catch (error) {
            console.error('Unexpected error occurred', error);
            turnOver = true;
        }

        await turnWaiter(); // Wait until current player turn is over
    }
    Map.changeScreenType('default');
    Map.clearMap();

    return true; // Returns true, because game is now over
}
