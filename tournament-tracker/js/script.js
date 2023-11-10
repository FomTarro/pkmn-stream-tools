const obs = new OBSWebSocket();

document.getElementById('connect').addEventListener('click', e => {
    const address = document.getElementById('address').value;
    const port = document.getElementById('port').value;
    const password = document.getElementById('password').value;
    console.log(address);
    const ws = `ws://${address.length > 0 ? address : 'localhost'}:${port}`;
    obs.connect(ws, password.length > 0 ? password : undefined);
});

document.getElementById('sceneSelect').addEventListener('change', e => {
    console.log(e.target.value);
})

// document.getElementById('player_1_name').addEventListener('change', e => {
//     document.getElementById("player_1_option").innerHTML = e.target.value;
// });

obs.on('Identified', () => {
    getAllScenes().then(scenes => {
        const sceneOptions = document.getElementById('sceneOptions');
        // clear current options
        sceneOptions.innerHTML = '';
        scenes.forEach(scene => {
            const sceneElement = document.createElement('option');
            sceneElement.textContent = scene;
            // sceneElement.onclick = function() {
            //     getBrowserSourcesInScene(scene).then(list => {
            //         console.log(list);
            //         setBrowserSourceURL(list[0], 
            //             relativeToAbsolutePath("./frame.html?img=ribbon"))
            //             .then(settings => console.log(settings));
            //     });

            //     getTextSourcesInScene(scene).then(list => {
            //         console.log(list);
            //         setTextSourceText(list[0], 
            //             window.location.href)
            //             .then(settings => console.log(settings));
            //     });
            // };
            sceneOptions.appendChild(sceneElement);
        });
    })
});

function relativeToAbsolutePath(relative) {
    return new URL(relative, window.location.href).href;
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
        .replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
}

document.getElementById('playerLeftSelect').addEventListener('change', e => {
    console.log(e);
})

document.getElementById("player_add").addEventListener('click', e => {
    createPlayer();
});

SPECIES.forEach(species => {
    const opt = document.createElement("option");
    opt.innerHTML = species.name;
    document.getElementById("pokemonOptions").appendChild(opt);
});

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
var PLAYER_SETTINGS = [];
const PLAYER_SETTINGS_KEY = "players";

function loadPlayerList() {
    var loaded = JSON.parse(localStorage.getItem(PLAYER_SETTINGS_KEY));
    loaded = loaded ? loaded : [];
    for (var player of loaded) {
        createPlayer(player);
    }
}

function savePlayerList() {
    localStorage.setItem(PLAYER_SETTINGS_KEY, JSON.stringify(PLAYER_SETTINGS));
}

/**
 * Creates a new player record
 * @param {Player} existingData Optional set of player data to load with
 */
function createPlayer(existingData) {
    const playerData = existingData ? existingData : {
        uuid: uuidv4(),
    };
    PLAYER_SETTINGS.push(playerData);

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
        element.id = element.id.replace('_x_', `_${playerData.uuid}_`);
    });

    // Add player to dropdown
    const opt = document.createElement('option');
    opt.id = `player_${playerData.uuid}_option`;
    opt.value = playerData.uuid;
    document.getElementById("playerLeftSelect").appendChild(opt);
    const nameInput = row.querySelector(`#player_${playerData.uuid}_name`);
    if(playerData.name){
        nameInput.value = playerData.name;
        opt.innerText = playerData.name;
    }
    nameInput.addEventListener('change', e => {
        opt.innerText = e.target.value;
        playerData.name = e.target.value;
        savePlayerList();
    });

    // Hook up setting mons
    for (let monIndex = 1; monIndex < 7; monIndex++) {
        const monInput = row.querySelector(`#player_${playerData.uuid}_mon_${monIndex}`);
        if(playerData && playerData[`mon${monIndex}`]){
            monInput.value = playerData[`mon${monIndex}`];
        }
        monInput.addEventListener('change', e => {
            const settings = PLAYER_SETTINGS.find(player => player.uuid === playerData.uuid)
            if (settings) {
                settings[`mon${monIndex}`] = e.target.value;
                savePlayerList();
            }
        })
    }

    // Hook up delete button
    const deleteButton = row.querySelector(`#player_${playerData.uuid}_delete`);
    deleteButton.addEventListener('click', e => {
        opt.remove();
        row.remove();
        const settings = PLAYER_SETTINGS.findIndex(player => player.uuid === playerData.uuid);
        if (settings >= 0 && settings < PLAYER_SETTINGS.length) {
            PLAYER_SETTINGS.splice(settings, 1);
            savePlayerList();
        }
    });

    savePlayerList();
}

const SOURCE_TYPE = {
    IMAGE: 'image_source',
    BROWSER: 'browser_source',
    TEXT: 'text_'
}

/**
 * Gets a list of all scene names in the collection.
 * @returns {Promise<string[]>} List of scene names.
 */
async function getAllScenes() {
    const results = await obs.call('GetSceneList');
    const mapped = results.scenes.map(scene => scene.sceneName);
    return mapped;
}

/**
 * Gets the names of all sources of a given type in the specified scene.
 * @param {string} sourceType The type of source to select.
 * @param {string} sceneName The name of the scene to query.
 * @returns {Promise<string[]>} List of source names.
 */
async function getSourcesOfTypeInScene(sourceType, sceneName) {
    const results = await obs.call('GetSceneItemList', {
        sceneName: sceneName
    });
    console.log(results);
    const filtered = results.sceneItems.filter(
        (item) => item.inputKind.includes(sourceType)).map(
            (item) => item.sourceName);
    return filtered;
}

/**
 * 
 * @param {string} sceneName The name of the scene to query.
 * @returns {Promise<string[]>} List of source names.
 */
async function getImageSourcesInScene(sceneName) {
    return await getSourcesOfTypeInScene(SOURCE_TYPE.IMAGE, sceneName);
}

/**
 * 
 * @param {string} sourceName The name of the image source to update.
 * @param {string} filePath Absolute filepath to set the source to.
 */
async function setImageSourceFilePath(sourceName, filePath) {
    results = await obs.call('SetInputSettings', {
        inputName: sourceName,
        inputSettings: {
            file: filePath
        }
    });
}

/**
 * 
 * @param {string} sceneName The name of the scene to query.
 * @returns {Promise<string[]>} List of source names.
 */
async function getBrowserSourcesInScene(sceneName) {
    return await getSourcesOfTypeInScene(SOURCE_TYPE.BROWSER, sceneName)
}

/**
 * 
 * @param {string} sourceName The name of the browser source to update.
 * @param {string} url Absolute URL to set the source to.
 */
async function setBrowserSourceURL(sourceName, url) {
    results = await obs.call('SetInputSettings', {
        inputName: sourceName,
        inputSettings: {
            url: url
        }
    });
    return results;
}

/**
 * 
 * @param {string} sceneName The name of the scene to query.
 * @returns {Promise<string[]>} List of source names.
 */
async function getTextSourcesInScene(sceneName) {
    return await getSourcesOfTypeInScene(SOURCE_TYPE.TEXT, sceneName);
}

/**
 * 
 * @param {string} sourceName The name of the text source to update.
 * @param {string} text The text to set.
 */
async function setTextSourceText(sourceName, text) {
    results = await obs.call('SetInputSettings', {
        inputName: sourceName,
        inputSettings: {
            text: text
        }
    });
}

loadPlayerList();