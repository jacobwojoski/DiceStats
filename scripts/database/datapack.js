import { DS_GLOBALS } from "../globals.js";
import { DICE_STATS_UTILS } from "../utils.js";
import { PLAYER } from "../appdatastorage/dice-stats-player.js";

//This file is for packaging data to be used in handlebars functions
// It converts the dice stats data into a format that is used by the displays
// Due to how handlebars loads data (Its really bad at using multi dim arrays)
//  we have to make a special object that is all 1D arrays and convert the info  
//  the display needs into the new object

export class DATA_PACKAGER
{
    //======================================================
    //================ Handlebars Data =====================
    //======================================================
    
    //Data displayed on the Player Handlebars Template Page
    //  We load dice-stats-player data into PLAYER_HANDLE_INFO when the popup is opened
    PLAYER_HNDL_INFO = 
    {
        PLAYER_NAME: '',

        //Is Auto DB feature enabled (Auto Save & Load)
        AUTO_DB_ACTIVE: false,

        //array<bools>[num_of_dice] Used by checkboxes on UI
        IS_DIE_DISPLAYED: [DS_GLOBALS.NUM_DIE_TYPES],

        //Arrays Use DIE_TYPE to get values for specific dice
        MEAN:   [DS_GLOBALS.NUM_DIE_TYPES],
        MEDIAN: [DS_GLOBALS.NUM_DIE_TYPES],
        MODE:   [DS_GLOBALS.NUM_DIE_TYPES],
        STREAK: [DS_GLOBALS.NUM_DIE_TYPES], //Array of strings
        S_IS_B: [DS_GLOBALS.NUM_DIE_TYPES],

        TOTAL_ROLLS:    [DS_GLOBALS.NUM_DIE_TYPES],
        D2_ROLL_DATA:   [DS_GLOBALS.MAX_DIE_VALUE[DS_GLOBALS.DIE_TYPE.D2]],
        D3_ROLL_DATA:   [DS_GLOBALS.MAX_DIE_VALUE[DS_GLOBALS.DIE_TYPE.D3]],
        D4_ROLL_DATA:   [DS_GLOBALS.MAX_DIE_VALUE[DS_GLOBALS.DIE_TYPE.D4]],
        D6_ROLL_DATA:   [DS_GLOBALS.MAX_DIE_VALUE[DS_GLOBALS.DIE_TYPE.D6]],
        D8_ROLL_DATA:   [DS_GLOBALS.MAX_DIE_VALUE[DS_GLOBALS.DIE_TYPE.D8]],
        D10_ROLL_DATA:  [DS_GLOBALS.MAX_DIE_VALUE[DS_GLOBALS.DIE_TYPE.D10]],
        D12_ROLL_DATA:  [DS_GLOBALS.MAX_DIE_VALUE[DS_GLOBALS.DIE_TYPE.D12]],
        D20_ROLL_DATA:  [DS_GLOBALS.MAX_DIE_VALUE[DS_GLOBALS.DIE_TYPE.D20]],
        D100_ROLL_DATA: [DS_GLOBALS.MAX_DIE_VALUE[DS_GLOBALS.DIE_TYPE.D100]],

        // -------- SUBCATAGORIZE DICE INFO --------
        // -- Only support D20's for PF2e 

        // Bool Array of Size NUM_DICE_TYPES
        HAVE_DICE_SUB_CATAGORIES: [DS_GLOBALS.NUM_DIE_TYPES],

        //D20 Info
        D20_ATK:[DS_GLOBALS.MAX_DIE_VALUE[DS_GLOBALS.DIE_TYPE.D20]],
        D20_DMG:[DS_GLOBALS.MAX_DIE_VALUE[DS_GLOBALS.DIE_TYPE.D20]],
        D20_SAVE:[DS_GLOBALS.MAX_DIE_VALUE[DS_GLOBALS.DIE_TYPE.D20]],
        D20_SKILL:[DS_GLOBALS.MAX_DIE_VALUE[DS_GLOBALS.DIE_TYPE.D20]],
        D20_ABILITY:[DS_GLOBALS.MAX_DIE_VALUE[DS_GLOBALS.DIE_TYPE.D20]],
        D20_UNKNOWN:[DS_GLOBALS.MAX_DIE_VALUE[DS_GLOBALS.DIE_TYPE.D20]],

        D20_MEAN:       [DS_GLOBALS.MAX_DIE_VALUE[DS_GLOBALS.DIE_TYPE.D20]],
        D20_MEDIAN:     [DS_GLOBALS.MAX_DIE_VALUE[DS_GLOBALS.DIE_TYPE.D20]],
        D20_MODE:       [DS_GLOBALS.MAX_DIE_VALUE[DS_GLOBALS.DIE_TYPE.D20]],

        //Size= NUM_ROLL_TYPES, total [atk, Dmg, save, skill, unknown] rolls
        D20_ROLLCOUNT:  [DS_GLOBALS.MAX_DIE_VALUE[DS_GLOBALS.NUM_ROLL_TYPES]], 

        BLIND_ROLL_COUNT: 0,

        /* ---- START ROLL DATA ---- */
        ROLL_DATA_IS_TRACKED: false,

        // Attack Info
        ATK_OUTCOME_TRACKER: [DS_GLOBALS.NUM_ROLL_TYPES],        // {INT[]} Degree success for every attack; length=DEGREE_SUCCESS.size 
        NUM_UNTARGETED_ATKS: 0,      // {INT}
        TOTAL_ATTACKS: 0,            // {INT}

        // Save Info
        SAVE_OUTCOME_TRACKER: [DS_GLOBALS.NUM_ROLL_TYPES],       // {INT[]} Degree success for Saves length=DEGREE_SUCCESS.size 
        NUM_UNTARGETED_SAVES: 0,     // {INT}
        TOTAL_SAVES: 0,              // {INT}

        // Advantage Info
        // NUM_ROLL_WITH_ADVANTAGE: 0,  // {INT}
        // MISS_FROM_ADV:  0,           // {INT}
        // HIT_FROM_ADV:   0,           // {INT}
        // ADV_DO_NOTHING: 0,           // {INT}
    }

    // Data displayed on the Global Dice Stats page (Combines all player data together)
    //  We load all data from main into GLOBAL_HANDLE_INFO when the popup is opened
    GLOBAL_HNDL_INFO = 
    {   
        //array<bools>[num_of_dice] Used by checkboxes on UI
        IS_DIE_DISPLAYED: [],

        //Is Auto DB feature enabled (Auto Save & Load)
        AUTO_DB_ACTIVE: false,
        
        //Arrays Use DIE_TYPE to get values for specific dice
        MEAN:[],
        MEDIAN:[],
        MODE:[],

        STREAK_PLAYER:[],//Array of Player Names
        STREAK:[], //Array of Strings [..."3,4,5,6", "4,5,6,7"...]
        S_IS_B:[], //Array of boolians to indicate if streak is blind 

        // String of playername per die. 
        // Could have tie's so String is format of ["NAME_ONE NAME_TWO NAME_THREE","NAME_THREE","NAME_FIVE NAME_SIX"] (Space Delinated)
        ROLLED_MOST_MAX_PLAYER:[], 
        ROLLED_MOST_MAX_ROLLCOUNT:[],
        ROLLED_MOST_MIN_PLAYER:[],
        ROLLED_MOST_MIN_ROLLCOUNT:[],

        TOTAL_ROLLS:    [], // total number of times each die type was rolled
        D2_ROLL_DATA:   [],
        D3_ROLL_DATA:   [],
        D4_ROLL_DATA:   [],
        D6_ROLL_DATA:   [],
        D8_ROLL_DATA:   [],
        D10_ROLL_DATA:  [],
        D12_ROLL_DATA:  [],
        D20_ROLL_DATA:  [],
        D100_ROLL_DATA: [],

        TOTAL_BLIND_ROLL_COUNT: 0,
    }

