import * as Map from './map.js'

let playerParcels = [];

let currentlySelectedParcelForDelivery = { // Contains data about currently opened delivery option for parcel
    liElement: null,
    data: null,
}

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

async function deliverParcel(parcel, flightType) {
    console.log(flightType);
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
        const liElement = document.createElement('li');
        liElement.textContent = `${parcel.item}, ${parcel.destination_country}`; // Example 'Foliota, Sweden'

        // Add click listener to the element
        addParcelElementClickListener(liElement, parcel)

        ulElement.appendChild(liElement);
    });

    parcelDeliveryScreenContainer.appendChild(parcelDeliveryScreen);
    uiInterface.appendChild(parcelDeliveryScreenContainer);
}

/**
 * Start package delivery for player
 * @param {Object} player Player data object
 */
export function start(player) {
    playerParcels = player.parcels_picked; // Store player parcels
    clearActiveScreen(); // Clear active screen
    Map.clearMap(); // Clear game map from all markers and polylines
    Map.createPlayerMarker(player.location); // Create player marker to the start location

    const packageCoords = getPackageLocations(playerParcels); // Get all package delivery locations
    Map.addPackageDeliveryMarkers(packageCoords); // Add the package delivery markers to the coords

    Map.changeScreenType('game'); // Change map screen type

    createDeliveryScreen(playerParcels); // Create and show delivery screen
} 