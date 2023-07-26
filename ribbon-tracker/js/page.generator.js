
function getQueryParameters(){
    const urlSearchParams = new URLSearchParams(location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    console.log(params);
    const config = {}
    if(params.gens && params.gens.startsWith('[') && params.gens.endsWith(']')){
        const commaDelimited = params.gens.replace('[', '').replace(']','').split(',');
        config.gens = commaDelimited;
    }
    if(params.ribbons && params.ribbons.startsWith('[') && params.ribbons.endsWith(']')){
        const commaDelimited = params.ribbons.replace('[', '').replace(']','').split(',');
        config.ribbons = commaDelimited;
    }
    console.log(config);
}

function drawGrid(){
    const container = document.getElementById('container');
    container.innerHTML =' ';
    for(const ribbon of ribbons.ribbons){
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

drawGrid();