    //Handlebars doesnt handle 2D arrays well so this is jank af
    //  Every Array is the size of NUMBER_OF_PLAYERS(Including GM). We can't find that value till runtime.
    COMPARE_HNDL_INFO = 
    {
        //Ary of {Player Name, Player ID:}
        // [ {name:'', id:''}, {name:'', id:''}, {name:'', PlayerID:''} ... ]
        PLAYERS_SELECTED: [], //Selected Player ID's
        NUM_PLAYERS_SELECTED: 0,

        IS_DIE_DISPLAYED: [],
        TOTAL_ROLLS: [],
        MEAN:   [],
        MEDIAN: [],
        MODE:   [],

        D2_ROLL_DATA_1:   [],
        D2_ROLL_DATA_2:   [],

        D3_ROLL_DATA_1:   [],
        D3_ROLL_DATA_2:   [],
        D3_ROLL_DATA_3:   [],

        D4_ROLL_DATA_1:   [],
        D4_ROLL_DATA_2:   [],
        D4_ROLL_DATA_3:   [],
        D4_ROLL_DATA_4:   [],

        D6_ROLL_DATA_1:   [],
        D6_ROLL_DATA_2:   [],
        D6_ROLL_DATA_3:   [],
        D6_ROLL_DATA_4:   [],
        D6_ROLL_DATA_5:   [],
        D6_ROLL_DATA_6:   [],

        D8_ROLL_DATA_1:   [],
        D8_ROLL_DATA_2:   [],
        D8_ROLL_DATA_3:   [],
        D8_ROLL_DATA_4:   [],
        D8_ROLL_DATA_5:   [],
        D8_ROLL_DATA_6:   [],
        D8_ROLL_DATA_7:   [],
        D8_ROLL_DATA_8:   [],

        D10_ROLL_DATA_1:  [],
        D10_ROLL_DATA_2:  [],
        D10_ROLL_DATA_3:  [],
        D10_ROLL_DATA_4:  [],
        D10_ROLL_DATA_5:  [],
        D10_ROLL_DATA_6:  [],
        D10_ROLL_DATA_7:  [],
        D10_ROLL_DATA_8:  [],
        D10_ROLL_DATA_9:  [],
        D10_ROLL_DATA_10: [],

        D12_ROLL_DATA_1:  [],
        D12_ROLL_DATA_2:  [],
        D12_ROLL_DATA_3:  [],
        D12_ROLL_DATA_4:  [],
        D12_ROLL_DATA_5:  [],
        D12_ROLL_DATA_6:  [],
        D12_ROLL_DATA_7:  [],
        D12_ROLL_DATA_8:  [],
        D12_ROLL_DATA_9:  [],
        D12_ROLL_DATA_10: [],
        D12_ROLL_DATA_11: [],
        D12_ROLL_DATA_12: [],

        D20_ROLL_DATA_1:  [],
        D20_ROLL_DATA_2:  [],
        D20_ROLL_DATA_3:  [],
        D20_ROLL_DATA_4:  [],
        D20_ROLL_DATA_5:  [],
        D20_ROLL_DATA_6:  [],
        D20_ROLL_DATA_7:  [],
        D20_ROLL_DATA_8:  [],
        D20_ROLL_DATA_9:  [],
        D20_ROLL_DATA_10:  [],
        D20_ROLL_DATA_11:  [],
        D20_ROLL_DATA_12:  [],
        D20_ROLL_DATA_13:  [],
        D20_ROLL_DATA_14:  [],
        D20_ROLL_DATA_15:  [],
        D20_ROLL_DATA_16:  [],
        D20_ROLL_DATA_17:  [],
        D20_ROLL_DATA_18:  [],
        D20_ROLL_DATA_19:  [],
        D20_ROLL_DATA_20:  []
    }

    //======================================================
    //================= Player Package =====================
    //======================================================
    
