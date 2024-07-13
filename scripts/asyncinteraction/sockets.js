//==========================================================
//==================== SOCKET SHIT =========================
//==========================================================
import { DS_GLOBALS } from "../dice-stats-globals.js";
import { DICE_STATS_UTILS } from "../dice-stats-utils.js";

// Global Method to load socket stuff
Hooks.once("socketlib.ready", () => {
	DS_GLOBALS.MODULE_SOCKET = socketlib.registerModule("dice-stats");

    DS_GLOBALS.MODULE_SOCKET.register("push_sock", pushPlayerBlindRolls_sock);
    DS_GLOBALS.MODULE_SOCKET.register("clear_sock", clearRollData_sock);
});

//Socket fn call. This funtion is triggered by the gm to tell all users that they can 
//  inclide the blind roll data to the charts
function pushPlayerBlindRolls_sock(userid) {
	DS_GLOBALS.DS_OBJ_GLOBAL.pushBlindRolls();
    
    DICE_STATS_UTILS.refreshForms();
}

// socket that the gm can call on all players to clear all of their values
function clearRollData_sock() {
    DS_GLOBALS.DS_OBJ_GLOBAL.clearAllRollData();
    
    DICE_STATS_UTILS.refreshForms();   
}