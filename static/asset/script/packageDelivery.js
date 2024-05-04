import * as Map from './map.js'

let playerParcels = [];
let playerName = null;
let currentlySelectedParcelForDelivery = { // Contains data about currently opened delivery option for parcel
    liElement: null,
    data: null,
}
let turnOver = false; // Changes to true when current player turn is over

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
                alert('Vuorosi loppui');
                turnOver = true;
                return;
            }

            document.querySelector('#uiActive').remove(); // Remove current delivery screen so it can be regenerated with new data

            const parcels = data.parcels;
            if (parcels.length <= 0) {
                alert('Vuorosi loppui');
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
        travelLiElement.textContent = i;

        // If player clicks any of the travel options
        travelLiElement.addEventListener(('click'), () => {
            deliverParcel(parcel, travelLiElement.textContent);
        });

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

    const ulElement = document.createElement('ul');
    ulElement.classList.add('parcel-delivery-list');
    parcelDeliveryScreen.appendChild(ulElement);

    // Create new li element for every parcel
    parcels.forEach((parcel) => {
        if (parcel.delivered) {
            // TODO. How we will show parcels that are delivered
        } else {
            const liElement = document.createElement('li');
            liElement.textContent = `${parcel.item}, ${parcel.destination_country}`; // Example 'Foliota, Sweden'

            // Add click listener to the element
            addParcelElementClickListener(liElement, parcel)

            ulElement.appendChild(liElement);
        }
    });

    parcelDeliveryScreenContainer.appendChild(parcelDeliveryScreen);
    uiInterface.appendChild(parcelDeliveryScreenContainer);
}

/**
 * Start package delivery for player
 * @param {String} nameOfThePlayer Player name
 * @param {Array<Object>} parcels Player parcels
 * @param {Array<Number, Number} playerLocation Array with coordinates [Latitude, Longitude] 
 */
function start(nameOfThePlayer, parcels, playerLocation) {
    alert(`${nameOfThePlayer}, aloita pelaus`);
    playerParcels = parcels; // Store player parcels
    playerName = nameOfThePlayer;
    clearActiveScreen(); // Clear active screen
    Map.clearMap(); // Clear game map from all markers and polylines
    Map.createPlayerMarker(playerLocation); // Create player marker to the start location

    const packageCoords = getPackageLocations(playerParcels); // Get all package delivery locations
    Map.addPackageDeliveryMarkers(packageCoords); // Add the package delivery markers to the coords

    Map.changeScreenType('game'); // Change map screen type

    createDeliveryScreen(playerParcels); // Create and show delivery screen
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
 * Turn waiter. Used to set startMultiplayer() to sleep until current player turn is over.
 */
async function turnWaiter() {
    return new Promise(resolve => {
        const interval = setInterval(() => {
            if (turnOver) {
                turnOver = false;
                clearInterval(interval);
                resolve();
            }
        }, 500);
    });
}

/**
 * Start multiplayer game
 * @param {Array<Object>} players Array of players
 */
export async function startMultiplayer(players) {
    for (let i = 0; i < players.length; i++) {
        const { error, data } = await getPlayerParcels(players[i].name);

        try {
            if (error) {
                console.error('Error occurred in getPlayerParcels()', error);
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
}
