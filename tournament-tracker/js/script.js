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
    saveSourceSettings();
}

// Hook up mon selection dropdowns
const monModules = document.querySelectorAll('.monModule');
for(let monModule of monModules){
    const monSelector = monModule.querySelector(".monSelect");
    const faintedToggle = monModule.querySelector(".faintedToggle");
    monSelector.addEventListener('change', e => {
        const source = monModule.querySelector('.sourceSelect').value;
        const opt = document.getElementById(monSelector.value);
        setBrowserSourceURL(source, relativeToAbsolutePath(`./frame.html?img=a_${opt ? opt.number : 0}&fainted=${faintedToggle.checked}`))
    });
    faintedToggle.addEventListener('change', e => {
        const source = monModule.querySelector('.sourceSelect').value;
        const opt = document.getElementById(monSelector.value);
        setBrowserSourceURL(source, relativeToAbsolutePath(`./frame.html?img=a_${opt ? opt.number : 0}&fainted=${faintedToggle.checked}`))
    });
}

// Hook up scores
const scoreModules = document.querySelectorAll('.scoreModule');
for(let scoreModule of scoreModules){
    const score = scoreModule.querySelector('.scoreDisplay');
    const sourceSelector = scoreModule.querySelector('.sourceSelect');
    const plus = scoreModule.querySelector('.plus');
    plus.addEventListener('click', e => {
        score.innerText = `${Math.max(0, Number(score.innerText) + 1)}`;
        console.log(score.innerText)
        setTextSourceText(sourceSelector.value, score.innerText);
    });
    const minus = scoreModule.querySelector('.minus');
    minus.addEventListener('click', e => {
        score.innerText = `${Math.max(0, Number(score.innerText) - 1)}`;
        setTextSourceText(sourceSelector.value, score.innerText);
    })
}

// Hook up player selection dropdowns
const nameModules = document.querySelectorAll('.nameModule');
for(let nameModule of nameModules){
    const playerSelector = nameModule.querySelector('.playerSelect');
    const sourceSelector = nameModule.querySelector('.sourceSelect');
    // changed via dropdown
    playerSelector.addEventListener('change', e => {
        for(monSelect of nameModule.querySelectorAll('.monSelect')){
            monSelect.value = "None";
        }
        populatePlayerModule(nameModule.closest('.playerModule'), e.target.value);
        const playerName = e.target.value === "None" ? "" : e.target.options[e.target.options.selectedIndex].innerText;
        setTextSourceText(sourceSelector.value, playerName);
    });
    // refreshed via save data
    playerSelector.addEventListener('refresh', e => {
        populatePlayerModule(nameModule.closest('.playerModule'), e.target.value);
        const playerName = e.target.value === "None" ? "" : e.target.options[e.target.options.selectedIndex].innerText;
        setTextSourceText(sourceSelector.value, playerName);
    });;
}

// Hook up reset buttons
const resetButtons = document.querySelectorAll('.resetButton');
for(let resetButton of resetButtons){
    resetButton.addEventListener('click', e => {
        console.log('resetting...')
        const parent = resetButton.closest('.playerModule');
        const childModules = parent.querySelectorAll('.monModule');
        for(let monModule of childModules){
            const monSelector = monModule.querySelector(".monSelect");
            monSelector.value = "None"
            const faintedToggle = monModule.querySelector('.faintedToggle');
            faintedToggle.checked = false;
            const event = new Event('change');
            monSelector.dispatchEvent(event);
        }
    })
}

// save settings every time we change a source setting
const sourceSelectors = document.getElementsByClassName('sourceSelect');
for(let sourceSelector of sourceSelectors){
    sourceSelector.addEventListener('change', e => {
        saveSourceSettings();
    })
}

document.getElementById('connect').addEventListener('click', connectToOBS);
document.getElementById('sceneSelect').addEventListener('change', e => {
    populateSourceOptionsFromScene(e.target.value);
});

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
 * @property {string} uuid
 * @property {number} score
 * @property {string} mon1
 * @property {string} mon2
 * @property {string} mon3
 * @property {string} mon4
 */

const SOURCE_SETTINGS_KEY = "tournament_overlay_settings";

function loadSourceSettings(){
    var settings = JSON.parse(localStorage.getItem(SOURCE_SETTINGS_KEY));
    settings = settings ? settings : {};
    const scene = document.getElementById('sceneSelect');
    scene.value = settings.scene;
    const playerModules = document.getElementsByClassName('playerModule');
    for(let i = 0; i < playerModules.length; i++){
        const playerModule = playerModules[i];
        const sources = settings.sources[i] ?  settings.sources[i] : [];
        const sourceSelectors = [...playerModule.querySelectorAll('.sourceSelect')];
        for(let j = 0; j < sourceSelectors.length; j++){
            sourceSelectors[j].value = sources[j] ? sources[j] : '';
            const event = new Event('change');
            sourceSelectors[j].dispatchEvent(event);
        }
    }
    const event = new Event('change');
    scene.dispatchEvent(event);
}

function saveSourceSettings(){
    const settings = {
        scene: undefined,
        sources: []
    };
    const scene = document.getElementById('sceneSelect').value;
    settings.scene = scene;
    const playerModules = document.getElementsByClassName('playerModule');
    for(let playerModule of playerModules){
        const sourceSelectors = [...playerModule.querySelectorAll('.sourceSelect')];
        const sources = sourceSelectors.map(node => node.value);
        settings.sources.push(sources);
    }
    localStorage.setItem(SOURCE_SETTINGS_KEY, JSON.stringify(settings));
}

window.onload = () =>{
    checkConnectionStatus();
    connectToOBS();
    loadSourceSettings();
    loadPlayerList();
}