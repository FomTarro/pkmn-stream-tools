
/**
 * A filtering configuration.
 * @typedef {Object} Config
 * @property {number[]} gens - Which gens to filter by? If emtpy, use all gens.
 * @property {string[]} games - Which specific games to filter by? If emtpy, use all games in provided gens.
 * @property {string[]} ribbons - Which specific ribbons to filter by? If emtpy, use all ribbons in provided games
 */

/**
 * Generates a filtering config based on provided optional query parameters
 * @returns {Config} config - The generated configuration based on query parameters
 */
function getQueryParameters(){
    const urlSearchParams = new URLSearchParams(location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    console.log(params);
    const config = {
        gens: [],
        ribbons: [],
    }
    if(params.gens && params.gens.startsWith('[') && params.gens.endsWith(']')){
        const commaDelimited = params.gens.replace('[', '').replace(']','').split(',');
        config.gens = commaDelimited;
    }
    if(params.ribbons && params.ribbons.startsWith('[') && params.ribbons.endsWith(']')){
        const commaDelimited = params.ribbons.replace('[', '').replace(']','').split(',');
        config.ribbons = commaDelimited;
    }
    console.log(config);
    return config;
}

/**
 * @param {Ribbon} ribbon - The Ribbon to generate a key for
 * @returns {string} key - The unique ribbon ID
 */
function ribbonToKey(ribbon){
    const regex = /([ ])+/g;
    const uniqueGens = ribbon.games.map(game => game.gen).filter((value, index, array) => array.indexOf(value) === index);
    const key = `${ribbon.name.toLowerCase().replace(regex, '_')}_${uniqueGens.join('_')}`;
    return key;
}

/**
 * @param {Ribbon} ribbon - The Ribbon to generate an image path for
 * @returns {string} key - The imahe path for the ribbon
 */
function ribbonToImagePath(ribbon){
    const imgSrc = `./img/ribbons/${ribbon.img}.png`;
    return imgSrc;
}

/**
 * The completion status of a ribbon.
 * @typedef {Object} RibbonStatus
 * @property {string} key - The unique ribbon ID
 * @property {boolean} completed - Has this ribbon been collected?
 */

/**
 * @param {Ribbon} ribbon - The ribbon to query
 * @returns {RibbonStatus} - The status of the ribbon
 */
function getRibbonStatus(ribbon){
    return JSON.parse(localStorage.getItem(ribbonToKey(ribbon)));
}

/**
 * @param {Ribbon} ribbon - The ribbon
 * @param {boolean} completed - Has this ribbon been collected?
 */
function setRibbonStatus(ribbon, completed){
    const key = ribbonToKey(ribbon);
    const status = {
        key,
        completed
    }
    localStorage.setItem(key, JSON.stringify(status));
}

var CURRENT_RIBBON;

/**
 * Draws the grid of Ribbon buttons
 * @param {Config} config 
 */
function drawGrid(config){
    const container = document.getElementById('container');
    container.innerHTML ='';
    const sortedRibbons = RIBBONS.filter(r => {
        return config.gens.length === 0 
        ? RIBBONS 
        : config.gens.some(gen => (r.games.findIndex(game => game.gen == gen) > -1));
    })
    for(const ribbon of sortedRibbons){
        const div = document.createElement('div');
        div.classList.add('ribbon-grid-cell');
        const name = ribbon.name;
        const img = document.createElement('img');
        img.src = ribbonToImagePath(ribbon);
        img.classList.add('ribbon-image');
        div.addEventListener('click', () => {
            CURRENT_RIBBON = ribbon;
            console.log(CURRENT_RIBBON.name)
            const status = JSON.parse(localStorage.getItem(ribbonToKey(CURRENT_RIBBON)));
            document.getElementById('info-box-ribbon-image').src = ribbonToImagePath(CURRENT_RIBBON);
            document.getElementById('info-box-name-key').innerHTML = CURRENT_RIBBON.name;
            document.getElementById('info-box-desc').innerHTML = CURRENT_RIBBON.description;
            document.getElementById('isCompleted').checked = status ? status.completed : false;
        });
        div.id = name;
        div.appendChild(img);
        container.appendChild(div);
    }
}

document.getElementById('isCompleted').addEventListener('change', onCheck);

function onCheck(event){
    setRibbonStatus(CURRENT_RIBBON, event.target.checked);
}

drawGrid(getQueryParameters());