    /**
     * Turn PLAYER Object into Handlebars Readable data Object
     *  Convert PLAYER Object into DATA_PACKAGER::PLAYER_HNDL_INFO
     *  Used in player.hbs
     * @param {PLAYER} playerInfo - PLAYER data object
     * @returns {PLAYER_HNDL_INFO} - Player info converted into handlebars struct
     */
    static packagePlayerData(playerInfo)
    {   
        let packedData = {};
        Object.assign(packedData, this.PLAYER_HNDL_INFO);

        packedData.AUTO_DB_ACTIVE = game.settings.get(DS_GLOBALS.MODULE_ID, DS_GLOBALS.MODULE_SETTINGS.ENABLE_AUTO_DB);

        packedData.IS_DIE_DISPLAYED = new Array(9);
        packedData.IS_DIE_DISPLAYED.fill(true);

        packedData.PLAYER_NAME = playerInfo.USERNAME;
        packedData.D2_ROLL_DATA =      [...playerInfo.PLAYER_DICE[0].ROLLS];
        packedData.D3_ROLL_DATA =      [...playerInfo.PLAYER_DICE[1].ROLLS];
        packedData.D4_ROLL_DATA =      [...playerInfo.PLAYER_DICE[2].ROLLS];
        packedData.D6_ROLL_DATA =      [...playerInfo.PLAYER_DICE[3].ROLLS];
        packedData.D8_ROLL_DATA =      [...playerInfo.PLAYER_DICE[4].ROLLS];
        packedData.D10_ROLL_DATA =     [...playerInfo.PLAYER_DICE[5].ROLLS];
        packedData.D12_ROLL_DATA =     [...playerInfo.PLAYER_DICE[6].ROLLS];
        packedData.D20_ROLL_DATA =     [...playerInfo.PLAYER_DICE[7].ROLLS];
        packedData.D100_ROLL_DATA =    [...playerInfo.PLAYER_DICE[8].ROLLS];

        packedData.TOTAL_ROLLS = new Array(DS_GLOBALS.NUM_DIE_TYPES);
        packedData.MEAN =   new Array(DS_GLOBALS.NUM_DIE_TYPES);
        packedData.MEDIAN = new Array(DS_GLOBALS.NUM_DIE_TYPES);
        packedData.MODE =   new Array(DS_GLOBALS.NUM_DIE_TYPES);
        packedData.STREAK = new Array(DS_GLOBALS.NUM_DIE_TYPES);
        packedData.S_IS_B = new Array(DS_GLOBALS.NUM_DIE_TYPES);

        for(let die=0; die<DS_GLOBALS.NUM_DIE_TYPES; die++){
            playerInfo.PLAYER_DICE[die].calculate();
            
            packedData.TOTAL_ROLLS[die] = playerInfo.PLAYER_DICE[die].TOTAL_ROLLS;
            packedData.MEAN[die] = playerInfo.PLAYER_DICE[die].MEAN;
            packedData.MEDIAN[die] = playerInfo.PLAYER_DICE[die].MEDIAN;
            packedData.MODE[die] = playerInfo.PLAYER_DICE[die].MODE;
            packedData.STREAK[die] = playerInfo.getStreakString(die);
            packedData.S_IS_B[die] = playerInfo.PLAYER_DICE[die].STREAK_ISBLIND;
        }
        
        // Set default of false to if we sub catagorize dice rolls
        packedData.HAVE_DICE_SUB_CATAGORIES = new Array(DS_GLOBALS.NUM_DIE_TYPES);
        packedData.HAVE_DICE_SUB_CATAGORIES.fill(false);

        // Handle if we hold sub catagory info for rolls
        //  - Currntly only supports PF2E, Working on adding D&D5e
        // * Note: If adding a new system that gets subcatagories,
        // *  You need to add stuff here and in the dice-stats-datapack::playerdata
        switch (game.system.id)
        {
            case 'pf2e':
            case 'dnd5e':
            case 'dragonbane':
                packedData.HAVE_DICE_SUB_CATAGORIES[DS_GLOBALS.DIE_TYPE.D20] = true;
                break;
                
            default:
                // By default we dont hold any sub roll info
        }

        if(packedData.HAVE_DICE_SUB_CATAGORIES[DS_GLOBALS.DIE_TYPE.D20]){
            packedData.D20_ATK = [...playerInfo.PLAYER_DICE[DS_GLOBALS.DIE_TYPE.D20].ATK_ROLLS];
            packedData.D20_DMG = [...playerInfo.PLAYER_DICE[DS_GLOBALS.DIE_TYPE.D20].DMG_ROLLS];
            packedData.D20_SAVE = [...playerInfo.PLAYER_DICE[DS_GLOBALS.DIE_TYPE.D20].SAVES_ROLLS];
            packedData.D20_SKILL = [...playerInfo.PLAYER_DICE[DS_GLOBALS.DIE_TYPE.D20].SKILLS_ROLLS];
            packedData.D20_ABILITY = [...playerInfo.PLAYER_DICE[DS_GLOBALS.DIE_TYPE.D20].ABILITY_ROLLS];
            packedData.D20_UNKNOWN = [...playerInfo.PLAYER_DICE[DS_GLOBALS.DIE_TYPE.D20].UNKNOWN_ROLLS];

            packedData.D20_MEAN = [...playerInfo.PLAYER_DICE[DS_GLOBALS.DIE_TYPE.D20].MEANS];
            packedData.D20_MEDIAN = [...playerInfo.PLAYER_DICE[DS_GLOBALS.DIE_TYPE.D20].MEDIANS];
            packedData.D20_MODE = [...playerInfo.PLAYER_DICE[DS_GLOBALS.DIE_TYPE.D20].MODES];
            packedData.D20_ROLLCOUNT = [...playerInfo.PLAYER_DICE[DS_GLOBALS.DIE_TYPE.D20].ROLL_COUNTERS];
        }

        packedData.BLIND_ROLL_COUNT = playerInfo.getBlindRollsCount();

        /* ---- Package roll info, Num hits crits etc ----*/
        packedData.ROLL_DATA_IS_TRACKED = playerInfo.PLAYER_ROLL_INFO.IS_ROLL_INFO_TRACKED;

        packedData.ATK_OUTCOME_TRACKER = [...playerInfo.PLAYER_ROLL_INFO.ATK_OUTCOME_TRACKER];       
        packedData.NUM_UNTARGETED_ATKS = playerInfo.PLAYER_ROLL_INFO.NUM_UNTARGETED_ATKS;     
        packedData.TOTAL_ATTACKS = playerInfo.PLAYER_ROLL_INFO.TOTAL_ATTACKS;           

        // Save Info
        packedData.SAVE_OUTCOME_TRACKER =[...playerInfo.PLAYER_ROLL_INFO.SAVE_OUTCOME_TRACKER];      
        packedData.NUM_UNTARGETED_SAVES = playerInfo.PLAYER_ROLL_INFO.NUM_UNTARGETED_SAVES;     
        packedData.TOTAL_SAVES = playerInfo.PLAYER_ROLL_INFO.TOTAL_SAVES;              

        // Advantage Info
        // packedData.NUM_ROLL_WITH_ADVANTAGE = playerInfo.PLAYER_ROLL_INFO.NUM_ROLL_WITH_ADVANTAGE; 
        // packedData.MISS_FROM_ADV =  playerInfo.PLAYER_ROLL_INFO.MISS_FROM_ADV;           
        // packedData.HIT_FROM_ADV =   playerInfo.PLAYER_ROLL_INFO.HIT_FROM_ADV;                    
        // packedData.ADV_DO_NOTHING=  playerInfo.PLAYER_ROLL_INFO.ADV_DO_NOTHING;            

        return packedData;
    }

    //======================================================
    //================= Global Package =====================
    //======================================================
    
    /**
     * Get stats from the global data (Mean median mode)
     * @param {DIE_TYPE} dieType 
     * @param {int[]} rollAry 
     * @param {GLOBAL_HNDL_INFO} handlebarsData 
     * @returns {GLOBAL_HNDL_INFO} with updated values 
     */
    static globalMathStatsHelper(dieType,rollAry,handlebarsData)
    {
        handlebarsData.MEAN[dieType] = DICE_STATS_UTILS.getMean(rollAry);
        handlebarsData.MEDIAN[dieType] = DICE_STATS_UTILS.getMedian(rollAry);
        handlebarsData.MODE[dieType] = DICE_STATS_UTILS.getMode(rollAry);
        return handlebarsData;
    }

    /**
     * 
     * @param {GLOBAL_HNDL_INFO} handlebarsData 
     * @returns {GLOBAL_HNDL_INFO} with updated values
     */
    static getGlobalMathStatsData(handlebarsData)
    {
        //For Every die type get stats
        handlebarsData = this.globalMathStatsHelper(0,handlebarsData.D2_ROLL_DATA,handlebarsData); 
        handlebarsData = this.globalMathStatsHelper(1,handlebarsData.D3_ROLL_DATA,handlebarsData); 
        handlebarsData = this.globalMathStatsHelper(2,handlebarsData.D4_ROLL_DATA,handlebarsData); 
        handlebarsData = this.globalMathStatsHelper(3,handlebarsData.D6_ROLL_DATA,handlebarsData); 
        handlebarsData = this.globalMathStatsHelper(4,handlebarsData.D8_ROLL_DATA,handlebarsData); 
        handlebarsData = this.globalMathStatsHelper(5,handlebarsData.D10_ROLL_DATA,handlebarsData); 
        handlebarsData = this.globalMathStatsHelper(6,handlebarsData.D12_ROLL_DATA,handlebarsData); 
        handlebarsData = this.globalMathStatsHelper(7,handlebarsData.D20_ROLL_DATA,handlebarsData); 
        handlebarsData = this.globalMathStatsHelper(8,handlebarsData.D100_ROLL_DATA,handlebarsData);
        return handlebarsData;
    }
    
