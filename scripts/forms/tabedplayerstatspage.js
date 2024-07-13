import { DS_GLOBALS } from "../globals.js";
import { DATA_PACKAGER } from "../database/datapack.js";

/**
 * This is the player stats class. One of these classes gets made for every player added in the game.
 * 
 */
export class CustomTabFormClass extends FormApplication
{
    SEL_PLAYER = 0;

    static get defaultOptions() {
        const defaults = super.defaultOptions;
      
        var player_stats_options_data = { 
            template: DS_GLOBALS.MODULE_TEMPLATES.TABEDPLAYERBASE,
            height: 'auto',
            popOut: true,
            resizable: true,
            id: 'player-tabbed-dice-stats',
            userId: game.userId,
            title: game.i18n.localize('DICE_STATS_TEXT.player_data_form.title'),
            tabs: [
                {   navSelector: ".tabs", 
                    contentSelector: ".content", 
                    initial: "player-stats"
                }
            ]
        }

        const mergedOptions = foundry.utils.mergeObject(defaults, player_stats_options_data);

        return mergedOptions;
    }

    formDataObject;

    //dataObject<PLAYER> = pointerToPlayerData type class PLAYER
    constructor(userId, options={}, dataObject = null) {  
        // the first argument is the object, the second are the options
        super(userId, options)
        this.SEL_PLAYER = userId;
        this.formDataObject = dataObject;
        //this.PLAYERDATA = dataObject;
    }

    /**
     * Update the tab object with different tab buttons bassed on the users current configuration settings
     * @param {*} tabObj Array that stores the tab buttons. 
     */
    createTabObj(){
        let tabObj = [];
        // Global Player Stats info, This is the default tab and should always be displayed
        tabObj.push(
            { 
                label: "player-stats",
                title: game.i18n.localize('DICE_STATS_TEXT.both_forms.tab_titles.all'),
                content: "<em>Fancy tab1 content.</em>",
                base: true
            }
        );

        // D20 Specific Info Tab. Some game systems like PBTA might want this disabled
        if(game.settings.get(DS_GLOBALS.MODULE_ID, DS_GLOBALS.MODULE_SETTINGS.LOCAL_ENABLE_D20_DETAILS_TAB)) {
            tabObj.push(
                { 
                    label: "player-stats-d20",
                    title: game.i18n.localize('DICE_STATS_TEXT.both_forms.tab_titles.d20'),
                    content: "<em>Fancy tab2 content.</em>",
                    d20: true
                }
            );
        }

        // 2DX Info Tab, Stats on rolls like 2d6, 2d12, 2d20. These should make bellcurve looking charts
        if(game.settings.get(DS_GLOBALS.MODULE_ID, DS_GLOBALS.MODULE_SETTINGS.LOCAL_ENABLE_2DX_DETAILS_TAB)) {
            tabObj.push(
                {
                    label: "2dx-stats",
                    title: game.i18n.localize('DICE_STATS_TEXT.both_forms.tab_titles.twoDx'),
                    content: "<em>Fancy tab2 content.</em>",
                    twoDx: true
                }
            );
        }

        if(game.settings.get(DS_GLOBALS.MODULE_ID, DS_GLOBALS.MODULE_SETTINGS.LOCAL_ENABLE_HIT_MISS_INFO_TAB)){
            tabObj.push(
                {
                    label: "hit-miss",
                    title: "Hit Miss Tracker",
                    content: "<em>Fancy tab2 content.</em>",
                    hitMiss: true
                }
            )
        }

        return tabObj;
    }

    // Create data object thats used for the form
    getData(){

        loadTemplates(DS_GLOBALS.TEMPLATE_PATH_ARY);
        
        //Object needed to specify tabs
        var baseDataObject = { 
            header: "<h1>HEADER</h1>",
            tabs: [],
            footer: "<h1>FOOTER</h1>"
        };

        // Create different tab buttons for player form
        baseDataObject.tabs = this.createTabObj();

        if(DS_GLOBALS.DS_OBJ_GLOBAL.PLAYER_DATA_MAP.has(this.SEL_PLAYER)){
            let playerObj = DS_GLOBALS.DS_OBJ_GLOBAL.PLAYER_DATA_MAP.get(this.SEL_PLAYER);

            var playerDataObject = DATA_PACKAGER.packagePlayerData(playerObj);
            playerDataObject.IS_DIE_DISPLAYED = [...DS_GLOBALS.DS_OBJ_GLOBAL.PLAYER_STATS_FORM_DIE_CHECKBOXES];

            var mergedDataObj = {...baseDataObject};
            mergedDataObj[ 'playerData' ] = playerDataObject;
            return mergedDataObj;
        }
        return DATA_PACKAGER.PLAYER_HNDL_INFO;
    }


