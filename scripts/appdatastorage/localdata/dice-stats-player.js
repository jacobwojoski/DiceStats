import { DIE_INFO } from "./dice-stats-diceinfo.js";
import { LOCAL_ROLL_INFO } from "./dice-stats-rollinfo.js";
import { DS_GLOBALS } from "../../dice-stats-globals.js";

//Class that defines a player. Players are all connected people to server including gm
//Player has Die Info for each die type they roll & some other misc data
export class PLAYER {
    PLAYER_DICE = new Array(DS_GLOBALS.NUM_DIE_TYPES); //Aray of type<DIE_INFO>
    USERNAME = '';
    USERID = 0;
    GM = false;
    PLAYER_ROLL_INFO;
    
    constructor(userid){
        if(userid)
        {
            this.USERID = userid;
            this.USERNAME = game.users.get(userid)?.name;
            this.GM = game.users.get(userid)?.isGM;
        }
        else
        {
            this.USERID = -1;
            this.USERNAME = 'NA';
            this.GM = false;
        }

        // Create dice objects (Tracks each die roll)
        for(let i in Object.values(DS_GLOBALS.DIE_TYPE))
        {
            this.PLAYER_DICE[i] = new DIE_INFO(i);
        }

        // Create roll info obj (Trags Generall roll stats; Hits Misses deg success etc)
        this.PLAYER_ROLL_INFO = new LOCAL_ROLL_INFO();
    }

    /**
     * Convert streak info into a string of all streak values
     * @param {DIE_TYPE} dieType 
     * @returns {string} - streak converted to a string
     */
    getStreakString(dieType){
        let len = this.PLAYER_DICE[dieType].LONGEST_STREAK
        let initNum = this.PLAYER_DICE[dieType].LONGEST_STREAK_INIT
        let nextNum = 0;
        if(len === -1){
            return "NO DICE ROLLED"
        }else if(len === 1){
            return "No Strings Made"
        }else{
            // this value is index 0, loop starts at 1
            // User can have a streak of 1 
            let tempStr = initNum.toString(); 
            for(let i=1; i<len; i++){
                nextNum = initNum+i;
                tempStr = tempStr+','+nextNum.toString();
            }
            return tempStr;
        }
    }

    /**
     * Get rolls from a specific die
     * @param {DIE_TYPE} dieType 
     * @returns {int[]} - array of die rolls
     */
    getRolls(dieType){
        return this.PLAYER_DICE[dieType].ROLLS;
    }

    /**
     * Get die info object from a player
     * @param {DIE_TYPE} dieType 
     * @returns {DIE_INFO} - 
     */
    getDieInfo(dieType){
        return this.PLAYER_DICE[dieType];
    }

    /**
     * Save roll to Players associated die
     * @param {bool} isBlind 
     * @param {int} rollVal 
     * @param {DIE_TYPE} dieType 
     * @param {DIE_ROLL_TYPE} rollType
     */
    // saveRoll(isBlind, rollVal, dieType, rollType){
    //     this.PLAYER_DICE[dieType].addRoll(rollVal,isBlind,rollType);
    // }

    /**
     * Take the roll info obj that we created from the msg and store the data
     * @param {DS_MSG_ROLL_INFO} msgRollInfo - roll info we want from msg
     */
    saveRoll(msgRollInfo){
        this.PLAYER_ROLL_INFO.updateRollInfo(msgRollInfo);
        
        for(let dieIT=0; dieIT < msgRollInfo.DiceInfo.length; dieIT++)
        {
            let tmpMsgDieInfo = msgRollInfo.DiceInfo[dieIT];

            this.PLAYER_DICE[tmpMsgDieInfo.DieType].addRoll(tmpMsgDieInfo);
        }

    }

    /**
     * Move all bind roll info normal roll area so it can be displayed
     */
    pushBlindRolls(){
        for(let i=0; i<this.PLAYER_DICE.length; i++){
            this.PLAYER_DICE[i].pushBlindRolls();
        }
    }

    /**
     * get number of total blind rolls from every die
     * @returns {int}
     */
    getBlindRollsCount(){
        let tempRollCount = 0;
        for(let i=0; i<this.PLAYER_DICE.length; i++){
            tempRollCount += this.PLAYER_DICE[i].getBlindRollsCount();
        }
        return tempRollCount;
    }

    /**
     * Clear All DIE_INFO objects
     */
    clearAllRollData(){
        this.PLAYER_ROLL_INFO.clearData();
        for(let i=0; i<this.PLAYER_DICE.length; i++){
            this.PLAYER_DICE[i].clearData();
        }

        this.PLAYER_ROLL_INFO.clearData();
    }

    /**
     * Clear a players specific DIE_INFO object
     * @param {DIE_TYPE} DiceType 
     */
    clearDieData(DiceType){
        this.PLAYER_DICE[DiceType].clearData();
    }

    /**
     * Clear all dice roll data
     */
    clearDiceData(){
        for(let i=0; i<this.PLAYER_DICE.length; i++){
            this.PLAYER_DICE[i].clearData();
        }
    }

    /**
     * Clear all roll specific info (Hits misses etc)
     */
    clearRollData(){
        this.PLAYER_ROLL_INFO.clearData();
    }
}