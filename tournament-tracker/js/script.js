/**
 * Connects to OBS using the settings input on the DOM.
 */
function connectToOBS() {
    OBS.checkConnectionStatus();
    const address = document.getElementById('address').value;
    const port = document.getElementById('port').value;
    const password = document.getElementById('password').value;
    const ws = `ws://${address.length > 0 ? address : 'localhost'}:${port}`;
    OBS.connect(ws, password).then(o => {
        console.log('Connection to OBS successful!');
    }).catch(e => {
        console.error('Unable to connect to OBS...');
    });
}

/**
 * Creates DOM elements from template tags.
 */
function createFromTemplates(){
    const standingsTemplate = document.getElementById("standings_template_item");
    for(let i = 0; i < 8; i++){
        const item = standingsTemplate.content.cloneNode(true).querySelector("li");
        const standingsList = document.getElementById("standingsList");
        const elements = item.querySelectorAll('*');
        for(let element of elements) {
            if (element.id) {
                element.id = element.id.replace('_x', `_${i}`);
            }
        }
        item.querySelector('select').setAttribute('standing', i+1);
        item.querySelector('select').setAttribute('ordinalToggle', 'standingsOrdinalToggle');
        standingsList.appendChild(item);
    }

    const monModuleTemplate = document.getElementById("mon_template_item");
    for(let j = 1; j <= 2; j++){
        for(let i = 4; i > 0; i--){
            const item = monModuleTemplate.content.cloneNode(true).querySelector(".monModule");
            const node = document.getElementById(`player_${j}_name`);
            const elements = item.querySelectorAll('*');
            const uuid = `p${j}_mon${i}`;
            for(let element of elements) {
                if(element.innerText && element.innerText === 'Mon #x'){
                    element.innerText = `Mon #${i}`
                }
                if (element.id) {
                    element.id = element.id.replace('_x', `_${uuid}`);
                }
                if(element.getAttribute('for')){
                    element.setAttribute('for', element.getAttribute('for').replace('_x', `_${uuid}`))
                }
            }
            node.after(item);
        }
    }
}

