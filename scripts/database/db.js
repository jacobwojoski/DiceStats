import { DS_GLOBALS } from "../globals.js";
/**
 *  Foundry has 2 types of database options, Flags and Files. (Both are not a real DB)
 * 
 *  Files are better if you have alot of info. Where flags are better with less info.
 * 
 *  We are getting to what i might consider alot of info but using files for DB storage requires
 *  all users to have file access. 
 * 
 *  Sticking with added DB obj validation and Flags for the time beeing. With the potential option for File access 
 *  and a .json version of the DB. 
 */
export class DB_INTERACTION 
{
    /**
     * Method to create flags if they dont exist
     */
    static createDB()
    {
        //Not needed
    }

    /**
     * Method used to load all players info from the db
     * @param {String} userId //Long string of letters and numbers unique to each user
     */
    static loadPlayerData(userId)
    {
        let user = game.users.get(userId);
        if(user)
        {
            if(user.getFlag(DS_GLOBALS.MODULE_ID, DS_GLOBALS.MODULE_FLAGS.ROLLDATAFLAG))
            {
                return user.getFlag(DS_GLOBALS.MODULE_ID, DS_GLOBALS.MODULE_FLAGS.ROLLDATAFLAG);
            }
        }
        return null;
    }

    /**
     * Method used to convert DB info to A player OBJ
     * Objects are pass by ref so dont need to return
     * @param {PLAYER} tempPlayerObj Object were putting data in
     * @param {PLAYER (DB VERSION)} dbDataObj Object were taking data from
     */

