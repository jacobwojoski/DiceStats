import { DS_GLOBALS } from "./dice-stats-globals.js";
import { MESSAGE_PARSER_FACTORY } from "./systemMessageParsers/dice-stats-messageparserfactory.js";
import { PLAYER } from "./appdatastorage/dice-stats-player.js";
import { DB_INTERACTION } from "./database/dice-stats-db.js";
import { ComparePlayerObjUtil } from "./dice-stats-utils.js";

//Were using this class as a singleton although its not quite set up correctly as one. 
// This is the main dice stats class. It holds all the data.
/**
 * Quick discrip on how mod works:
 *      Hook into Foundry scene render to add dce stats buttons [async/hooks & form/scenecontrol]
 *      Hook into Foundry chat msg creation to add roll to data storage
 *          Data Storage:
 *              DICE_STATS_CLASS - Main class that holds backend data for dice stats
 *                  PLAYER_DATA -    Main class holds a player data class for every player for the world
 *                      DICE_DATA -     Player Data holds a dice data class for every type of dice roll we track
 * 
 *          Initalize:
 *              - creates hooks
 *              - create button on scene
 *              - load any data from database if we have it
 * 
 *          Process Desc:
 *              - Hook gets called -> Main -> parseChatMsg(MSG_WE_JUST_GOT_FROM_HOOK);
 *              - parseChatMsg -> createSystemSpecificParser
 *              - parse Using System Specific Parser and create rollmMsgInfo (Convert system specific info into generic dice stats info obj)
 *              - Save the dice stats info obj to the backend
 * 
 *          Open Form:
 *              - Openeing form calls the associated forms getData()
 *              - get data calls datapack functions to convert the dice stats data into data for the form. 
 *                  Because of the handlebars templating language not liking multi dimentional arrays I need to convert all backend data 
 *                  into a different object that the handlebars forms can handle. Its a reak pain in the ass and is implemented like shit right now.
 *              - form buttons all have id's that have a corresponding switch case in _handleButtonClick(). This is a build in foundry form fn that gets called whenever
 *                  a button is selected on any from. 
 *               - These buttons interacts with the DiceStats object as its global/singleton and call getData() again to update the display  
 * 
 */
export class DiceStatsTracker {
    static _singleton_pointer = null;
    AM_I_GM = false;

    ID = 'dice-stats';

    SYSTEM = '';

    /*PLAYER_ID to PLAYER_INFO map*/
    PLAYER_DATA_MAP = null; //<PLAYER_ID, PLAYER_DATA>

    PLAYER_STATS_FORM_DIE_CHECKBOXES =   [];
    GLOBAL_STATS_FORM_DIE_CHECKBOXES =   [];
    COMPARISON_FORM_DIE_CHECKBOXES =     [];
    COMPARISON_FORM_PLAYER_CHECKBOXES =  [];

    /**
     * Update global map to add a key value pair for every user.
     * key:value = {int}userid:{PLAYER}PLAYER Object
     */
    updateMap(){
        //Add everyplayer to storage. Were tracking all even if we dont need
        for (let user of game.users) {
            if(!this.PLAYER_DATA_MAP.has(user.id)){
                this.PLAYER_DATA_MAP.set(user.id, new PLAYER(user.id))    
            }
        }
    }

    updateComparisonFormCheckboxes(){
        this.COMPARISON_FORM_PLAYER_CHECKBOXES = new Array();
        for(let user of game.users)
        {
            let temp = new ComparePlayerObjUtil(user);
            this.COMPARISON_FORM_PLAYER_CHECKBOXES.push(temp);
        }
    }

    /**
     * Dice Stats sould be singleton so set it up to be
     * @returns pointer to DiceStatsTracker
     */
    static getInstance(){
        if(DiceStatsTracker._singleton_pointer == null){
            DiceStatsTracker._singleton_pointer = new DiceStatsTracker();
        }
        return DiceStatsTracker._singleton_pointer;
    }

