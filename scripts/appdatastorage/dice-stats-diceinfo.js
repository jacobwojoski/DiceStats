import { DS_GLOBALS } from "../dice-stats-globals.js";
import { DICE_STATS_UTILS } from "../dice-stats-utils.js";
import { DS_MSG_DIE_ROLL_INFO } from "./dice-stats-rollmsginfo.js";

//Storage Class for Each Die
//Die rolls are stored in array thats size of the die type 
//That way can just incrament each position rather then store array of increasing size
//Ex, D20 roll was 16 -> Rolls[(16-1)]++;
export class DIE_INFO {
    TYPE =          0;  //Type of die <DIE_TYPE> varable
    MAX =           0;  //MAX Value On Die , ex 6, 10, 12, 20
    TOTAL_ROLLS =   0;
    ROLLS =         []; //Array size of die 
    BLIND_ROLLS = [];
    STREAK_SIZE =   -1;
    STREAK_INIT =   -1;
    STREAK_ISBLIND = false;
    LONGEST_STREAK =        -1;
    LONGEST_STREAK_INIT =   -1;

    MEAN =      0.0; //(avg)
    MEDIAN =    0;
    MODE =      0;

    //Basic Stats About Specific Type of Rolls. Should prolly be called 
    //  D20_MEANS, D20_MEDIANS....etc
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
    PERCEPTION_ROLLS = [];
    INITIATIVE_ROLLS = [];

    ATK_ROLLS_BLIND = [];
    DMG_ROLLS_BLIND = [];
    SAVES_ROLLS_BLIND = [];
    SKILLS_ROLLS_BLIND = [];
    ABILITY_ROLLS_BLIND = [];
    UNKNOWN_ROLLS_BLIND = [];
    PERCEPTION_ROLLS_BLIND = [];
    INITIATIVE_ROLLS_BLIND = [];

    /* Dice pools (Roll [XdY kh 1] or Roll [XdY kl 1]) There are so many different ways systems can use dice pools 
            So we're only handling the FitD keep highest or lowest 1 die for now 
    */
    DICE_POOL_ROLLS = [];   /* 2d array - [die-type][pool-size][die-result]=num-times-happened Initial-implementation has pool sizes of 1-10+ */
    DICE_POOL_TOTALS = [];  /* 1d array - [die-type][die-result]=total_rolls (add roll totals from all pool sizes at specific die result) */

    /* 2dX Rolls */
    TWO_DX_ROLLS = []; /* 1d array - [die-result]*/

    /**
     * constructor set values to defaults
     * @param {int} dieMax - max value the die can be
     */
    constructor(dieType = 9){
        this.MAX = DS_GLOBALS.MAX_DIE_VALUE[dieType];
        this.TYPE = dieType;
        this.STREAK_SIZE = -1;
        this.STREAK_INIT = -1;
        this.LONGEST_STREAK = 0;
        this.LONGEST_STREAK_INIT = 0;

        this.ROLLS = new Array(this.MAX);
        this.ROLLS.fill(0);

        this.BLIND_ROLLS = new Array(this.MAX);
        this.BLIND_ROLLS.fill(0);
        
        this.ROLL_COUNTERS = new Array(DS_GLOBALS.NUM_ROLL_TYPES);
        this.MEANS = new Array(DS_GLOBALS.NUM_ROLL_TYPES);
        this.MEDIANS = new Array(DS_GLOBALS.NUM_ROLL_TYPES);
        this.MODES = new Array(DS_GLOBALS.NUM_ROLL_TYPES);

        this.ATK_ROLLS = new Array(this.MAX);
        this.DMG_ROLLS = new Array(this.MAX);
        this.SAVES_ROLLS = new Array(this.MAX);
        this.SKILLS_ROLLS = new Array(this.MAX);
        this.ABILITY_ROLLS = new Array(this.MAX);
        this.UNKNOWN_ROLLS = new Array(this.MAX);

        this.ATK_ROLLS_BLIND = new Array(this.MAX);
        this.DMG_ROLLS_BLIND = new Array(this.MAX);
        this.SAVES_ROLLS_BLIND = new Array(this.MAX);
        this.SKILLS_ROLLS_BLIND = new Array(this.MAX);
        this.ABILITY_ROLLS_BLIND = new Array(this.MAX);
        this.UNKNOWN_ROLLS_BLIND = new Array(this.MAX);

        this.ROLL_COUNTERS.fill(0);
        this.MEANS.fill(0);
        this.MEDIANS.fill(0);
        this.MODES.fill(0);

        this.ATK_ROLLS.fill(0);
        this.DMG_ROLLS.fill(0);
        this.SAVES_ROLLS.fill(0);
        this.SKILLS_ROLLS.fill(0);
        this.ABILITY_ROLLS.fill(0);
        this.UNKNOWN_ROLLS.fill(0);

        this.ATK_ROLLS_BLIND.fill(0);
        this.DMG_ROLLS_BLIND.fill(0);
        this.SAVES_ROLLS_BLIND.fill(0);
        this.SKILLS_ROLLS_BLIND.fill(0);
        this.ABILITY_ROLLS_BLIND.fill(0);
        this.UNKNOWN_ROLLS_BLIND.fill(0);
        
    }

