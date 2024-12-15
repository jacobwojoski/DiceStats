/* This is the struct that system forms use to display data specific to those systems.
    This data struct holds info that will be displayed using charts */
class GenericSystemChartData {
    /* ---- Chart Info ---- */
    _isChartDisplayed = true
    _chartName = ""; /* {STRING} needs to localized EX: "DICE_STATS_TEXT.both_forms.section_headings.d2" */
    _chartID = "";   /* {STRING} chart id that will get loaded on callback */

    _chartXAxisLabel = "";
    _chartYAxisLabel = "";
    _chartZAxisLabels = "";

    _chartXAxisLabels = []; /* {STRING} This is usually the value that was rolled on a die       EX: You rolled a 20! */
    _chartYAxisLabels = []; /* {STRING} This is usually the number of times a vaue was rolled    EX: You rolled a 1 32 times! */
    _chartZAxisLabels = []; /* {STRING} This is usually going to be degree success info          EX: You rolled a 10 - 3 times, That CF:0 F:1 P:2 CS:0 */

    _use2dAry = false;
    _chartData1D = [];  /* {INT} [DIE_RESULT] = Num Times Rolled */
    _chartData2D = [];  /* {INT} [DIE_RESULT][DEGREE_SUCCESS] = Num Times Rolled */

    _dieResultMax = 0;
    _degreeSuccessMax = 0;

    /* ---- Chart Details Info ---- */
    _chartDetailsLabels = [4]; /* {STRING} [] */

    _totalRolls = 0;/* {INT} Toal Rolls in chart */
    _mean = 0;      /* {INT} Average */
    _median = 0;    /* {INT} Middle Number */
    _mode = 0;      /* {INT} Most common */

    /* ---- Degree Success info ---- */
    _showDegSuccessInfo = false;
    _numDegreeSuccessVals = 0;  /* {INT} */
    _degreeSuccessLabels = [];  /* {STRING} [DEGREE_SUCCESS] = strings for each degree success */
    _degreeSuccessRolls = [];   /* {STRING} [DEGREE_SUCCESS] = num Times Rolled */

    /* ---- Public vars ---- */
    googleChartsDataAry = []; /* chart info stored in format used for google charts */

    chartDetailsHtml = "";
    degSuccessHtml = "";

    /** 
     * Convert chart data into array that will be loaded into google charts obj
     * @returns 2d array that gets used for google chart data
     */
    createChartArray(){
        let chart_data_ary = []

        let headings = [
            '{{localize '+this._chartXAxisLabel+'}}',
            '{{localize '+this._chartYAxisLabel+'}}'
        ]

        if (this._use2dAry){

            // Setup heading data
            for (let z_label_idx=0; z_label_idx < this._chartZAxisLabels.length(); z_label_idx++){
                headings.append( '{{localize '+this._chartZAxisLabels[z_label_idx]+'}}' );
            }
            chart_data_ary.append(headings);

            // Setup datapoints area of data ary
            for (var die_value=0; die_value < this._dieResultMax; die_value++) {
                // Add row heading to data 
                let row_heading = '{{localize '+this._chartXAxisLabels[die_value]+'}}';
                let row_data = [];
                row_data.append(row_heading);

                // Add data point for each degree success value
                for (var deg_success=0; deg_success < this._degreeSuccessMax; deg_success++){
                    let data_point = this._chartData2D[die_value][deg_success];
                    row_data.append(data_point);
                }

                // Add row info to total array
                chart_data_ary.append(row_data);
            }

        }else{ // 1d array data 

            // Create Row array that will be appended to the total returned array 
            let row_data = [];

            // For every resulting roll of the di(c)e
            for (var die_value=0; die_value < this._dieResultMax; die_value++) {
                // Add row heading 
                let row_heading = '{{localize '+this._chartXAxisLabels[die_value]+'}}';
                row_data.append(row_heading);

                // Add Data point
                let data_point = this._chartData1D[die_value];
                row_data.append(data_point);
            }
        }
        
        this.googleChartsDataAry = [...chart_data_ary];
        return chart_data_ary
    }

    /* ---- Convert Details info into array to be placed in table ---- */
    createDetailsArray(){

    }

    /* ---- Convert Degree Success info ----- */
    createDegreeSuccessArray(){

    }

}

/* Class that holds all the chart data */
class GenericSystemChartDataContainer {
    _numCharts = 0;
    _chartData = [];

    /* ---- Contructor ---- */
    GenericSystemChartData(new_chart_data=null) {
        if (new_chart_data){
            this._numCharts = new_chart_data.length();
            this._chartData = [...new_chart_data];
        }
    }

    /* ---- Add new data to chart info ---- */
    appendChartData(new_chart_data){
        this._chartData.append(new_chart_data);
        this._numCharts = this._chartData.length()
    }
}