    static createPlayerObject(tempPlayerObj, dbDataObj)
    {
        /*
        ----Info We need Coppied----
        class PLAYER {
            PLAYER_DICE = new Array(NUM_DIE_TYPES); //Aray of type<DIE_INFO>
            USERNAME = '';
            USERID = 0;
            GM = false;
        }

        class DIE_INFO {
            TYPE =          0;  //Type of die <DIE_TYPE> varable
            TOTAL_ROLLS =   0;
            ROLLS =         []; //Array size of die 
            BLIND_ROLLS = [];
            STREAK_SIZE =   -1;
            STREAK_INIT =   -1;
            STREAK_ISBLIND = false;
            LONGEST_STREAK =        -1;
            LONGEST_STREAK_INIT =   -1;

            MEAN =      0;
            MEDIAN =    0;
            MODE =      0;

            //Used for Specific Die Info (Currently only D20 on pf2e)
            MEANS = [];
            MEDIANS = [];
            MODES = [];
            ROLL_COUNTERS = [];

            ATK_ROLLS = [];
            DMG_ROLLS = [];
            SAVES_ROLLS = [];
            SKILLS_ROLLS = [];
            ABILITY_ROLLS = [];
            UNKNOWN_ROLLS = [];

            ATK_ROLLS_BLIND = [];
            DMG_ROLLS_BLIND = [];
            SAVES_ROLLS_BLIND = [];
            SKILLS_ROLLS_BLIND = [];
            ABILITY_ROLLS_BLIND = [];
            UNKNOWN_ROLLS_BLIND = [];
        }
    
        dbDataObj.USERNAME  ? tempPlayerObj.USERNAME = dbDataObj.USERNAME   : "";
        dbDataObj.USERID    ? tempPlayerObj.USERID = dbDataObj.USERID       : "";
        dbDataObj.GM        ? tempPlayerObj.GM = dbDataObj.GM               : "";
        
        for(let i=0; i<tempPlayerObj.PLAYER_DICE.length; i++)
        {
            let tempDieObj = tempPlayerObj.PLAYER_DICE[i];
            let dbDieDataObj = dbDataObj.PLAYER_DICE[i];

            // If the die obj doesnt exist no db values will exist so skip.
            if(!dbDieDataObj)
            {
                continue;
            }

            
            dbDieDataObj.TYPE ?         tempDieObj.TYPE =           dbDieDataObj.TYPE                   : "";
            dbDieDataObj.TOTAL_ROLLS ?  tempDieObj.TOTAL_ROLLS =    dbDieDataObj.TOTAL_ROLLS            : "";
            dbDieDataObj.ROLLS ?        tempDieObj.ROLLS =          [... dbDieDataObj.ROLLS]            : "";  
            dbDieDataObj.BLIND_ROLLS ?  tempDieObj.BLIND_ROLLS =    [... dbDieDataObj.BLIND_ROLLS]      : "";
            dbDieDataObj.STREAK_SIZE ?  tempDieObj.STREAK_SIZE =    dbDieDataObj.STREAK_SIZE            : "";
            dbDieDataObj.STREAK_INIT ?  tempDieObj.STREAK_INIT =    dbDieDataObj.STREAK_INIT            : "";
            dbDieDataObj.STREAK_ISBLIND ? tempDieObj.STREAK_ISBLIND = dbDieDataObj.STREAK_ISBLIND       : "";
            dbDieDataObj.LONGEST_STREAK ? tempDieObj.LONGEST_STREAK = dbDieDataObj.LONGEST_STREAK       : "";
            dbDieDataObj.LONGEST_STREAK_INIT ? tempDieObj.LONGEST_STREAK_INIT = dbDieDataObj.LONGEST_STREAK_INIT : "";

            dbDieDataObj.MEAN   ? tempDieObj.MEAN =     dbDieDataObj.MEAN   : "";
            dbDieDataObj.MEDIAN ? tempDieObj.MEDIAN =   dbDieDataObj.MEDIAN : "";
            dbDieDataObj.MODE   ? tempDieObj.MODE =     dbDieDataObj.MODE   : "";

            if(i == DS_GLOBALS.DIE_TYPE.D20)
            {
                dbDieDataObj.MEANS         ? tempDieObj.MEANS =          [...dbDieDataObj.MEANS]   : "";
                dbDieDataObj.MEDIANS       ? tempDieObj.MEDIANS =        [...dbDieDataObj.MEDIANS] : "";
                dbDieDataObj.MODES         ? tempDieObj.MODES =          [...dbDieDataObj.MODES]   : "";
                dbDieDataObj.ROLL_COUNTERS ? tempDieObj.ROLL_COUNTERS =  [...dbDieDataObj.ROLL_COUNTERS] : "";

                dbDieDataObj.ATK_ROLLS      ? tempDieObj.ATK_ROLLS =      [...dbDieDataObj.ATK_ROLLS]       : "";
                dbDieDataObj.DMG_ROLLS      ? tempDieObj.DMG_ROLLS =      [...dbDieDataObj.DMG_ROLLS]       : "";
                dbDieDataObj.SAVES_ROLLS    ? tempDieObj.SAVES_ROLLS =    [...dbDieDataObj.SAVES_ROLLS]     : "";
                dbDieDataObj.SKILLS_ROLLS   ? tempDieObj.SKILLS_ROLLS =   [...dbDieDataObj.SKILLS_ROLLS]    : "";
                dbDieDataObj.ABILITY_ROLLS  ? tempDieObj.ABILITY_ROLLS =  [...dbDieDataObj.ABILITY_ROLLS]   : "";
                dbDieDataObj.UNKNOWN_ROLLS  ? tempDieObj.UNKNOWN_ROLLS =  [...dbDieDataObj.UNKNOWN_ROLLS]   : "";

                dbDieDataObj.ATK_ROLLS_BLIND        ? tempDieObj.ATK_ROLLS_BLIND =        [...dbDieDataObj.ATK_ROLLS_BLIND]     : "";
                dbDieDataObj.DMG_ROLLS_BLIND        ? tempDieObj.DMG_ROLLS_BLIND =        [...dbDieDataObj.DMG_ROLLS_BLIND]     : "";
                dbDieDataObj.SAVES_ROLLS_BLIND      ? tempDieObj.SAVES_ROLLS_BLIND =      [...dbDieDataObj.SAVES_ROLLS_BLIND]   : "";
                dbDieDataObj.SKILLS_ROLLS_BLIND     ? tempDieObj.SKILLS_ROLLS_BLIND =     [...dbDieDataObj.SKILLS_ROLLS_BLIND]  : "";
                dbDieDataObj.ABILITY_ROLLS_BLIND    ? tempDieObj.ABILITY_ROLLS_BLIND =    [...dbDieDataObj.ABILITY_ROLLS_BLIND] : "";
                dbDieDataObj.UNKNOWN_ROLLS_BLIND    ? tempDieObj.UNKNOWN_ROLLS_BLIND =    [...dbDieDataObj.UNKNOWN_ROLLS_BLIND] : "";
            }
        }
        */
        
        dbDataObj?.USERNAME ? tempPlayerObj.USERNAME =    dbDataObj?.USERNAME : console.log("No USERNAME in DB");
        dbDataObj?.USERID   ? tempPlayerObj.USERID =      dbDataObj?.USERID   : console.log("No USERID in DB");
        dbDataObj?.GM       ? tempPlayerObj.GM =          dbDataObj?.GM       : console.log("No GM in DB");
        
        for(let i=0; i<tempPlayerObj.PLAYER_DICE.length; i++)
        {
            let tempDieObj = tempPlayerObj.PLAYER_DICE[i];
            let dbDieDataObj = dbDataObj.PLAYER_DICE[i];

            // If the die obj doesnt exist no db values will exist so skip.
            if(!dbDieDataObj)
            {
                continue;
            }

            dbDieDataObj?.DOESNT_EXIST ?    tempDieObj.BLIND_ROLLS =    [... dbDieDataObj.DOESNT_EXIST]    : console.log("No Blind Rolls in DB");
            dbDieDataObj?.TYPE ?            tempDieObj.TYPE =           dbDieDataObj.TYPE                  : console.log("No TYPE in DB");
            dbDieDataObj?.TOTAL_ROLLS ?     tempDieObj.TOTAL_ROLLS =    dbDieDataObj.TOTAL_ROLLS           : console.log("No TOTAL ROLLS in DB") ;
            
            dbDieDataObj?.ROLLS ?       tempDieObj.ROLLS =          [... dbDieDataObj.ROLLS]            : console.log("No ROLLS in DB");  
            dbDieDataObj?.BLIND_ROLLS ? tempDieObj.BLIND_ROLLS =    [... dbDieDataObj.BLIND_ROLLS]      : console.log("No BLIND ROLLS in DB");
            dbDieDataObj?.STREAK_SIZE ? tempDieObj.STREAK_SIZE =    dbDieDataObj.STREAK_SIZE            : console.log("No STREAK SIZE in DB");
            dbDieDataObj?.STREAK_INIT ? tempDieObj.STREAK_INIT =    dbDieDataObj.STREAK_INIT            : console.log("No STREAK INIT in DB");
            dbDieDataObj?.STREAK_ISBLIND ? tempDieObj.STREAK_ISBLIND = dbDieDataObj.STREAK_ISBLIND         : console.log("No STREAK ISBLIND in DB");
            dbDieDataObj?.LONGEST_STREAK ? tempDieObj.LONGEST_STREAK = dbDieDataObj.LONGEST_STREAK         : console.log("No LONGEST STREAK in DB");
            dbDieDataObj?.LONGEST_STREAK_INIT ? tempDieObj.LONGEST_STREAK_INIT = dbDieDataObj.LONGEST_STREAK_INIT  : console.log("No LONGEST STREAK INIT in DB");

            dbDieDataObj?.MEAN ?    tempDieObj.MEAN =     dbDieDataObj.MEAN   : console.log("No MEAN in DB");
            dbDieDataObj?.MEDIAN ?  tempDieObj.MEDIAN =   dbDieDataObj.MEDIAN : console.log("No MEDIAN in DB");
            dbDieDataObj?.MODE ?    tempDieObj.MODE =     dbDieDataObj.MODE   : console.log("No MODE ROLLS in DB");

            if(i == DS_GLOBALS.DIE_TYPE.D20)
            {
                dbDieDataObj?.MEANS ?       tempDieObj.MEANS =          [...dbDieDataObj.MEANS]   : console.log("No D20 MEANS  in DB");
                dbDieDataObj?.MEDIANS ?     tempDieObj.MEDIANS =        [...dbDieDataObj.MEDIANS] : console.log("No D20 MEDIANS in DB");
                dbDieDataObj?.MODES ?       tempDieObj.MODES =          [...dbDieDataObj.MODES]   : console.log("No  in DB");
                dbDieDataObj?.ROLL_COUNTERS ? tempDieObj.ROLL_COUNTERS =  [...dbDieDataObj.ROLL_COUNTERS] : console.log("No  in DB");

                dbDieDataObj?.ATK_ROLLS ?       tempDieObj.ATK_ROLLS =      [...dbDieDataObj.ATK_ROLLS]       : console.log("No ATK ROLLS in DB");
                dbDieDataObj?.DMG_ROLLS ?       tempDieObj.DMG_ROLLS =      [...dbDieDataObj.DMG_ROLLS]       : console.log("No DMG ROLLS in DB");
                dbDieDataObj?.SAVES_ROLLS ?     tempDieObj.SAVES_ROLLS =    [...dbDieDataObj.SAVES_ROLLS]     : console.log("No SAVE ROLLS in DB");
                dbDieDataObj?.SKILLS_ROLLS ?    tempDieObj.SKILLS_ROLLS =   [...dbDieDataObj.SKILLS_ROLLS]    : console.log("No SKILL ROLLS in DB");
                dbDieDataObj?.ABILITY_ROLLS ?   tempDieObj.ABILITY_ROLLS =  [...dbDieDataObj.ABILITY_ROLLS]   : console.log("No ABILITY ROLLS in DB");
                dbDieDataObj?.UNKNOWN_ROLLS ?   tempDieObj.UNKNOWN_ROLLS =  [...dbDieDataObj.UNKNOWN_ROLLS]   : console.log("No UNKNOWN ROLLS in DB");

                dbDieDataObj?.ATK_ROLLS_BLIND ?     tempDieObj.ATK_ROLLS_BLIND =        [...dbDieDataObj.ATK_ROLLS_BLIND]     : console.log("No BLIND ATK in DB");
                dbDieDataObj?.DMG_ROLLS_BLIND ?     tempDieObj.DMG_ROLLS_BLIND =        [...dbDieDataObj.DMG_ROLLS_BLIND]     : console.log("No BLIND DMG in DB");
                dbDieDataObj?.SAVES_ROLLS_BLIND ?   tempDieObj.SAVES_ROLLS_BLIND =      [...dbDieDataObj.SAVES_ROLLS_BLIND]   : console.log("No BLIND SAVES in DB");
                dbDieDataObj?.SKILLS_ROLLS_BLIND ?  tempDieObj.SKILLS_ROLLS_BLIND =     [...dbDieDataObj.SKILLS_ROLLS_BLIND]  : console.log("No BLIND SKILL in DB");
                dbDieDataObj?.ABILITY_ROLLS_BLIND ? tempDieObj.ABILITY_ROLLS_BLIND =    [...dbDieDataObj.ABILITY_ROLLS_BLIND] : console.log("No BLIND ATTR in DB");
                dbDieDataObj?.UNKNOWN_ROLLS_BLIND ? tempDieObj.UNKNOWN_ROLLS_BLIND =    [...dbDieDataObj.UNKNOWN_ROLLS_BLIND] : console.log("No BLIND UNKNOWN in DB");
            }
        }// end for(DIE in PLAYER_DICE)

        // -- Load in PLAYER_ROLL Info --
        if(dbDataObj?.PLAYER_ROLL_INFO)
        {
            let playerRollInfo = tempPlayerObj.PLAYER_ROLL_INFO;
            let dbRollInfo = dbDataObj.PLAYER_ROLL_INFO;

            playerRollInfo.IS_ROLL_INFO_TRACKED = dbRollInfo.IS_ROLL_INFO_TRACKED;

            playerRollInfo.ATK_OUTCOME_TRACKER = [...dbRollInfo.ATK_OUTCOME_TRACKER];
            playerRollInfo.NUM_UNTARGETED_ATKS = dbRollInfo.NUM_UNTARGETED_ATKS;
            playerRollInfo.TOTAL_ATTACKS = dbRollInfo.TOTAL_ATTACKS;

            playerRollInfo.SAVE_OUTCOME_TRACKER = [...dbRollInfo.SAVE_OUTCOME_TRACKER];
            playerRollInfo.NUM_UNTARGETED_SAVES = dbRollInfo.NUM_UNTARGETED_SAVES;
            playerRollInfo.TOTAL_SAVES = dbRollInfo.TOTAL_SAVES;
        }
        
    }

