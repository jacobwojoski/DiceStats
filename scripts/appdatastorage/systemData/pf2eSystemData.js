import { DS_GLOBALS } from "../../dice-stats-globals";
export class Pf2eSystemData {
    static DIE_TYPE = DS_GLOBALS.DIE_TYPE.D20;
    static DIE_MAX = 20;

    static NUM_DEG_SUCCESS = 5;
    static DEGREE_SUCCESS = {
        UNKNOWN: 0,
        CRIT_FAIL: 1,
        FAIL: 2,
        SUCCESS: 3,
        CRIT_SUCCESS: 4
    }

    /* All system arrays are 2d: [D20_RESULT][DEGREE_SUCCESS] = num_of_degree_success_rolls*/
    atk_rolls = [];
    player_saves = [];
    npc_saves = [];
    skills = [];
    ability = [];
    initiative = [];

    /* msg rolls dont have degree successs so its 2d arrays of [DIE_TYPE][NUM_DICE] = dmg_done*/
    dmg_rolls = [];

    /* Its very unlinkly to have an unknown attack with a degree success */
    unknown = [];

    /* Dmg values just from dice */
    damage_done = 0;
    damage_max = 0;
    damage_min = 0;
    damage_expected = 0;

    /* Dmg values including modifiers to rolls Ex: 6d4+10 */
    damage_done_with_mods = 0;
    damage_expected_with_mods = 0;
    damage_taken_to_player = 0;    

    /* Misc Info */
    hero_points_used = 0;

    degree_success_with_advantage = [];
    degree_success_with_disadvantage = [];

    advantage_helped = 0;
    advantage_did_nothing = 0;
    advantage_unknown = 0;
    advantage_total = 0;

    disadvantage_hurt = 0;
    disadvantage_did_nothing = 0;
    disadvantage_unknown = 0;
    disadvantage_total = 0;



    constructor(){
        /* INIT 2d arrays */
        for(let i=0; i<this.DIE_MAX; i++){
            this.atk_rolls[i] = new Array(this.NUM_DEG_SUCCESS);
            this.dmg_rolls[i] = new Array(this.NUM_DEG_SUCCESS);
            this.player_saves[i] = new Array(this.NUM_DEG_SUCCESS);
            this.npc_saves[i] = new Array(this.NUM_DEG_SUCCESS);
            this.skills[i] = new Array(this.NUM_DEG_SUCCESS);
            this.ability[i] = new Array(this.NUM_DEG_SUCCESS);
            this.initiative[i] = new Array(this.NUM_DEG_SUCCESS);

            /* Its very unlinkly to have an unknown attack with a degree success */
            this.unknown[i] = new Array(this.NUM_DEG_SUCCESS);
        }

        this.degree_success_with_advantage = new Array(this.NUM_DEG_SUCCESS);
        this.degree_success_with_disadvantage = new Array(this.NUM_DEG_SUCCESS);

        this.clear_data();
    }

    clear_data(){
        /* Fill all arays with 0 */
        for(let i=0; i<this.DIE_MAX; i++){
            for(let j=0; j<this.NUM_DEG_SUCCESS; j++){
                this.atk_rolls[i][j].fill(0);
                this.dmg_rolls[i][j].fill(0);
                this.player_saves[i][j].fill(0);
                this.npc_saves[i][j].fill(0);
                this.skills[i][j].fill(0);
                this.ability[i][j].fill(0);
                this.initiative[i][j].fill(0);
                this.unknown[i][j].fill(0);
            }
        }/* for die_max */

        this.hero_points_used = 0; 

        /* Degree success for D20 rolls with advantage(Xd20kh1) or disadvantage(Xd20kl1) */
        this.degree_success_with_advantage.fill(0);
        this.degree_success_with_disadvantage.fill(0);

        this.advantage_changed_result = 0;
        this.advantage_did_nothing = 0;
        this.disadvantage_changed_result = 0;
        this.disadvantage_did_nothing = 0;

        this.damage_done = 0;
        this.damage_max = 0;
        this.damage_min = 0;
        this.damage_expected = 0;
        this.damage_done_with_mods = 0;
        this.damage_expected_with_mods = 0;
        this.damage_taken_to_player = 0;
    }

    /**
     * Add temp_data into this data
     * @param {Pf2eSystemData} temp_data 
     */
    add(temp_data){
        for(let i=0; i<this.DIE_MAX; i++){
            for(let j=0; j<this.NUM_DEG_SUCCESS; j++){
                this.atk_rolls[i][j] +=     temp_data.atk_rolls[i][j];
                this.dmg_rolls[i][j] +=     temp_data.atk_rolls[i][j];
                this.player_saves[i][j] +=  temp_data.atk_rolls[i][j];
                this.npc_saves[i][j] +=     temp_data.atk_rolls[i][j];
                this.skills[i][j] +=        temp_data.atk_rolls[i][j];
                this.ability[i][j] +=       temp_data.atk_rolls[i][j];
                this.initiative[i][j] +=    temp_data.atk_rolls[i][j];
                this.unknown[i][j]+=        temp_data.atk_rolls[i][j];
            }
        }/* for die_max */

        this.hero_points_used = 0; 

        for(let i=0; i<NUM_DEG_SUCCESS; i++){
            this.degree_success_with_advantage[i]       +=temp_data.degree_success_with_advantage[i];
            this.degree_success_with_disadvantage[i]    +=temp_data.degree_success_with_disadvantage[i];
        }

        this.advantage_changed_result       += temp_data.advantage_changed_result;
        this.advantage_did_nothing          += temp_data.advantage_did_nothing;
        this.disadvantage_changed_result    += temp_data.disadvantage_changed_result;
        this.disadvantage_did_nothing       += temp_data.advantage_did_nothing;

        this.damage_done                += temp_data.damage_done;
        this.damage_max                 += temp_data.damage_max;
        this.damage_min                 += temp_data.damage_min;
        this.damage_expected            += temp_data.damage_expected;
        this.damage_done_with_mods      += temp_data.damage_done_with_mods;
        this.damage_expected_with_mods  += temp_data.damage_expected_with_mods; 
        this.this.damage_taken_to_player += temp_data.damage_taken_to_player;  
    }

    
}

/* Example for later 
var data = google.visualization.arrayToDataTable([
          ['Category', 'Group 1', 'Group 2', 'Expected Distribution'],
          ['A', 5, 5, 12],
          ['B', 7, 7, 15],
          ['C', 8, 8, 16],
          ['D', 10, 12, 18],
          ['E', 13, 15, 25]
        ]);

        var options = {
          title: 'Stacked Bar Chart with Overlay Line',
		  width: 1500,
		  height: 500,
          hAxis: { title: 'Category' },
          vAxis: { title: 'Value' },
          isStacked: true,  // Enables stacked bars
          seriesType: 'bars',  // Default type for all series
          series: {
            2: { type: 'line', color: 'red', lineWidth: 3, pointSize: 5 } // Line chart for the third column (Expected Distribution)
          }
*/