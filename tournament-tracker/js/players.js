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
    const selectors = document.querySelectorAll('.playerSelect');
    for(let selector of selectors){
        for(let player of PLAYER_LIST){
            if(player.uuid === selector.value){
                const event = new Event('change');
                selector.dispatchEvent(event);
            }
        }
    }
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
        // opt.id = `player_${playerData.uuid}_option`;
        opt.value = playerData.uuid;
        opt.innerText = playerData.name;
        const optGroup = selector.querySelector('.optionContent');
        optGroup.insertBefore(opt, optGroup.firstChild);
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
            // If the player is currently selected when their name is changed,
            // update their name in-place and in OBS
            // if(opt.selected){
            //     const sourceSelector = opt.closest('.playerModule').querySelector('.sourceSelect');
            //     setTextSourceText(sourceSelector.value, playerData.name);
            // }
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

/**
 * Populates a given player module with details from the player table (name, team, etc).
 * @param {HTMLElement} element - The player module element.
 * @param {string} uuid - The UUID of the player to pull details for.
 * @returns 
 */
function populatePlayerModule(element, uuid){
    const entry = PLAYER_LIST.find((p) => p.uuid === uuid);
    if(!entry){
        console.warn(`No player with UUID ${uuid} found...`);
    }
    const modules = element.querySelectorAll('.monModule');
    for(let item of modules){
        const monSelector = item.querySelector(".monSelect");
        const opts = monSelector.querySelectorAll(".monOption")
        for(var i = 1; i <= 6; i++){
            const mon = entry ? entry[`mon${i}`] : undefined;
            if(mon){
                opts[i].innerText = mon;
                opts[i].hidden = false;
            }else{
                opts[i].hidden = true;
            }
        }
        const event = new Event('change');
        monSelector.dispatchEvent(event);
    }
}

loadPlayerList();