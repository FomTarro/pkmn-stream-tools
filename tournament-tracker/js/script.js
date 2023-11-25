/**
 * Connects to OBS using the settings input on the DOM
 */
function connectToOBS() {
    const address = document.getElementById('address').value;
    const port = document.getElementById('port').value;
    const password = document.getElementById('password').value;
    const ws = `ws://${address.length > 0 ? address : 'localhost'}:${port}`;
    obs.connect(ws, password.length > 0 ? password : undefined).then(o => {
        console.log('Connection to OBS successful!');
    }).catch(e => {
        console.error('Unable to connect to OBS...');
    });
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
                url.searchParams.set('used', itemToggle.checked);
            }
            setBrowserSourceURL(source, url.toString())
            const icon = monModule.querySelector('.monIcon');
            if(icon){
                icon.src = url;
                const description = `An icon of ${monSelector.value && monSelector.value.length > 0 && monSelector.value !== SPECIES_NONE_VALUE ? 'the Pokemon '+ monSelector.value : 'a PokeBall'} holding ${itemSelector.value && itemSelector.value.length > 0 ?  'the ' + itemSelector.value : 'no'} item.`;
                icon.title = description;
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
        const incrementScore = (num) => {
            score.innerText = `${Math.round(Math.max(0, Number(score.innerText) + num))}`;
            setTextSourceText(sourceSelector.value, score.innerText);
        }
        const plus = scoreModule.querySelector('.plus');
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
            const playerName = e.target.value === PLAYER_NONE_VALUE ? "" : e.target.options[e.target.options.selectedIndex].innerText;
            setTextSourceText(sourceSelector.value, playerName);
        }
        // changed via dropdown
        playerSelector.addEventListener('change', e => {
            for(monSelect of nameModule.querySelectorAll('.monSelect')){
                monSelect.value = SPECIES_NONE_VALUE;
            }
            updatePlayer(e);
        });
        // refreshed current player via save data changing
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
                monSelector.value = SPECIES_NONE_VALUE;
                const faintedToggle = monModule.querySelector('.faintedToggle');
                faintedToggle.checked = false;
                const itemUsedToggle = monModule.querySelector('.itemToggle');
                itemUsedToggle.checked = false;
                const event = new Event('change');
                monSelector.dispatchEvent(event);
            }
        })
    }

    const resetAllButton = document.querySelector('.resetAllButton');
    resetAllButton.addEventListener('click', e => {
        if(window.confirm("Do you really want to reset the round?\nThis will reset both players to 'None' and set both scores to 0.")){
            const playerSelectors = document.querySelectorAll('.playerSelect');
            // Set both players to 'None'
            for(let playerSelector of playerSelectors){
                playerSelector.value = PLAYER_NONE_VALUE;
                const event = new Event('change');
                playerSelector.dispatchEvent(event);
            }
            // Effectively 'click' both reset buttons
            for(let resetButton of resetButtons){
                const event = new Event('click');
                resetButton.dispatchEvent(event);
            }
        }
    });

    // Hook up Player Filter
    const playerFilter = document.getElementById('playerFilter');
    const filterPlayerTable = () => {
        let i = 0;
        const rows = document.getElementsByClassName('playerRow');
        for(let row of rows){
            const name = row.querySelector('.playerName');
            if(playerFilter.value && !name.value.toLowerCase().includes(playerFilter.value.toLowerCase())){
                row.hidden = true;
            }else{
                i++;
                row.hidden = false;
            }
        }
        document.getElementById('playerFilterTotal').innerText = i;
    }
    playerFilter.addEventListener('input', e => {
        filterPlayerTable()
    });
    playerFilter.addEventListener('change', e => {
        if(playerFilter.value){
            playerFilter.value = playerFilter.value.trim();
        }
        filterPlayerTable();
    });

    const playerImport = document.getElementById('playerImport');
    const playerImportStatus = document.getElementById('playerImportStatus');
    playerImport.addEventListener('input', e => {
        importPlayersFromTOM(e.target.files[0], 
            {
                abbreviateJuniors: document.getElementById('abbreviateJuniorsToggle').checked,
                abbreviateSeniors: document.getElementById('abbreviateSeniorsToggle').checked,
                abbreviateMasters: document.getElementById('abbreviateMastersToggle').checked,
            },
            (message) => {
                playerImportStatus.classList.add('connected');
                playerImportStatus.classList.remove('disconnected');
                playerImportStatus.innerText = message;
            },
            (error) => {
                playerImportStatus.classList.remove('connected');
                playerImportStatus.classList.add('disconnected');
                playerImportStatus.innerText = error;
            }
        );
    })

    // Save settings every time we change a source setting
    const sourceSelectors = document.getElementsByClassName('sourceSelect');
    for(let sourceSelector of sourceSelectors){
        sourceSelector.addEventListener('change', e => {
            saveSourceSettings();
        });
    }

    const generalSettings = document.getElementsByClassName('generalSetting');
    for(let setting of generalSettings){
        setting.addEventListener('change', e => {
            saveGeneralSettings();
        });
    }

    // document.getElementById("fileWatcher").addEventListener('click', async e => {
    //     const [fileHandle] = await window.showOpenFilePicker();
    //     const file = await fileHandle.getFile();
    //     console.log(file);
    // })

    document.getElementById('connect').addEventListener('click', connectToOBS);
    document.getElementById('sceneSelect').addEventListener('change', e => {
        populateSourceOptionsFromScene(e.target.value);
    });
}

const SOURCE_SETTINGS_KEY = "tournament_overlay_settings";

function loadSourceSettings(){
    var settings = JSON.parse(localStorage.getItem(SOURCE_SETTINGS_KEY));
    settings = settings ? settings : {
        scene: '',
        sources: []
    };
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

const GENERAL_SETTINGS_KEY = "tournament_overlay_general_settings";

function loadGeneralSettings(){
    var settings = JSON.parse(localStorage.getItem(GENERAL_SETTINGS_KEY));
    settings = settings ? settings : {
        abbreviateJuniors: false,
        abbreviateSeniors: false,
        abbreviateSeniors: false,
    };
    document.getElementById('abbreviateJuniorsToggle').checked = settings.abbreviateJuniors;
    document.getElementById('abbreviateSeniorsToggle').checked = settings.abbreviateSeniors;
    document.getElementById('abbreviateMastersToggle').checked = settings.abbreviateMasters;
}

function saveGeneralSettings(){
    const settings = {
        abbreviateJuniors: document.getElementById('abbreviateJuniorsToggle').checked,
        abbreviateSeniors: document.getElementById('abbreviateSeniorsToggle').checked,
        abbreviateMasters: document.getElementById('abbreviateMastersToggle').checked
    };
    localStorage.setItem(GENERAL_SETTINGS_KEY, JSON.stringify(settings));
}

window.onload = async() =>{
    attachEventListeners();
    checkConnectionStatus();
    connectToOBS();
    loadGeneralSettings();
    loadSourceSettings();
    loadPlayerList();
}

document.getElementById('temp').addEventListener('click', async e => {
    [fileHandle] = await window.showOpenFilePicker();
    const interval = watchFile(fileHandle, (content) => {console.log(content)});
})