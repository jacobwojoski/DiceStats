import { DS_GLOBALS } from "../../../dice-stats-globals.js";
import { DS_MSG_ROLL_INFO } from "../appdatastorage/dice-stats-rollmsginfo.js";
import { DS_MSG_DIE_ROLL_INFO } from "../appdatastorage/dice-stats-rollmsginfo.js";

/**
 * Parse Chat message obj and gather all the info we might use
 */
export class PF2E_SYSTEM_MESSAGE_PARSER
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
     * @returns {DS_MSG_ROLL_INFO[]} 
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
     * @param {MSG} msg
     * @param {DS_MSG_ROLL_INFO} retRollInfoObj - our conversion of message info into local info
     * @param {MSG.ROLL[it]} rollObjSel - 
     * Update roll obj with any info that system holds in roll compared to specific dice info
     * NOTE: THESE ARE ONLY ACCESSABLE IF THE USER HAS A PLAYER TARGETED, IF NOT, ITS NOT TRACKED
     */
    updateRollInfo(msg, retRollInfoObj, rollObjSel){

        let rollToParse = rollObjSel;

        // We track hit & miss info for pf2e, So this should always be true. 
        retRollInfoObj.IsRollInfoChecked = true;

        // For PF2e, If it was an attack Roll get some extra info
        if( rollToParse?.type == "attack-roll" ){
            // How did our attack do?
            retRollInfoObj = this.getDegSuccessInfo(msg, retRollInfoObj);
            retRollInfoObj.RollType = DS_GLOBALS.ROLL_TYPE.ATK;
            retRollInfoObj.IsRollInfoChecked = true;

        }else if(rollToParse?.type == "saving-throw" ){
            // How did our save do?
            retRollInfoObj = this.getDegSuccessInfo(msg, retRollInfoObj);
            retRollInfoObj.RollType = DS_GLOBALS.ROLL_TYPE.SAVE;
            retRollInfoObj.IsRollInfoChecked = true;

        }else if(rollToParse?.type?.includes("skill-check")){
            retRollInfoObj.RollType = DS_GLOBALS.ROLL_TYPE.SKILL;
            // Was it some check vs a DC? Means the roll was a skill of some kinds
        }else if(msg?.isDamageRoll){
            retRollInfoObj.RollType = DS_GLOBALS.ROLL_TYPE.DMG;
            // Was a dmg roll? We could tally total damage done 
            //NOTE: (Wont be super reliable as all flat checks will count as dmg)
        }else if(rollToParse?.type?.includes("perception-check")){
            retRollInfoObj.RollType = DS_GLOBALS.ROLL_TYPE.PERCEPTION;

        }else if(rollToParse?.type?.includes("initiative")){
            retRollInfoObj.RollType = DS_GLOBALS.ROLL_TYPE.INITIATIVE;
        }
        return retRollInfoObj;
    }

    /**
     * Get Roll Type, This will be overriden for specific system parsing
     * NOTE: There are no Ability Rolls in pf2e
     * @param {*} msg 
     * @returns {ROLL_TYPE} - type of roll object
     */
    getRollType(msg, rollData)
    {
        //Check if damage Roll
        if(msg.isDamageRoll)
        {
            return DS_GLOBALS.ROLL_TYPE.DMG;
        }

        switch(rollData.type){
            case "attack-roll":
                return DS_GLOBALS.ROLL_TYPE.ATK;
            case "saving-throw":
                return DS_GLOBALS.ROLL_TYPE.SAVE;
            case "skill-check":
            case "perception-check":
            case "initiative":
                return DS_GLOBALS.ROLL_TYPE.SKILL;
            default :
                return DS_GLOBALS.ROLL_TYPE.UNKNOWN;
        }
    }

    /**
     * Get hit and miss info from the attack roll
     * @param {*} msg - Chat Message Object
     * @param {DS_MSG_ROLL_INFO} newRollInfo - Current Roll info Obj without Hit Info
     * @returns {DS_MSG_ROLL_INFO} updatedNewRollInfo 
     * 
     * DEG_SUCCESS 
     * UNKNOWN:        0,
        CRIT_FAIL:      1,
        FAIL:           2,
        SUCCESS:        3,
        CRIT_SUCCESS:   4,
        DOWNBEAT:       5, //NOT USED FOR PF2
        MIXEDBEAT:      6  //NOT USED FOR PF2
        UPBEAT:         7  //NOT USED FOR PF2
     */
    getDegSuccessInfo(msg, newRollInfo)
    {
        //let targetDc = msg.flags.pf2e.context.dc.value;
        let outcome = msg.flags.pf2e?.context?.outcome;
        switch(outcome){
            case "criticalFailure":
                newRollInfo.DegSuccess = DS_GLOBALS.DEGREE_SUCCESS.CRIT_FAIL;
                break;
            case "failure":
                newRollInfo.DegSuccess = DS_GLOBALS.DEGREE_SUCCESS.FAIL;
                break;
            case "success":
                newRollInfo.DegSuccess = DS_GLOBALS.DEGREE_SUCCESS.SUCCESS;
                break;
            case "criticalSuccess":
                newRollInfo.DegSuccess = DS_GLOBALS.DEGREE_SUCCESS.CRIT_SUCCESS;
                break;
            default:
                newRollInfo.DegSuccess = DS_GLOBALS.DEGREE_SUCCESS.UNKNOWN;

        }
        return newRollInfo;
    }

    /**
     * For any roll against a DC find out how much the user missed by
     * @param {*} msg - Chat msg obj
     * @param {DS_MSG_ROLL_INFO} newRollInfo - Cur roll info Obj were going to update and return 
     * @param {MSG.ROLL_OBT} rollValue - msg.roll info that were currently looking at
     * @returns {DS_MSG_ROLL_INFO} newRollInfo
     */
    getHitOrMissBy(msg, newRollInfo, rollValue)
    {
        let dc = msg?.flags?.pf2e?.context?.dc?.value;
        let rollTotal = rollValue?._total;
        newRollInfo.CheckDiff = (rollTotal - dc);
        return newRollInfo;
    }

    /**
     * Check to see if we hit or missed because of advantage or disadvantage 
     * @param {*} msg - chat msg object
     * @param {DS_MSG_ROLL_INFO} newRollInfo - rollInfoObj were going to update with info and return
     * @returns {DS_MSG_ROLL_INFO} -newRollInfo but with updated values
     */
    getIsHitMissFromAdvantage(msg, newRollInfo)
    {
        let finalResult = msg.flags?.pf2e?.context?.outcome;
        let originalResult = msg.flags?.pf2e?.context?.unadjustedOutcome;

        // Check if we hit because of "advantage"
        if( (originalResult == "criticalFailure" || originalResult == "Failure") && 
            (finalResult == "success" || finalResult == "criticalSuccess") ){
            newRollInfo.HitFromAdv = true;
        
        // Check if we missed because of "disadvantage"
        }else if( (finalResult == "criticalFailure" || finalResult == "Failure") && 
        (originalResult == "success" || originalResult == "criticalSuccess")){
            newRollInfo.MissFromAdv = true;

        }else if(finalResult && originalResult){
            newRollInfo.MissFromAdv = true;
            newRollInfo.HitFromAdv = false;
        }
        return newRollInfo;
    }
}