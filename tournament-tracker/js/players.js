/**
 * A player data structure
 * @typedef {Object} Player
 * @property {string} uuid - UUID for the player row
 * @property {string} name - Name of the player.
 * @property {string} mon1
 * @property {string} mon2
 * @property {string} mon3
 * @property {string} mon4
 * @property {string} mon5
 * @property {string} mon6
 */

/** 
* @constant - List of all players.
* @type {Player[]}
*/
var PLAYER_LIST = [];
const PLAYER_LIST_KEY = "tournament_overlay_players";

document.getElementById("player_add").addEventListener('click', e => {
    addPlayer();
});

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
        .replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
}

function loadPlayerList() {
    var loaded = JSON.parse(localStorage.getItem(PLAYER_LIST_KEY));
    loaded = loaded ? loaded : [];
    for (var player of loaded) {
        addPlayer(player);
    }
}

function savePlayerList() {
    localStorage.setItem(PLAYER_LIST_KEY, JSON.stringify(PLAYER_LIST));
}

/**
 * Creates a new player record
 * @param {Player} existingData Optional set of player data to load with
 */
function addPlayer(existingData) {
    const playerData = existingData ? existingData : {
        uuid: uuidv4(),
    };
    PLAYER_LIST.push(playerData);

    // Append a row to the table
    const template = document.getElementById("player_template_row");
    const header = document.getElementById("players_table_header");
    const row = template.content.cloneNode(true).querySelector("tr");
    header.after(row);

    // Update ID tokens in new row
    const inputs = row.querySelectorAll("input");
    const buttons = row.querySelectorAll("button");
    const elements = [...inputs, ...buttons]
    elements.forEach(element => {
        if(element.id){
            element.id = element.id.replace('_x_', `_${playerData.uuid}_`);
        }
    });

    // Add player to dashboard dropdowns
    const playerSelectors = document.getElementsByClassName("playerSelect");
    const opts = [];
    for(var selector of playerSelectors){
        const opt = document.createElement('option');
        opt.id = `player_${playerData.uuid}_option`;
        opt.value = playerData.uuid;
        opt.innerText = playerData.name;
        selector.insertBefore(opt, selector.firstChild);
        opts.push(opt);
    }

    // Hook up setting player name
    const nameInput = row.querySelector(`#player_${playerData.uuid}_name`);
    if(playerData.name){
        nameInput.value = playerData.name;
    }
    nameInput.addEventListener('change', e => {
        playerData.name = e.target.value;
        for(var opt of opts){
            opt.innerText = playerData.name;
            // TODO: find some way to invoke the OBS update if this option is active while
        }
        savePlayerList();
    });

    // Hook up setting team mons
    for (let monIndex = 1; monIndex <= 6; monIndex++) {
        const monInput = row.querySelector(`#player_${playerData.uuid}_mon_${monIndex}`);
        if(playerData && playerData[`mon${monIndex}`]){
            monInput.value = playerData[`mon${monIndex}`];
        }
        monInput.addEventListener('change', e => {
            const entry = PLAYER_LIST.find(player => player.uuid === playerData.uuid)
            if(entry) {
                entry[`mon${monIndex}`] = e.target.value;
                savePlayerList();
            }
        })
    }

    // Hook up delete button
    const deleteButton = row.querySelector(`#player_${playerData.uuid}_delete`);
    deleteButton.addEventListener('click', e => {
        for(var opt of opts){
            opt.remove();
        }
        row.remove();
        const entry = PLAYER_LIST.findIndex(player => player.uuid === playerData.uuid);
        if (entry >= 0 && entry < PLAYER_LIST.length) {
            PLAYER_LIST.splice(entry, 1);
            savePlayerList();
        }
    });

    savePlayerList();
}

loadPlayerList();