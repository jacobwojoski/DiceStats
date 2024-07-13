import { DS_GLOBALS } from "../dice-stats-globals.js";
import { DS_MSG_ROLL_INFO } from "../appdatastorage/dice-stats-rollmsginfo.js";
import { DS_MSG_DIE_ROLL_INFO } from "../appdatastorage/dice-stats-rollmsginfo.js";

/**
 * Parse Chat message obj and gather all the info we might use
 */
export class DND5E_SYSTEM_MESSAGE_PARSER
{
    /* ROLL_INFO Vars:
    DieType=    0; //{DIE_TYPE}
    RollType=   0; //{ROLL_TYPE}
    RollValue=  0; //{INT}
    IsBlind=    0; //{BOOLEAN}
    DegSuccess= 0; //{DEG_SUCCESS}
    CheckDiff=  null;       //{INT}
    MissFromAdv = false;
    HitFromAdv = false;
    */
    /**
     * Parse the passed in message
     * @param {*} msg 
     * @returns {ROLL_OBJECT[]} 
     */
    parseMsgRoll(msg){
        if(!msg.isRoll){
            return;}

        let retRollInfoAry = [];

        //For multiple rolls in chat
        for (let tempRoll = 0; tempRoll < msg.rolls.length; tempRoll++) {
            retRollInfoAry.push(new DS_MSG_ROLL_INFO);
            let rollObjSel = msg.rolls[tempRoll];

            retRollInfoAry[tempRoll] = this.updateRollInfo(msg, retRollInfoAry[tempRoll], rollObjSel);

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
     * Get Roll Type, This will be overriden for specific system parsing
     * @param {*} msg 
     * @returns {ROLL_TYPE} - type of roll object
     */
    getRollType(msg,rollObjSel)
    {
        let rollType = msg?.flags?.dnd5e?.roll?.type;
        if(rollType == "skill"){
            return DS_GLOBALS.ROLL_TYPE.SKILL;

        }else if(rollType == "ability"){
            return DS_GLOBALS.ROLL_TYPE.ABILITY;

        }else if(rollType == "attack"){
            return DS_GLOBALS.ROLL_TYPE.ATK;

        }else if(rollType == "damage"){
            return DS_GLOBALS.ROLL_TYPE.DMG;

        }else if(rollType == "save"){
            return DS_GLOBALS.ROLL_TYPE.SAVE;

        }else{
            return DS_GLOBALS.ROLL_TYPE.UNKNOWN;
        }
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
}