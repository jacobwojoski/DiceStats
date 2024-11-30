# CHANGELOG  

## [ 1.21.0 ]
- Added API for other modules || macros to interact with dice stats data

## [ 1.20.0 ]
- Added starting support for Call Of Cathulu 7E

## [ 1.19.2 ]
- Stop V 11 Support 
- Fix depricated warnings : ThiefMaster
- Fix some spelling mistakes
- Validate working for v12

## [ 1.19.1 ]
- Update db load logging statements to be debug only

## [ 1.19.0 ]
- Version 12 release 
- refactor to use esmodules
- Add setting to temp disable recording of stats

## [ 1.18.4 ]
- joonhohw - Allow GM access when canSeePlayerData is false

## [ 1.18.3 ]
- Fix hit and miss tracker clearing
- Add some details to hit and miss tracker "Unsupported" popup

## [ 1.18.2 ]
- Add json data export feature

## [ 1.18.1 ]
- Fix issue with midiqol not working with new message objects

## [ 1.18.0 ]
- redesigned how roll info is pulled from messages
- redesigned backend for how data is stored to now follow ROLL_INFO.DICE_INFO
- started to add ability to track ROLL STATS. 
- pf2e has ROLL stats tab for DEG_SUCC for attacks and saves. info properly saves and loads from DB

## [ 1.17.5 ]
- Redesign data storage structure for msg parsing
- Create factory object for parsers
- Update pf1 parser to handle atack rolls & crit confirms

## [ 1.17.4 ]
- Make clear popup off by default
- Add text to clear popup to describe mod its from

## [ 1.17.3 ]
- Add ability to disable tabs from appearing in the player sheet though settings
- Force Global Stats or Compare Stats to close when opening each other. They broke eahothers charts if both open at the same time
- Updated DB validation part 2

## [ 1.17.2 ]
- Update DB load fn to validate data that its getting. If data doesnt exist in DB, dont load it in.
- Add setting to allow a Clear all poup when the GM joins the game. 
- add chaining operator for 5e parse. Fix for unknown dice not being tracked. 

## [ 1.17.1 ]
- Update dnd msg parsing to use flag value. Now it should parse rolls correctly in all langs. 

## [ 1.17.0 ]
- Add Dragonbane parser. 
- Could be improved on in the future to parse dice object instead of flavor object. Depends on System Updates though. 

## [ 1.16.1 ]
- Fix weird bug on pf2e due to not allowing Ability rolls. 
- Removing the ability rolls secrion from handlebars, Loading, Adding it back and reloading worked for some reason.
- Can no longer recreate issue

## [ 1.16.0 ]
### Updates
- Added bind to HTML Calls, allows future refactoring to remove globals and help with scope issues (Callbacks and scope are a real bitch sometimes)
- Added various comments to improve code readability
- Made all systems used the tabbed_player_screen
- Made D&D5E support d20 roll types!
- Made sub template to deal when dice info isnt present for current system (Warning Display)

## [ 1.15.1 ]
### Updates
- added 0 min so graphs don't adjust min

## [ 1.15.0 ]
### Updates
- fix issue with version number being mismatched
- Updated from 14->15 as lang change is more or minor version than bug fix

## [ 1.14.4 ]
### Updates - By *marcel-wiechmann*
- Add German language file 
- Move some hardcoded values to lang files

## [ 1.14.3 ]
### Updates
- move constants to own file
- Updates to readme
  - Added images for new d20 rolls display
  - Added images for comparison screen
  - Remove old versions
  - Updated DB call so now only player rolling should update DB values rather than everyone on every roll
  - Put comment in on where to fix DB error but dont feel fix is needed. Issue is with setFlag->Update call

## [ 1.14.2 ]
### Fixed
- Reformat of globals 

## [ 1.14.1 ]
### Added
- Fixed bug where blind roll setting didn't work correctly
- Fixed bug where mod was trying to load a form that was only used for testing so didn't exist
- Updated a few comments
- Fixed bug when trying to load DB values for different roll types on dice that didnt have different rolls

## [ 1.14.0 ]
### Added
- PF2E added ability to view different roll types! 

## [ 1.13.1 ]
### Fixed
- Added button to its own layer to avoid collision with other mods.

## [ 1.13.0 ]
### Added
- Comparison Screen Added! Now you can see your rolls next to your friends! 

