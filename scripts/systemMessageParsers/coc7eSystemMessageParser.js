import { DS_GLOBALS } from "../dice-stats-globals.js";
import { DS_MSG_ROLL_INFO } from "../appdatastorage/dice-stats-rollmsginfo.js";
import { DS_MSG_DIE_ROLL_INFO } from "../appdatastorage/dice-stats-rollmsginfo.js";
import { GENERIC_SYSTEM_MESSAGE_PARSER } from "./genericSystemMessageParser.js";

/* Create a system parser for call of cathulu. Currently CoC rolls are handles as 2d10 and should be d100 rolls 
    The message parser takes in the rraw message structure from different systems and converts it to
    generic DS_MSG info.
    
    This gets importaed into the local data storage after the parsing has taken place
*/
export class COC7E_SYSTEM_MESSAGE_PARSER extends GENERIC_SYSTEM_MESSAGE_PARSER {
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

            //Declare dt and d10 values for possible d100 rolls
            let dt_val = 0;
            let d10_val = 0;

            //For multiple dice types per roll
            for(let tempDieType=0; tempDieType<rollObjSel?.dice?.length; tempDieType++){
                let dieTypeSel = rollObjSel.dice[tempDieType];
                
                // Convert die type selected to local {DIE_TYPE} enum
                let sides = dieTypeSel?.faces;
                let dieType = DS_GLOBALS.MAX_TO_DIE.get(sides);

                /* Check if its a part of a d100 roll Currently just parse the roll info looking for a dt and d10 roll
                at the same time. There are def edge cases where soemone can roll more than just 1 of each die and it 
                would cause issues*/
                let formula = dieTypeSel.formula;
                if(formula.includes("1dt") || formula.includes("dtkh") || formula.includes("dtkl")){
                    // 10's digit for D 100
                    dt_val = dieTypeSel.total;
                }else if(formula.includes("1d10") || formula.includes("d10kh") || formula.includes("d10kl")){
                    d10_val = dieTypeSel.total;
                }

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

            // Handle a d100 roll if it was made from a dt and d10 die
            if (dt_val && d10_val){
                let d100_info = new DS_MSG_DIE_ROLL_INFO;
                d100_info.DieType=DS_GLOBALS.DIE_TYPE.D100;
                d100_info.IsBlind=msg.blind;
                d100_info.RollType=DS_GLOBALS.ROLL_TYPE.UNKNOWN;
                //d100_info.RollValue=(dt_val + d10_val);

                // Get the die outcome from the html
                const parser = new DOMParser();
                const tmpdoc = parser.parseFromString(msg.content, "text/html");
                let resultElement = tmpdoc.getElementById("diceResult");
                let roll_value=resultElement.textContent;
                d100_info.RollValue = parseInt(roll_value);

                if(d100_info.RollValue > 100){
                    d100_info.RollValue = 100;
                }else if (d100_info.RollValue < 1){
                    d100_info.RollValue = 1;
                }

                retRollInfoAry[tempRoll].DiceInfo.push(d100_info);
                // WOJO: Check content id='diceResult`
            }
            
        } // end rolls
        return retRollInfoAry;
    } // end parseMessageRoll

    /**
     * @param {MSG} msg - Foundry/ System message object 
     * @param {DS_MSG_ROLL_INFO} retRollInfoObj - our conversion of message info into local info
     * @param {MSG.ROLL[it]} rollObjSel - 
     * Update roll obj with any info that system holds in roll compared to specific dice info
     * NOTE: THESE ARE ONLY ACCESSABLE IF THE USER HAS A PLAYER TARGETED, IF NOT, ITS NOT TRACKED
     */
    updateRollInfo(msg, retRollInfoObj, rollObjSel){
        // Get Degree success from roll result html item
        // const parser = new DOMParser();
        // const tmpdoc = parser.parseFromString(msg.content, "text/html");
        // let d100_result = resultElement.textContent;

        // var resultElement = tmpdoc.getElementById("diceResult");

        // if(resultElement.classList.contains('extreme-success')){

        // }else if(resultElement.classList.contains('critical') && resultElement.classList.contains('success')){

        // }else if(resultElement.classList.contains('success')){

        // }else if(resultElement.classList.contains('failure') && resultElement.classList.contains('critical')){
        
        // }else if(resultElement.classList.contains('failure')){

        // };

        return retRollInfoObj;
    }
}