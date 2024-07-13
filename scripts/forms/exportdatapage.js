import { DS_GLOBALS } from "../globals.js";

//==========================================================
//===================== FORMS SHIT =========================
//==========================================================
export class ExportDataPage extends FormApplication{

    static get defaultOptions() {
        const defaults = super.defaultOptions;
      
        const overrides = {
            height: 700,
            width: 400,
            popOut: true,
            resizable: true,
            id: 'export-data',
            template: DS_GLOBALS.MODULE_TEMPLATES.EXPORTFORM,
            userId: game.userId,
            title: game.i18n.localize('DICE_STATS_TEXT.export_data_form.title'),
        };
      
        const mergedOptions = foundry.utils.mergeObject(defaults, overrides);
        
        return mergedOptions;
    }

    constructor(userId, options={}, dataObject = null) {  
        // the first argument is the object, the second are the options
        super(userId, options)
    }

    //Every Form has this fn. Its returns data object that handlebars template uses
    getData(){
        let dataObject = {
            players: game.users.map(x => x.name),
        };

        return dataObject;
    }

    /**
     * Generates a CSV with statistics for all die types, given a list of player names
     * @param {string[]} playerList - A list of player usernames to be included in the statistics 
     * @returns {string} The CSV contents as a string
     */
    createCsv(playerList) {
        // Write CSV header
        let csvString = "Die Type,";
        for (let i = 1; i <= 100; i++) {
            csvString += i.toString() + (i == 100 ? "" : ",");
        }

        // Get data
        let players = game.users.filter(x => playerList.includes(x.name));
        let rollData = players.map(player => DS_GLOBALS.DS_OBJ_GLOBAL.PLAYER_DATA_MAP.get(player.id));
        let rolls = {};
        for (const data of rollData) {
            if (!data) continue;
            for (const dieType of data.PLAYER_DICE) {
                // Add player's rolls to total
                if (rolls[dieType.MAX] === undefined) {
                    rolls[dieType.MAX] = dieType.ROLLS;
                } else {
                    rolls[dieType.MAX] = rolls[dieType.MAX].map((val, ind) => val + dieType.ROLLS[ind]);
                }
            }
        }

        // Format roll data in CSV
        for (const die in rolls) {
            csvString += `\nD${die},${rolls[die].join(",")}`;
        }
        return csvString;
    }

    /**
     * Download a text file
     * @param {String} contents - Contents of the file
     * @param {String} fileName - Name with extention of file
     * returns DOWNLOADS A FILE
     */
    downloadFile(contents, fileName) {
        let hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(contents);
        hiddenElement.target = '_blank';
        hiddenElement.download = fileName;
        hiddenElement.click();
    }

    /**
     * Turn a specific players {PLAYER} data into a json file and download it
     * @param {String} playerName - the player we want to download
     * @returns {String} Playerdata as Json String
     */
    createSinglePlayerJson(playerName){
        /* Get Players Data */
        // Find player with specified name in game list & get their dice stats data object
        let players = game.users.filter(x => x.name === playerName);
        let rollData = players.map(player => DS_GLOBALS.DS_OBJ_GLOBAL.PLAYER_DATA_MAP.get(player.id));

        // Break and siaply warning if no data found
        if(!rollData){
            ui.anouncements.warn(`No Rolls for ${playerName} Found`);
            return;
        }

        /* Create Json String of player data */
        let playerJsonString = JSON.stringify(rollData);
        return playerJsonString;
    }

    /** 
     * 1. Get every players {PLAYER} data and convert it to a json string
     * 2. Convert json string into file and download it
     * @returns All Playerdata as Json String
     */
    createAllPlayerJson(){
        /* Stop non GM's from downloading files */
        if (!game.user.isGM) {
            ui.notifications.warn("Only the GM can download full player file");
            return;
        }

        /* Create Json String */
        let localPlayerDataAry = [];
        for(const [key, playerData] of DS_GLOBALS.DS_OBJ_GLOBAL.PLAYER_DATA_MAP.entries()){
            localPlayerDataAry.push(playerData);
        }
        
        let jsonString = JSON.stringify(localPlayerDataAry);

        return jsonString;
    }

    //Handle button events made on the form
    async _handleButtonClick(event){
        const clickedElement = $(event.currentTarget);
        const action = clickedElement.data().action;

        if(DS_GLOBALS.FORM_EXPORT == null){return;}

        if (!game.user.isGM) return;

        /* Export CSV DATA */
        if (action.startsWith("export-csv-player-")) {
            const playerName = action.substr(18);
            this.downloadFile(this.createCsv(playerName),
                `${playerName} dice-stats-${new Date().toISOString().split(".").shift()}.csv`);

        } else if (action === ("export-csv-allplayers")) {
            this.downloadFile(this.createCsv(game.users.map(x => x.name)),
                `total dice-stats-${new Date().toISOString().split(".").shift()}.csv`);

        /* Export JSON Data */
        } else if (action.startsWith("export-json-player-")){
            const playerName = action.substr(19);
            let filename = `${playerName}-dice-stats-json-data.json`;
            let jsonDataString = this.createSinglePlayerJson(playerName);

            this.downloadFile(jsonDataString, filename);

        } else if (action === ("export-json-allplayers")){
            let filename = `allPlayers-dice-stats-json-data.json`;
            let jsonDataString = this.createAllPlayerJson();

            this.downloadFile(jsonDataString, filename);
        }

    }

    activateListeners(html) {
        super.activateListeners(html);
        html.on('click', "[data-action]", this._handleButtonClick.bind(this));
    }
}