    /**
     * method used to save the longest streak playername and streak values to handlebars data
     * @param {DIE_TYPE} dieType 
     * @param {PLAYER} player 
     * @param {GLOBAL_HNDL_INFO} handlebarsData 
     */
    static globalStreakDataHelper(dieType, player, handlebarsData){
        if(player.PLAYER_DICE[dieType].LONGEST_STREAK > 0)
        {
            handlebarsData.STREAK_PLAYER[dieType] = player.USERNAME;
            handlebarsData.STREAK[dieType] = player.getStreakString(dieType);
        }
    }

    /**
     * Get global streak data from players
     * @param {PLAYER[]} players 
     * @param {GLOBAL_HNDL_INFO} handlebarsData 
     * @param {boolean} includeGMrolls 
     * @returns {GLOBAL_HNDL_INFO}
     */
    static getGlobalStreakData(players, handlebarsData,includeGMrolls)
    {
        for(let itr = 0; itr < players.length; itr++){
            let plyr = players[itr];
            //See if we should skip adding data becasue its GM's
            if(plyr.GM && !includeGMrolls){continue};

            //For every die type
            for (let i = 0; i < 9; i++) {
                this.globalStreakDataHelper(i,plyr,handlebarsData);
            }
        }
        return handlebarsData;
    }
    
    /**
     * Method used to save info of player info to Handlebars data if they rolled the most MIN or most MAX for that die
     * @param {int} minRoll 
     * @param {int} maxRoll 
     * @param {DIE_TYPE} dieType 
     * @param {String} username 
     * @param {GLOBAL_HNDL_INFO} handlebarsData 
     * @returns {GLOBAL_HNDL_INFO}
     */
    static globalMaxMinDataHelper(minRoll, maxRoll, dieType, username, handlebarsData){
        //If num Rolls is 0, Number wasnt rolled by user so skip processing data
        //Most Min Rolls
        if(minRoll != 0){
            if(minRoll > handlebarsData.ROLLED_MOST_MIN_ROLLCOUNT[dieType]){
                handlebarsData.ROLLED_MOST_MIN_ROLLCOUNT[dieType] = minRoll;
                handlebarsData.ROLLED_MOST_MIN_PLAYER[dieType] = username;
            }else if(minRoll === handlebarsData.ROLLED_MOST_MIN_ROLLCOUNT[dieType]){
                //Tied For Most Min Rolls, Append username
                handlebarsData.ROLLED_MOST_MIN_PLAYER[dieType] += " "+username;
            }
        }

        //Most Max Rolls
        if(maxRoll != 0){
            if(maxRoll > handlebarsData.ROLLED_MOST_MAX_ROLLCOUNT[dieType]){
                handlebarsData.ROLLED_MOST_MAX_ROLLCOUNT[dieType] = maxRoll;
                handlebarsData.ROLLED_MOST_MAX_PLAYER[dieType] = username;
            }else if(maxRoll === handlebarsData.ROLLED_MOST_MAX_ROLLCOUNT[dieType]){
                //Tied For Most Min Rolls, Append username
                handlebarsData.ROLLED_MOST_MAX_PLAYER[dieType] += " "+username;
            }
        }
        return handlebarsData;
    }

