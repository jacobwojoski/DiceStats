/* 
    FILE DESCRIPTION:

    This file includes classes that are used for extracting important info from the foundry MSG 
    object. This gets parsed again and added into our local storage data structures later.
    
    Only some systems have implementations for storing roll data where die data can usually
    be taken from any system.
    
    There are different system parsers to get this data because its 
    implemented differently depending on the system
    
*/


/* DIE_TYPE, ROLL_TYPE, ROLL_VALUE, IS_BLIND, DEG_SUCCESS*/
/* Any Negative value is invalid */
/* Storage of any info related to the DICE that in the message (Trim out all the useless bits)*/
export class DS_MSG_DIE_ROLL_INFO {
    DieType=    -1; //{DIE_TYPE}
    RollType=   -1; //{ROLL_TYPE}
    RollValue=  -1; //{INT}
    IsBlind=    -1; //{BOOLEAN}

    constructor()
    {
        this.DieType=    -1; //{DIE_TYPE}
        this.RollType=   -1; //{ROLL_TYPE}
        this.RollValue=  -1; //{INT}
        this.IsBlind=    -1; //{BOOLEAN}
    }
}

/**
 * Roll Info Object. 
 * When a message is made in chat it can include multiple rolls, and multiple dice of each type
 * EX: "/r 2d20 + 1d10 + 2d4kh" is a valid roll inside the message. There could even be multiple rolls.
 * Storage Holds Roll Info and an array of Dice Info, Also helps if Hit and Miss's Require multiple dice
 * Trim out all the useless bits from the MSG.ROLL obj
 */
export class DS_MSG_ROLL_INFO {
    IsRollInfoChecked = false;
    DiceInfo = [];         // {DS_MSG_DIE_ROLL_INFO}
    RollType=   null;      // {ROLL_TYPE} Type of roll that was made; Save, attack etc
    DegSuccess= null;      // {DEG_SUCCESS} HIT OR MISS VALUE
    CheckDiff = null;      // {INT} Integer Hit Or Missed By
    UsedAdvantage = null;  // {BOOLEAN}
    MissFromAdv = null;    // {BOOLEAN}
    HitFromAdv  = null;    // {BOOLEAN}

    constructor(){
        this.DiceInfo = [];
        this.DegSuccess =   null;
        this.CheckDiff =    null;
        this.UsedAdvantage = false;
        this.MissFromAdv =  false;
        this.HitFromAdv =   false;
    }
}