    /**
     * Update and save streak info (Streaks are series of incrementing dice rolls)
     * @param {int} currentRoll - current die roll value
     * @param {bool} isBlind was the roll a blind roll or not
     */
    updateStreak(currentRoll, isBlind){
        //Streak Size will always be at least 1 unless its right after initalization
        if(this.STREAK_INIT + this.STREAK_SIZE != currentRoll){
            //Streak resets
            this.STREAK_SIZE = 1;
            this.STREAK_INIT = currentRoll;
            this.STREAK_ISBLIND = isBlind;
        }else{
            //Streak Incramented
            this.STREAK_SIZE++;
            this.STREAK_ISBLIND = this.STREAK_ISBLIND || isBlind;
            //Check if longest streak and update if it is
            if(this.STREAK_SIZE > this.LONGEST_STREAK){
                this.LONGEST_STREAK = this.STREAK_SIZE;
                this.LONGEST_STREAK_INIT = this.STREAK_INIT;
            }
        }
    }

    /**
     * Clear all die info
     */
    clearData(){
        this.TOTAL_ROLLS =   0;
        this.ROLLS.fill(0);
        this.BLIND_ROLLS.fill(0);

        this.ROLL_COUNTERS.fill(0);
        this.MEANS.fill(0);
        this.MEDIANS.fill(0);
        this.MODES.fill(0);

        this.ATK_ROLLS.fill(0);
        this.DMG_ROLLS.fill(0);
        this.SAVES_ROLLS.fill(0);
        this.SKILLS_ROLLS.fill(0);
        this.ABILITY_ROLLS.fill(0);
        this.UNKNOWN_ROLLS.fill(0);

        this.ATK_ROLLS_BLIND.fill(0);
        this.DMG_ROLLS_BLIND.fill(0);
        this.SAVES_ROLLS_BLIND.fill(0);
        this.SKILLS_ROLLS_BLIND.fill(0);
        this.ABILITY_ROLLS_BLIND.fill(0);
        this.UNKNOWN_ROLLS_BLIND.fill(0);

        this.STREAK_SIZE =   -1;
        this.STREAK_INIT =   -1;
        this.STREAK_ISBLIND = false;
        this.LONGEST_STREAK =        -1;
        this.LONGEST_STREAK_INIT =   -1;

        this.MEAN =      0.0;
        this.MEDIAN =    0;
        this.MODE =      0;
    }