    /**
     * //Get Max and min values from player data
     * @param {PLAYER[]} players 
     * @param {GLOBAL_HNDL_INFO} handlebarsData 
     * @param {bool} includeGMrolls 
     * @returns {GLOBAL_HNDL_INFO}
     */
    static getGlobalMaxMinData(players, handlebarsData,includeGMrolls)
    {
        //NOTE Cant use loops to pack data because Global Data Obj cant use 2d Arrays (Handlbars is lame)
        /**
        ROLLED_MOST_MAX_PLAYER:[], //Array of String
        ROLLED_MOST_MAX_ROLLCOUNT:[], //Array of ints
        ROLLED_MOST_MIN_PLAYER:[],  //Array of Strings
        ROLLED_MOST_MIN_ROLLCOUNT:[], //Array of Ints
         */
        let minRoll = 0;
        let maxRoll = 0;
        for(let itr = 0; itr < players.length; itr++){
            let plyr = players[itr];
            //See if we should skip adding ply data becasue its GM's stats
            if(plyr.GM && !includeGMrolls){continue};

            let myUsername = plyr.USERNAME;
            //D2 Data
                minRoll = plyr.PLAYER_DICE[0].ROLLS[0];
                maxRoll = plyr.PLAYER_DICE[0].ROLLS[1];

                handlebarsData = this.globalMaxMinDataHelper(minRoll, maxRoll, 0, myUsername, handlebarsData)
            //D3 Data
                minRoll = plyr.PLAYER_DICE[1].ROLLS[0];
                maxRoll = plyr.PLAYER_DICE[1].ROLLS[2];
                
                handlebarsData = this.globalMaxMinDataHelper(minRoll, maxRoll, 1, myUsername, handlebarsData)
            //D4 Data
                minRoll = plyr.PLAYER_DICE[2].ROLLS[0];
                maxRoll = plyr.PLAYER_DICE[2].ROLLS[3];
                
                handlebarsData = this.globalMaxMinDataHelper(minRoll, maxRoll, 2, myUsername, handlebarsData)
            //D6 Data
                minRoll = plyr.PLAYER_DICE[3].ROLLS[0];
                maxRoll = plyr.PLAYER_DICE[3].ROLLS[5];
                
                handlebarsData = this.globalMaxMinDataHelper(minRoll, maxRoll, 3, myUsername, handlebarsData)
            //D8 Data
                minRoll = plyr.PLAYER_DICE[4].ROLLS[0];
                maxRoll = plyr.PLAYER_DICE[4].ROLLS[7];
                
                handlebarsData = this.globalMaxMinDataHelper(minRoll, maxRoll, 4, myUsername, handlebarsData)
            //D10 Data
                minRoll = plyr.PLAYER_DICE[5].ROLLS[0];
                maxRoll = plyr.PLAYER_DICE[5].ROLLS[9];
                
                handlebarsData = this.globalMaxMinDataHelper(minRoll, maxRoll, 5, myUsername, handlebarsData)
            //D12 Data
                minRoll = plyr.PLAYER_DICE[6].ROLLS[0];
                maxRoll = plyr.PLAYER_DICE[6].ROLLS[11];
                
                handlebarsData = this.globalMaxMinDataHelper(minRoll, maxRoll, 6, myUsername, handlebarsData)
            //D20 Data
                minRoll = plyr.PLAYER_DICE[7].ROLLS[0];
                maxRoll = plyr.PLAYER_DICE[7].ROLLS[19];
    
                handlebarsData = this.globalMaxMinDataHelper(minRoll, maxRoll, 7, myUsername, handlebarsData)
            //D100 Data
                minRoll = plyr.PLAYER_DICE[8].ROLLS[0];
                maxRoll = plyr.PLAYER_DICE[8].ROLLS[99];

                handlebarsData = this.globalMaxMinDataHelper(minRoll, maxRoll, 8, myUsername, handlebarsData)   
        }
        return handlebarsData;
    }
    
    
    /**
     * Create Combined Arrays of all players rolls
     * Save Most Max and Most min Roll Data
     * @param {PLAYER[]} players 
     * @param {GLOBAL_HNDL_INFO} handlebarsData 
     * @param {bool} includeGMrolls 
     * @returns {GLOBAL_HNDL_INFO}
     */
    static getGlobalRollData(players, handlebarsData,includeGMrolls)
    {
        for(let itr = 0; itr < players.length; itr++){
            let plyr = players[itr];
            //See if we should skip adding ply data becasue its GM's stats
            if(plyr.GM && !includeGMrolls){continue};
            
            for (let i = 0; i < handlebarsData.D2_ROLL_DATA.length; i++) {
                handlebarsData.TOTAL_ROLLS[0] += plyr.PLAYER_DICE[0].ROLLS[i];
                handlebarsData.D2_ROLL_DATA[i] = handlebarsData.D2_ROLL_DATA[i] + plyr.PLAYER_DICE[0].ROLLS[i];
            }
            for (let i = 0; i < handlebarsData.D3_ROLL_DATA.length; i++) {
                handlebarsData.TOTAL_ROLLS[1] += plyr.PLAYER_DICE[1].ROLLS[i];
                handlebarsData.D3_ROLL_DATA[i] = handlebarsData.D3_ROLL_DATA[i] + plyr.PLAYER_DICE[1].ROLLS[i];
            }
            for (let i = 0; i < handlebarsData.D4_ROLL_DATA.length; i++) {
                handlebarsData.TOTAL_ROLLS[2] += plyr.PLAYER_DICE[2].ROLLS[i];
                handlebarsData.D4_ROLL_DATA[i] = handlebarsData.D4_ROLL_DATA[i] + plyr.PLAYER_DICE[2].ROLLS[i];
            }
            for (let i = 0; i < handlebarsData.D6_ROLL_DATA.length; i++) {
                handlebarsData.TOTAL_ROLLS[3] += plyr.PLAYER_DICE[3].ROLLS[i];
                handlebarsData.D6_ROLL_DATA[i] = handlebarsData.D6_ROLL_DATA[i] + plyr.PLAYER_DICE[3].ROLLS[i];
            }
            for (let i = 0; i < handlebarsData.D8_ROLL_DATA.length; i++) {
                handlebarsData.TOTAL_ROLLS[4] += plyr.PLAYER_DICE[4].ROLLS[i];
                handlebarsData.D8_ROLL_DATA[i] = handlebarsData.D8_ROLL_DATA[i] + plyr.PLAYER_DICE[4].ROLLS[i];
            }
            for (let i = 0; i < handlebarsData.D10_ROLL_DATA.length; i++) {
                handlebarsData.TOTAL_ROLLS[5] += plyr.PLAYER_DICE[5].ROLLS[i];
                handlebarsData.D10_ROLL_DATA[i] = handlebarsData.D10_ROLL_DATA[i] + plyr.PLAYER_DICE[5].ROLLS[i];
            }
            for (let i = 0; i < handlebarsData.D12_ROLL_DATA.length; i++) {
                handlebarsData.TOTAL_ROLLS[6] += plyr.PLAYER_DICE[6].ROLLS[i];
                handlebarsData.D12_ROLL_DATA[i] = handlebarsData.D12_ROLL_DATA[i] + plyr.PLAYER_DICE[6].ROLLS[i];
            }
            for (let i = 0; i < handlebarsData.D20_ROLL_DATA.length; i++) {
                handlebarsData.TOTAL_ROLLS[7] += plyr.PLAYER_DICE[7].ROLLS[i];
                handlebarsData.D20_ROLL_DATA[i] = handlebarsData.D20_ROLL_DATA[i] + plyr.PLAYER_DICE[7].ROLLS[i];
            }
            for (let i = 0; i < handlebarsData.D100_ROLL_DATA.length; i++) {
                handlebarsData.TOTAL_ROLLS[8] += plyr.PLAYER_DICE[8].ROLLS[i];
                handlebarsData.D100_ROLL_DATA[i] = handlebarsData.D100_ROLL_DATA[i] + plyr.PLAYER_DICE[8].ROLLS[i];
            }
        }
        return handlebarsData;
    }

    /**
     * Initalize array size and set default values in arrays
     * @param {GLOBAL_HNDL_INFO} handlebarsData 
     * @returns {GLOBAL_HNDL_INFO}
     */
    static setGlobalDefaultData(handlebarsData){
        //Initalize Arrays
        handlebarsData.D2_ROLL_DATA = new Array(2);
        handlebarsData.D3_ROLL_DATA = new Array(3);
        handlebarsData.D4_ROLL_DATA = new Array(4);
        handlebarsData.D6_ROLL_DATA = new Array(6);
        handlebarsData.D8_ROLL_DATA = new Array(8);
        handlebarsData.D10_ROLL_DATA = new Array(10);
        handlebarsData.D12_ROLL_DATA = new Array(12);
        handlebarsData.D20_ROLL_DATA = new Array(20);
        handlebarsData.D100_ROLL_DATA = new Array(100);

        handlebarsData.TOTAL_ROLLS = new Array(9);
        handlebarsData.MEAN =   new Array(9);
        handlebarsData.MEDIAN = new Array(9);
        handlebarsData.MODE =   new Array(9);

        handlebarsData.STREAK_PLAYER = new Array(9),
        handlebarsData.STREAK = new Array(9);
        handlebarsData.S_IS_B = new Array(9);

        handlebarsData.ROLLED_MOST_MAX_PLAYER =     new Array(9), 
        handlebarsData.ROLLED_MOST_MAX_ROLLCOUNT =  new Array(9),
        handlebarsData.ROLLED_MOST_MIN_PLAYER =     new Array(9),
        handlebarsData.ROLLED_MOST_MIN_ROLLCOUNT =  new Array(9)

        //Set default Values in Arrays
        handlebarsData.D2_ROLL_DATA.fill(0);
        handlebarsData.D3_ROLL_DATA.fill(0);
        handlebarsData.D4_ROLL_DATA.fill(0);
        handlebarsData.D6_ROLL_DATA.fill(0);
        handlebarsData.D8_ROLL_DATA.fill(0);
        handlebarsData.D10_ROLL_DATA.fill(0);
        handlebarsData.D12_ROLL_DATA.fill(0);
        handlebarsData.D20_ROLL_DATA.fill(0);
        handlebarsData.D100_ROLL_DATA.fill(0);

        handlebarsData.TOTAL_ROLLS.fill(0);
        handlebarsData.MEAN.fill(0.0);
        handlebarsData.MEDIAN.fill(0);
        handlebarsData.MODE.fill(0);

        handlebarsData.STREAK_PLAYER.fill("");
        handlebarsData.STREAK.fill(0);
        handlebarsData.S_IS_B.fill(0);

        handlebarsData.ROLLED_MOST_MAX_PLAYER.fill(""), 
        handlebarsData.ROLLED_MOST_MAX_ROLLCOUNT.fill(0),
        handlebarsData.ROLLED_MOST_MIN_PLAYER.fill(""),
        handlebarsData.ROLLED_MOST_MIN_ROLLCOUNT.fill(0);

        handlebarsData.TOTAL_BLIND_ROLL_COUNT = 0;

        return handlebarsData;
    }

