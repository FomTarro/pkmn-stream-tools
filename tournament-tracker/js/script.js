/**
 * Connects to OBS using the settings input on the DOM
 */
function connectToOBS() {
    const address = document.getElementById('address').value;
    const port = document.getElementById('port').value;
    const password = document.getElementById('password').value;
    const ws = `ws://${address.length > 0 ? address : 'localhost'}:${port}`;
    obs.connect(ws, password.length > 0 ? password : undefined);
}

/**
 * Populates the auto-complete suggestions on the DOM with the sources pulled from the given scene.
 * @param {string} sceneName - The name of the scene to pull sources from
 */
function populateSourceOptionsFromScene(sceneName){
    const browserSourceOptions = document.getElementById("browserSourceOptions");
    browserSourceOptions.innerHTML = '';
    getBrowserSourcesInScene(sceneName).then(list => {
        list.forEach(source => {
            const option = document.createElement('option');
            option.textContent = source;
            browserSourceOptions.appendChild(option);
        })
    });

    const textSourceOptions = document.getElementById("textSourceOptions");
    textSourceOptions.innerHTML = '';
    getTextSourcesInScene(sceneName).then(list => {
        list.forEach(source => {
            const option = document.createElement('option');
            option.textContent = source;
            textSourceOptions.appendChild(option);
        })
    });
}

// Hook up mon selection dropdowns
const monModules = document.querySelectorAll('.monModule');
for(let monModule of monModules){
    const monSelector = monModule.querySelector(".monSelect");
    monSelector.addEventListener('change', e => {
        const source = monModule.querySelector('.sourceSelect').value;
        const opt = document.getElementById(e.target.value);
        setBrowserSourceURL(source, relativeToAbsolutePath(`./frame.html?img=a_${opt ? opt.number : 0}`))
    });
    const faintedToggle = monModule.querySelector(".faintedToggle");
        faintedToggle.addEventListener('change', e => {
            console.log(e.target.checked);
    });
}

// Hook up player selection dropdowns
const playerModules = document.querySelectorAll('.playerModule');
for(let playerModule of playerModules){
    const playerSelector = playerModule.querySelector('.playerSelect');
    const sourceSelector = playerModule.querySelector('.sourceSelect');
    const toggleAccess = () => {
        if(sourceSelector.value == ''){
            playerSelector.disabled = true;
        }else{
            playerSelector.disabled = false;
        }
    }
    sourceSelector.addEventListener('change', toggleAccess);
    playerSelector.addEventListener('change', e => {
        populatePlayerModule(playerModule, e.target.value);
        setTextSourceText(sourceSelector.value, e.target.options[e.target.options.selectedIndex].innerText)
    });
    toggleAccess();
}

const resetButtons = document.querySelectorAll('.resetButton');
for(let resetButton of resetButtons){
    resetButton.addEventListener('click', e => {
        for(let monModule of monModules){
            const monSelector = monModule.querySelector(".monSelect");
            monSelector.value = "None"
            const event = new Event('change');
            monSelector.dispatchEvent(event);
        }
    })
}


document.getElementById('connect').addEventListener('click', connectToOBS);
document.getElementById('sceneSelect').addEventListener('change', e => {
    populateSourceOptionsFromScene(e.target.value);
});
connectToOBS();

/**
 * A player data structure
 * @typedef {Object} SourceMap
 * @property {string} scene - Name of the scene.
 * @property {PlayerSourceMap} p1 - Player 1 settings.
 * @property {PlayerSourceMap} p2 - Player 2 settings.
 */

/**
 * A player data structure
 * @typedef {Object} PlayerSourceMap
 * @property {number} score
 * @property {string} mon1
 * @property {string} mon2
 * @property {string} mon3
 * @property {string} mon4
 */

const SOURCE_SETTINGS_KEY = "tournament_overlay_settings";

function loadSourceSettings(){
}

function saveSourceSettings(){
    const settings = {};
    const scene = document.getElementById('sceneSelect').value;
    settings.scene = scene;
    localStorage.setItem(SOURCE_SETTINGS_KEY, JSON.stringify(settings));
}
