
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
        const desc = ribbon.description;
        const imgSrc = `./img/ribbons/${ribbon.img}.png`;
        const img = document.createElement('img');
        img.src = imgSrc;
        img.classList.add('ribbon-image');
        div.addEventListener('click', () => {
            console.log(name)
            const ribbonStorage = JSON.parse(localStorage.getItem(name));
            document.getElementById('info-box-ribbon-image').src = imgSrc;
            document.getElementById('info-box-name-key').innerHTML = name;
            document.getElementById('info-box-desc').innerHTML = desc;
            document.getElementById('isCompleted').checked = ribbonStorage.completed;
        });
        div.id = name;
        div.appendChild(img);
        container.appendChild(div);
        localStorage.setItem(ribbon.name, JSON.stringify(ribbon));
    }
}

document.getElementById('isCompleted').addEventListener('change', onCheck);

function onCheck(event){
    const currentRibbon = document.getElementById('info-box-name-key').innerHTML;
    const ribbonStorage = JSON.parse(localStorage.getItem(currentRibbon));
    console.log(ribbonStorage);
    if(ribbonStorage){
        ribbonStorage.completed = (event.target.checked);
        console.log(ribbonStorage);
        localStorage.setItem(currentRibbon, JSON.stringify(ribbonStorage));
        console.log("ribbon status updated")
    }
}

function onResponse(data){
    const response = JSON.parse(data.target.response);
    console.log(response);
}

drawGrid(getQueryParameters());