    /**
     * Turn PLAYER[] into Handlebars Readable data object {GLOBAL_HNDL_INFO}
     * @param {PLAYER[]} playersArry 
     * @param {bool} includeGMrolls 
     * @returns GLOBAL_HNDL_INFO
     */
    static packageGlobalData(playersArry, includeGMrolls)
    {
        //TODO. packedData should be passed By ref so update fn's for that behavior
        //Well yk what they say. Nothings more perm than a temp solution that works...
        let packedData = {};
        Object.assign(packedData, this.PLAYER_HNDL_INFO);

        packedData.AUTO_DB_ACTIVE = game.settings.get(DS_GLOBALS.MODULE_ID, DS_GLOBALS.MODULE_SETTINGS.ENABLE_AUTO_DB);
        
        packedData = this.setGlobalDefaultData(packedData);
        
        packedData = this.getGlobalRollData(playersArry,packedData,includeGMrolls);
        packedData = this.getGlobalMaxMinData(playersArry,packedData,includeGMrolls);
        packedData = this.getGlobalStreakData(playersArry,packedData,includeGMrolls);
        packedData = this.getGlobalMathStatsData(packedData);
        
        for(let itr = 0; itr < playersArry.length; itr++){
            packedData.TOTAL_BLIND_ROLL_COUNT += playersArry[itr].getBlindRollsCount();
        }

        return packedData;
    }

    //======================================================
    //============== Compare Plyr Package ==================
    //======================================================
    
    /**
     * Get the number of players selected
     *  Part of Pack Compare Object
     * @param {*} compPlyrObjAry 
     * @returns 
     */
    static getNumPlayersSelected(compPlyrObjAry)
    {
        let numSel = 0;
        for(let plyr of compPlyrObjAry)
        {
            if(plyr.isChecked == true)
            {
                numSel = numSel+1; 
            }
        }
        return numSel;
    }

    /**
     * 
     * @param {*} plyrAry 
     * @param {*} plyrID 
     * @returns 
     */
    static isPlayerCheckedComparePlayerObj(plyrAry,plyrID)
    {
        for(let plyr of plyrAry)
        {
            if(plyr.id == plyrID)
            {
                return plyr.isChecked;
            }
        }

        return false;
    }

    /**
     * 
     * @param {*} players 
     * @param {*} plyrID 
     * @returns 
     */
    static getPlayerDataComparePlayerObj(players, plyrID)
    {
        for(let plyr of players)
        {
            if(plyr.USERID == plyrID)
            {
                return plyr;
            }
        }
        return null;
    }

    /**
     * 
     * @param {*} handlebarsData 
     * @param {*} playerObj 
     */
    static setPlayerRollDataComparePlayerObj(handlebarsData, playerObj)
    {
        handlebarsData.D2_ROLL_DATA_1.push(playerObj.PLAYER_DICE[0].ROLLS[0]); 
        handlebarsData.D2_ROLL_DATA_2.push(playerObj.PLAYER_DICE[0].ROLLS[1]);

        handlebarsData.D3_ROLL_DATA_1.push(playerObj.PLAYER_DICE[1].ROLLS[0]);
        handlebarsData.D3_ROLL_DATA_2.push(playerObj.PLAYER_DICE[1].ROLLS[1]);
        handlebarsData.D3_ROLL_DATA_3.push(playerObj.PLAYER_DICE[1].ROLLS[2]);

        handlebarsData.D4_ROLL_DATA_1.push(playerObj.PLAYER_DICE[2].ROLLS[0]);
        handlebarsData.D4_ROLL_DATA_2.push(playerObj.PLAYER_DICE[2].ROLLS[1]);
        handlebarsData.D4_ROLL_DATA_3.push(playerObj.PLAYER_DICE[2].ROLLS[2]);
        handlebarsData.D4_ROLL_DATA_4.push(playerObj.PLAYER_DICE[2].ROLLS[3]);

        handlebarsData.D6_ROLL_DATA_1.push(playerObj.PLAYER_DICE[3].ROLLS[0]);
        handlebarsData.D6_ROLL_DATA_2.push(playerObj.PLAYER_DICE[3].ROLLS[1]);
        handlebarsData.D6_ROLL_DATA_3.push(playerObj.PLAYER_DICE[3].ROLLS[2]);
        handlebarsData.D6_ROLL_DATA_4.push(playerObj.PLAYER_DICE[3].ROLLS[3]);
        handlebarsData.D6_ROLL_DATA_5.push(playerObj.PLAYER_DICE[3].ROLLS[4]);
        handlebarsData.D6_ROLL_DATA_6.push(playerObj.PLAYER_DICE[3].ROLLS[5]);

        handlebarsData.D8_ROLL_DATA_1.push(playerObj.PLAYER_DICE[4].ROLLS[0]);
        handlebarsData.D8_ROLL_DATA_2.push(playerObj.PLAYER_DICE[4].ROLLS[1]);
        handlebarsData.D8_ROLL_DATA_3.push(playerObj.PLAYER_DICE[4].ROLLS[2]);
        handlebarsData.D8_ROLL_DATA_4.push(playerObj.PLAYER_DICE[4].ROLLS[3]);
        handlebarsData.D8_ROLL_DATA_5.push(playerObj.PLAYER_DICE[4].ROLLS[4]);
        handlebarsData.D8_ROLL_DATA_6.push(playerObj.PLAYER_DICE[4].ROLLS[5]);
        handlebarsData.D8_ROLL_DATA_7.push(playerObj.PLAYER_DICE[4].ROLLS[6]);
        handlebarsData.D8_ROLL_DATA_8.push(playerObj.PLAYER_DICE[4].ROLLS[7]);

        handlebarsData.D10_ROLL_DATA_1.push(playerObj.PLAYER_DICE[5].ROLLS[0]);
        handlebarsData.D10_ROLL_DATA_2.push(playerObj.PLAYER_DICE[5].ROLLS[1]);
        handlebarsData.D10_ROLL_DATA_3.push(playerObj.PLAYER_DICE[5].ROLLS[2]);
        handlebarsData.D10_ROLL_DATA_4.push(playerObj.PLAYER_DICE[5].ROLLS[3]);
        handlebarsData.D10_ROLL_DATA_5.push(playerObj.PLAYER_DICE[5].ROLLS[4]);
        handlebarsData.D10_ROLL_DATA_6.push(playerObj.PLAYER_DICE[5].ROLLS[5]);
        handlebarsData.D10_ROLL_DATA_7.push(playerObj.PLAYER_DICE[5].ROLLS[6]);
        handlebarsData.D10_ROLL_DATA_8.push(playerObj.PLAYER_DICE[5].ROLLS[7]);
        handlebarsData.D10_ROLL_DATA_9.push(playerObj.PLAYER_DICE[5].ROLLS[8]);
        handlebarsData.D10_ROLL_DATA_10.push(playerObj.PLAYER_DICE[5].ROLLS[9]);

        handlebarsData.D12_ROLL_DATA_1.push(playerObj.PLAYER_DICE[6].ROLLS[0]);
        handlebarsData.D12_ROLL_DATA_2.push(playerObj.PLAYER_DICE[6].ROLLS[1]);
        handlebarsData.D12_ROLL_DATA_3.push(playerObj.PLAYER_DICE[6].ROLLS[2]);
        handlebarsData.D12_ROLL_DATA_4.push(playerObj.PLAYER_DICE[6].ROLLS[3]);
        handlebarsData.D12_ROLL_DATA_5.push(playerObj.PLAYER_DICE[6].ROLLS[4]);
        handlebarsData.D12_ROLL_DATA_6.push(playerObj.PLAYER_DICE[6].ROLLS[5]);
        handlebarsData.D12_ROLL_DATA_7.push(playerObj.PLAYER_DICE[6].ROLLS[6]);
        handlebarsData.D12_ROLL_DATA_8.push(playerObj.PLAYER_DICE[6].ROLLS[7]);
        handlebarsData.D12_ROLL_DATA_9.push(playerObj.PLAYER_DICE[6].ROLLS[8]);
        handlebarsData.D12_ROLL_DATA_10.push(playerObj.PLAYER_DICE[6].ROLLS[9]);
        handlebarsData.D12_ROLL_DATA_11.push(playerObj.PLAYER_DICE[6].ROLLS[10]);
        handlebarsData.D12_ROLL_DATA_12.push(playerObj.PLAYER_DICE[6].ROLLS[11]);

        handlebarsData.D20_ROLL_DATA_1.push(playerObj.PLAYER_DICE[7].ROLLS[0]);
        handlebarsData.D20_ROLL_DATA_2.push(playerObj.PLAYER_DICE[7].ROLLS[1]);
        handlebarsData.D20_ROLL_DATA_3.push(playerObj.PLAYER_DICE[7].ROLLS[2]);
        handlebarsData.D20_ROLL_DATA_4.push(playerObj.PLAYER_DICE[7].ROLLS[3]);
        handlebarsData.D20_ROLL_DATA_5.push(playerObj.PLAYER_DICE[7].ROLLS[4]);
        handlebarsData.D20_ROLL_DATA_6.push(playerObj.PLAYER_DICE[7].ROLLS[5]);
        handlebarsData.D20_ROLL_DATA_7.push(playerObj.PLAYER_DICE[7].ROLLS[6]);
        handlebarsData.D20_ROLL_DATA_8.push(playerObj.PLAYER_DICE[7].ROLLS[7]);
        handlebarsData.D20_ROLL_DATA_9.push(playerObj.PLAYER_DICE[7].ROLLS[8]);
        handlebarsData.D20_ROLL_DATA_10.push(playerObj.PLAYER_DICE[7].ROLLS[9]);
        handlebarsData.D20_ROLL_DATA_11.push(playerObj.PLAYER_DICE[7].ROLLS[10]);
        handlebarsData.D20_ROLL_DATA_12.push(playerObj.PLAYER_DICE[7].ROLLS[11]);
        handlebarsData.D20_ROLL_DATA_13.push(playerObj.PLAYER_DICE[7].ROLLS[12]);
        handlebarsData.D20_ROLL_DATA_14.push(playerObj.PLAYER_DICE[7].ROLLS[13]);
        handlebarsData.D20_ROLL_DATA_15.push(playerObj.PLAYER_DICE[7].ROLLS[14]);
        handlebarsData.D20_ROLL_DATA_16.push(playerObj.PLAYER_DICE[7].ROLLS[15]);
        handlebarsData.D20_ROLL_DATA_17.push(playerObj.PLAYER_DICE[7].ROLLS[16]);
        handlebarsData.D20_ROLL_DATA_18.push(playerObj.PLAYER_DICE[7].ROLLS[17]);
        handlebarsData.D20_ROLL_DATA_19.push(playerObj.PLAYER_DICE[7].ROLLS[18]);
        handlebarsData.D20_ROLL_DATA_20.push(playerObj.PLAYER_DICE[7].ROLLS[19]);
    }

