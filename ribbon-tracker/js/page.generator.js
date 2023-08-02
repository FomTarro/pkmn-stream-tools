
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
    if(params.playing){
        for(var property in GAMES){
            const game = GAMES[property];
            if(game.names.findIndex(name => name.toLowerCase() === params.playing.toLowerCase()) > -1){
                document.getElementById('logo').classList.remove('hidden')
                document.getElementById('logo').src = `./img/logos/${game.id}.png`
            }
        }
    }else{
        document.getElementById('logo').classList.add('hidden');
    }
    console.log(config);
    return config;
}

/**
 * @param {Config} config - The filtering config
 * @returns {Ribbon[]} ribbons - The filtered and sorted ribbon list
 */
function getFilteredRibbonList(config){

    const filteredRibbons = RIBBONS.filter(ribbon => {
        return config.gens.some(gen => includedInGame(ribbon, gen)) 
        || config.games.some(gameName => includedInGame(ribbon, gameName))
        || config.ribbons.some(ribbonName => isMatchedByName(ribbon, ribbonName))
    }).filter(ribbon => {
        return (config.ribbons.length === 0 
        || !config.ribbons.some(ribbonName => (ribbonName.startsWith('-') && isMatchedByName(ribbon, ribbonName.substring(1)))))
    })

    // If the filtered set is empty
    if (filteredRibbons.length === 0){
        console.log("List empty after all filters, using whole list...");
        filteredRibbons.concat(RIBBONS);
    }

    const uniqueRibbons = [...new Set(filteredRibbons.length > 0 ? filteredRibbons : RIBBONS)];
    const sortedRibbons = uniqueRibbons.sort((a, b) => a.games[0].gen - b.games[0].gen);

    if(sortedRibbons.length > 0 && (CURRENT_RIBBON === undefined || !sortedRibbons.includes(CURRENT_RIBBON))){
        CURRENT_RIBBON = sortedRibbons[0];
        displayRibbon();
    }

    return sortedRibbons;
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

/** 
 * @constant - The currently selected Ribbon.
 * @type {Ribbon}
*/
var CURRENT_RIBBON;

/**
 * Draws the grid of Ribbon buttons
 * @param {Ribbon[]} ribbons 
 */
function drawGrid(ribbons){
    const container = document.getElementById('ribbon-grid');
    container.innerHTML ='';

    var completed = 0;
    for(const ribbon of ribbons){
        const div = document.createElement('div');
        div.id = ribbonToKey(ribbon);
        div.classList.add('ribbon-grid-cell');
        const status = getRibbonStatus(ribbon);
        if(status){
            console.log(`${ribbon.name} -> ${JSON.stringify(status)}`);
        }
        if(status && status.completed){
            completed++;
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

        const bar = document.getElementById('progress-bar-fill');
        document.getElementById('progress-bar-text').innerText = `${completed}/${ribbons.length}`;
        bar.style.width = `${(completed/ribbons.length)*100}%`;
        displayRibbon();
    }
}

function displayRibbon(){
    console.log(`Displaying ${CURRENT_RIBBON.name}...`);
    const status = getRibbonStatus(CURRENT_RIBBON);
    document.getElementById('ribbon-info-box-image').src = ribbonToImagePath(CURRENT_RIBBON);
    document.getElementById('ribbon-info-box-name').innerHTML = CURRENT_RIBBON.name;
    document.getElementById('ribbon-info-box-desc').innerHTML = CURRENT_RIBBON.description.replaceAll('é', '&eacute;');
    
    if(status && status.completed){
        document.getElementById('is-completed').checked = status.completed;
        // document.getElementById('ribbon-info-box-image-container').classList.add('completed');
    }else{
        document.getElementById('is-completed').checked = false;
        // document.getElementById('ribbon-info-box-image-container').classList.remove('completed');
    }
    
    const availableIn = document.getElementById('available-in');
    availableIn.innerHTML = '';
    const gensSet = new Set();
    for(var game of CURRENT_RIBBON.games){
        gensSet.add(game.gen)
        const span = document.createElement('span');
        span.innerText = `${game.names[0]}`;
        span.classList.add(game.id);
        availableIn.appendChild(span);
    }
    const titleConferred = document.getElementById('title-conferred');
    titleConferred.innerHTML = CURRENT_RIBBON.title ? `"...${CURRENT_RIBBON.title}"` : 'N/A';
}

document.getElementById('is-completed').addEventListener('change', onCheck);

function onCheck(event){
    setRibbonStatus(CURRENT_RIBBON, event.target.checked);
    drawGrid(getFilteredRibbonList(getQueryParameters()));
}

drawGrid(getFilteredRibbonList(getQueryParameters()));