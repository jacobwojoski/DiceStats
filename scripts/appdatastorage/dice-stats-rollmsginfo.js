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
    RollType=   null;      // {ROLL_TYPE} Type of roll that was made; Save, attack etc.. Better desc would be roll_target (What the rolls targeting)
    DegSuccess= null;      // {DEG_SUCCESS} HIT OR MISS VALUE
    CheckDiff = null;      // {INT} Integer Hit Or Missed By

    // Advantage is basically a dice pool so its mostly covered there?
    UsedAdvantage = null;  // {BOOLEAN}
    MissFromAdv = null;    // {BOOLEAN}
    HitFromAdv  = null;    // {BOOLEAN}

    IsDicePool= -1; //{BOOLEAN} Is this a dice pool roll? (Current Dice pool design is multiple dice keep specific #)
    PoolSize=   -1; //{INT} How many dice rolled in dice pool
    PoolMax=    -1; //{INT} Max Value from pool
    PoolMin=    -1; //{INT} Min Value from pool
    PoolVal=    -1; //{INT} Value from pool, It could be a max or min of multiple dice depending on the system/modifiers

    /* Specific system impl, Not currently used */
    PoolSuccs=  -1; //{INT} Some Systems use # succ or # fails from dice pools to see pass / failed results
    PoolFails=  -1; //{INT}  

    Is2DxRoll=  -1; //{BOOLEAN} Is the system a 2dx system like PBTA, DUNE, Daggerheart, ... etc
    TwoDxVal=   -1; //{INT} Value from the two dice rolled

    IsKeepHigher=false // {BOOLEAN} Does this result keep the higher value
    IdKeepLower=false // {BOOLEAN} Does this roll keep the lower value

    constructor(){
        this.DiceInfo = [];
        this.DegSuccess =   null;
        this.CheckDiff =    null;
        this.UsedAdvantage = false;
        this.MissFromAdv =  false;
        this.HitFromAdv =   false;

        this.IsDicePool= -1; //{BOOLEAN}
        this.PoolSize=   -1; //{INT} How many dice rolled in dice pool
        this.PoolMax=    -1; //{INT} Max Value from pool
        this. PoolMin=    -1; //{INT} Min Value from pool
        this.PoolVal=    -1; //{INT} Value from pool, It could be a max or min of multiple dice depending on the system/modifiers

        this.Is2DxSys=   -1; //{BOOLEAN} Is the system a 2dx system like PBTA, DUNE, Daggerheart, ... etc
        this.TwoDxVal=   -1; //{INT} Value from the two dice rolled
    }
}