    /**
     * Constructor for the module. 
     * @returns {VOID}
     */
    constructor(){
        /* Singleton instance check */
        if (DiceStatsTracker._singleton_pointer != null){return;}
        //Get Settings and System Info
        // Store the current system, for settings purposes. It has to be set here, and not in the parent
        // class, because the system needs to initialize on foundry boot up before we can get its id
        //DS_GLOBALS.GAME_SYSTEM_ID = `${game.system.id}`;
        this.SYSTEM = `${game.system.id}`

        this.PLAYER_DATA_MAP = new Map();
        
        this.PLAYER_STATS_FORM_DIE_CHECKBOXES =   new Array(DS_GLOBALS.NUM_DIE_TYPES);
        this.GLOBAL_STATS_FORM_DIE_CHECKBOXES =   new Array(DS_GLOBALS.NUM_DIE_TYPES);
        this.COMPARISON_FORM_DIE_CHECKBOXES =     new Array(DS_GLOBALS.NUM_DIE_TYPES);
        // This can only be update when game system is ready to know player count
        //COMPARISON_FORM_PLAYER_CHECKBOXES =  []; 

        this.PLAYER_STATS_FORM_DIE_CHECKBOXES.fill(true);
        this.GLOBAL_STATS_FORM_DIE_CHECKBOXES.fill(true);
        this.COMPARISON_FORM_DIE_CHECKBOXES.fill(true);

        let ID = 'dice-stats';

        // A setting to determine whether players can see gm data
        game.settings.register(ID, DS_GLOBALS.MODULE_SETTINGS.PLAYERS_SEE_GM, {
            name: `DICE_STATS_TEXT.settings.${DS_GLOBALS.MODULE_SETTINGS.PLAYERS_SEE_GM}.Name`,
            default: false,
            type: Boolean,
            scope: 'world',
            config: true,
            hint: `DICE_STATS_TEXT.settings.${DS_GLOBALS.MODULE_SETTINGS.PLAYERS_SEE_GM}.Hint`
            //restricted: true    // Restric item to gamemaster only 
            //Only used for non world lvl items. All World items are already gm only
        })

        // A setting to determine whether players can see global data
        game.settings.register(ID, DS_GLOBALS.MODULE_SETTINGS.PLAYERS_SEE_GLOBAL, {
            name: `DICE_STATS_TEXT.settings.${DS_GLOBALS.MODULE_SETTINGS.PLAYERS_SEE_GLOBAL}.Name`,
            default: true,
            type: Boolean,
            scope: 'world',
            config: true,
            hint: `DICE_STATS_TEXT.settings.${DS_GLOBALS.MODULE_SETTINGS.PLAYERS_SEE_GLOBAL}.Hint`,
        })

        // A setting to determine whether players can see global data
        game.settings.register(ID, DS_GLOBALS.MODULE_SETTINGS.PLAYERS_SEE_GM_IN_GLOBAL, {
            name: `DICE_STATS_TEXT.settings.${DS_GLOBALS.MODULE_SETTINGS.PLAYERS_SEE_GM_IN_GLOBAL}.Name`,
            default: false,
            type: Boolean,
            scope: 'world',
            config: true,
            hint: `DICE_STATS_TEXT.settings.${DS_GLOBALS.MODULE_SETTINGS.PLAYERS_SEE_GM_IN_GLOBAL}.Hint`,
        })

        // A setting to determine whether players can see global data
        game.settings.register(ID, DS_GLOBALS.MODULE_SETTINGS.SHOW_BLIND_ROLLS_IMMEDIATE, {
            name: `DICE_STATS_TEXT.settings.${DS_GLOBALS.MODULE_SETTINGS.SHOW_BLIND_ROLLS_IMMEDIATE}.Name`,
            default: false,
            type: Boolean,
            scope: 'world',
            config: true,
            hint: `DICE_STATS_TEXT.settings.${DS_GLOBALS.MODULE_SETTINGS.SHOW_BLIND_ROLLS_IMMEDIATE}.Hint`,
        })

        // A setting to let db interaction be automated
        game.settings.register(ID, DS_GLOBALS.MODULE_SETTINGS.ENABLE_AUTO_DB , {
            name: `DICE_STATS_TEXT.settings.${DS_GLOBALS.MODULE_SETTINGS.ENABLE_AUTO_DB}.Name`,
            default: true,
            type: Boolean,
            scope: 'world',
            config: true,
            hint: `DICE_STATS_TEXT.settings.${DS_GLOBALS.MODULE_SETTINGS.ENABLE_AUTO_DB}.Hint`,
        })

        // A Setting to change access icons when using the new access items
        game.settings.register(ID, DS_GLOBALS.MODULE_SETTINGS.OTHER_ACCESS_BUTTON_ICONS, {
            name: `DICE_STATS_TEXT.settings.${DS_GLOBALS.MODULE_SETTINGS.OTHER_ACCESS_BUTTON_ICONS}.Name`,
            default: 'fas fa-dice-d20',
            type: String,
            scope: 'world',
            config: true,
            hint: game.i18n.localize(`DICE_STATS_TEXT.settings.${DS_GLOBALS.MODULE_SETTINGS.OTHER_ACCESS_BUTTON_ICONS}.Hint`),
        })

        // A setting to limit players to only see global stats
        game.settings.register(ID, DS_GLOBALS.MODULE_SETTINGS.PLAYERS_SEE_PLAYERS, {
            name: `DICE_STATS_TEXT.settings.${DS_GLOBALS.MODULE_SETTINGS.PLAYERS_SEE_PLAYERS}.Name`,
            default: true,
            type: Boolean,
            scope: 'world', //world = db, client = local
            config: true,   // show in module config
            hint: `DICE_STATS_TEXT.settings.${DS_GLOBALS.MODULE_SETTINGS.PLAYERS_SEE_PLAYERS}.Hint`,
            restricted: true,
        })

        // A setting that creates a popup for the gm everytime they join the game asking if they want to "clear all player data"
        // This clears all DB values and local values
        game.settings.register(ID, DS_GLOBALS.MODULE_SETTINGS.GLOBAL_ENABLE_CLEAR_ALL_STATS_POPUP, {
            name: `DICE_STATS_TEXT.settings.${DS_GLOBALS.MODULE_SETTINGS.GLOBAL_ENABLE_CLEAR_ALL_STATS_POPUP}.Name`,
            default: false,
            type: Boolean,
            scope: 'world', //world = db, client = local
            config: true,   // show in module config
            hint: `DICE_STATS_TEXT.settings.${DS_GLOBALS.MODULE_SETTINGS.GLOBAL_ENABLE_CLEAR_ALL_STATS_POPUP}.Hint`,
            restricted: true,
        })

        // A setting to allow quick enable or disable of saving roll data
        game.settings.register(ID, DS_GLOBALS.MODULE_SETTINGS.GLOBAL_PAUSE_SAVING_DATA, {
            name: `DICE_STATS_TEXT.settings.${DS_GLOBALS.MODULE_SETTINGS.GLOBAL_PAUSE_SAVING_DATA}.Name`,
            default: false,
            type: Boolean,
            scope: 'world', //world = db, client = local
            config: true,   // show in module config
            hint: `DICE_STATS_TEXT.settings.${DS_GLOBALS.MODULE_SETTINGS.GLOBAL_PAUSE_SAVING_DATA}.Hint`,
            restricted: true,
        })

        // -------- START TAB DISABLE SETTINGS -----------
        //  The following are a series of settings that let the users diable dice stats tabs if they dont want/need them 
        //      cluttering up the UI
    
        // Setting to disable d20-info tab [Def: Enabled]
        game.settings.register(ID, DS_GLOBALS.MODULE_SETTINGS.LOCAL_ENABLE_D20_DETAILS_TAB, {
            name: `DICE_STATS_TEXT.settings.${DS_GLOBALS.MODULE_SETTINGS.LOCAL_ENABLE_D20_DETAILS_TAB}.Name`,
            default: true,
            type: Boolean,
            scope: 'client', //world = db, client = local
            config: true,   // show in module config
            hint: `DICE_STATS_TEXT.settings.${DS_GLOBALS.MODULE_SETTINGS.LOCAL_ENABLE_D20_DETAILS_TAB}.Hint`,
        })

        // Setting to disable 2dx-info tab [Def: Disabled]
        game.settings.register(ID, DS_GLOBALS.MODULE_SETTINGS.LOCAL_ENABLE_2DX_DETAILS_TAB, {
            name: `DICE_STATS_TEXT.settings.${DS_GLOBALS.MODULE_SETTINGS.LOCAL_ENABLE_2DX_DETAILS_TAB}.Name`,
            default: false,
            type: Boolean,
            scope: 'client', //world = db, client = local
            config: true,   // show in module config
            hint: `DICE_STATS_TEXT.settings.${DS_GLOBALS.MODULE_SETTINGS.LOCAL_ENABLE_2DX_DETAILS_TAB}.Hint`,
        })

        // Setting to disable Hit Miss tab [Def: Enabled]
        game.settings.register(ID, DS_GLOBALS.MODULE_SETTINGS.LOCAL_ENABLE_HIT_MISS_INFO_TAB, {
            name: `DICE_STATS_TEXT.settings.${DS_GLOBALS.MODULE_SETTINGS.LOCAL_ENABLE_HIT_MISS_INFO_TAB}.Name`,
            default: true,
            type: Boolean,
            scope: 'client',    //world = db, client = local
            config: true,       // show in module config
            hint: `DICE_STATS_TEXT.settings.${DS_GLOBALS.MODULE_SETTINGS.LOCAL_ENABLE_HIT_MISS_INFO_TAB}.Hint`,
        })

        if(DiceStatsTracker._singleton_pointer == null){
            DiceStatsTracker._singleton_pointer = this;
        }
    }