    /**
     * Add a roll for whatever die we currently are
     * @param {DS_MSG_DIE_ROLL_INFO} msgDieInfo 
     */
    addRoll(msgDieInfo){
        // Guard for being in wrong die object & we got a valid roll value
        if(msgDieInfo.DieType != this.TYPE && msgDieInfo.RollValue <= this.MAX ){
            return;}

        let roll = msgDieInfo.RollValue;
        let isBlind = msgDieInfo.IsBlind;
        let rollType = msgDieInfo.RollType;

        this.TOTAL_ROLLS++;
        this.ROLL_COUNTERS[rollType] ++;
        this.updateStreak(roll, isBlind)

        var dontHideBlindRolls = game.settings.get(DS_GLOBALS.MODULE_ID, DS_GLOBALS.MODULE_SETTINGS.SHOW_BLIND_ROLLS_IMMEDIATE);
        if(!isBlind || dontHideBlindRolls){
            this.ROLLS[roll-1] = this.ROLLS[roll-1]+1;
        }else{
            this.BLIND_ROLLS[roll-1] = this.BLIND_ROLLS[roll-1]+1; 
        }

        //Add roll to sub type array
        switch(rollType)
        {
            case DS_GLOBALS.ROLL_TYPE.ATK :
                if(isBlind){
                    this.ATK_ROLLS_BLIND[roll-1] = this.ATK_ROLLS_BLIND[roll-1]+1;
                }else{
                    this.ATK_ROLLS[roll-1] = this.ATK_ROLLS[roll-1]+1;
                }
                break;
            case DS_GLOBALS.ROLL_TYPE.DMG :
                if(isBlind){
                    this.DMG_ROLLS_BLIND[roll-1] = this.DMG_ROLLS_BLIND[roll-1]+1;
                }else{
                    this.DMG_ROLLS[roll-1] = this.DMG_ROLLS[roll-1]+1;
                }
                break;
            case DS_GLOBALS.ROLL_TYPE.SAVE :
                if(isBlind){
                    this.SAVES_ROLLS_BLIND[roll-1] = this.SAVES_ROLLS_BLIND[roll-1]+1;
                }else{
                    this.SAVES_ROLLS[roll-1] = this.SAVES_ROLLS[roll-1]+1;
                }
                break;
            case DS_GLOBALS.ROLL_TYPE.SKILL :
                if(isBlind){
                    this.SKILLS_ROLLS_BLIND[roll-1] = this.SKILLS_ROLLS_BLIND[roll-1]+1;
                }else{
                    this.SKILLS_ROLLS[roll-1] = this.SKILLS_ROLLS[roll-1]+1;
                }
                break;
            case DS_GLOBALS.ROLL_TYPE.ABILITY :
                if(isBlind){
                    this.ABILITY_ROLLS_BLIND[roll-1] = this.ABILITY_ROLLS_BLIND[roll-1]+1;
                }else{
                    this.ABILITY_ROLLS[roll-1] = this.ABILITY_ROLLS[roll-1]+1;
                }
                break;
            case DS_GLOBALS.ROLL_TYPE.PERCEPTION:
            case DS_GLOBALS.ROLL_TYPE.INITIATIVE:
            case DS_GLOBALS.ROLL_TYPE.UNKNOWN :
                if(isBlind){
                    this.UNKNOWN_ROLLS_BLIND[roll-1] = this.UNKNOWN_ROLLS_BLIND[roll-1]+1;
                }else{
                    this.UNKNOWN_ROLLS[roll-1] = this.UNKNOWN_ROLLS[roll-1]+1;
                }
                break;
        }
    }

    /**
     * Calculate mean median and mode for the die and for each type of roll of that die
     */
    calculate(){
        this.MEAN = DICE_STATS_UTILS.getMean(this.ROLLS);
        this.MEDIAN = DICE_STATS_UTILS.getMedian(this.ROLLS);
        this.MODE = DICE_STATS_UTILS.getMode(this.ROLLS);

        this.MEANS[DS_GLOBALS.ROLL_TYPE.ATK] = DICE_STATS_UTILS.getMean(this.ATK_ROLLS);
        this.MEDIANS[DS_GLOBALS.ROLL_TYPE.ATK] = DICE_STATS_UTILS.getMedian(this.ATK_ROLLS);
        this.MODES[DS_GLOBALS.ROLL_TYPE.ATK] = DICE_STATS_UTILS.getMode(this.ATK_ROLLS);

        this.MEANS[DS_GLOBALS.ROLL_TYPE.DMG] = DICE_STATS_UTILS.getMean(this.DMG_ROLLS);
        this.MEDIANS[DS_GLOBALS.ROLL_TYPE.DMG] = DICE_STATS_UTILS.getMedian(this.DMG_ROLLS);
        this.MODES[DS_GLOBALS.ROLL_TYPE.DMG] = DICE_STATS_UTILS.getMode(this.DMG_ROLLS);

        this.MEANS[DS_GLOBALS.ROLL_TYPE.SAVE] = DICE_STATS_UTILS.getMean(this.SAVES_ROLLS);
        this.MEDIANS[DS_GLOBALS.ROLL_TYPE.SAVE] = DICE_STATS_UTILS.getMedian(this.SAVES_ROLLS);
        this.MODES[DS_GLOBALS.ROLL_TYPE.SAVE] = DICE_STATS_UTILS.getMode(this.SAVES_ROLLS);

        this.MEANS[DS_GLOBALS.ROLL_TYPE.SKILL] = DICE_STATS_UTILS.getMean(this.SKILLS_ROLLS);
        this.MEDIANS[DS_GLOBALS.ROLL_TYPE.SKILL] = DICE_STATS_UTILS.getMedian(this.SKILLS_ROLLS);
        this.MODES[DS_GLOBALS.ROLL_TYPE.SKILL] = DICE_STATS_UTILS.getMode(this.SKILLS_ROLLS);

        this.MEANS[DS_GLOBALS.ROLL_TYPE.ABILITY] = DICE_STATS_UTILS.getMean(this.ABILITY_ROLLS);
        this.MEDIANS[DS_GLOBALS.ROLL_TYPE.ABILITY] = DICE_STATS_UTILS.getMedian(this.ABILITY_ROLLS);
        this.MODES[DS_GLOBALS.ROLL_TYPE.ABILITY] = DICE_STATS_UTILS.getMode(this.ABILITY_ROLLS);

        this.MEANS[DS_GLOBALS.ROLL_TYPE.UNKNOWN] = DICE_STATS_UTILS.getMean(this.UNKNOWN_ROLLS);
        this.MEDIANS[DS_GLOBALS.ROLL_TYPE.UNKNOWN] = DICE_STATS_UTILS.getMedian(this.UNKNOWN_ROLLS);
        this.MODES[DS_GLOBALS.ROLL_TYPE.UNKNOWN] = DICE_STATS_UTILS.getMode(this.UNKNOWN_ROLLS);
    }

