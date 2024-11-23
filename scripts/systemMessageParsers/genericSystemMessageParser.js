import { DS_GLOBALS } from "../dice-stats-globals.js";
import { DS_MSG_ROLL_INFO } from "../appdatastorage/dice-stats-rollmsginfo.js";
import { DS_MSG_DIE_ROLL_INFO } from "../appdatastorage/dice-stats-rollmsginfo.js";

/**
 * These parsers take raw foundry roll messages and convert them into DS_MSG_ROLL_INFO object
 * These will get parsed and added into the main data structure later
 * 
 * Parse a generic system parser,
 * All parsers must implment parseMsgRoll
 */
export class GENERIC_SYSTEM_MESSAGE_PARSER {

    /**
     * Parse the passed in message
     * @param {*} msg 
     * @returns {ROLL_OBJECT[]} 
     */
    parseMsgRoll(msg){
        if(!msg.isRoll){
            return;}

        let retRollInfoAry = [];

        // For multiple rolls in chat EX: /r 1d20 + /r 1d6 = 2 rolls
        for (let tempRoll = 0; tempRoll < msg.rolls.length; tempRoll++) {
            retRollInfoAry.push(new DS_MSG_ROLL_INFO);
            let rollObjSel = msg.rolls[tempRoll];

            retRollInfoAry[tempRoll] = this.updateRollInfo(msg, retRollInfoAry[tempRoll], rollObjSel);

            retRollInfoAry[tempRoll] = this.getDicePoolInfo(msg, retRollInfoAry[tempRoll], rollObjSel);

            //For multiple dice types per roll
            for(let tempDieType=0; tempDieType<rollObjSel?.dice?.length; tempDieType++){
                let dieTypeSel = rollObjSel.dice[tempDieType];
                
                // Convert die type selected to local {DIE_TYPE} enum
                let sides = dieTypeSel?.faces;
                let dieType = DS_GLOBALS.MAX_TO_DIE.get(sides);

                //For results of every die roll of that dice type
                for(let rollResult=0; rollResult < dieTypeSel.results.length; rollResult++){
                    let dieResultSel = dieTypeSel.results[rollResult];

                    // Create new ROLL_INFO obj to ass to array
                    let newDieRollInfo = new DS_MSG_DIE_ROLL_INFO;
                    
                    // See if it was a blind roll
                    newDieRollInfo.IsBlind = msg.blind;

                    if(dieType)
                    {
                        newDieRollInfo.DieType = dieType;

                        //Get type of roll (Atack, Save, ect) 
                        // Generally this should always return unknown as specific system parsers are the only ones that can get this info
                        newDieRollInfo.RollType = this.getRollType(msg,rollObjSel);

                        // Get roll value (int)
                        newDieRollInfo.RollValue = dieResultSel.result;

                        // Add die info to roll storage obj
                        retRollInfoAry[tempRoll].DiceInfo.push(newDieRollInfo);
                    }
                } // end results
            } // end dice in rolls
        } // end rolls
        return retRollInfoAry;
    }

    /**
     * Update roll obj with any info that system holds. Usually hit or miss/ degree success values
     * Generic sytsem doesnt so anything here but specific systems do
     */
    updateRollInfo(msg, rollObj){
        return rollObj
    }

