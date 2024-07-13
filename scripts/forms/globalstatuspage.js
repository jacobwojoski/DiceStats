import { DS_GLOBALS } from "../globals.js";
import { DATA_PACKAGER } from "../database/datapack.js";
import { DB_INTERACTION } from "../database/db.js";

//==========================================================
//===================== FORMS SHIT =========================
//==========================================================


export class GlobalStatusPage extends FormApplication{

    static get defaultOptions() {
        const defaults = super.defaultOptions;
      
        const overrides = {
          height: 'auto',
          popOut: true,
          resizable: true,
          id: 'global-data',
          template: DS_GLOBALS.MODULE_TEMPLATES.GLOBALDATAFORM,
          userId: game.userId,
          title: game.i18n.localize('DICE_STATS_TEXT.global_data_form.title'),
        };
      
        const mergedOptions = foundry.utils.mergeObject(defaults, overrides);
        
        return mergedOptions;
    }

    constructor(userId, options={}, dataObject = null) {  
        // the first argument is the object, the second are the options
        super(userId, options)
    }

    getData(){
        var includeGM = game.settings.get(DS_GLOBALS.MODULE_ID, DS_GLOBALS.MODULE_SETTINGS.PLAYERS_SEE_GM_IN_GLOBAL);

        //Convert Map of PLayers to Array
        let playersAry = [];
        DS_GLOBALS.DS_OBJ_GLOBAL.PLAYER_DATA_MAP.forEach(value => {
            playersAry.push(value);
        })

        let dataObject = DATA_PACKAGER.packageGlobalData(playersAry, includeGM);
        dataObject.IS_DIE_DISPLAYED = [...DS_GLOBALS.DS_OBJ_GLOBAL.GLOBAL_STATS_FORM_DIE_CHECKBOXES];
        return dataObject;
    }

    //Handle button events made on the form
    async _handleButtonClick(event){
        const clickedElement = $(event.currentTarget);
        const action = clickedElement.data().action;
        
        let title_txt;
        let context_txt;

        switch(action){
            case 'refresh':
                DS_GLOBALS.FORM_GL_STATS.render();
                break;
            case 'pushBlindRolls':
                DS_GLOBALS.MODULE_SOCKET.executeForEveryone("push_sock", game.userId);
                DS_GLOBALS.FORM_GL_STATS.render();
                break;
            case 'clearAllRollData':
                title_txt = game.i18n.localize('DICE_STATS_TEXT.global_dialogs.clear_all_data.title');
                context_txt = game.i18n.localize('DICE_STATS_TEXT.global_dialogs.clear_all_data.context');
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
                break;
            case 'clearAllLocalRollData':
                title_txt = game.i18n.localize('DICE_STATS_TEXT.global_dialogs.clear_all_local_data.title');
                context_txt = game.i18n.localize('DICE_STATS_TEXT.global_dialogs.clear_all_local_data.context');
                const localClear = await Dialog.confirm({
                    title: title_txt,
                    content: context_txt,
                    yes: () => {return true},
                    no: () => {return false},
                    defaultYes: false
                    });

                if (localClear) {
                    ui.notifications.warn("All Local Data Cleared");
                    DS_GLOBALS.MODULE_SOCKET.executeForEveryone("clear_sock", {});
                }
                break;
            case 'clearAllDBrollData':
                title_txt = game.i18n.localize('DICE_STATS_TEXT.global_dialogs.clear_all_db_data.title');
                context_txt = game.i18n.localize('DICE_STATS_TEXT.global_dialogs.clear_all_db_data.context');
                const dbClear = await Dialog.confirm({
                    title: title_txt,
                    content: context_txt,
                    yes: () => {return true},
                    no: () => {return false},
                    defaultYes: false
                    });

                if (dbClear) {
                    ui.notifications.warn("All DB Data Cleared");
                    DS_GLOBALS.DS_OBJ_GLOBAL.clear_database();
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
                case 'd2checkbox':
                    DS_GLOBALS.DS_OBJ_GLOBAL.GLOBAL_STATS_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D2] 
                        = !DS_GLOBALS.DS_OBJ_GLOBAL.GLOBAL_STATS_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D2];
                    DS_GLOBALS.FORM_PLAYER_STATS.render();
                    break;
                case 'd3checkbox':
                    DS_GLOBALS.DS_OBJ_GLOBAL.GLOBAL_STATS_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D3] 
                        = !DS_GLOBALS.DS_OBJ_GLOBAL.GLOBAL_STATS_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D3];
                    DS_GLOBALS.FORM_PLAYER_STATS.render();
                    break;
                case 'd4checkbox':
                    DS_GLOBALS.DS_OBJ_GLOBAL.GLOBAL_STATS_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D4] 
                        = !DS_GLOBALS.DS_OBJ_GLOBAL.GLOBAL_STATS_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D4];
                    DS_GLOBALS.FORM_PLAYER_STATS.render();
                    break;
                case 'd6checkbox':
                    DS_GLOBALS.DS_OBJ_GLOBAL.GLOBAL_STATS_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D6] 
                        = !DS_GLOBALS.DS_OBJ_GLOBAL.GLOBAL_STATS_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D6];
                    DS_GLOBALS.FORM_PLAYER_STATS.render();
                    break;
                case 'd8checkbox':
                    DS_GLOBALS.DS_OBJ_GLOBAL.GLOBAL_STATS_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D8] 
                        = !DS_GLOBALS.DS_OBJ_GLOBAL.GLOBAL_STATS_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D8];
                    DS_GLOBALS.FORM_PLAYER_STATS.render();
                    break;
                case 'd10checkbox':
                    DS_GLOBALS.DS_OBJ_GLOBAL.GLOBAL_STATS_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D10] 
                        = !DS_GLOBALS.DS_OBJ_GLOBAL.GLOBAL_STATS_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D10];
                    DS_GLOBALS.FORM_PLAYER_STATS.render();
                    break;
                case 'd12checkbox':
                    DS_GLOBALS.DS_OBJ_GLOBAL.GLOBAL_STATS_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D12] 
                        = !DS_GLOBALS.DS_OBJ_GLOBAL.GLOBAL_STATS_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D12];
                    DS_GLOBALS.FORM_PLAYER_STATS.render();
                    break;
                case 'd20checkbox':
                    DS_GLOBALS.DS_OBJ_GLOBAL.GLOBAL_STATS_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D20] 
                        = !DS_GLOBALS.DS_OBJ_GLOBAL.GLOBAL_STATS_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D20];
                    DS_GLOBALS.FORM_PLAYER_STATS.render();
                    break;
                case 'd100checkbox':
                    DS_GLOBALS.DS_OBJ_GLOBAL.GLOBAL_STATS_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D100] 
                        = !DS_GLOBALS.DS_OBJ_GLOBAL.GLOBAL_STATS_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D100];
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
