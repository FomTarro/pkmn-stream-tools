
const REGEX_WHITESPACE = /([ ])+/g;
const REGEX_ARRAY = /([\[\]])+/g

/**
 * A filtering configuration.
 * @typedef {Object} Config
 * @property {number[]} gens - Which gens to filter by? If emtpy, use all gens.
 * @property {string[]} games - Which specific games to filter by? If emtpy, use all games in provided gens.
 * @property {string[]} ribbons - Which specific ribbons to filter by? If emtpy, use all ribbons in provided games.
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
        games: [],
        ribbons: [],
    }
    if(params.gens && params.gens.startsWith('[') && params.gens.endsWith(']')){
        config.gens = params.gens.replace(REGEX_ARRAY, '').split(',');
    }
    if(params.games && params.games.startsWith('[') && params.games.endsWith(']')){
        config.games = params.games.replace(REGEX_ARRAY, '').split(',');
    }
    if(params.ribbons && params.ribbons.startsWith('[') && params.ribbons.endsWith(']')){
        config.ribbons = params.ribbons.replace(REGEX_ARRAY, '').split(',');
    }
    console.log(config);
    return config;
}

/**
 * @param {Ribbon} ribbon - The Ribbon to generate a key for
 * @returns {string} key - The unique ribbon ID
 */
function ribbonToKey(ribbon){
    const uniqueGens = ribbon.games.map(game => game.gen).filter((value, index, array) => array.indexOf(value) === index);
    return `${ribbon.name.toLowerCase().replace(REGEX_WHITESPACE, '_')}_${uniqueGens.join('_')}`;
}

/**
 * @param {Ribbon} ribbon - The Ribbon to generate an image path for
 * @returns {string} path - The image path for the ribbon
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
    const container = document.getElementById('ribbon-grid');
    container.innerHTML ='';

    // Find all ribbons in the provided gens list
    const ribbonsByGen = RIBBONS.filter(r => {
        return config.gens.length === 0 
        ? false 
        : config.gens.some(gen => (r.games.findIndex(
            game => game.gen == gen) > -1));
    })

    // Find all ribbons from the provided games list
    const ribbonsByGame = RIBBONS.filter(r => {
        return config.games.length === 0 
        ? false 
        : config.games.some(gameName => (r.games.findIndex(
            game => game.id.toLowerCase() === gameName.toLowerCase() 
            || (game.names.findIndex(
                n => n.toLowerCase() === gameName.toLowerCase()) > -1)) > -1))
    })

    const ribbonsByName = RIBBONS.filter(r => {
        return config.ribbons.length === 0 
        ? false 
        : config.ribbons.some(ribbonName => (ribbonName.toLowerCase() === r.name.toLowerCase()))
    })

    const ribbonsByAll = ribbonsByGen.concat(ribbonsByGame).concat(ribbonsByName);
    const uniqueRibbons = [...new Set(ribbonsByAll.length > 0 ? ribbonsByAll : RIBBONS)];
    const sortedRibbons = uniqueRibbons.sort((a, b) => a.games[0].gen - b.games[0].gen);
    if(sortedRibbons.length > 0){
        CURRENT_RIBBON = sortedRibbons[0];
        displayRibbon();
    }
    for(const ribbon of sortedRibbons){
        const div = document.createElement('div');
        div.id = ribbonToKey(ribbon);
        div.classList.add('ribbon-grid-cell');
        const status = getRibbonStatus(ribbon);
        if(status){
            console.log(ribbon.name + " " + JSON.stringify(status));
        }
        if(status && status.completed){
            div.classList.add('completed');
        }
        const name = ribbon.name;
        const img = document.createElement('img');
        img.src = ribbonToImagePath(ribbon);
        img.classList.add('ribbon-image-small');
        div.addEventListener('click', () => {
            CURRENT_RIBBON = ribbon;
            displayRibbon();
        });
        div.id = name;
        div.appendChild(img);
        container.appendChild(div);
    }
}

function displayRibbon(){
    console.log(CURRENT_RIBBON.name)
    const status = getRibbonStatus(CURRENT_RIBBON);
    document.getElementById('ribbon-info-box-image').src = ribbonToImagePath(CURRENT_RIBBON);
    document.getElementById('ribbon-info-box-name').innerHTML = CURRENT_RIBBON.name;
    document.getElementById('ribbon-info-box-desc').innerHTML = CURRENT_RIBBON.description;
    document.getElementById('is-completed').checked = status ? status.completed : false;
}

document.getElementById('is-completed').addEventListener('change', onCheck);

function onCheck(event){
    setRibbonStatus(CURRENT_RIBBON, event.target.checked);
    drawGrid(getQueryParameters());
}

drawGrid(getQueryParameters());