    /**
     * Method used that parses messages from the chat. This is how we know a roll has happened, what die was rolled, and the value
     * @param {Message} msg - chat message object
     */
    parseMessage(msg)
    {
        // Get the player that the roll is associated with
        let playerInfo = this.PLAYER_DATA_MAP.get(msg.author.id);

        // Get the specific system parser to parse msg
        let parser = MESSAGE_PARSER_FACTORY.createMessageParser();

        // Parse the msg (Parser returns ROLL_OBJ[] which has some Hit / Miss stats + DIE_OBJ[] 
        /*{DS_MSG_ROLL_INFO[]}*/
        let rollInfoAry = parser.parseMsgRoll(msg);
        // Parser Should now get deleted here as we dont need it anymore once we have the ary
        //delete parser;
        
        // Guard for no roll info found
        if(!rollInfoAry?.length || rollInfoAry.length == 0){return;}

        // Save Each ROLL_INFO  from array into players local data
        // TODO: Update player & Die Stats to take in {DS_MSG_ROLL_INFO} object
        let updatedLocalRollValue = false;
        for(let rollIT=0; rollIT<rollInfoAry.length; rollIT++){

            playerInfo.saveRoll(rollInfoAry[rollIT]);
            updatedLocalRollValue = true;

        }

        //If AutoSave is Enabled by GM, only save updates to YOUR ROLLS to the DB
        //  Each person updates their own DB values but loads everyones in on joining the game
        if(game.settings.get(DS_GLOBALS.MODULE_ID, DS_GLOBALS.MODULE_SETTINGS.ENABLE_AUTO_DB)) 
        {
            //If it was my roll save my data to the db
            if(msg.author.id == game.user.id && updatedLocalRollValue)
            {
                this.saveMyPlayerData();
            }
        }
    }

