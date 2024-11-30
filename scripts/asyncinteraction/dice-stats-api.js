/* Import Obj's */
import { DS_GLOBALS } from "../dice-stats-globals.js";
import { DiceStatsTracker } from "../dice-stats-main.js";
import { DS_MSG_ROLL_INFO, DS_MSG_DIE_ROLL_INFO } from "../appdatastorage/dice-stats-rollmsginfo.js";

/* Import UI's */
import { GlobalStatusPage } from "../forms/dice-stats-globalstatuspage.js";
import { ComparePlayerStatusPage } from "../forms/dice-stats-compareplayerspage.js";
import { ExportDataPage } from "../forms/dice-stats-exportdatapage.js";
import { CustomTabFormClass } from "../forms/dice-stats-tabedplayerstatspage.js";

/**
 * This class is the API for dice stats. Used to allow other modules & macros easily access the data.
 * 
 * Different Functions:        Fn Returns
 * 
 * saveRollValue({STRING:Player_id}, {ENUM:DIE_TYPE: #}, {INT: #}) -> Save a roll result to a player
 * saveRollInfo({STRING:Player_id}, {DS_MSG_ROLL_INFO}) -> Save a roll object
 * getPlayerList({VOID})        -> String[]=    Array of player ID's that are stored in the dice stats database
 * getGlobals({VOID})           -> DS_GLOBALS=  Global Dice Stats Object & Enums 
 * 
 * openGlobalStats({VOID})      -> Open Global Stats UI
 * openCompareStats({VOID})     -> Open Compare Stats UI
 * openPlayerStats({INT} player_id) -> Open the players stats for the player ID selected
 * openExportStats({BOOL} isGM) -> Open Export page if they're the GM
 * 
 */

/* --- Examples on how to use API
    // if I need to do something as soon as the cool-module is ready
    Hooks.on('diceStatsReady', (api) => {
    // do what I need with their api
    });

    // alternatively if I know that the API should be populated when I need it,
    // I can defensively use the api on game.modules
    game.modules.get('diceStatsReady')?.api?.diceStatsApiStaticMethod(someInput)
*/
export class DiceStatsAPI {
    /**
    * @returns {VOID} - Save specific roll value to player stats
    */
    static saveRollValue(/*player-id*/player_id,/*int:enum*/die_type, /*result*/roll_value){

        // Fill In die Structure
        let dieValue = new DS_MSG_DIE_ROLL_INFO;
        dieValue.DieType = die_type;
        dieValue.dieValue = roll_value;

        // Fill in Roll Structure
        rollDataStruct.DiceInfo.push(dieValue);

        // Save to Dice Stats data storage
        DiceStatsTracker.addRoll(rollDataStruct, player_id);
    }

    /**
    * @returns {VOID} - Save roll specific details, Requires building roll specific info
    */
    static saveRollInfo(/*player-id*/player_id, /*roll_info*/roll_info){
        DiceStatsTracker.addRoll(roll_info, player_id);
    }

    /**
     * @returns {String []} - Array of player id's that are stored in the map
     */
    static getPlayerList(){
        // Return list of player id's saved in map
        return DiceStatsTracker.getInstance().getPlayerIDs();
    }

    /**
     * @returns {DS_GLOBALS} - Globals object for enums & other global vars, Def not the most secure and should
     * be used sparingly.
     */
    static getGlobals(){
        // Retrun pointer to global data struct
        return DS_GLOBALS;
    }

    /**
     * @returns {VOID} - Renders UI Component
     */
    static async openGlobalStats(){
        await DS_GLOBALS.FORM_GL_COMPARE?.close();

        if(DS_GLOBALS.FORM_GL_STATS){
            DS_GLOBALS.FORM_GL_STATS.render(true);
        }else{
            DS_GLOBALS.FORM_GL_STATS = new GlobalStatusPage().render(true);
        } 
    }

    /**
     * @returns {VOID} - Renders UI Component
     */
    static async openCompareStats(){
        let canSeePlayerData = game.settings.get(DS_GLOBALS.MODULE_ID, DS_GLOBALS.MODULE_SETTINGS.PLAYERS_SEE_PLAYERS);
        if(canSeePlayerData === false && game.user.isGM === false){
            //Do nothing, Dont allow players to view player data if setting is set
            ui.notifications.warn("No Accesss to Player Data, Ask GM For Permission");
        }else if(DS_GLOBALS.FORM_GL_COMPARE){
            // Close Global Stats page if opening Compare popup
            await DS_GLOBALS?.FORM_GL_STATS?.close(false);

            DS_GLOBALS.FORM_GL_COMPARE.render(true);
        }else{
            // Close Global Stats page if opening Compare popup
            await DS_GLOBALS?.FORM_GL_STATS?.close(false);

            DS_GLOBALS.FORM_GL_COMPARE = new ComparePlayerStatusPage().render(true);
        } 
    }

    /**
     * @returns {VOID} - Renders UI Component
     */
    static openPlayerStats(/*String*/player_id){

        //Delete OLD OBJ before making new one (Other objects are singletons so delete is not needed)
        if(DS_GLOBALS.FORM_PLAYER_STATS)
        {
            DS_GLOBALS.FORM_PLAYER_STATS.render(false);
            delete DS_GLOBALS.FORM_PLAYER_STATS
        }
    
        // Always render the Tabbed Version, Were removing the normal Player status page
        DS_GLOBALS.FORM_PLAYER_STATS = new CustomTabFormClass(player_id).render(true);

    }

    /**
     * @returns {VOID} - Renders UI Component
     */
    static openExportStats(/*Bool*/isGM){
        if (isGM) {
            DS_GLOBALS.FORM_EXPORT = new ExportDataPage().render(true);
        }
    }
}