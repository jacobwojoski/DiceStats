/* List of data thats specific to dragonbane that each PC might want to have tracked */
export class DRAGONBANE_SYSTEM_DATA {
    // Stats about skills
    NumWeaponRolls  = 0;
    WeaponRollCS    = 0;
    WeaponRollS     = 0;
    WeaponRollF     = 0;
    WeaponRollCF    = 0;
    WeaponRollsAry  = [];

    NumSkillRolls   = 0;
    SkillRollCS     = 0;
    SkillRollS      = 0;
    SkillRollF      = 0;
    SkillRollCF     = 0;
    SkillRollsAry   = [];

    NumSecSkillRolls   = 0;
    SecSkillRollCS     = 0;
    SecSkillRollS      = 0;
    SecSkillRollF      = 0;
    SecSkillRollCF     = 0;
    SecSkillsRollsAry   = [];

    // Stats about abilities
    NumStrRollsWithCondition    = 0;
    StrSuccedWithCondition      = 0;
    StrFailedWithCondition      = 0;
    StrFailedFromCondition      = 0;

    NumConRollsWithCondition    = 0;
    ConSuccedWithCondition      = 0;
    ConFailedWithCondition      = 0;
    ConFailedFromCondition      = 0;

    NumAglRollsWithCondition    = 0;
    AglSuccedWithCondition      = 0;
    AglFailedWithCondition      = 0;
    AglFailedFromCondition      = 0;

    NumIntRollsWithCondition    = 0;
    IntSuccedWithCondition      = 0;
    IntFailedWithCondition      = 0;
    IntFailedFromCondition      = 0;

    NumWillRollsWithCondition   = 0;
    WillSuccedWithCondition     = 0;
    WillFailedWithCondition     = 0;
    WillFailedFromCondition     = 0;

    NumChaRollsWithCondition    = 0;
    ChaSuccedWithCondition      = 0;
    ChaFailedWithCondition      = 0;
    ChaFailedFromCondition      = 0;

    //Boons and Banes (Advantage & Disadvantage)
    NumAdvantageRolls       = 0;
    PassedEitherWay         = 0;
    PassedFromAdvantage     = 0;
    FailedWithAdvantage     = 0;

    NumDisadvantageRolls    = 0;
    FailedWitherWay         = 0;
    FailedFromDisadvantage  = 0;
    PassedWithDisadvantage  = 0;
    
    // Reroll & Take Condition
    NumRerolls = 0;
    RerollsPassed = 0;
    RerollsFailed = 0;
}