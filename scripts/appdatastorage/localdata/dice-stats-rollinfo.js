import { DS_MSG_ROLL_INFO } from "./dice-stats-rollmsginfo.js";
import { DS_GLOBALS } from "../dice-stats-globals.js";

/**
 * Class to hold any info we want to track that applies 
 * to the roll as a whole rather than specific dice. 
 * 
 * This stuff is all system specific so check system parser on how we get this data from msg's
 * We fill in this data from the DS_MSG_ROLL_INFO obj
 */
export class LOCAL_ROLL_INFO {
    
    IS_ROLL_INFO_TRACKED = false;    // {BOOLEAN} Did we record any roll info?

    // Attack Info
    ATK_OUTCOME_TRACKER = [];       // {INT[]} Degree success for every attack; length=DEGREE_SUCCESS.size 
    NUM_UNTARGETED_ATKS = null;     // {INT}
    TOTAL_ATTACKS = null;           // {INT}

    // Save Info
    SAVE_OUTCOME_TRACKER = [];      // {INT[]} Degree success for Saves length=DEGREE_SUCCESS.size 
    NUM_UNTARGETED_SAVES = null;    // {INT}
    TOTAL_SAVES = null;             // {INT}

    // TODO: 
    // Other Checks Info
    // CHECKS_OUTCOME_TRACKER = [];    // {INT[]} Degree success for All Other Checks length=DEGREE_SUCCESS.size 

    // // advantage & disadvantage info
    // IS_ADV_INFO_TRACKED = false;
    // NUM_ROLL_WITH_ADVANTAGE = null; // {INT}
    // MISS_FROM_ADV = null;   //{INT}
    // HIT_FROM_ADV = null;    //{INT}
    // ADV_MISS_BOTH = null;   //{INT}
    // ADV_HIT_BOTH = null;    //{INT}
    // ADV_DO_NOTHING = null;  //{INT}

    // // Damage
    // TOTAL_DAMAGE = null;    //{INT} Total ammount of damage done

    constructor(){
        this.ATK_OUTCOME_TRACKER = new Array(DS_GLOBALS.NUM_ROLL_TYPES);
        this.ATK_OUTCOME_TRACKER.fill(0);
        this.NUM_UNTARGETED_ATKS = 0;
        this.TOTAL_ATTACKS = 0;

        this.SAVE_OUTCOME_TRACKER = new Array(DS_GLOBALS.NUM_ROLL_TYPES);
        this.SAVE_OUTCOME_TRACKER.fill(0);
        this.NUM_UNTARGETED_SAVES = 0;
        this.TOTAL_SAVES = 0;
        
        // this.NUM_ROLL_WITH_ADVANTAGE = 0;
        // this.MISS_FROM_ADV = 0;
        // this.HIT_FROM_ADV = 0;
        // this.ADV_HIT_BOTH = 0;
        // this.ADV_MISS_BOTH = 0;
        // this.ADV_DO_NOTHING = 0;
    }

    /**
     * Take the DS_MSG_ROLL_INFO obj (message roll data) and convert it to local storage obj
     * @param {DS_MSG_ROLL_INFO} msgRollObj 
     * @returns {VOID} - It updates the local obj
     */
    updateRollInfo(msgRollObj){
        /* msgRollObj vars:
        MSG OBJ INFO {DS_MSG_ROLL_INFO}:
        DiceInfo = [];         // {DS_MSG_DIE_ROLL_INFO}
        RollType=   null;      // {ROLL_TYPE} Type of roll that was made; Save, attack etc
        DegSuccess= null;      // {DEG_SUCCESS} HIT OR MISS VALUE
        CheckDiff = null;      // {INT} Integer Hit Or Missed By

        UsedAdvantage = null;  // {BOOLEAN}
        MissFromAdv = null;    // {BOOLEAN}
        HitFromAdv  = null;    // {BOOLEAN}
        */
        if(msgRollObj.RollType == DS_GLOBALS.ROLL_TYPE.ATK || msgRollObj.RollType == DS_GLOBALS.ROLL_TYPE.SAVE)
        {
            this.IS_ROLL_INFO_TRACKED = true;

            switch(msgRollObj.RollType){
                // save Attack Roll info
                case DS_GLOBALS.ROLL_TYPE.ATK:
                    this.TOTAL_ATTACKS++;
                    if(msgRollObj.DegSuccess){
                        this.ATK_OUTCOME_TRACKER[msgRollObj.DegSuccess]++;
                    }else{
                        this.NUM_UNTARGETED_ATKS++;
                    }
                    break;

                // save Save Roll info
                case DS_GLOBALS.ROLL_TYPE.SAVE:
                    this.TOTAL_SAVES++;
                    if(msgRollObj.DegSuccess){
                        this.SAVE_OUTCOME_TRACKER[msgRollObj.DegSuccess]++;
                    }else{
                        this.NUM_UNTARGETED_SAVES++;
                    }
                    break;

                default:
                    break;
            }

            // Track Advantage info if we know the degree success so they must have targeted a creature
            if(msgRollObj.DegSuccess && msgRollObj.UsedAdvantage){
                this.NUM_ROLL_WITH_ADVANTAGE++;
                if(msgRollObj.MissFromAdv){
                    this.MISS_FROM_ADV++;
                }else if(msgRollObj.HitFromAdv){
                    this.HIT_FROM_ADV++;
                }else{
                    this.ADV_DO_NOTHING++;
                }
            }
        }
    }

    /**
     * Clear all current data
     * @returns void
     */
    clearData(){
        this.IS_ROLL_INFO_TRACKED = false;    // {BOOLEAN} Did we record any roll info?

        // Attack Info
        this.ATK_OUTCOME_TRACKER.fill(0);       // {INT[]} Degree success for every attack; length=DEGREE_SUCCESS.size 
        this.NUM_UNTARGETED_ATKS = 0;     // {INT}
        this.TOTAL_ATTACKS = 0;           // {INT}

        // Save Info
        this.SAVE_OUTCOME_TRACKER.fill(0);      // {INT[]} Degree success for Saves length=DEGREE_SUCCESS.size 
        this.NUM_UNTARGETED_SAVES = 0;    // {INT}
        this.TOTAL_SAVES = 0;             // {INT}
    }
}