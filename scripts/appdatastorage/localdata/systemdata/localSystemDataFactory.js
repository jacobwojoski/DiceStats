import { PF2E_SYSTEM_DATA } from "./pf2eSystemData";
import { DRAGONBANE_SYSTEM_DATA } from "./dragonbaneSystemData";
import { DAGGERHEART_SYSTEM_DATA } from "./daggerheartSystemData";
/* Create a data storage object for specific systems
    The data storage object is used to display any system specific 
    roll info. 

    These info obj get passed to a system display form. There will be multiple custom made forms
    that will display info bassed on whatever system the user in currently in.
*/

export class SystemDataFactory {
    /**
     * 
     * @param {systemid} systemid - current gamesystem ID
     * @returns 
     */
    static createSystemDataObject(systemid)
    {
        if(!systemid){
            systemid = game.system.id
        }

        switch(systemid)
        {
            case "pf2e" :
                return new PF2E_SYSTEM_DATA;
            case "dragonbane" :
                return new DRAGONBANE_SYSTEM_DATA;
            case "daggerheart" :
                return new DAGGERHEART_SYSTEM_DATA;
            case "dnd5e" :
                return new DND5E_SYSTEM_DATA;
            default :
                return null;
        }
    }
}