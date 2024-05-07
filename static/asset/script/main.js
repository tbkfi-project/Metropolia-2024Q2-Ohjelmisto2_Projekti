"use strict";

import * as Map from './map.js'
import * as Menu from './menu.js'

export const versionNumber = "r1"


// Initialise Application
document.querySelector("#JavaScriptCheck").remove();
Map.show();
Menu.uiPanel();
Menu.uiMainMenu();

backendPing();
setInterval(backendPing, 5000);


// Connection check
async function backendPing() {
    const elementOrb = document.querySelector("#backendStatusOrb");
    try {
        const response = await fetch("http://127.0.0.1:3333/game/check_connection");
        // console.log("ping: backend response", response);

        if (response.ok) {
            backendStatusOrb.innerHTML = "backend status: <span style='color: SpringGreen;'>up</span>";
        } else {
            backendStatusOrb.innerHTML = "backend status: <span style='color: red;'>down</span>";
        }
    } catch (error) {
        // console.error("error: backend response", error);
        backendStatusOrb.innerHTML = "backend status: <span style='color: red;'>down</span>";
    }
}