## [ 1.12.0 ]
### Fixed
- Works with Foundry V11 and V10

## [ 1.11.1 ]
### Fixed
- Fixed Collision with global module id value & Token Mirror

## [ 1.11.0 ] 
### Updated
- Added better funtion comments to explain what every fn does and their inputs and outputs
- Updated format of scripts to better organize classes into seperate files

## [ 1.10.0 ] 5/8/2023
### Added
- Updated the stats to display the decimal value of the average rather then the integer value
- Fix clear All Data from DB buttons not working correctly
### Updated
- Changed Default of Auto DB to be **ON**
- Changed new Buttons to be **ON** by default

## [ 1.9.1 ]  4/28/2023
### Fixed
- Bugfix for gm visibility setting

## [ 1.9.0 ]  5/2/2023
### Added
- Added optional setting to change where to access player roll data

## [ 1.8.0 ]  4/28/2023
### Added
- Added auto db feature
- Added clear call button to clear local and bd at once
- Change Buttons on player Page when Auto DB is enabled
- Added auto db feature. (Disabled by default)

## [ 1.7.0 ]  3/24/2023
### Added
- Added DB interaction to allow user to
  - Save Players Data
  - Load Players Data
  - Load All Data
  - Load Other Players Data
  - Clear Players Data
  - Clear Other Players Data

## [ 1.6.0 ]  3/18/2023
### Added
- Button to allow clearing of all roll data

## [ 1.5.4 ]  3/15/2023
### Fixed
- Fix Download link for Dependency
- Fix Download link for My module

## [ 1.5.3 ]  3/13/2023
### Fixed
- Same As below but for real this time

## [ 1.5.2 ]  3/13/2023
### Fixed
- Update to allow dependency install if user doesnt have it

## [ 1.5.1 ]  2/28/2023
### Fixed
- Updates Templates to use en.json page rather then hard coded values
- Fixed issue with incompatability with token health
- SWADE Compatability confirmed

## [ 1.5.0 ]  2/26/2023
### Added
- Added feature to record if multiple dice types are rolled at once (1d10+1d20)

## [ 1.4.1 ]  2/26/2023
### Fixed
- Fixed spelling of Median (Spelt it wrong on the table but variables in code were spelt corrently... Classic)
- Fixed Median not always displaying correctly Will always display middle of odd number of rolls or left-middle for even
- Updated README to explain median
- Updated streak table to better explain what streaks are
- Added : to some table enteries that were missing it
- Fixed changelog values being wrong

## [ 1.4.0 ]  2/25/2023
### Fixed
- Fixed D100 Charts not displaying properly
- Updated Readme with more up to date images
- Re organized and added new sections to Readme

## [ 1.3.0 ]  2/20/2023
### Added
- Added feature where blind rolls do not get displayed. Instead string of test appears on top of player stats indicating that they have X Number of blind rolls and should ask the GM to push the data.
- GM has a **Push Blind Rolls** button on the global stats
- Pushing blind rolls makes all players have those rolls visible to the global and player data 

## [ 1.2.0 ]  2/20/2023
### Added
- Added Checkboxes on forms page to allow users to disable displaying of certain stats if desired.
- Checkboxes are client side

## [ 1.1.5 ]  2/19/2023  
### Fixed 
- Fix multiple dice in midi-qol

## [ 1.1.4 ]  2/19/2023  
### Fixed 
- Fix Copy Paste error in MidiQol Fix

## [ 1.1.3 ]  2/19/2023  
### Fixed 
- Partial fix for midi-qol, merge to 1 card. look at readme incompatabilities section

## [ 1.1.2 ]  2/17/2023  
### Fixed 
- Fix version number not working

## [ 1.1.1 ]  2/17/2023  
### Fixed 
- Removed only allowing for pf2e. Should work for All msystems that post rolls to chat

## [ 1.1.0 ]  2/16/2023
### Added  
- Refresh Button added to forms

### Changed  

### Fixed  
- Fixed Global Max and Min Values not displaying when they should
- Having both player stats and global stats up at the same time makes chart not visible on one of the screens


## [ 1.0 ] 2/15/2023  
### Added  
- Player Dice Stats Stats 
- Global Dice Stats Stats 
- Stats for D2, D3, D4, D6, D8, D10, D12, D20, D100
- Hide GM Rolls from global setting
- Hide GM Rolls From Player setting

### Changed  

### Fixed
