//==========================================================
//===================== HOOKS SHIT =========================
//==========================================================
import { DS_MSG_DIE_ROLL_INFO } from "../appdatastorage/dice-stats-rollmsginfo.js";
import { DS_MSG_ROLL_INFO } from "../appdatastorage/dice-stats-rollmsginfo.js";
import { DiceStatsTracker } from "../dice-stats-main.js";
import { DB_INTERACTION } from "../database/dice-stats-db.js";
import { CustomSceneControl, CustomSceneControlToolCompare, CustomSceneControlToolExport, CustomSceneControlToolGlobal, CustomSceneControlToolPlayer } from "../forms/dice-stats-scenecontrol.js";
import { DICE_STATS_UTILS } from "../dice-stats-utils.js";
import { DS_GLOBALS } from "../dice-stats-globals.js";
import { DiceStatsAPI } from "./dice-stats-api.js";

// Hooks 'hook' into different external triggers
//  - EX: Loading of A page, When a roll gets made etc
// Some hooks get made from modules while most we use are prebuild into foundry

//This hook is used to change how we deal with some midiqol settings 
function midiQolSupport(){
    /*Add Hook for Midi-QoL */
    Hooks.on("midi-qol.RollComplete", (workflow) => {

        //Deal with Attack Rolls
        if(workflow.attackRollCount > 0){
            let /* {DS_MSG_ROLL_INFO} */ rollInfo = new DS_MSG_ROLL_INFO();
            rollInfo.RollType = DS_GLOBALS.ROLL_TYPE.ATK;
            let dieType = DS_GLOBALS.MAX_TO_DIE.get(workflow.attackRoll.terms[0].faces);
            let isBlind = false;

            if( workflow.attackRoll.options.rollMode != 'publicroll'){
                isBlind = true;
            }

            for (let i = 0; i < workflow.attackRoll.terms[0].results.length; i++) {
                let /* {DS_MSG_DIE_ROLL_INFO} */ dieInfo = new DS_MSG_DIE_ROLL_INFO();
                dieInfo.RollValue = workflow.attackRoll.terms[0].results[i].result;
                dieInfo.RollType = rollInfo.RollType;
                dieInfo.DieType = dieType;
                dieInfo.IsBlind = isBlind;

                rollInfo.DiceInfo.push(dieInfo);
            }

            //Get Associated Player
            let owners = Object.keys(workflow.actor.ownership);
            let owner = owners[owners.length-1];
            //If no owner found first pos should be GM ID
            if(owner === undefined){
                owner = owners[1];
            }
                
            DS_GLOBALS.DS_OBJ_GLOBAL.addRoll(rollInfo, owner);
        }
            
        //Deal with dmg rolls
        if(workflow.damageRollCount > 0){
            for(let rollIt = 0;  rollIt < workflow.damageRolls.length; rollIt++)
            {
                let /* {DS_MSG_ROLL_INFO} */ rollInfo = new DS_MSG_ROLL_INFO();
                rollInfo.RollType = DS_GLOBALS.ROLL_TYPE.DMG;
                let isBlind = false;

                if( workflow.damageRolls[rollIt].options.rollMode != 'publicroll'){
                    isBlind = true;
                }

                for(let termIt = 0;  termIt < workflow.damageRolls[rollIt].terms.length; termIt++)
                {
                    
                    let termInfo = workflow.damageRolls[rollIt].terms[termIt];
                    let dieType = DS_GLOBALS.MAX_TO_DIE.get(termInfo.faces);

                    for (let i = 0; i < termInfo.results.length; i++) {
                        let /* {DS_MSG_DIE_ROLL_INFO} */ dieInfo = new DS_MSG_DIE_ROLL_INFO();
                        dieInfo.RollValue = termInfo.results[i].result;
                        dieInfo.RollType = rollInfo.RollType;
                        dieInfo.DieType = dieType;
                        dieInfo.IsBlind = isBlind;
        
                        rollInfo.DiceInfo.push(dieInfo);
                    }
                }// end die type it

                //Get Associated Player
                let owners = Object.keys(workflow.actor.ownership);
                let owner = owners[owners.length-1];

                //If no owner found first pos should be GM ID
                if(owner === undefined){
                    owner = owners[1];
                }
                    
                DS_GLOBALS.DS_OBJ_GLOBAL.addRoll(rollInfo, owner);

            }// End roll it        
        }
    })
}

function initDiceStats(){
    //Load {MAP} MAX_TO_DIE To be used in DICE_STATS message parsing
    DS_GLOBALS.MAX_TO_DIE.set(2,   DS_GLOBALS.DIE_TYPE.D2);
    DS_GLOBALS.MAX_TO_DIE.set(3,   DS_GLOBALS.DIE_TYPE.D3);
    DS_GLOBALS.MAX_TO_DIE.set(4,   DS_GLOBALS.DIE_TYPE.D4);
    DS_GLOBALS.MAX_TO_DIE.set(6,   DS_GLOBALS.DIE_TYPE.D6);
    DS_GLOBALS.MAX_TO_DIE.set(8,   DS_GLOBALS.DIE_TYPE.D8);
    DS_GLOBALS.MAX_TO_DIE.set(10,  DS_GLOBALS.DIE_TYPE.D10);
    DS_GLOBALS.MAX_TO_DIE.set(12,  DS_GLOBALS.DIE_TYPE.D12);
    DS_GLOBALS.MAX_TO_DIE.set(20,  DS_GLOBALS.DIE_TYPE.D20);
    DS_GLOBALS.MAX_TO_DIE.set(100, DS_GLOBALS.DIE_TYPE.D100);

    DS_GLOBALS.GAME_SYSTEM_ID = `${game.system.id}`;

    //New Players might get added throught the game so update map on playerlist render. 
    DS_GLOBALS.DS_OBJ_GLOBAL.updateMap();

    //Comparison form needs player list which needs to wait for game to be in ready state.
    DS_GLOBALS.DS_OBJ_GLOBAL.updateComparisonFormCheckboxes() 

    if(game.settings.get(DS_GLOBALS.MODULE_ID, DS_GLOBALS.MODULE_SETTINGS.ENABLE_AUTO_DB)) 
    {
        DS_GLOBALS.DS_OBJ_GLOBAL.loadAllPlayerData();
    }

    // --- GM Clear all POPUP ---
    // Check Setting if popup enabled, (I like tracking stats per session so I clear my data every game)
    if( game.user.isGM &&
        game.settings.get(DS_GLOBALS.MODULE_ID, DS_GLOBALS.MODULE_SETTINGS.GLOBAL_ENABLE_CLEAR_ALL_STATS_POPUP))
    {   // Bring Up Popup
        DICE_STATS_UTILS.clearAllData();
    }
}