    /**
     * Check if the roll was a dice poll and fill in any roll data coresponding to dice polls
     * ONLY HANDLE [KEEP HIGEST DIE] and [KEEP LOWEST DIE] dice pools
     * @param {Foundry/System msg struct} msg - Foundry/System chat message structrue that needs to be parsed
     * @param {DS_MSG_ROLL_INFO} retRollInfoObj - Roll info object that gets passed in. This is updated to be used later, Store pool info here
     * @param {MSG.ROLL[it]} rollObj - Roll object of msg structure that needs to be parsed
     * @returns {DS_MSG_ROLL_INFO} retRollInfoObj - This is an object ref so we update it and return it
     * 
     * DICE POOL info to fill out:
        IsDicePool= -1; //{BOOLEAN} Is this a dice pool roll? (Current Dice pool design is multiple dice keep specific #)
        PoolSize=   -1; //{INT} How many dice rolled in dice pool
        PoolMax=    -1; //{INT} Max Value from pool
        PoolMin=    -1; //{INT} Min Value from pool
        PoolVal=    -1; //{INT} Value from pool, It could be a max or min of multiple dice depending on the system/modifiers
     */
    getDicePoolInfo(msg, retRollInfoObj, rollObjSel){
        let rollFormula = rollObjSel.formula;

        // Roll is a dice pool or adv/dis that uses roll X take highest/lowest
        if(rollFormula.contains("kh1") || rollFormula.contains("kl1")){
            retRollInfoObj.IsDicePool=true;
            retRollInfoObj.PoolSize= rollObjSel.result.value;
            retRollInfoObj.PoolMax= rollObjSel.result.value;
            retRollInfoObj.PoolMin= rollObjSel.result.value;
            retRollInfoObj.PoolVal= rollObjSel.result.value;
        }
        return retRollInfoObj;
    }

    /**
     * Check if the roll 2 dice and get corresponding info, Mostly used for systems like pbta
     * @param {Foundry/System msg struct} msg - Foundry/System chat message structrue that needs to be parsed. 
     *                                              This is made up of default foundry info and any info system wanted to add
     * @param {DS_MSG_ROLL_INFO} retRollInfoObj - Roll info object that gets passed in. This is updated to be used later, 
     *                                              Store TwoDx info here
     * @param {MSG.ROLL[it]} rollObj - Roll object of msg structure that needs to be parsed
     * @returns {DS_MSG_ROLL_INFO} retRollInfoObj - This is an object ref so we update it and return it
     * 
     * 2DX info to store
        Is2DxRoll=  -1; //{BOOLEAN} Is the system a 2dx system like PBTA, DUNE, Daggerheart, ... etc
        TwoDxVal=   -1; //{INT} Value from the two dice rolled
     */
    getTwoDxInfo(msg, retRollInfoObj, rollObjSel){
        // See if roll is 2dx
        let rollFormula = rollObjSel.formula;
        if(rollFormula.contains("2d")){
            
        }
        return retRollInfoObj;
    }

    /**
     * Get Roll Type, This will be overriden for specific system parsing
     * @param {*} msg 
     * @returns {ROLL_TYPE} - type of roll object
     */
    getRollType(msg,rollObjSel)
    {
        return DS_GLOBALS.ROLL_TYPE.UNKNOWN;
    }

    /**
     * Get any roll info not tied to specific dice
     * @param {*} msg - Chat Message Object
     * @param {DS_MSG_ROLL_INFO} newRollInfo - Current Roll info Obj without Hit Info
     * @returns {DS_MSG_ROLL_INFO} updatedNewRollInfo 
     * 
     */
    getDegSuccessInfo(msg, newRollInfo){
        // USED ONLY IN SPECIFIC SYSTEM PARSERS
        return newRollInfo
    }

    /**
     * For any roll against a DC find out how much the user missed by
     * @param {*} msg - Chat msg obj
     * @param {DS_MSG_ROLL_INFO} newRollInfo - Cur roll info Obj were going to update and return 
     * @param {*} rollValue - msg.roll info that were currently looking at
     * @returns {DS_MSG_ROLL_INFO} newRollInfo
     */
    getHitOrMissBy(msg, newRollInfo, rollValue){
        // USED ONLY IN SPECIFIC SYSTEM PARSERS
        return newRollInfo
    }

    /**
     * Check to see if we hit or missed because of advantage or disadvantage 
     * @param {*} msg - chat msg object
     * @param {DS_MSG_ROLL_INFO} newRollInfo - rollInfoObj were going to update with info and return
     * @returns {DS_MSG_ROLL_INFO} -newRollInfo but with updated values
     */
    getIsHitMissFromAdvantage(msg, newRollInfo){
        // USED ONLY IN SPECIFIC SYSTEM PARSERS
        return newRollInfo
    }
} //enc GENERIC_SYSTEM_MESSAGE_PARSER