    /**
     * 
     * @param {*} handlebarsData 
     */
    static setDefaultComparePlayerObj(handlebarsData){
        handlebarsData.D2_ROLL_DATA_1 = [];
        handlebarsData.D2_ROLL_DATA_2 = [];

        handlebarsData.D3_ROLL_DATA_1 = [];
        handlebarsData.D3_ROLL_DATA_2 = [];
        handlebarsData.D3_ROLL_DATA_3 = [];

        handlebarsData.D4_ROLL_DATA_1 = [];
        handlebarsData.D4_ROLL_DATA_2 = [];
        handlebarsData.D4_ROLL_DATA_3 = [];
        handlebarsData.D4_ROLL_DATA_4 = [];

        handlebarsData.D6_ROLL_DATA_1 = [];
        handlebarsData.D6_ROLL_DATA_2 = [];
        handlebarsData.D6_ROLL_DATA_3 = [];
        handlebarsData.D6_ROLL_DATA_4 = [];
        handlebarsData.D6_ROLL_DATA_5 = [];
        handlebarsData.D6_ROLL_DATA_6 = [];

        handlebarsData.D8_ROLL_DATA_1 = [];
        handlebarsData.D8_ROLL_DATA_2 = [];
        handlebarsData.D8_ROLL_DATA_3 = [];
        handlebarsData.D8_ROLL_DATA_4 = [];
        handlebarsData.D8_ROLL_DATA_5 = [];
        handlebarsData.D8_ROLL_DATA_6 = [];
        handlebarsData.D8_ROLL_DATA_7 = [];
        handlebarsData.D8_ROLL_DATA_8 = [];

        handlebarsData.D10_ROLL_DATA_1 = [];
        handlebarsData.D10_ROLL_DATA_2 = [];
        handlebarsData.D10_ROLL_DATA_3 = [];
        handlebarsData.D10_ROLL_DATA_4 = [];
        handlebarsData.D10_ROLL_DATA_5 = [];
        handlebarsData.D10_ROLL_DATA_6 = [];
        handlebarsData.D10_ROLL_DATA_7 = [];
        handlebarsData.D10_ROLL_DATA_8 = [];
        handlebarsData.D10_ROLL_DATA_9 = [];
        handlebarsData.D10_ROLL_DATA_10 = [];

        handlebarsData.D12_ROLL_DATA_1 = [];
        handlebarsData.D12_ROLL_DATA_2 = [];
        handlebarsData.D12_ROLL_DATA_3 = [];
        handlebarsData.D12_ROLL_DATA_4 = [];
        handlebarsData.D12_ROLL_DATA_5 = [];
        handlebarsData.D12_ROLL_DATA_6 = [];
        handlebarsData.D12_ROLL_DATA_7 = [];
        handlebarsData.D12_ROLL_DATA_8 = [];
        handlebarsData.D12_ROLL_DATA_9 = [];
        handlebarsData.D12_ROLL_DATA_10 = [];
        handlebarsData.D12_ROLL_DATA_11 = [];
        handlebarsData.D12_ROLL_DATA_12 = [];

        handlebarsData.D20_ROLL_DATA_1 = [];
        handlebarsData.D20_ROLL_DATA_2 = [];
        handlebarsData.D20_ROLL_DATA_3 = [];
        handlebarsData.D20_ROLL_DATA_4 = [];
        handlebarsData.D20_ROLL_DATA_5 = [];
        handlebarsData.D20_ROLL_DATA_6 = [];
        handlebarsData.D20_ROLL_DATA_7 = [];
        handlebarsData.D20_ROLL_DATA_8 = [];
        handlebarsData.D20_ROLL_DATA_9 = [];
        handlebarsData.D20_ROLL_DATA_10 = [];
        handlebarsData.D20_ROLL_DATA_11 = [];
        handlebarsData.D20_ROLL_DATA_12 = [];
        handlebarsData.D20_ROLL_DATA_13 = [];
        handlebarsData.D20_ROLL_DATA_14 = [];
        handlebarsData.D20_ROLL_DATA_15 = [];
        handlebarsData.D20_ROLL_DATA_16 = [];
        handlebarsData.D20_ROLL_DATA_17 = [];
        handlebarsData.D20_ROLL_DATA_18 = [];
        handlebarsData.D20_ROLL_DATA_19 = [];
        handlebarsData.D20_ROLL_DATA_20 = [];

        handlebarsData.IS_DIE_DISPLAYED = [];

        handlebarsData.D2_ROLL_DATA_1.push('1'); 
        handlebarsData.D2_ROLL_DATA_2.push('2');

        handlebarsData.D3_ROLL_DATA_1.push('1');
        handlebarsData.D3_ROLL_DATA_2.push('2');
        handlebarsData.D3_ROLL_DATA_3.push('3');

        handlebarsData.D4_ROLL_DATA_1.push('1');
        handlebarsData.D4_ROLL_DATA_2.push('2');
        handlebarsData.D4_ROLL_DATA_3.push('3');
        handlebarsData.D4_ROLL_DATA_4.push('4');

        handlebarsData.D6_ROLL_DATA_1.push('1');
        handlebarsData.D6_ROLL_DATA_2.push('2');
        handlebarsData.D6_ROLL_DATA_3.push('3');
        handlebarsData.D6_ROLL_DATA_4.push('4');
        handlebarsData.D6_ROLL_DATA_5.push('5');
        handlebarsData.D6_ROLL_DATA_6.push('6');

        handlebarsData.D8_ROLL_DATA_1.push('1');
        handlebarsData.D8_ROLL_DATA_2.push('2');
        handlebarsData.D8_ROLL_DATA_3.push('3');
        handlebarsData.D8_ROLL_DATA_4.push('4');
        handlebarsData.D8_ROLL_DATA_5.push('5');
        handlebarsData.D8_ROLL_DATA_6.push('6');
        handlebarsData.D8_ROLL_DATA_7.push('7');
        handlebarsData.D8_ROLL_DATA_8.push('8');

        handlebarsData.D10_ROLL_DATA_1.push('1');
        handlebarsData.D10_ROLL_DATA_2.push('2');
        handlebarsData.D10_ROLL_DATA_3.push('3');
        handlebarsData.D10_ROLL_DATA_4.push('4');
        handlebarsData.D10_ROLL_DATA_5.push('5');
        handlebarsData.D10_ROLL_DATA_6.push('6');
        handlebarsData.D10_ROLL_DATA_7.push('7');
        handlebarsData.D10_ROLL_DATA_8.push('8');
        handlebarsData.D10_ROLL_DATA_9.push('9');
        handlebarsData.D10_ROLL_DATA_10.push('10');

        handlebarsData.D12_ROLL_DATA_1.push('1');
        handlebarsData.D12_ROLL_DATA_2.push('2');
        handlebarsData.D12_ROLL_DATA_3.push('3');
        handlebarsData.D12_ROLL_DATA_4.push('4');
        handlebarsData.D12_ROLL_DATA_5.push('5');
        handlebarsData.D12_ROLL_DATA_6.push('6');
        handlebarsData.D12_ROLL_DATA_7.push('7');
        handlebarsData.D12_ROLL_DATA_8.push('8');
        handlebarsData.D12_ROLL_DATA_9.push('9');
        handlebarsData.D12_ROLL_DATA_10.push('10');
        handlebarsData.D12_ROLL_DATA_11.push('11');
        handlebarsData.D12_ROLL_DATA_12.push('12');

        handlebarsData.D20_ROLL_DATA_1.push('1');
        handlebarsData.D20_ROLL_DATA_2.push('2');
        handlebarsData.D20_ROLL_DATA_3.push('3');
        handlebarsData.D20_ROLL_DATA_4.push('4');
        handlebarsData.D20_ROLL_DATA_5.push('5');
        handlebarsData.D20_ROLL_DATA_6.push('6');
        handlebarsData.D20_ROLL_DATA_7.push('7');
        handlebarsData.D20_ROLL_DATA_8.push('8');
        handlebarsData.D20_ROLL_DATA_9.push('9');
        handlebarsData.D20_ROLL_DATA_10.push('10');
        handlebarsData.D20_ROLL_DATA_11.push('11');
        handlebarsData.D20_ROLL_DATA_12.push('12');
        handlebarsData.D20_ROLL_DATA_13.push('13');
        handlebarsData.D20_ROLL_DATA_14.push('14');
        handlebarsData.D20_ROLL_DATA_15.push('15');
        handlebarsData.D20_ROLL_DATA_16.push('16');
        handlebarsData.D20_ROLL_DATA_17.push('17');
        handlebarsData.D20_ROLL_DATA_18.push('18');
        handlebarsData.D20_ROLL_DATA_19.push('19');
        handlebarsData.D20_ROLL_DATA_20.push('20');
    }

