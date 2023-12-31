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
    const sceneSelector = document.getElementById('sceneSelect');
    if(sceneSelector.value){
        populateSourceOptionsFromScene(sceneSelector.value);
    }
});

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
    try{
        const results = await obs.call('GetSceneItemList', {
            sceneName: sceneName
        });
        const filtered = results.sceneItems.filter(
            (item) => item.inputKind.includes(sourceType)).map(
                (item) => item.sourceName);
        return filtered;
    }catch(e){
        console.warn(`Error fetching sources of type ${sourceType} from scene ${sceneName}: ${e}`);
        return [];
    }
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
    try{
        await obs.call('SetInputSettings', {
            inputName: sourceName,
            inputSettings: {
                file: filePath
            }
        });
    }catch(e){
        console.warn(`Error trying to set image source: ${e}`);
    }
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
    try{
        await obs.call('SetInputSettings', {
            inputName: sourceName,
            inputSettings: {
                url: url
            }
        });
    }
    catch(e){
        console.warn(`Error trying to set browser source: ${e}`);
    }
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
    try{
        await obs.call('SetInputSettings', {
            inputName: sourceName,
            inputSettings: {
                text: text
            }
        });
    }catch(e){
        console.warn(`Error trying to set text source: ${e}`);
    }
}