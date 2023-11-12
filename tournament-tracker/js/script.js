document.getElementById('connect').addEventListener('click', e => {
    const address = document.getElementById('address').value;
    const port = document.getElementById('port').value;
    const password = document.getElementById('password').value;
    console.log(address);
    const ws = `ws://${address.length > 0 ? address : 'localhost'}:${port}`;
    obs.connect(ws, password.length > 0 ? password : undefined);
});

document.getElementById('sceneSelect').addEventListener('change', e => {
    const browserSourceOptions = document.getElementById("browserSourceOptions");
    browserSourceOptions.innerHTML = '';
    getBrowserSourcesInScene(e.target.value).then(list => {
        list.forEach(source => {
            const option = document.createElement('option');
            option.textContent = source;
            browserSourceOptions.appendChild(option);
        })
    });
});

function relativeToAbsolutePath(relative) {
    return new URL(relative, window.location.href).href;
}

const modules = document.querySelectorAll('.monModule');
for(let m of modules){
    const monSelector = m.querySelector(".monSelect");
    monSelector.addEventListener('change', e => {
        const source = m.querySelector('.sourceSelect').value;
        const opt = document.getElementById(e.target.value);
        setBrowserSourceURL(source, relativeToAbsolutePath(`./frame.html?img=a_${opt ? opt.number : 0}`))
    });
    const faintedToggle = m.querySelector(".faintedToggle");
        faintedToggle.addEventListener('change', e => {
            console.log(e.target.checked);
    });
}

document.getElementById('player_1_select').addEventListener('change', e => {
    const modules = document.getElementById('player_1_dashboard').querySelectorAll('.monModule');
    const entry = PLAYER_LIST.find((p) => p.uuid === e.target.value);
    for(let m of modules){
        const monSelector = m.querySelector(".monSelect");
        monSelector.innerHTML = '';
        const opt = document.createElement('option')
        opt.innerText = "None";
        monSelector.appendChild(opt);
        for(var i = 1; i <= 4; i++){
            const mon = entry[`mon${i}`]
            if(mon){
                const opt = document.createElement('option');
                opt.innerText = mon;
                monSelector.appendChild(opt);
            }
        }
    }
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