    /**
     * Method used to add roll to a specifc player
     * @param {DS_MSG_ROLL_INFO[]} msgRollInfoObj - Important Roll and Die info from the msg
     * @param {USER_ID} owner - message owners player ID
     */
    addRoll(msgRollInfoObj, owner=undefined){
        // get roll info player object and guard against not getting a player
        let playerInfo = this.PLAYER_DATA_MAP.get(owner);
        if(playerInfo == undefined){return;}

        // Guard for no roll info found
        if(msgRollInfoObj == undefined || msgRollInfoObj.DiceInfo.length == 0){return;}

        // Only 1 roll object vs aray of roll objects
        let updatedLocalRollValue = false;
        if(!msgRollInfoObj.length){
            playerInfo.saveRoll(msgRollInfoObj);
        }else{
            // Save Each ROLL_INFO  from array into players local data
            // saveRoll( {DS_MSG_ROLL_INFO} )
            for(let rollIT=0; rollIT<msgRollInfoObj.length; rollIT++){
                playerInfo.saveRoll(msgRollInfoObj[rollIT]);
                updatedLocalRollValue = true;
            }
        }

        

        //If AutoSave is Enabled by GM, only save updates to YOUR ROLLS to the DB
        //  Each person updates their own DB values but loads everyones in on joining the game
        if(game.settings.get(DS_GLOBALS.MODULE_ID, DS_GLOBALS.MODULE_SETTINGS.ENABLE_AUTO_DB)) 
        {
            //If it was my roll save my data to the db
            if(owner == game.user.id && updatedLocalRollValue)
            {
                this.saveMyPlayerData();
            }
        } 
    }