    /**
     * method to take blind roll data and push it into normal roll data
     * Reset blind roll data once pushed
     */
    pushBlindRolls(){
        //Push All rolls ary
        for(let i=0; i<this.BLIND_ROLLS.length; i++){
            this.ROLLS[i] = this.ROLLS[i]+this.BLIND_ROLLS[i];
            this.BLIND_ROLLS[i]=0;
        }

        //Atk Rolls ary
        for(let i=0; i<this.ATK_ROLLS_BLIND.length; i++){
            this.ATK_ROLLS[i] = this.ATK_ROLLS[i]+this.ATK_ROLLS_BLIND[i];
            this.ATK_ROLLS_BLIND[i]=0;
        }

        //DMG Rolls ary
        for(let i=0; i<this.DMG_ROLLS_BLIND.length; i++){
            this.DMG_ROLLS[i] = this.DMG_ROLLS[i]+this.DMG_ROLLS_BLIND[i];
            this.DMG_ROLLS_BLIND[i]=0;
        }

        //SAVE Rolls ary
        for(let i=0; i<this.SAVES_ROLLS_BLIND.length; i++){
            this.SAVES_ROLLS[i] = this.SAVES_ROLLS[i]+this.SAVES_ROLLS_BLIND[i];
            this.SAVES_ROLLS_BLIND[i]=0;
        }

        //SKILL Rolls ary
        for(let i=0; i<this.SKILLS_ROLLS_BLIND.length; i++){
            this.SKILLS_ROLLS[i] = this.SKILLS_ROLLS[i]+this.SKILLS_ROLLS_BLIND[i];
            this.SKILLS_ROLLS_BLIND[i]=0;
        }

        //Ability Rolls array
        for(let i=0; i<this.ABILITY_ROLLS_BLIND.length; i++){
            this.ABILITY_ROLLS[i] = this.ABILITY_ROLLS[i]+this.ABILITY_ROLLS_BLIND[i];
            this.ABILITY_ROLLS_BLIND[i]=0;
        }

        //UNKNOWN / FLATCHECK Rolls ary
        for(let i=0; i<this.UNKNOWN_ROLLS_BLIND.length; i++){
            this.UNKNOWN_ROLLS[i] = this.UNKNOWN_ROLLS[i]+this.UNKNOWN_ROLLS_BLIND[i];
            this.UNKNOWN_ROLLS_BLIND[i]=0;
        }
    }

    /**
     * method to get total number of blind rolls
     * @returns {int} - total number of blind rolls for this die
     */
    getBlindRollsCount(){
        let tempRollCount = 0;
        for(let i=0; i<this.BLIND_ROLLS.length; i++){
            tempRollCount += this.BLIND_ROLLS[i];
        }

        return tempRollCount;
    }
}