/**
 * Attaches event listeners to just about every releavnt DOM element.
 */
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
            url.searchParams.set('img', `poke_icon_${opt ? opt.getAttribute('number') : 0}`)
            url.searchParams.set('fainted', faintedToggle.checked);
            if(itemOpt){
                if(itemOpt.type === 'Berry'){
                    url.searchParams.set('item', `berry_icon_${itemOpt.key}`);
                }else{
                    url.searchParams.set('item', `item_icon_${itemOpt.key}`);
                }
                url.searchParams.set('used', itemToggle.checked);
            }
            OBS.setBrowserSourceURL(source, url.toString())
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
            OBS.setTextSourceText(sourceSelector.value, score.innerText);
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
        const updatePlayer = () => {
            let prefix = '';
            let suffix = '';
            // If there's an associated Battle Module, update it
            const playerModule = nameModule.closest('.playerModule');
            if(playerModule){
                populatePlayerModule(playerModule, playerSelector.value);
            }
            // If there's an associated Ordinal Toggle, check it
            const ordinalToggle = playerSelector.getAttribute('ordinalToggle');
            if(ordinalToggle && document.getElementById(ordinalToggle).checked){
                prefix = applyOrdinalSuffix(playerSelector.getAttribute('standing')) + ' ';
            }
            // TODO: this might break if the browser is translated (fragile string matching)
            const playerName = playerSelector.value === PLAYER_NONE_VALUE ? "???" : playerSelector.options[playerSelector.options.selectedIndex]?.innerText;
            // console.log(`Updating OBS for ${playerName}`);
            OBS.setTextSourceText(sourceSelector.value, `${prefix}${playerName}${suffix}`);
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

    const resetRoundButton = document.querySelector('.resetRoundButton');
    resetRoundButton.addEventListener('click', e => {
        const description = [...resetRoundButton.querySelectorAll('li')].map(item => `• ${item.innerText}`).join('\n');
        if(window.confirm(`Do you really want to reset the round?\nThis action will do the following:\n${description}`)){
            const playerSelectors = document.getElementById('battle').querySelectorAll('.playerSelect');
            // Set both players to 'None'
            for(let playerSelector of playerSelectors){
                playerSelector.value = PLAYER_NONE_VALUE;
                const event = new Event('change');
                playerSelector.dispatchEvent(event);
            }
            const scoreModules = document.getElementById('battle').querySelectorAll('.scoreModule');
            for(let scoreModule of scoreModules){
                scoreModule.querySelector('.scoreDisplay').innerText = 0;
                const event = new Event('click');
                const button = scoreModule.querySelector('.minus');
                button.dispatchEvent(event);

            }
            // Effectively 'click' both reset buttons
            for(let resetButton of resetButtons){
                const event = new Event('click');
                resetButton.dispatchEvent(event);
            }
        }
    });

    const resetGameButton = document.querySelector('.resetGameButton');
    resetGameButton.addEventListener('click', e => {
        const description = [...resetGameButton.querySelectorAll('li')].map(item => `• ${item.innerText}`).join('\n');
        if(window.confirm(`Do you really want to reset the game?\nThis action will do the following:\n${description}`)){
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

    // Hook up Player Import
    const playerImport = document.getElementById('playerImport');
    const playerImportStatus = document.getElementById('playerImportStatus');
    playerImport.addEventListener('input', async e => {
        try{
            const newPlayers = await importPlayersFromTOM(e.target.files[0], 
                {
                    abbreviateJuniors: document.getElementById('abbreviateJuniorsToggle').checked,
                    abbreviateSeniors: document.getElementById('abbreviateSeniorsToggle').checked,
                    abbreviateMasters: document.getElementById('abbreviateMastersToggle').checked,
                }
            );
            playerImportStatus.classList.add('connected');
            playerImportStatus.classList.remove('disconnected');
            playerImportStatus.innerText = `Successfully imported ${newPlayers.length} new players!`;
        }catch(e){
            playerImportStatus.classList.remove('connected');
            playerImportStatus.classList.add('disconnected');
            playerImportStatus.innerText = 'Selected file is either malformed or not the ...roster.html file!';
        }
    });

    // Hook up Standings Import
    document.getElementById('standingsImport').addEventListener('click', async e => {
        try{
            [fileHandle] = await window.showOpenFilePicker({
                id: 'tomStandings',
                types: [
                    {
                        accept: {
                            'text/plain': ".html"
                        }
                    }
                ],
                excludeAcceptAllOption: true,
            });
            window.clearInterval(standingsInterval);
            const file = await fileHandle.getFile();
            document.getElementById('standingsImportFile').innerText = abridgeWord(file.name);
            const standingsImportStatus = document.getElementById('standingsImportStatus');
            try{
                await importStandingsFromTOM(file);
                standingsImportStatus.classList.add('connected');
                standingsImportStatus.classList.remove('disconnected');
                standingsImportStatus.innerText = 'Successfully tracking live standings!';
                document.getElementById('standingsTrackingStop').disabled = false

            }catch(e){
                standingsImportStatus.classList.remove('connected');
                standingsImportStatus.classList.add('disconnected');
                standingsImportStatus.innerText = 'Selected file is either malformed or not the ...standings.html file!';
            }
            standingsInterval = watchFile(fileHandle, async (content) => {
                await importStandingsFromTOM(content)
            });
        }catch(e){
            console.warn(e);
        }
    });

    document.getElementById('standingsTrackingStop').addEventListener('click', e => {
        if(standingsInterval){
            window.clearInterval(standingsInterval);
            standingsInterval = undefined;
            const standingsImportStatus = document.getElementById('standingsImportStatus');
            standingsImportStatus.classList.remove('connected');
            standingsImportStatus.classList.add('disconnected');
            standingsImportStatus.innerText = 'Stopped tracking standings.';
            document.getElementById('standingsImportFile').innerText = '';
            document.getElementById('standingsTrackingStop').disabled = true;
        }
    });

    const updateStandingsSingle = () => {
        const sourceSelector = document.getElementById('standingsSingleSource');
        const singleLine = document.getElementById('standingsSingle');
        const splitter = document.getElementById('standingsSingleSplitter')?.value ?? "";
        const includeOrdinal = document.getElementById('standingsSingleOrdinalToggle').checked;
        const playerSelectors = [...document.getElementById('standingsList').querySelectorAll('.playerSelect')];
        const placements = [];
        for(let i = 0; i < playerSelectors.length; i++){
            const placeSuffix = includeOrdinal ? applyOrdinalSuffix(i+1) + ' ' : '';
            const playerName = playerSelectors[i].value === PLAYER_NONE_VALUE ? "???" : playerSelectors[i].options[playerSelectors[i].options.selectedIndex]?.innerText;
            if(playerName !== "???"){
                placements.push(`${placeSuffix}${playerName} ${splitter} `);
            }
        }
        singleLine.value = placements.join('');
        OBS.setTextSourceText(sourceSelector.value, singleLine.value);
    }

    const standingsPlayerSelectors = document.getElementById('standingsList').querySelectorAll('.playerSelect');
    for(let playerSelector of standingsPlayerSelectors){
        playerSelector.addEventListener('change', e => { 
            updateStandingsSingle(); 
        });
        playerSelector.addEventListener('refresh', e => { 
            updateStandingsSingle(); 
        });
    }
    document.getElementById('standingsSingleSplitter').addEventListener('change', e => {
        updateStandingsSingle();
    });

    document.getElementById('standingsSingleOrdinalToggle').addEventListener('change', e => {
        updateStandingsSingle();
    });

    document.getElementById('standingsOrdinalToggle').addEventListener('change', e => {
        for(let playerSelector of standingsPlayerSelectors){
            const event = new Event('change');
            playerSelector.dispatchEvent(event);
        }
    });

    // Hook up Minimize Buttons
    const minimize = document.getElementsByClassName('minimizeButton');
    for(let button of minimize){
        button.addEventListener('click', e => {
            const target = button.getAttribute('target');
            const element = document.getElementById(target);
            element.hidden = !element.hidden;
            button.setAttribute('status', element.hidden ? 'off' : 'on');
        });
    }

    // Save settings every time we change a source setting
    const sourceSettings = document.getElementsByClassName('sourceSetting');
    for(let setting of sourceSettings){
        setting.addEventListener('change', e => {
            saveSourceSettings();
        });
    }

    // Save every time we change a general setting
    const generalSettings = document.getElementsByClassName('generalSetting');
    for(let setting of generalSettings){
        setting.addEventListener('change', e => {
            saveGeneralSettings();
        });
    }

    document.getElementById('connect').addEventListener('click', connectToOBS);
    const sceneSelectors = document.getElementsByClassName('sceneSelect');
    for(let sceneSelector of sceneSelectors){
        sceneSelector.addEventListener('change', e => {
            OBS.populateSourceOptionsFromScene(sceneSelector.value, sceneSelector.getAttribute('target'));
        });
    };
}

const SOURCE_SETTINGS_KEY = "tournament_overlay_settings";

function loadSourceSettings(){
    var settings = JSON.parse(localStorage.getItem(SOURCE_SETTINGS_KEY));
    settings = settings ? settings : {
        battleScene: '',
        battleSources: [],
        standingsScene: '',
        standingsSources: [],
        standingsSingleSource: '',
    };
    const battleScene = document.getElementById('battleSceneSelect');
    battleScene.value = settings.battleScene ? settings.battleScene : '';
    if(settings.battleSources){
        const playerModules = document.getElementsByClassName('playerModule');
        for(let i = 0; i < playerModules.length; i++){
            const playerModule = playerModules[i];
            const sources = settings.battleSources[i] ?  settings.battleSources[i] : [];
            const sourceSelectors = [...playerModule.querySelectorAll('.sourceSelect')];
            for(let j = 0; j < sourceSelectors.length; j++){
                sourceSelectors[j].value = sources[j] ? sources[j] : '';
                const event = new Event('change');
                sourceSelectors[j].dispatchEvent(event);
            }
        }
    }

    const standingScene = document.getElementById('standingsSceneSelect');
    standingScene.value = settings.standingsScene ? settings.standingsScene : '';
    if(settings.standingsSources){
        const standingsSourceSelectors = document.getElementById('standingsList').querySelectorAll('.sourceSelect');
        for(let i = 0; i < standingsSourceSelectors.length; i++){
            const source = settings.standingsSources[i] ? settings.standingsSources[i] : '';
            standingsSourceSelectors[i].value = source;
            const event = new Event('change');
            standingsSourceSelectors[i].dispatchEvent(event);
        }
    }
    if(settings.standingsSingleSource){
        document.getElementById('standingsSingleSource').value = settings.standingsSingleSource;
    }

    const sceneSelectors = document.getElementsByClassName('sceneSelect');
    for(let sceneSelector of sceneSelectors){
        const event = new Event('change');
        sceneSelector.dispatchEvent(event);
    }
}

function saveSourceSettings(){
    const settings = {
        battleScene: undefined,
        battleSources: [],
        standingsScene: undefined,
        standingsSources: [],
        standingsSingleSource: undefined,
    };
    const scene = document.getElementById('battleSceneSelect').value;
    settings.battleScene = scene;
    const playerModules = document.getElementsByClassName('playerModule');
    for(let playerModule of playerModules){
        const sourceSelectors = [...playerModule.querySelectorAll('.sourceSelect')];
        const sources = sourceSelectors.map(node => node.value);
        settings.battleSources.push(sources);
    }

    const standingsScene = document.getElementById('standingsSceneSelect').value;
    settings.standingsScene = standingsScene;
    const standingsSources = document.getElementById('standingsList').querySelectorAll('.sourceSelect');
    for(let source of standingsSources){
        settings.standingsSources.push(source.value)
    }
    settings.standingsSingleSource = document.getElementById('standingsSingleSource').value;

    localStorage.setItem(SOURCE_SETTINGS_KEY, JSON.stringify(settings));
}

const GENERAL_SETTINGS_KEY = "tournament_overlay_general_settings";

function loadGeneralSettings(){
    var settings = JSON.parse(localStorage.getItem(GENERAL_SETTINGS_KEY));
    settings = settings ? settings : {
        abbreviateJuniors: false,
        abbreviateSeniors: false,
        abbreviateSeniors: false,
        standingsIncludeOrdinal: true,
        standingsSingleIncludeOrdinal: true,
        standingsSingleSplitter: '/',
    };
    document.getElementById('abbreviateJuniorsToggle').checked = settings.abbreviateJuniors;
    document.getElementById('abbreviateSeniorsToggle').checked = settings.abbreviateSeniors;
    document.getElementById('abbreviateMastersToggle').checked = settings.abbreviateMasters;

    document.getElementById('standingsOrdinalToggle').checked = settings.standingsIncludeOrdinal;
    document.getElementById('standingsSingleOrdinalToggle').checked = settings.standingsSingleIncludeOrdinal;
    document.getElementById('standingsSingleSplitter').value = settings.standingsSingleSplitter ?? '/';
}

function saveGeneralSettings(){
    const settings = {
        abbreviateJuniors: document.getElementById('abbreviateJuniorsToggle').checked,
        abbreviateSeniors: document.getElementById('abbreviateSeniorsToggle').checked,
        abbreviateMasters: document.getElementById('abbreviateMastersToggle').checked,
        standingsIncludeOrdinal: document.getElementById('standingsOrdinalToggle').checked,
        standingsSingleIncludeOrdinal: document.getElementById('standingsSingleOrdinalToggle').checked,
        standingsSingleSplitter: document.getElementById('standingsSingleSplitter').value,
    };
    localStorage.setItem(GENERAL_SETTINGS_KEY, JSON.stringify(settings));
}

let standingsInterval = undefined;
let connectionInterval = window.setInterval(OBS.checkConnectionStatus, 1000);
window.onload = async() => {
    createFromTemplates();
    attachEventListeners();
    loadGeneralSettings();
    loadSourceSettings();
    loadPlayerList();
    connectToOBS();
}
const urlParams = new URLSearchParams(window.location.search);
if(urlParams.get('unown')){
    document.getElementsByTagName('body')[0].classList.add('unown');
}