//Parse chat message when one gets displayed
Hooks.on('createChatMessage', (chatMessage) => {
    // Check if were pausing saving player roll data
    if(game.settings.get(DS_GLOBALS.MODULE_ID, DS_GLOBALS.MODULE_SETTINGS.GLOBAL_PAUSE_SAVING_DATA) === false){
        DS_GLOBALS.DS_OBJ_GLOBAL.parseMessage(chatMessage);
    }
});

// Initialize dialog and settings on foundry boot up
Hooks.once('init', () => {
    DS_GLOBALS.DS_OBJ_GLOBAL = new DiceStatsTracker();
    DB_INTERACTION.createDB();

    //Updates for Other system support. 
    //Needs to be after init hook to see active system and modules
    /*MIDI-QOL SUPPORT */
    if(game.modules.get("midi-qol")?.active){
        midiQolSupport();
    }

    /* Create Dice Stats API */
    game.modules.get('dice-stats').api = {
        saveRollValue: DiceStatsAPI.saveRollValue,//(/*player-id*/player_id,/*int:enum*/die_type, /*result*/roll_value),
        saveRollInfo: DiceStatsAPI.saveRollInfo,//(/*player-id*/player_id, /*roll_info*/roll_info),

        getPlayerList: DiceStatsAPI.getPlayerList,//(),
        getGlobals: DiceStatsAPI.getGlobals,//(),

        openGlobalStats: DiceStatsAPI.openGlobalStats,//(),
        openCompareStats: DiceStatsAPI.openCompareStats,//(),
        openPlayerStats: DiceStatsAPI.openPlayerStats,//(/*String*/player_id),
        openExportStats: DiceStatsAPI.openExportStats,//(/*Bool*/isGM)

    };

    // Call hook to tell people API is ready
    Hooks.callAll('diceStatsReady', game.modules.get('dice-stats').api);

    /* --- Examples on how to use API
        // if I need to do something as soon as the cool-module is ready
        Hooks.on('diceStatsReady', (api) => {
        // do what I need with their api
        });

        // alternatively if I know that the API should be populated when I need it,
        // I can defensively use the api on game.modules
        game.modules.get('diceStatsReady')?.api?.diceStatsApiStaticMethod(someInput)
    */
})

// Hook to interact when scenecontrols get created Method used to have a better location to access player data
Hooks.on("getSceneControlButtons", controls => {
  
    // Have Scenecontrol as global obj so its not made everytime scenecontrols gets rerendered (this happens alot)
    // Create new button on scene control
    if(DS_GLOBALS.SCENE_CONTROL_BTNS == null){

        // Register a new layer for our button
        CONFIG.Canvas.layers.diceStats = { layerClass: InteractionLayer, group: 'interface' }

        let playersAsTools = [];

        playersAsTools.push(new CustomSceneControlToolGlobal());
        playersAsTools.push(new CustomSceneControlToolCompare());

        if (game.user.isGM) {
            playersAsTools.push(new CustomSceneControlToolExport());
        }

        let string = game.settings.get(DS_GLOBALS.MODULE_ID, DS_GLOBALS.MODULE_SETTINGS.OTHER_ACCESS_BUTTON_ICONS);
        let icons = string.split(',');
        let i=0;
        let defaultIcon = 'fas fa-dice-d20'
        
        //Create sub button for each player
        //Add players custom icons
        for(let user of game.users){
            if(!user){return;}

            let icon;
            if(icons.length > 0 && icons[i])
            {
                icon = icons[i];
            }else{
                icon = defaultIcon;
            }

            playersAsTools.push(new CustomSceneControlToolPlayer(user.name, user.id, icon));
            i++;
        }
        
        //GLOBALSCENECONTROLSOBJ = new CustomSceneControl(playersAsTools);
        //This doesnt work anymore and dont know why. Need to set it as an object 
        // first, hence the temp var and obj.assign
        DS_GLOBALS.SCENE_CONTROL_BTNS = new Object();
        var temp = new CustomSceneControl(playersAsTools);
        Object.assign(DS_GLOBALS.SCENE_CONTROL_BTNS, temp);
    }

    if(DS_GLOBALS.SCENE_CONTROL_BTNS!=null && !controls.includes(DS_GLOBALS.SCENE_CONTROL_BTNS))
    {
        controls.push(DS_GLOBALS.SCENE_CONTROL_BTNS);
    }
    
});

//Autoload DB info on connection if setting is checked
Hooks.once('ready', () => {
        initDiceStats();
});

// Do something when another user connects to the game 
Hooks.on('userConnected', (userid, isConnecting) => {
    //Unused for now
});
