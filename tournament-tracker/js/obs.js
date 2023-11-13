const obs = new OBSWebSocket();

function checkConnectionStatus(){
    const statusIndicator = document.getElementById("obs_status");
    obs.call("GetVersion").then(() => {
        statusIndicator.innerText = "🟢 Connected!"
        statusIndicator.classList.remove("disconnected");
        statusIndicator.classList.add("connected");
    }).catch(() => {
        statusIndicator.innerText = "🔴 Disconnected!"
        statusIndicator.classList.add("disconnected");
        statusIndicator.classList.remove("connected");
    });
}
const intervalID = window.setInterval(checkConnectionStatus, 1000);

function populateScenesOptionsFromOBS(){
    getAllScenes().then(scenes => {
        const sceneOptions = document.getElementById('sceneOptions');
        // clear current options
        sceneOptions.innerHTML = '';
        scenes.forEach(scene => {
            const option = document.createElement('option');
            option.textContent = scene;
            sceneOptions.appendChild(option);
        });
    })
}

obs.on('Identified', () => {
    populateScenesOptionsFromOBS();
});

checkConnectionStatus();

// Utility functions

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