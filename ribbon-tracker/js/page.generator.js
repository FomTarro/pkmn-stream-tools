for(const ribbon of ribbons.ribbons){
    const container = document.getElementById('container');
    const div = document.createElement('div');
    div.classList.add('ribbon-grid-cell');
    const name = ribbon.name;
    const desc = ribbon.description;
    const imgSrc = `./img/Ribbons/Gen ${ribbon.gen}/40px-${name.replaceAll(' ', '_')}_Ribbon_VIII.png`;
    const img = document.createElement('img');
    img.src = imgSrc;
    img.classList.add('ribbon-image');
    div.addEventListener('click', () => {
        console.log(name)
        const container = document.getElementById('info-box');
        document.getElementById('info-box-ribbon-image').src = imgSrc;
        document.getElementById('info-box-name').innerHTML = name;
        document.getElementById('info-box-desc').innerHTML = desc;
    })
    div.appendChild(img);
    container.appendChild(div);
}

document.getElementById('isCompleted').addEventListener('change', onCheck);

function onCheck(e){
    const currentRibbon = document.getElementById('info-box-name').innerHTML;
    console.log(currentRibbon);
    const req = new XMLHttpRequest();
    req.addEventListener("load", onResponse);
    req.open("GET", `./${currentRibbon}?status=true`);
    req.send();
}

function onResponse(data){

}