    /**
     * ComparePlayersForm::COMPARE_PLAYERS_LIST
     * @param {*} COMPARE_PLAYERS_LIST 
     * @param {*} playersArry 
     * @param {*} includeGMrolls 
     * @returns 
     */
    static packageComparePlayerData(COMPARE_PLAYERS_LIST, playersArry, includeGMrolls)
    {
        //Create dataObject
        let packedData = {};
        Object.assign(packedData, this.COMPARE_HNDL_INFO);

        packedData.PLAYERS_SELECTED = [...COMPARE_PLAYERS_LIST];
        packedData.NUM_PLAYERS_SELECTED = this.getNumPlayersSelected(packedData.PLAYERS_SELECTED);

        this.setDefaultComparePlayerObj(packedData);

        for(let plyr of packedData.PLAYERS_SELECTED)
        {
            if(plyr.isChecked)
            {
                let playerObj = this.getPlayerDataComparePlayerObj(playersArry, plyr.id);
                if(includeGMrolls == false && playerObj.GM == true)
                {
                    //skip because we dont want to allow adding gm data due to setting
                }
                else
                {
                    this.setPlayerRollDataComparePlayerObj(packedData, playerObj);
                }
            }
        }

        //this.setRollStatsComparePlayerObj(packedData);
        return packedData;
    }
    
    //======================================================
    //================= Export Package =====================
    //======================================================
    
    /**
     * Save Global Data to a file to allow for importing
     * @param {PLAYER[]} playersArry 
     */
    static exportGlobalDataAsJson(playersArry)
    {
        
    }

    /**
     * Save Global Data to a file to keep track off in external program (Excel/google sheets/ect)
     * @param {PLAYER[]} playersArry 
     */
    static exportGlobalDataAsCSV(playersArry)
    {

    }
}
