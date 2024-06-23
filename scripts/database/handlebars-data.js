import { DS_GLOBALS } from "../dice-stats-globals";

class HBS_CHART_INFO_TABLE_DATA {
    totalRolls  = 0;
    mean        = 0;
    median      = 0;
    mode        = 0;
    isStreakBlind = false;
    streak      = "";
}

class HANDLEBARS_DICE_CHART_DATA {
    rollType            = null; /*Attack rolls, All rolls, skill rolls, etc*/
    dieType             = DS_GLOBALS.DIE_TYPE.D2;
    dieSectionHeading   = "";
    chartID             = "";
    totalNumDieRolls    = 0;       
    isDieDisplayed      = false;     /* User checkbox */
    chartTableData = new HBS_CHART_INFO_TABLE_DATA();
    chartData = null;
    googleChart = null;
    rollData = [];

    createChartData(roll_data){
        // Create 2d array ( [[index, value]*maxDieValue] )

    }

    createGoogleChartObj()
    {
        // Make sure we have data to make chart
        if(this.chartData == null){
            console.log("ERROR: No chart data found");
            return;
        }

    }

}

