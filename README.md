# Dice Stats
A foundry vtt module to view dice stats (Number of each roll in a Chart! See Below)  
Currently stats are stored by parsing chat. If the user joins the game late after rolls were made  
they will only get data from that point on unless **Auto DB** Setting is enabled. Original Idea was from [Catan Online](https://colonist.io/) end-of-game dice stats screen and wanted something similar to let players look at during or the end of a session.   

Used Google Charts as a charting library. (MIT License)
Used [Roll Tracker Module](https://foundryvtt.com/packages/roll-tracker)(MIT License) as a starting point but  
Wanted the ability to track multiple dice types. This Basically lead to a full rewrite as I wanted a more OOP appreach for data storage.

## MISC Design Settings
- GM's Rolls for player will count as GM Rolls (Unless Midi Qol is active)
- Blind rolls get tracked but do not get added to results screen unless GM Presses "PUSH BLIND ROLLS" button on Global Stats Display
- GM Data Does not get added to global stats by default so Players cant use it to cheat and see any of the GM's rolls
- Database is automatically used by default (auto DB adding and loading). its unclear of the performance impact so for games with lower speced player you might want this disabled

## DESIGN PHILOSOPHY
The original design philosophy was a way to view SESSION stats. Rolls will always avg out over long periods of time so personaly I only wanted to look at per session data. Because of this the implementation resets stats when leaving in joining. There is now a DB setting if you would like stats to stay between sessions

## DEPENDENCIES
[socketlib](https://github.com/manuelVo/foundryvtt-socketlib) | 
[socketlib Foundry Page](https://foundryvtt.com/packages/socketlib)
Socketlib needs to be active to allow GM to tell other users to push blind rolls.

## CONTRIBUTIONS
- Jacobwojo: Lead Developer
- Juan Ferrer: Fix for canvas buttons
- RadicalEd: German translation + Remove some hardcoded items
- Willumz: Added CSV, export by player options
- joonhohw: Allow GM access when canSeePlayerData is false
- ThiefMaster: Fix Depricated warning from V12 Updates

## SVG IMAGES - CREATIVE COMMONS V3.0
- d4,d6,d8,d10,d12,d20 Icons By Lonnie Tapscott :: Noun Project

## INCOMPATABILITIES (Add an Issue for any System Requests)
- Any system that doesnt print rolls to chat
- **Midi-Qol** if **Merge Rolls to 1 Card** is enabled but have a partial fix. 
    - Midi-qol.rollComplete hook Doesnt have a way to trace back to the Player that rolled. Only the actor
    - I Used actor.owner property to find out who to associate the roll with but that makes the following issues
        - If an actor has >1 owner it might not track the roll to the right player. 
        - If the GM rolls for a player is will count as the players roll Not the GM's where normally this isnt the case

# Features 

## Form Info and Features (Individual)  
- Checkboxes to limit which dice types are displayed 
- Refresh Button To update stats if a new roll is made while screen if open
- Number of each roll 
- Total Number of rolls
- Mean  
- Median (true-Middle for Odd or left-middle for Even number of rolls)
- Mode  
- Streaks (Incrementing die rolls in a row) 4,5,6,7 ect  
- Save and Clear Player Data to DB
  
## Form Info and Features (Global)
- Checkboxes to limit which dice types are displayed 
- Refresh Button To update stats if a new roll is made while screen if open 
- Total Number of each roll
- Global Mean
- Global Median (true-Middle for Odd or left-middle for Even number of rolls)
- Global Mode
- Global Longest Streaks (Player Name and Streak Value)
- Most Min and Most Max values Rolled (Player Name and Number)
- Clear All Players Data (GM Only)

## Dice Types Supported  
Tracks multiple dice types. Currently supporting types are:  
- D2, D3, D4, D6, D8, D10, D12, D20, D100
  
## Module Settings (Not All are Implemented Yet)
[Def: XX] = Default value for setting  
(Global) & (Local) = setting scope  
Global Settings are restricted to GM only by default
- PLAYERS_SEE_PLAYERS --------- If players cant see self they cant see others either -[Def: True]     (Global)
- PLAYERS_SEE_GM -------------- If Players can see GM dice roll stats ----------------[Def: False]    (Global)
- PLAYERS_SEE_GLOBAL --------  If Players Can  Global Dice Stats --------------------[Def: True]     (Global)
- PLAYERS_SEE_GM_IN_GLOBAL - If GM roll stats get added into global stats ---------[Def: False]    (Global)
- SHOW_BLIND_ROLLS_IMMEDIATE -- let Blind Rolls be added to player stats immediately ---[Def: false] (Global)
- ENABLE_AUTO_DB - Save And Load Info From DB Automatically On Join and On roll respectively -[Def: true]   (Global)
- OTHER_ACCESS_BUTTON_ICONS - Setting to add custom icons on Scene Controls buttons - [Def: fas fa-dice-d20] (Local)

## Install  
If prerelease version is desired the user can add to module folder by hand by placing it in   
```bash
$/PATH_TO_FOUNDRY_DATA(Prolly AppData foulder on windows)/Sources/Modules
```  
## Usage 
### PLAYER ICONS
- Must be on a scene to see the die button. Pressing the die button allows the user to open global stats or specific player stats
    - ![Icon Img](https://i.imgur.com/y0IwT0b.png) ![Icon Img 2](https://i.imgur.com/cXyQ1AV.png)
    - Icons for Global and Compare buttons are hard coded and cant be changed
    - The default value is the d20 icon but users can change the players Icons from the D-20 to anything on the font awesome icon website under the free section
    - [Where to find Icons](https://fontawesome.com/search?o=a&m=free)
    - Users can change the icons but updating the **Define Player Icons** field in the game settings
    - Update the field to a comma seperated list of the ion text from the font awesome website. The order of the text list corresponds to the order of players in the player list from top down. 
    - EX: Updating the field to `fa-solid fa-book-open-reader, fa-solid fa-dumbbell, fa-solid fa-explosion` as sceen in the following image changes the icons to what I have in my photos (Photo doesnt show full string of icons)
    - ![My Settings Values](https://i.imgur.com/CocZunr.png)

### PF2E Specific Settings
- D20 rolls on pf2e get seperated into their different types to specially viewable. The anyone can select **ALL STATS** or **D20 STATS** to switch between the different set of graphs
- Different D20 Catagory types include
    - Attack
    - Damage
    - Save
    - Skill
    - Unknow (All rolls that dont have a label, This includes Flat-Checks)
    - ![Tabs](https://i.imgur.com/mG96PAd.png)

### OTHER FEATURES
- Hideing GM Values from players so they cant cheat to see the GM rolls
- PLAYERS_SEE_GM = False  (Warning is displayed if trying to view GM values with setting sating you cant)
![PLAYERS_SEE_GM = False](https://i.imgur.com/sGELoCJ.png)  
  
- Database Interaction
    - **Automatically use DB** setting will allow users roll data save between session, load immediately on joining, autosave every roll but it could negatively impact performance
    - If **Automatically use DB** is **Disabled** players can still save and load the info between sessions but they need to do it manually. If they forget, leaving and rejoining the session will clear their data
    - ![PLAYER DB](https://i.imgur.com/yrwyJJH.png)

## FORM PHOTOS
### Player Comparison Screen
![Comparison Screen](https://i.imgur.com/VJzKOy8.png)

### Player D20  
![PL D20](https://i.imgur.com/Sszy3bk.png)   

### Player D20 BLIND
![PL D20 B](https://i.imgur.com/EOYY6y6.png) 

### GLOBAL D20 BLIND
![GLB D20 B](https://i.imgur.com/mLXWWjm.png) 

### CHECKBOXES
![CHK](https://i.imgur.com/pVFw0QE.png)

### Global Clear Local Data Button
![GLB CLR](https://i.imgur.com/GtGz0h4.png)


### Design Format to update/start following
### I've royalled fucked up the casing for class vars and gotta fix them (way way way too many UPPER_CASE vars)
- Globals           = GL_Pascale_Snake_Case?
- Constants         = UPPER_CASE
- Static Vars       = STAT_(follow other)

- Class Names       = PascaleCase
- Public Funtions   = cammelCase
- Private Funtions  = _cammelCase

- Public Vars       = cammelCase
- Priv Vars         = _cammelCase
- local             = snake_case

- fn input refs     = ptr_snake_case
- fn input vars     = PasecaleCase

- arrays            = plurals!
- bools             = is/has: Var Name

# DICE STATS API
#### View scripts/utils/open-displays-macro.js for example
#### View scripts/asyncinteraction/dice-stats-api.js for Funtion calls

## Current Funtions & Funtionality
- saveRollValue({STRING:Player_id}, {ENUM:DIE_TYPE: #}, {INT: #}) -> Save a roll result to a player
- saveRollInfo({STRING:Player_id},{DS_MSG_ROLL_INFO}) -> Save a DS_MSG_ROLL_INFO roll object to database (Will only save data to global db if you are the player_ID thats being added)

- getPlayerList({VOID})        -> String[]=    Array of [{id:(STRING), name:(STRING)},...] that are stored in the dice stats database
- getGlobals({VOID})           -> DS_GLOBALS=  Global Dice Stats Object & Enums (NOTE: Globals will be refactoed to only be enums at some point down the line)

- openGlobalStats({VOID})      -> Open Global Stats UI
- openCompareStats({VOID})     -> Open Compare Stats UI
- openPlayerStats({INT} player_id) -> Open the players stats for the player ID selected
- openExportStats({BOOL} isGM) -> Open Export page if they're the GM

  
