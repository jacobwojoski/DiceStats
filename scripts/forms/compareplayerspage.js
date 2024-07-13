import { DS_GLOBALS } from "../globals.js";
import { DATA_PACKAGER } from "../database/datapack.js";

//==========================================================
//===================== FORMS SHIT =========================
//==========================================================
export class ComparePlayerStatusPage extends FormApplication{

    static get defaultOptions() {
        const defaults = super.defaultOptions;
      
        const overrides = {
            height: 700,
            width: 1000,
            popOut: true,
            resizable: true,
            id: 'compare-data',
            template: DS_GLOBALS.MODULE_TEMPLATES.COMPAREFORM,
            userId: game.userId,
            title: game.i18n.localize('DICE_STATS_TEXT.compare_data_form.title'),
        };
      
        const mergedOptions = foundry.utils.mergeObject(defaults, overrides);
        
        return mergedOptions;
    }

    constructor(userId, options={}, dataObject = null) {  
        // the first argument is the object, the second are the options
        super(userId, options)
    }

    /**
     * Update isChecked in COMPARE_PLAYERS_LIST[]
     * @param {String} userid User ID Value
     * @returns void
     */
    swapPlayersChecked(userid)
    {
        for(let plyr of DS_GLOBALS.DS_OBJ_GLOBAL.COMPARISON_FORM_PLAYER_CHECKBOXES)
        {
            if(plyr.id == userid)
            {
                plyr.isChecked = !plyr.isChecked;
                return;
            }
        }
    }

    //Every Form has this fn. Its returns data object that handlebars template uses
    getData(){
        var includeGM = game.settings.get(DS_GLOBALS.MODULE_ID, DS_GLOBALS.MODULE_SETTINGS.PLAYERS_SEE_GM_IN_GLOBAL);

        //Convert Map of PLayers to Array
        let playersAry = [];
        DS_GLOBALS.DS_OBJ_GLOBAL.PLAYER_DATA_MAP.forEach(value => {
            playersAry.push(value);
        })

        let dataObject = DATA_PACKAGER.packageComparePlayerData(DS_GLOBALS.DS_OBJ_GLOBAL.COMPARISON_FORM_PLAYER_CHECKBOXES, playersAry, includeGM);
        dataObject.IS_DIE_DISPLAYED = [...DS_GLOBALS.DS_OBJ_GLOBAL.COMPARISON_FORM_DIE_CHECKBOXES]

        //dataObject.IS_DIE_DISPLAYED = [...CLASSOBJ.GLOBAL_DICE_CHECKBOXES];
        return dataObject;
    }

    //Handle button events made on the form
    async _handleButtonClick(event){
        const clickedElement = $(event.currentTarget);
        const action = clickedElement.data().action;

        if(DS_GLOBALS.FORM_GL_COMPARE == null){return;}

        switch(action){
            case 'refresh':
                DS_GLOBALS.FORM_GL_COMPARE.render();
                break;
            case 'd2checkbox':
                DS_GLOBALS.DS_OBJ_GLOBAL.COMPARISON_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D2] 
                    = !DS_GLOBALS.DS_OBJ_GLOBAL.COMPARISON_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D2];
                DS_GLOBALS.FORM_GL_COMPARE.render();
                break;
            case 'd3checkbox':
                DS_GLOBALS.DS_OBJ_GLOBAL.COMPARISON_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D3] 
                    = !DS_GLOBALS.DS_OBJ_GLOBAL.COMPARISON_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D3];
                DS_GLOBALS.FORM_GL_COMPARE.render();
                break;
            case 'd4checkbox':
                DS_GLOBALS.DS_OBJ_GLOBAL.COMPARISON_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D4] 
                    = !DS_GLOBALS.DS_OBJ_GLOBAL.COMPARISON_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D4];
                DS_GLOBALS.FORM_GL_COMPARE.render();
                break;
            case 'd6checkbox':
                DS_GLOBALS.DS_OBJ_GLOBAL.COMPARISON_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D6] 
                    = !DS_GLOBALS.DS_OBJ_GLOBAL.COMPARISON_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D6];
                DS_GLOBALS.FORM_GL_COMPARE.render();
                break;
            case 'd8checkbox':
                DS_GLOBALS.DS_OBJ_GLOBAL.COMPARISON_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D8] 
                    = !DS_GLOBALS.DS_OBJ_GLOBAL.COMPARISON_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D8];
                DS_GLOBALS.FORM_GL_COMPARE.render();
                break;
            case 'd10checkbox':
                DS_GLOBALS.DS_OBJ_GLOBAL.COMPARISON_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D10] 
                    = !DS_GLOBALS.DS_OBJ_GLOBAL.COMPARISON_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D10];
                DS_GLOBALS.FORM_GL_COMPARE.render();
                break;
            case 'd12checkbox':
                DS_GLOBALS.DS_OBJ_GLOBAL.COMPARISON_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D12] 
                    = !DS_GLOBALS.DS_OBJ_GLOBAL.COMPARISON_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D12];
                DS_GLOBALS.FORM_GL_COMPARE.render();
                break;
            case 'd20checkbox':
                DS_GLOBALS.DS_OBJ_GLOBAL.COMPARISON_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D20] 
                    = !DS_GLOBALS.DS_OBJ_GLOBAL.COMPARISON_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D20];
                DS_GLOBALS.FORM_GL_COMPARE.render();
                break;
            case 'd100checkbox':
                //D100 Not currently on Comparison Screen due to lines not being wide enough
                //DS_GLOBALS.DS_OBJ_GLOBAL.COMPARISON_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D100] = 
                //!DS_GLOBALS.DS_OBJ_GLOBAL.COMPARISON_FORM_DIE_CHECKBOXES[DS_GLOBALS.DIE_TYPE.D100];
                DS_GLOBALS.FORM_GL_COMPARE.render();
                break;
            default:
                //Check if button was from checking players to compare
                if(DS_GLOBALS.DS_OBJ_GLOBAL.PLAYER_DATA_MAP.has(action))
                {
                    DS_GLOBALS.FORM_GL_COMPARE.swapPlayersChecked(action);
                    DS_GLOBALS.FORM_GL_COMPARE.render();
                }
                return;
        }
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.on('click', "[data-action]", this._handleButtonClick.bind(this));
    }
}