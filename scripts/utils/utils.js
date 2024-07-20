import { DS_GLOBALS } from "./globals.js";
import { DB_INTERACTION } from "./database/db.js";
/**
 * Mic utility funtions that get used in different parts of the code. 
 */
export class DICE_STATS_UTILS {
    /**
     * Build hook hook that waits for A DsN msg then return
     * This funtion returns after Hook is made so this code returns and now were 
     * waiting at the end of promise fn to get our resolve
     * @param {*} targetMessageId 
     * @returns 
     */
    static async waitFor3DDiceMessage(targetMessageId) {
        function buildHook(resolve) {
            Hooks.once('diceSoNiceRollComplete', (messageId) => {
                //This code ONLY gets called if a DsN roll completed (async code)
                //Is the DsNmsg found, the one we were waiting for?
                if (targetMessageId === messageId){
                    //got msg we wanted so we can return now
                    resolve(true);
                } else {
                    //We got a msg but was wrong one, Need to build a new hook to wait for 
                    //a new msg
                    buildHook(resolve);
                }
            });
        }
        //Promise means the following is async dont return untill we get a result
        return new Promise((resolve, reject) => {
            
            //If 3d Dice is installed build hook (The async thing)
            if(game.dice3d){
                buildHook(resolve);
            } else {
                resolve(true);
            }
        });   
    }

    /**
     * Mode = Most common
     * Find index that has the largest value 
     * result = index+1
     * @param {int[]} RollsAry 
     * @returns 
     */
    static getMode(RollsAry){
        if(!RollsAry || RollsAry.length == 0 )
        {return 0}
        
        var indexOfMax = 0;
        var maxValue = 0;

        for(let i=0; i<RollsAry.length; i++){
            if(RollsAry[i] > maxValue){
                indexOfMax = i;
                maxValue = RollsAry[i];
            }
        }

        return indexOfMax+1;
    }

    /**
     * Average
     * Becasue array holds number of each roll instead of each roll value math is more anoying
     * @param {int[]} RollsAry 
     * @returns {float}
     */
    static getMean(RollsAry){
        if(!RollsAry || RollsAry.length == 0 )
        {return 0}

        var numberOfRolls=0;
        var sum = 0;

        //For every elm in array
        //Sum = Arrayindex+1(die Roll) * array value(number of times value was rolled)
        for(let i=0; i<RollsAry.length; i++){
            numberOfRolls += RollsAry[i];
            sum = sum+((i+1)*RollsAry[i]);
        }

        if(numberOfRolls>0)
        {
            let float = sum/numberOfRolls;
            return float.toFixed(2);
        }
        return 0;
    }

    /**
     * Middle number
     * Find Total Number of rolls/2 ()
     * Go through array subtracting each roll untill we find our middle number
     * @param {int[]} RollsAry 
     * @returns {int}
     */
    static getMedian(RollsAry){
        if(!RollsAry || RollsAry.length == 0 )
        {return 0}

        let totalRolls = 0;
        for(let i=0; i<RollsAry.length; i++){
            totalRolls += RollsAry[i];
        }

        if(totalRolls > 1){
            //Get Middle roll number
            let middleIndex = 0;
            if(totalRolls%2 === 0){
                //Even Number of rolls
                middleIndex = Math.floor(totalRolls/2);
            }else{
                //Odd Number of rolls
                middleIndex = Math.floor(totalRolls/2)+1;
            }

            for(let i=0; i<RollsAry.length; i++){
                var indxlValue = RollsAry[i]; //Number of that roll (i+1) is die number
                while(indxlValue!=0 && middleIndex!=0){
                    middleIndex--;
                    indxlValue--;
                }

                if(middleIndex===0){
                    return i+1; //index+1 = die number
                }
            }

        }else if(totalRolls === 1){
            for(let i=0; i<RollsAry.length; i++){
                if(RollsAry[i] === 1){
                    return i+1;
                }
            }
        }
        return 0;
    }

