import { DS_GLOBALS } from "../dice-stats-globals.js";
import { DS_MSG_ROLL_INFO } from "../appdatastorage/dice-stats-rollmsginfo.js";
import { DS_MSG_DIE_ROLL_INFO } from "../appdatastorage/dice-stats-rollmsginfo.js";

/**
 * Parse Chat message obj and gather all the info we might use
 */
export class PF1E_SYSTEM_MESSAGE_PARSER
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
        if(!msg.isRoll && !msg?.systemRolls?.attacks){
            return;}
        let retRollInfoAry = [];

        /* ========== ANY NON ATTACK || DAMAGE ROLL ============= */
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

        // Return if there are no attack rolls
        if(!msg?.systemRolls?.attacks){return retRollInfoAry;}

        /* ================== ATTACK ROLLS LOOP ============= */
        // PF1 Splits rolls into 'ROLLS' and 'SYSTEM ROLLS'. 
        //  The latter are used when a player presses a card on their character sheer
        //For multiple rolls in chat (Any roll made from a card)
        //For multiple rolls in chat
        for (let tempRoll = 0; tempRoll < msg?.systemRolls?.attacks?.length; tempRoll++) {
            retRollInfoAry.push(new DS_MSG_ROLL_INFO);
            let rollObjSel = msg.systemRolls.attacks[tempRoll].attack;

            retRollInfoAry[retRollInfoAry.length-1] = this.updateRollInfo(msg, retRollInfoAry[tempRoll], rollObjSel);

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
                        retRollInfoAry[retRollInfoAry.length-1].DiceInfo.push(newDieRollInfo);
                    }
                } // end results
            } // end dice in rolls
        } // end rolls

        /* ================== Crit Confirm LOOP ============= */
        // Damage is fucky. Its a sub comp of system attack rolls
        for (let tempAtlRoll = 0; tempAtlRoll < msg.systemRolls.attacks.length; tempAtlRoll++) {
            let attckRollObjSel = msg.systemRolls.attacks[tempAtlRoll];

            // for all crit confirm rolls in each attack roll
            for (let tempRoll = 0; tempRoll < attckRollObjSel.damage.length; tempRoll++) {
                retRollInfoAry.push(new DS_MSG_ROLL_INFO);
                let rollObjSel = attckRollObjSel.critConfirm;
    
                retRollInfoAry[retRollInfoAry.length-1] = this.updateRollInfo(msg, retRollInfoAry[tempRoll], rollObjSel);
    
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
                            retRollInfoAry[retRollInfoAry.length-1].DiceInfo.push(newDieRollInfo);
                        }
                    } // end results
                } // end dice in rolls
            } // end damage rolls
        }// end attack rolls

        /* ================== CRIT DAMAGE LOOP ============= */
        // Damage is fucky. Its a sub comp of system attack rolls
        for (let tempAtlRoll = 0; tempAtlRoll < msg.systemRolls.attacks.length; tempAtlRoll++) {
            let attckRollObjSel = msg.systemRolls.attacks[tempAtlRoll];

            // for all crit confirm rolls in each attack roll
            for (let tempRoll = 0; tempRoll < attckRollObjSel.damage.length; tempRoll++) {
                retRollInfoAry.push(new DS_MSG_ROLL_INFO);
                let rollObjSel = attckRollObjSel.critDamage[tempRoll];
    
                retRollInfoAry[retRollInfoAry.length-1] = this.updateRollInfo(msg, retRollInfoAry[tempRoll], rollObjSel);
    
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
                            retRollInfoAry[retRollInfoAry.length-1].DiceInfo.push(newDieRollInfo);
                        }
                    } // end results
                } // end dice in rolls
            } // end damage rolls
        }// end attack rolls

        /* ================== DAMAGE ROLLS LOOP ============= */
        // Damage is fucky. Its a sub comp of system attack rolls
        for (let tempAtlRoll = 0; tempAtlRoll < msg.systemRolls.attacks.length; tempAtlRoll++) {
            let attckRollObjSel = msg.systemRolls.attacks[tempAtlRoll];

            // for all damage rolls in each attack roll
            for (let tempRoll = 0; tempRoll < attckRollObjSel.damage.length; tempRoll++) {
                retRollInfoAry.push(new DS_MSG_ROLL_INFO);
                let rollObjSel = attckRollObjSel.damage[tempRoll];
    
                retRollInfoAry[retRollInfoAry.length-1] = this.updateRollInfo(msg, retRollInfoAry[tempRoll], rollObjSel);
    
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
                            retRollInfoAry[retRollInfoAry.length-1].DiceInfo.push(newDieRollInfo);
                        }
                    } // end results
                } // end dice in rolls
            } // end damage rolls
        }// end attack rolls
        

        return retRollInfoAry;
    }

    /**
     * Update roll obj with any info that system holds in roll compared to specific dice info
     * NOTE: THESE ARE ONLY ACCESSABLE IF THE USER HAS A PLAYER TARGETED, IF NOT, ITS NOT TRACKED
     */
    /**
     * 
     * @param {*} msg - chat message obj (Prob not needed now that we have the rollObj)
     * @param {DS_MSG_ROLL_INFO} retRollInfoObj - data struct that were going to modify and return
     * @param {MSG.ROLL_INFO} rollOBJ - Roll Obj We want to parse
     * @returns retRollInfoObj
     */
    updateRollInfo(msg, retRollInfoObj, rollObj){
        // NOT CURRENTLY supported for PF1
        return retRollInfoObj; 
        // For PF2e, If it was an attack Roll get some extra info
        if( rollToParse?.type == "attack-roll" ){

        }else if(rollToParse?.type == "saving-throw" ){
            // How Did the save faire
        }else if(rollToParse?.type?.includes("skill-check")){
            // Was it some check vs a DC? Means the roll was a skill of some kinds
        }else if(msg?.isDamageRoll){
            // Was a dmg roll? We could tally total damage done 
            //NOTE: (Wont be super reliable as all flat checks will count as dmg)
        }else if(rollToParse?.type?.includes("perception-check")){

        }else if(rollToParse?.type?.includes("initiative")){

        }
        return retRollInfoObj;
    }

    getRollType(msg,rollObjSel)
    {
        
    }
}