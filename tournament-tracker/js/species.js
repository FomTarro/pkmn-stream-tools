const SPECIES = [
    {
        name: 'Bulbasaur',
        natdex: 1,
    },
    {
        name: 'Ivysaur',
        natdex: 2,
    },
    {
        name: 'Venusaur',
        natdex: 3,
        formes: [
            {
                name: "Mega-Venusaur",
                index: 1
            }
        ]
    },
    {
        name: 'Charmander',
        natdex: 4
    },
    {
        name: 'Charmeleon',
        natdex: 5
    },
    {
        name: 'Charizard',
        natdex: 6,
        formes: [
            {
                name: 'Mega-Charizard X',
                index: 1
            },
            {
                name: 'Mega-Charizard Y',
                index: 2
            }
        ]
    }
]

SPECIES.forEach(species => {
    makeSpeciesOption({name: species.name, number: species.natdex});
    if(species.formes){
        species.formes.forEach(forme => {
            makeSpeciesOption({name: forme.name, number: `${species.natdex}-${forme.index}`})
        })
    }
});

function makeSpeciesOption(species){
    const opt = document.createElement("option");
    opt.id = species.name;
    opt.innerHTML = species.name;
    opt.number = species.number;
    document.getElementById("pokemonOptions").appendChild(opt);
}