/**
 * Data storage object that holds any roll info related to the system
 * EX: Advantage/Disadvantage, Hits, Misses, Crits, Etc
 */
class PF2E_SYSTEM_DATA {
    ATK_ROLL_NUM_HISTORY = 20; //Track last X number of rolls in line chart
    
    /* ------------------------------- */
    //Attack Info
    TotalAtks       = 0;
    AtkCritSuccess  = 0;
    AtkSuccess      = 0;
    AtkFails        = 0;
    AtkCritFails    = 0;
    AttackRolls     = [];
    LastXAtkRolls   = [];
    //Spell Attack Info
    TotalSpellAtks       = 0;
    SpellAtkCritSuccess  = 0;
    SpellAtkSuccess      = 0;
    SpellAtkFails        = 0;
    SpellAtkCritFails    = 0;
    SpellAttackRolls     = [];
    //Weapon Attack info
    TotalWeaponAtks       = 0;
    WeaponAtkCritSuccess  = 0;
    WeaponAtkSuccess      = 0;
    WeaponAtkFails        = 0;
    WeaponAtkCritFails    = 0;
    WeaponAttackRolls     = [];
    
    /* ------------------------------- */
    //Total Save Info
    TotalSaves      = 0;
    SaveCritSuccess = 0;
    SaveSuccess     = 0;
    SaveFails       = 0;
    SaveCritFails   = 0;
    SaveRolls       = [];
    //Fortitude Save Info
    TotalFortitudeSaved = 0;
    FortSaveCritSuccess = 0;
    FortSaveSuccess     = 0;
    ForSaveFails        = 0;
    FortSaveCritFails   = 0;
    FortSaveRolls       = [];
    //Reflex Save Info
    TotalReflexSaves    = 0;
    RefSaveCritSuccess  = 0;
    RefSaveSuccess      = 0;
    RefSaveFails        = 0;
    RefSaveCritFails    = 0;
    RefSaveRolls        = [];
    //Will Save Info
    TotalWillSaves      = 0;
    WillSaveCritSuccess = 0;
    WillSaveSuccess     = 0;
    WillSaveFails       = 0;
    WillSaveCritFails   = 0;
    WillSaveRolls       = [];

    /* ------------------------------- */
    //Heropoint Stats
    Rerolls         = 0;
    RerollsHelped   = 0;
    RerollNotHelped = 0;

    /* ------------------------------- */
    //Advantage & Disadvantage info
    AdvDisTotalRolls    = 0;
    //Advantage Roll Stats
    AdvRolls            = 0;
    AdvHelpedRolls      = 0;
    AdvNotHelpedRolls   = 0;
    //Disadvantage Roll Stats
    DisadvRolls         = 0;
    DisadvHurtRolls     = 0;
    DisadvNotHurtRolls  = 0;
}