    /**
     * method to clear all info from the DB
     * Used if we want users to just keep track of per session stats rather then lifetime stats
     */
    static clearDB()
    {
        for(let aUser of game.users)
        {
            if(aUser)
            {
                if(aUser.getFlag(DS_GLOBALS.MODULE_ID, DS_GLOBALS.MODULE_FLAGS.ROLLDATAFLAG))
                {
                    aUser.unsetFlag(DS_GLOBALS.MODULE_ID, DS_GLOBALS.MODULE_FLAGS.ROLLDATAFLAG);
                }
            }
        }
    } 

    /**
     * Method used to clear a specific users data
     * @param {game.user} user
     */
    static async clearPlayer(user)
    {
        if(user)
        {
            if(user.getFlag(DS_GLOBALS.MODULE_ID, DS_GLOBALS.MODULE_FLAGS.ROLLDATAFLAG))
            {
                await user.unsetFlag(DS_GLOBALS.MODULE_ID, DS_GLOBALS.MODULE_FLAGS.ROLLDATAFLAG);
            }
        }
    }

     /**
     * Method called to save user info to the db, Can only save your own data!
     * @param {PLAYER} playerInfo 
     */
     static async saveUserData(playerInfo)
     {
         // Get Deep Copy rather than shallow copy the player object
         let objCpy = JSON.parse(JSON.stringify(playerInfo));
 
         //Get user ID
         let userid = objCpy.USERID;
 
         //Save copy into DB
         if(userid)
         {
             /**
             * the underlies update fn that set Flag calls seems to mess up and not update the DB causing the ERROR.
             * Think it has to do with saving data to forms makes a merge call not a obj.set. Doc talks a but about it
             * Uncommenting this should fix it but leaving it out to not interact with DB more than needed
             */
             await DB_INTERACTION.clearPlayer(game.users.get(userid));
 
             await game.users.get(userid)?.setFlag(DS_GLOBALS.MODULE_ID, DS_GLOBALS.MODULE_FLAGS.ROLLDATAFLAG, objCpy);
         }
     }
}