const obs = new OBSWebSocket();

document.getElementById('connect').addEventListener('click', e => {
    const address = document.getElementById('address').value;
    const port = document.getElementById('port').value;
    const password = document.getElementById('password').value;
    console.log(address);
    const ws = `ws://${address.length > 0 ? address: 'localhost'}:${port}`;
    obs.connect(ws, password.length > 0 ? password : undefined);
});

document.getElementById('sceneSelect').addEventListener('change', e => {
    console.log(e.target.value);
})


// document.getElementById('player_1_name').addEventListener('change', e => {
//     document.getElementById("player_1_option").innerHTML = e.target.value;
// });

SPECIES.forEach(species => {
    const opt = document.createElement("option");
    opt.innerHTML = species.name;
    document.getElementById("pokemonOptions").appendChild(opt);
})


obs.on('Identified', () => {
    getAllScenes().then(scenes => {
        const sceneOptions = document.getElementById('scenes');
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

function relativeToAbsolutePath(relative){
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
    createPlayerRow(uuidv4());
});

/**
 * A player data structure
 * @typedef {Object} Player
 * @property {string} uuid - UUID for the player row
 * @property {string} names - Name of the player.
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
const PLAYER_SETTINGS = [];

function createPlayerRow(index){
    const template = document.getElementById("player_template_row");
    const header = document.getElementById("players_table_header");

    const row = template.content.cloneNode(true).querySelector("tr");
    header.after(row);

    const data = {
        uuid: index,
    };
    PLAYER_SETTINGS.push(data);

    // Update ID tokens
    const inputs = row.querySelectorAll("input");
    const buttons = row.querySelectorAll("button");
    const elements = [...inputs, ...buttons]
    elements.forEach(element => {
        element.id = element.id.replace('_x_', `_${index}_`);
    });

    // Add player to dropdown
    const opt = document.createElement('option');
    opt.id = `player_${index}_option`;
    document.getElementById("playerLeftSelect").appendChild(opt);
    const playerName = row.querySelector(`#player_${index}_name`);
    opt.value = index;
    playerName.addEventListener('change', e => {
        opt.innerText = e.target.value;
        data.name = e.target.value;
    });
    // Hook up delete button
    const deleteButton = row.querySelector(`#player_${index}_delete`);
    deleteButton.addEventListener('click', e => {
        opt.remove();
        row.remove();
        const settings = PLAYER_SETTINGS.findIndex(player => player.uuid === index);
        if(settings >= 0 && settings < PLAYER_SETTINGS.length){
            PLAYER_SETTINGS.splice(settings, 1);
        }
    });
    // Hook up setting mons
    for (let mon = 1; mon < 7; mon++) {
        console.log(`#player_${index}_mon_${mon}`);
        const input = row.querySelector(`#player_${index}_mon_${mon}`);
        input.addEventListener('change', e => {
            const settings = PLAYER_SETTINGS.find(player => player.uuid === index)
            if(settings){
                settings[`mon${mon}`] = e.target.value;
            }
        })
    }
}

const SOURCE_TYPE = {
    IMAGE: 'image_source',
    BROWSER: 'browser_source',
    TEXT: 'text_'
}

/**
 * 
 * @returns {Promise<string[]>} List of scene names.
 */
async function getAllScenes(){
    const results = await obs.call('GetSceneList');
    const mapped = results.scenes.map(scene => scene.sceneName);
    return mapped;
}

/**
 * 
 * @param {string} sourceType The type of source to select.
 * @param {string} sceneName The name of the scene to query.
 * @returns {Promise<string[]>} List of source names.
 */
async function getSourcesOfTypeInScene(sourceType, sceneName){
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
async function getImageSourcesInScene(sceneName){
    return await getSourcesOfTypeInScene(SOURCE_TYPE.IMAGE, sceneName);
}

/**
 * 
 * @param {string} sourceName The name of the image source to update.
 * @param {string} filePath Absolute filepath.
 */
async function setImageSourceFilePath(sourceName, filePath){
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
async function getBrowserSourcesInScene(sceneName){
    return await getSourcesOfTypeInScene(SOURCE_TYPE.BROWSER, sceneName)
}

/**
 * 
 * @param {string} sourceName The name of the image source to update.
 * @param {string} url Absolute filepath.
 */
async function setBrowserSourceURL(sourceName, url){
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
async function getTextSourcesInScene(sceneName){
    return await getSourcesOfTypeInScene(SOURCE_TYPE.TEXT, sceneName);
}

/**
 * 
 * @param {string} sourceName The name of the image source to update.
 * @param {string} text The text to set
 */
async function setTextSourceText(sourceName, text){
    results = await obs.call('SetInputSettings', {
        inputName: sourceName,
        inputSettings: {
            text: text
        }
    });
}