    /**
     * Get the type of roll the msg was. Currently only for PF2e system
     * 
     * Note: If adding a new system that gets subcatagories,
     *  You need to add stuff here and in the dice-stats-datapack::playerdata
     * 
     * @param {chatMessage} msg - chat message object (Chat message object is a foundry object not made by me. 
     *                                 This object might have different variables bassed off of system so only set for PF2e for now)
     * @returns {ROLL_TYPE} - Type of roll that was made (atack, dmg, save ect)
     */
    static getRollType(msg)
    {
        //This should never happen as its already been checked but double check
        if(!msg.isRoll)
        {
            return DS_GLOBALS.ROLL_TYPE.UNKNOWN;
        }

        /* To add a new system update here & datapack */
        if(game.system.id == "pf2e")
        {
            //Check if damage Roll
            if(msg.isDamageRoll)
            {
                return DS_GLOBALS.ROLL_TYPE.DMG;
            }

            //TODO: Add Ability Section for if someone Rolls straight STR, CON, WILL ETC
            
            let domains = msg.rolls[0].options.domains;
            //Check if Save | Atack roll | Skill check
            if(domains)
            {
                for (var i=0; i<domains.length; i++) {
                    if(domains[i].match("attack"))
                    {
                        return DS_GLOBALS.ROLL_TYPE.ATK;
                    }
                    else if (domains[i].match("saving-throw"))
                    {
                        return DS_GLOBALS.ROLL_TYPE.SAVE;
                    }
                    else if(domains[i].match("skill-check"))
                    {
                        return DS_GLOBALS.ROLL_TYPE.SKILL
                    }
                }
                return DS_GLOBALS.ROLL_TYPE.UNKNOWN;
            }
            //unknown so return unknown type
            return DS_GLOBALS.ROLL_TYPE.UNKNOWN;
        }
        else if (game.system.id == "dnd5e")
        {// D&D System is annoying and doesn't have a good way to see the type of roll. Need to parse a String to find out

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

        }else if(game.system.id == "dragonbane")
        {// Dragonbane also doesn't have a nice way to parse rolls. Need to pull flavor text.
            // Flavor text doesnt have a good way to see different types of skill rolls
            let flavorString = msg.flavor;
            if(flavorString.includes("Skill")){
                return DS_GLOBALS.ROLL_TYPE.SKILL;
                
            }else if(   flavorString.includes("Attack") || flavorString.includes("Topple") || 
                        flavorString.includes("Disarm") || flavorString.includes("Parry")){
                return DS_GLOBALS.ROLL_TYPE.ATK;

            }else if(flavorString.includes("Attribute")){
                return DS_GLOBALS.ROLL_TYPE.ABILITY;

            }else if(flavorString.includes("Damage")){
                return DS_GLOBALS.ROLL_TYPE.DMG;
                
            }else{
                return DS_GLOBALS.ROLL_TYPE.UNKNOWN;
            }
        }
        /**
         * ADD else if HERE to implement other game systems, 
         * For New TYPES need to udpate dice-info and enum values
         * */

        return DS_GLOBALS.ROLL_TYPE.UNKNOWN;
    }

    /**
     * Refresh all form objects
     */
    static refreshForms(){
        if(DS_GLOBALS.FORM_GL_STATS){
            DS_GLOBALS.FORM_GL_STATS.render();
        }
    
        if(DS_GLOBALS.FORM_GL_COMPARE){
            DS_GLOBALS.FORM_GL_COMPARE.render()
        }
    
        if(DS_GLOBALS.FORM_PLAYER_STATS){
            DS_GLOBALS.FORM_PLAYER_STATS.render();
        }
    }

    /** 
     * async Utils fn used to make a popup asking if the user wants to clear all data from the DB.
     * This fn should prob only ever be available to the GM
     */
    static async clearAllData(){
        let title_txt = game.i18n.localize('DICE_STATS_TEXT.settings.global_enable_clear_all_stats_popup.title');
        let context_txt = game.i18n.localize('DICE_STATS_TEXT.settings.global_enable_clear_all_stats_popup.context');
        const allClear = await Dialog.confirm({
            title: title_txt,
            content: context_txt,
            yes: () => {return true},
            no: () => {return false},
            defaultYes: false
            });
        if(allClear){
            ui.notifications.warn("All Player Data Cleared");
            DS_GLOBALS.MODULE_SOCKET.executeForEveryone("clear_sock", {});
            DB_INTERACTION.clearDB();
        }
    }
}

export class  ComparePlayerObjUtil
{
    name = '';
    id = '';
    isChecked = true;

    constructor(user)
    {
        this.name = user.name;
        this.id = user.id;
        this.isChecked = true;
    }
}