    /**
     * Tell user to move any blind rolls they have saved from the blind roll ary 
     * to the data aray so the user can see the rolls on the charts
     */
    pushBlindRolls(){
        for (let user of game.users) {
            this.PLAYER_DATA_MAP.get(user.id)?.pushBlindRolls();
        }
    }

    /**
     * Erase all locally stored data
     */
    clearAllRollData(){
        for (let user of game.users) {
            let ds_playerData = this.PLAYER_DATA_MAP.get(user.id);
            if(ds_playerData){
                ds_playerData.clearDiceData();
                ds_playerData.clearRollData();
            }     
        }
    }

    /**
     * Erase a specific users locally stored data
     * @param {String} userid 
     */
    clearUsersRollData(userid){
        this.PLAYER_DATA_MAP.get(userid)?.clearDiceData();
    }

    /**
     * Save my players data to the DB
     */
    saveMyPlayerData(){
        let myData = this.PLAYER_DATA_MAP.get(game.user.id)
        if(myData)
        {
            DB_INTERACTION.saveUserData(myData); 
        }
    }
     
    /**
     * Load Every Players Data from the DB
     */
    loadAllPlayerData(){
        for(let tempUser of game.users)
        {
            var dbInfo = DB_INTERACTION.loadPlayerData(tempUser.id);
            if(dbInfo)
            {
                let localPlayerInfo = this.PLAYER_DATA_MAP.get(tempUser.id);

                if(localPlayerInfo)
                {
                    DB_INTERACTION.createPlayerObject(localPlayerInfo,dbInfo); //Puts db info into local player obj
                    this.PLAYER_DATA_MAP.set(tempUser.id,localPlayerInfo);
                }
            }
            else
            {
                //DB returned null clear local data
                console.log("Warning: No DB data Found, Setting local value to 0");
                let tempPlayer = this.PLAYER_DATA_MAP.get(tempUser.id);
                tempPlayer.clearAllRollData();
            }
        }
    }

    /**
     * Load your players data from the data
     */
    loadYourPlayerData(){
        var dbInfo = DB_INTERACTION.loadPlayerData(game.user.id);
        if(dbInfo)
        {
            let localPlayerInfo = this.PLAYER_DATA_MAP.get(game.user.id);

            DB_INTERACTION.createPlayerObject(localPlayerInfo, dbInfo);
            this.PLAYER_DATA_MAP.set(game.user.id, localPlayerInfo);
        } 
    }

    /**
     * Load other players data from the DB (Not yours)
     */
    loadOthersPlayerData(){
        for(let tempUser of game.users)
        {
            if(tempUser.id != game.user.id) //Dont load your data only other players
            {
                var dbInfo = DB_INTERACTION.loadPlayerData(tempUser.id);
                if(dbInfo)
                {
                    let localPlayerInfo = this.PLAYER_DATA_MAP.get(tempUser.id);

                    DB_INTERACTION.createPlayerObject(localPlayerInfo, dbInfo);
                    this.PLAYER_DATA_MAP.set(tempUser.id, localPlayerInfo);
                }
            }
        }
    }

    /**
     * Clear DB values
     */
    clear_database()
    {
        DB_INTERACTION.clearDB();
    }

    /**
     * 
     * @returns {STRING[]} = Array of player ID's
     */
    getPlayerIDs(){
        let ary;
        for (user_id of this.PLAYER_DATA_MAP.keys()){
            
            ary.push(
                {
                    id: user_id, 
                    name: game.users.get(user_id).name
                });
        }
        return ary;
    }
}
