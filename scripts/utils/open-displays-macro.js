/*
NOTE: You can't have imports in macros making building the custom data structs a bit of a bitch
if you want to add a full roll object buts you can make the roll object the same as Mine and push it.
It should still work as long as vars are all the same name.

Note: Copy Paste this macro should work to allow the user to open displays. They do need macro perms ofc.

Any problems with macro or ideas for new ones submit an Issue on the github!
*/
// import { DS_GLOBALS } from "modules/diceStats/scripts/dice-stats-globals.js";
// import { GlobalStatusPage } from "modules/diceStats/scripts/forms/dice-stats-globalstatuspage.js";
// import { ComparePlayerStatusPage } from "modules/diceStats/scripts/forms/dice-stats-compareplayerspage.js";
// import { ExportDataPage } from "modules/diceStats/scripts/forms/dice-stats-exportdatapage.js";
// import { CustomTabFormClass } from "modules/diceStats/scripts/forms/dice-stats-tabedplayerstatspage.js";

// API Examples
/*
    game.modules.get('diceStatsReady')?.api?.diceStatsApiStaticMethod(someInput)

    saveRollValue: DiceStatsAPI.saveRollValue( player-id: player_id, int:enum: die_type, result: roll_value),
    saveRollInfo: DiceStatsAPI.saveRollInfo( player-id: player_id, roll_info: roll_info),

    getPlayerList: DiceStatsAPI.getPlayerList(),
    getGlobals: DiceStatsAPI.getGlobals(),

    openGlobalStats: DiceStatsAPI.openGlobalStats(),
    openCompareStats: DiceStatsAPI.openCompareStats(),
    openPlayerStats: DiceStatsAPI.openPlayerStats( String: player_id),
    openExportStats: DiceStatsAPI.openExportStats( Bool: isGM)
*/

let DS_GLOBALS = game.modules.get('dice-stats')?.api?.getGlobals();

/* Open the global status page */
async function openGlobalStatusPage(){
    game.modules.get('dice-stats')?.api?.openGlobalStats();
}

/* Open the compare player status page*/
async function openComparePlayerStatusPage () {
    game.modules.get('dice-stats')?.api?.openCompareStats();
}

/* open player status page */
function openPlayerStatusPage(event){
    const clickedElement = $(event.currentTarget);
    const player_id = clickedElement.data().value;
    game.modules.get('dice-stats')?.api?.openPlayerStats(player_id);
}

/* Open the export page */
function openExportDataPage(){
    game.modules.get('dice-stats')?.api?.openExportStats(game.user.isGM);
}

// ============================================================================
// =================================== MAIN ===================================
// ============================================================================

// game.modules.get("dice-stats")?.value; 
let buttons_list = "";
let player_count = 0;

/* get [{id, name},...] ary object from DiceStats */
// let users = game.modules.get('diceStatsReady')?.api?.getPlayerList(someInput);
for ( let user of game.users ){ /* x of y = values | x in y = keys */
    buttons_list+='<button id="ds_open_player" data-value='+user.id+' style="padding: 10px 20px;">'+user.name+"</button>";
}

// Define the HTML content for the pop-up dialog
let content = `
  <div style="text-align:center; padding: 10px;">
    <p>Click the button below to perform an action:</p>
    <button id="ds_open_global" style="padding: 10px 20px;">Globals</button>
    <button id="ds_open_compare" style="padding: 10px 20px;">Campare</button>
    <button id="ds_open_export" style="padding: 10px 20px;">Export</button>
  ` + buttons_list + 
  `</div>`;

// Create a simple dialog with the HTML content
new Dialog({
  title: "Action Dialog",  // Title of the dialog
  content: content,        // HTML content of the dialog
  buttons: {},             // No other buttons for now
  default: "cancel",       // Default button action
  close: () => {
    // Close action (if needed)
    console.log("Dialog closed");

    // Add event listener for the button click
    $(document).off('click', '#ds_open_global');
    $(document).off('click', '#ds_open_compare');
    $(document).off('click', '#ds_open_export');
    $(document).off('click', '#ds_open_player');
  }
}).render(true);

// Add event listener for the button click
$(document).on('click', '#ds_open_global', (event) => {openGlobalStatusPage(event) });
$(document).on('click', '#ds_open_compare', (event) => {openComparePlayerStatusPage(event) });
$(document).on('click', '#ds_open_export', (event) => {openExportDataPage(event) });
$(document).on('click', '#ds_open_player', (event) => {openPlayerStatusPage(event) });
