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

function attachEventListeners(){
    // Hook up mon selection dropdowns
    const monModules = document.querySelectorAll('.monModule');
    for(let monModule of monModules){
        const monSelector = monModule.querySelector(".monSelect");
        const itemSelector = monModule.querySelector(".itemSelect");
        const faintedToggle = monModule.querySelector(".faintedToggle");
        const itemToggle = monModule.querySelector(".itemToggle");
        const setItem = () => {
            const item = monSelector.options[monSelector.selectedIndex].item;
            itemSelector.value = item ? item : '';
        }
        const updateIcon = () => {
            const source = monModule.querySelector('.sourceSelect').value;
            const opt = document.getElementById(monSelector.value);
            const itemOpt = document.getElementById(itemSelector.value);
            const url = new URL(relativeToAbsolutePath('./frame.html?'));
            url.searchParams.set('img', `poke_icon_${opt ? opt.number : 0}`)
            url.searchParams.set('fainted', faintedToggle.checked);
            if(itemOpt){
                if(itemOpt.type === 'Berry'){
                    url.searchParams.set('item', `berry_icon_${itemOpt.key}`);
                }else{
                    url.searchParams.set('item', `item_icon_${itemOpt.key}`);
                }
            }
            url.searchParams.set('used', itemToggle.checked);
            // const url = relativeToAbsolutePath(`./frame.html?img=poke_icon_${opt ? opt.number : 0}&fainted=${faintedToggle.checked}&item=item_icon_${itemOpt ? itemOpt.key: 'air_balloon'}&used=${itemToggle.checked}`);
            setBrowserSourceURL(source, url.toString())
            const icon = monModule.querySelector('.monIcon');
            if(icon){
                icon.src = url;
            } 
        }
        monSelector.addEventListener('change', setItem);
        monSelector.addEventListener('change', updateIcon);
        faintedToggle.addEventListener('change', updateIcon);
        itemSelector.addEventListener('change', updateIcon);
        itemToggle.addEventListener('change', updateIcon);
    }

    // Hook up scores
    const scoreModules = document.querySelectorAll('.scoreModule');
    for(let scoreModule of scoreModules){
        const score = scoreModule.querySelector('.scoreDisplay');
        const sourceSelector = scoreModule.querySelector('.sourceSelect');
        const plus = scoreModule.querySelector('.plus');
        const incrementScore = (num) => {
            score.innerText = `${Math.max(0, Number(score.innerText) + num)}`;
            setTextSourceText(sourceSelector.value, score.innerText);
        }
        plus.addEventListener('click', e => {
            incrementScore(1);
        });
        const minus = scoreModule.querySelector('.minus');
        minus.addEventListener('click', e => {
            incrementScore(-1);
        })
    }

    // Hook up player selection dropdowns
    const nameModules = document.querySelectorAll('.nameModule');
    for(let nameModule of nameModules){
        const playerSelector = nameModule.querySelector('.playerSelect');
        const sourceSelector = nameModule.querySelector('.sourceSelect');
        const updatePlayer = (e) => {
            populatePlayerModule(nameModule.closest('.playerModule'), e.target.value);
            const playerName = e.target.value === "None" ? "" : e.target.options[e.target.options.selectedIndex].innerText;
            setTextSourceText(sourceSelector.value, playerName);
        }
        // changed via dropdown
        playerSelector.addEventListener('change', e => {
            for(monSelect of nameModule.querySelectorAll('.monSelect')){
                monSelect.value = "None";
            }
            updatePlayer(e);
        });
        // refreshed current player via save data
        playerSelector.addEventListener('refresh', e => {
            updatePlayer(e)
        });
    }

    // Hook up reset buttons
    const resetButtons = document.querySelectorAll('.resetButton');
    for(let resetButton of resetButtons){
        resetButton.addEventListener('click', e => {
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

    const resetAllButton = document.querySelector('.resetAllButton');
    const playerSelectors = document.querySelectorAll('.playerSelect');
    resetAllButton.addEventListener('click', e => {
    
        for(let playerSelector of playerSelectors){
            playerSelector.value = 'None';
            const event = new Event('change');
            playerSelector.dispatchEvent(event);
        }
        for(let resetButton of resetButtons){
            const event = new Event('click');
            resetButton.dispatchEvent(event);
        }
    })

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
}

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
    attachEventListeners();
    checkConnectionStatus();
    connectToOBS();
    loadSourceSettings();
    loadPlayerList();
}