    async _handleButtonClick(event){
        const clickedElement = $(event.currentTarget);
        const action = clickedElement.data().action;

        let title_txt;
        let context_txt;

        //Handle button events made on the form
        switch(action){
            case 'refresh':
                DS_GLOBALS.FORM_PLAYER_STATS.render();
                break;
            case 'save':
                title_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.save_to_db.title');
                context_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.save_to_db.context');
                const saveConfirmation = await Dialog.confirm({
                    title: title_txt,
                    content: context_txt,
                    yes: () => {return true},
                    no: () => {return false},
                    defaultYes: false
                    });

                if (saveConfirmation) {
                    ui.notifications.warn("Your Data Saved");
                    DS_GLOBALS.DS_OBJ_GLOBAL.saveMyPlayerData();
                }
                break;
            case 'loadAllFromDB':
                title_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.load_all_db.title');
                context_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.load_all_db.context');
                const loadConfirmation = await Dialog.confirm({
                    title: title_txt,
                    content: context_txt,
                    yes: () => {return true},
                    no: () => {return false},
                    defaultYes: false
                    });

                if (loadConfirmation) {
                    ui.notifications.warn("All Data Loaded");
                    DS_GLOBALS.DS_OBJ_GLOBAL.loadAllPlayerData();
                }
                break;
            case 'loadYoursFromDB':
                title_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.load_your_db.title');
                context_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.load_your_db.context');
                const loadYoursConfirmation = await Dialog.confirm({
                    title: title_txt,
                    content: context_txt,
                    yes: () => {return true},
                    no: () => {return false},
                    defaultYes: false
                    });

                if (loadYoursConfirmation) {
                    ui.notifications.warn("Your Data Loaded");
                    DS_GLOBALS.DS_OBJ_GLOBAL.loadYourPlayerData();
                }
                break;
            case 'loadOthersFromDB':
                title_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.load_others_db.title');
                context_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.load_others_db.context');
                const loadOthersConfirmation = await Dialog.confirm({
                    title: title_txt,
                    content: context_txt,
                    yes: () => {return true},
                    no: () => {return false},
                    defaultYes: false
                    });

                if (loadOthersConfirmation) {
                    DS_GLOBALS.DS_OBJ_GLOBAL.loadOthersPlayerData();
                }
                break;
            case 'clearAllLocalRollData':
                title_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.clear_all_local.title');
                context_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.clear_all_local.context');
                const clearAllLocalConfirmation = await Dialog.confirm({
                    title: title_txt,
                    content: context_txt,
                    yes: () => {return true},
                    no: () => {return false},
                    defaultYes: false
                    });

                if (clearAllLocalConfirmation) {
                    ui.notifications.warn("All Local Data Cleared");
                    DS_GLOBALS.DS_OBJ_GLOBAL.clearAllRollData();
                    if(DS_GLOBALS.FORM_PLAYER_STATS){
                        DS_GLOBALS.FORM_PLAYER_STATS.render();
                    }
                }
                break;
            case 'clearYourLocalRollData':
                title_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.clear_your_local.title');
                context_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.clear_your_local.context');
                const clearYourLocalConfirmation = await Dialog.confirm({
                    title: title_txt,
                    content: context_txt,
                    yes: () => {return true},
                    no: () => {return false},
                    defaultYes: false
                    });

                if (clearYourLocalConfirmation) {
                    ui.notifications.warn("Your Local Data Cleared");
                    DS_GLOBALS.DS_OBJ_GLOBAL.clearUsersRollData(game.user.id);
                    if(DS_GLOBALS.FORM_PLAYER_STATS){
                        DS_GLOBALS.FORM_PLAYER_STATS.render();
                    }
                }
                break;
            case 'clearYourDBrollData':
                    title_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.clear_your_db.title');
                    context_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.clear_your_db.context');
                    const dbcon = await Dialog.confirm({
                        title: title_txt,
                        content: context_txt,
                        yes: () => {return true},
                        no: () => {return false},
                        defaultYes: false
                        });
    
                    if (dbcon) {
                        ui.notifications.warn("All Your DB Data Cleared");
                        DB_INTERACTION.clearPlayer(game.user);
                        if(DS_GLOBALS.FORM_PLAYER_STATS){
                            DS_GLOBALS.FORM_PLAYER_STATS.render();
                        }
                    }
                    break;
            case 'clearAllPlayerData':
                title_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.clear_both.title');
                context_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.clear_both.context');
                const dbcon2 = await Dialog.confirm({
                    title: title_txt,
                    content: context_txt,
                    yes: () => {return true},
                    no: () => {return false},
                    defaultYes: false
                    });

                if (dbcon2) {
                    ui.notifications.warn("All Your Data Cleared");
                    DS_GLOBALS.DS_OBJ_GLOBAL.clearUsersRollData(game.user.id);
                    DB_INTERACTION.clearPlayer(game.user);
                    if(DS_GLOBALS.FORM_PLAYER_STATS){
                        DS_GLOBALS.FORM_PLAYER_STATS.render();
                    }
                }
                break;
            case 'd2checkbox':
                DS_GLOBALS.DS_OBJ_GLOBAL.PLAYER_STATS_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D2] 
                    = !DS_GLOBALS.DS_OBJ_GLOBAL.PLAYER_STATS_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D2];
                DS_GLOBALS.FORM_PLAYER_STATS.render();
                break;
            case 'd3checkbox':
                DS_GLOBALS.DS_OBJ_GLOBAL.PLAYER_STATS_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D3] 
                    = !DS_GLOBALS.DS_OBJ_GLOBAL.PLAYER_STATS_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D3];
                DS_GLOBALS.FORM_PLAYER_STATS.render();
                break;
            case 'd4checkbox':
                DS_GLOBALS.DS_OBJ_GLOBAL.PLAYER_STATS_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D4] 
                    = !DS_GLOBALS.DS_OBJ_GLOBAL.PLAYER_STATS_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D4];
                DS_GLOBALS.FORM_PLAYER_STATS.render();
                break;
            case 'd6checkbox':
                DS_GLOBALS.DS_OBJ_GLOBAL.PLAYER_STATS_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D6] 
                    = !DS_GLOBALS.DS_OBJ_GLOBAL.PLAYER_STATS_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D6];
                DS_GLOBALS.FORM_PLAYER_STATS.render();
                break;
            case 'd8checkbox':
                DS_GLOBALS.DS_OBJ_GLOBAL.PLAYER_STATS_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D8] 
                    = !DS_GLOBALS.DS_OBJ_GLOBAL.PLAYER_STATS_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D8];
                DS_GLOBALS.FORM_PLAYER_STATS.render();
                break;
            case 'd10checkbox':
                DS_GLOBALS.DS_OBJ_GLOBAL.PLAYER_STATS_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D10] 
                    = !DS_GLOBALS.DS_OBJ_GLOBAL.PLAYER_STATS_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D10];
                DS_GLOBALS.FORM_PLAYER_STATS.render();
                break;
            case 'd12checkbox':
                DS_GLOBALS.DS_OBJ_GLOBAL.PLAYER_STATS_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D12] 
                    = !DS_GLOBALS.DS_OBJ_GLOBAL.PLAYER_STATS_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D12];
                DS_GLOBALS.FORM_PLAYER_STATS.render();
                break;
            case 'd20checkbox':
                DS_GLOBALS.DS_OBJ_GLOBAL.PLAYER_STATS_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D20] 
                    = !DS_GLOBALS.DS_OBJ_GLOBAL.PLAYER_STATS_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D20];
                DS_GLOBALS.FORM_PLAYER_STATS.render();
                break;
            case 'd100checkbox':
                DS_GLOBALS.DS_OBJ_GLOBAL.PLAYER_STATS_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D100] 
                    = !DS_GLOBALS.DS_OBJ_GLOBAL.PLAYER_STATS_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D100];
                DS_GLOBALS.FORM_PLAYER_STATS.render();
                break;
            default:
                DS_GLOBALS.FORM_PLAYER_STATS.render();
                return;
        }
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.on('click', "[data-action]", this._handleButtonClick.bind(this));
    }    
}