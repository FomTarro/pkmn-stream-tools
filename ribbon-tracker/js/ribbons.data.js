/**
 * A game data structure.
 * @typedef {Object} Game
 * @property {string[]} names - What names does this game go by?
 * @property {number} gen - Which gen is this game from?
 */

/** 
* @constant - List of all games.
* @type {Object.<string, Game>}
*/
const GAMES = {
    RUBY: {
        names: ['R', 'ruby'],
        gen: 3
    },
    SAPPHIRE: {
        names: ['S', 'sapphire'],
        gen: 3
    },
    EMERALD: {
        names: ['E', 'emerald'],
        gen: 3
    },
    FIRE_RED: {
        names: ['FR', 'fire red', 'firered', 'red'],
        gen: 3
    },
    LEAF_GREEN: {
        names: ['LG', 'leaf green', 'leafgreen', 'green'],
        gen: 3
    },
    COLOSSEUM: {
        names: ['C', 'colo', 'colosseum'],
        gen: 3
    },
    XD: {
        names: ['XD'],
        gen: 3
    },
    DIAMOND: {
        names: ['D', 'diamond'],
        gen: 4
    },
    PEARL: {
        names: ['P', 'pearl'],
        gen: 4
    },
    PLATINUM: {
        names: ['PT', 'platinum'],
        gen: 4
    },
    HEART_GOLD: {
        names: ['HG', 'heart gold', 'heartgold', 'gold'],
        gen: 4
    },
    SOUL_SILVER: {
        names: ['SS', 'soul silver', 'soulsilver', 'silver'],
        gen: 4
    },
    BLACK: {
        names: ['B', 'black'],
        gen: 5
    },
    WHITE: {
        names: ['W', 'white'],
        gen: 5
    },
    BLACK_2: {
        names: ['B2', 'black 2', 'black2'],
        gen: 5
    },
    WHITE_2: {
        names: ['W2', 'white 2', 'white2'],
        gen: 5
    },
    X: {
        names: ['X'],
        gen: 6,
    },
    Y: {
        names: ['Y'],
        gen: 6
    },
    OMEGA_RUBY: {
        names: ['OR', 'omega ruby', 'omegaruby'],
        gen: 6
    },
    ALPHA_SAPPHIRE: {
        names: ['AS', 'alpha sapphire', 'alphasapphire'],
        gen: 6
    },
    SUN: {
        names: ['S', 'sun'],
        gen: 7
    },
    MOON: {
        names: ['M', 'moon'],
        gen: 7
    },
    ULTRA_SUN: {
        names: ['US', 'ultra sun', 'ultrasun'],
        gen: 7
    },
    ULTRA_MOON: {
        names: ['UM', 'ultra moon', 'ultramoon'],
        gen: 7
    },
    SWORD: {
        names: ['SW', 'sword'],
        gen: 8
    },
    SHIELD: {
        names: ['SH', 'shield'],
        gen: 8
    },
    BRILLIANT_DIAMOND: {
        names: ['BD', 'brilliant diamond', 'brilliantdiamond'],
        gen: 8
    },
    SHINING_PEARL: {
        names: ['SP', 'shining pearl', 'shiningpearl'],
        gen: 8
    },
    LEGENDS_ARCEUS: {
        names: ['PLA', 'arceus', 'legends', 'legends arceus', 'legendsarceus'],
        gen: 8
    },
    SCARLET:{
        names: ['SC', 'scarlet'],
        gen: 9
    },
    VIOLET: {
        names: ['VI', 'violet'],
        gen: 9
    },

}

/**
 * A Ribbon data structure.
 * @typedef {Object} Ribbon
 * @property {string} name - What is the name of the ribbon?
 * @property {string} img - What is the icon file path for the ribbon?
 * @property {string} description - What is the in-game description of the ribbon?
 * @property {Game[]} games - Which games is this ribbon obtainable in?
 */


/** 
 * @constant - List of all obtainable ribbons.
 * @type {Ribbon[]}
*/
const RIBBONS = [
    // Champion Ribbons
    {
        name: "Champion Ribbon",
        img: 'champions/40px-Champion_Ribbon_VIII',
        description: "A Ribbon awarded for clearing the Pokémon League and entering the Hall of Fame somewhere long ago.",
        games: [GAMES.RUBY, GAMES.SAPPHIRE, GAMES.EMERALD, GAMES.FIRE_RED, GAMES.LEAF_GREEN]
    },
    {
        name: "Sinnoh Champion Ribbon",
        img: 'champions/40px-Sinnoh_Champion_Ribbon_VIII',
        description: "A Ribbon awarded for beating the Sinnoh Champion and entering the Sinnoh Hall of Fame.",
        games: [GAMES.DIAMOND, GAMES.PEARL, GAMES.PLATINUM, GAMES.BRILLIANT_DIAMOND, GAMES.SHINING_PEARL],
    },
    {
        name: "Kalos Champion Ribbon",
        img: 'champions/40px-Kalos_Champion_Ribbon_VIII',
        description: "A Ribbon awarded for beating the Kalos Champion and entering the Kalos Hall of Fame.",
        games: [GAMES.X, GAMES.Y]
    },
    {
        name: "Hoenn Champion Ribbon",
        img: 'champions/40px-Hoenn_Champion_Ribbon_VIII',
        description: "A Ribbon awarded for beating the Hoenn Champion and entering the Hoenn Hall of Fame.",
        games: [GAMES.OMEGA_RUBY, GAMES.ALPHA_SAPPHIRE]
    },
    {
        name: "Alola Champion Ribbon",
        img: 'champions/40px-Alola_Champion_Ribbon_VIII',
        description: "A Ribbon awarded for becoming the Alola Champion and entering the Alola Hall of Fame.",
        games: [GAMES.SUN, GAMES.MOON, GAMES.ULTRA_SUN, GAMES.ULTRA_MOON]
    },
    {
        name: "Galar Champion Ribbon",
        img: 'champions/40px-Galar_Champion_Ribbon_VIII',
        description: "A Ribbon awarded for becoming the Galar Champion and entering the Galar Hall of Fame.",
        games: [GAMES.SWORD, GAMES.SHIELD]
    },
    {
        name: "Paldea Champion Ribbon",
        img: 'champions/40px-Paldea_Champion_Ribbon_IX',
        description: "A Ribbon awarded for becoming a Paldea Champion and entering the Paldea Hall of Fame.",
        games: [GAMES.SCARLET, GAMES.VIOLET]
    },
    // Contest Ribbons
    {
        name: "Cool Ribbon",
        img: 'contests/Cool_Ribbon_Hoenn',
        description: "Hoenn Cool Contest Normal Rank winner!",
        games: [GAMES.RUBY, GAMES.SAPPHIRE, GAMES.EMERALD]
    },
    {
        name: "Cool Ribbon Super",
        img: 'contests/Cool_Ribbon_Super',
        description: "Hoenn Cool Contest Super Rank winner!",
        games: [GAMES.RUBY, GAMES.SAPPHIRE, GAMES.EMERALD]
    },
    {
        name: "Cool Ribbon Hyper",
        img: 'contests/Cool_Ribbon_Hyper',
        description: "Hoenn Cool Contest Hyper Rank winner!",
        games: [GAMES.RUBY, GAMES.SAPPHIRE, GAMES.EMERALD]
    },
    {
        name: "Cool Ribbon Master",
        img: 'contests/Cool_Ribbon_Master_Hoenn',
        description: "Hoenn Cool Contest Master Rank winner!",
        games: [GAMES.RUBY, GAMES.SAPPHIRE, GAMES.EMERALD]
    },
    {
        name: "Beauty Ribbon",
        img: 'contests/Beauty_Ribbon_Hoenn',
        description: "Hoenn Beauty Contest Normal Rank winner!",
        games: [GAMES.RUBY, GAMES.SAPPHIRE, GAMES.EMERALD]
    },
    {
        name: "Beauty Ribbon Super",
        img: 'contests/Beauty_Ribbon_Super',
        description: "Hoenn Beauty Contest Super Rank winner!",
        games: [GAMES.RUBY, GAMES.SAPPHIRE, GAMES.EMERALD]
    },
    {
        name: "Beauty Ribbon Hyper",
        img: 'contests/Beauty_Ribbon_Hyper',
        description: "Hoenn Beauty Contest Hyper Rank winner!",
        games: [GAMES.RUBY, GAMES.SAPPHIRE, GAMES.EMERALD]
    },
    {
        name: "Beauty Ribbon Master",
        img: 'contests/Beauty_Ribbon_Master_Hoenn',
        description: "Hoenn Beauty Contest Master Rank winner!",
        games: [GAMES.RUBY, GAMES.SAPPHIRE, GAMES.EMERALD]
    },
    {
        name: "Cute Ribbon",
        img: 'contests/Cute_Ribbon_Hoenn',
        description: "Hoenn Cute Contest Normal Rank winner!",
        games: [GAMES.RUBY, GAMES.SAPPHIRE, GAMES.EMERALD]
    },
    {
        name: "Cute Ribbon Super",
        img: 'contests/Cute_Ribbon_Super',
        description: "Hoenn Cute Contest Super Rank winner!",
        games: [GAMES.RUBY, GAMES.SAPPHIRE, GAMES.EMERALD]
    },
    {
        name: "Cute Ribbon Hyper",
        img: 'contests/Cute_Ribbon_Hyper',
        description: "Hoenn Cute Contest Hyper Rank winner!",
        games: [GAMES.RUBY, GAMES.SAPPHIRE, GAMES.EMERALD]
    },
    {
        name: "Cute Ribbon Master",
        img: 'contests/Cute_Ribbon_Master_Hoenn',
        description: "Hoenn Cute Contest Master Rank winner!",
        games: [GAMES.RUBY, GAMES.SAPPHIRE, GAMES.EMERALD]
    },
    {
        name: "Smart Ribbon",
        img: 'contests/Smart_Ribbon_Hoenn',
        description: "Hoenn Smart Contest Normal Rank winner!",
        games: [GAMES.RUBY, GAMES.SAPPHIRE, GAMES.EMERALD]
    },
    {
        name: "Smart Ribbon Super",
        img: 'contests/Smart_Ribbon_Super',
        description: "Hoenn Smart Contest Super Rank winner!",
        games: [GAMES.RUBY, GAMES.SAPPHIRE, GAMES.EMERALD]
    },
    {
        name: "Smart Ribbon Hyper",
        img: 'contests/Smart_Ribbon_Hyper',
        description: "Hoenn Smart Contest Hyper Rank winner!",
        games: [GAMES.RUBY, GAMES.SAPPHIRE, GAMES.EMERALD]
    },
    {
        name: "Smart Ribbon Master",
        img: 'contests/Smart_Ribbon_Master_Hoenn',
        description: "Hoenn Smart Contest Master Rank winner!",
        games: [GAMES.RUBY, GAMES.SAPPHIRE, GAMES.EMERALD]
    },
    {
        name: "Tough Ribbon",
        img: 'contests/Tough_Ribbon_Hoenn',
        description: "Hoenn Tough Contest Normal Rank winner!",
        games: [GAMES.RUBY, GAMES.SAPPHIRE, GAMES.EMERALD]
    },
    {
        name: "Tough Ribbon Super",
        img: 'contests/Tough_Ribbon_Super',
        description: "Hoenn Tough Contest Super Rank winner!",
        games: [GAMES.RUBY, GAMES.SAPPHIRE, GAMES.EMERALD]
    },
    {
        name: "Tough Ribbon Hyper",
        img: 'contests/Tough_Ribbon_Hyper',
        description: "Hoenn Tough Contest Hyper Rank winner!",
        games: [GAMES.RUBY, GAMES.SAPPHIRE, GAMES.EMERALD]
    },
    {
        name: "Tough Ribbon Master",
        img: 'contests/Tough_Ribbon_Master_Hoenn',
        description: "Hoenn Tough Contest Master Rank winner!",
        games: [GAMES.RUBY, GAMES.SAPPHIRE, GAMES.EMERALD]
    },
    // Super Contests
    {
        name: "Cool Ribbon",
        img: 'super_contests/Cool_Ribbon_Sinnoh',
        description: "Super Contest Cool Category Normal Rank winner!",
        games: [GAMES.DIAMOND, GAMES.PEARL, GAMES.PLATINUM]
    },
    {
        name: "Cool Ribbon Great",
        img: 'super_contests/Cool_Ribbon_Great',
        description: "Super Contest Cool Category Great Rank winner!",
        games: [GAMES.DIAMOND, GAMES.PEARL, GAMES.PLATINUM]
    },
    {
        name: "Cool Ribbon Ultra",
        img: 'super_contests/Cool_Ribbon_Ultra',
        description: "Super Contest Cool Category Ultra Rank winner!",
        games: [GAMES.DIAMOND, GAMES.PEARL, GAMES.PLATINUM]
    },
    {
        name: "Cool Ribbon Master",
        img: 'super_contests/Cool_Ribbon_Master_Sinnoh',
        description: "Super Contest Cool Category Master Rank winner!",
        games: [GAMES.DIAMOND, GAMES.PEARL, GAMES.PLATINUM]
    },
    {
        name: "Beauty Ribbon",
        img: 'super_contests/Beauty_Ribbon_Sinnoh',
        description: "Super Contest Beauty Category Normal Rank winner!",
        games: [GAMES.DIAMOND, GAMES.PEARL, GAMES.PLATINUM]
    },
    {
        name: "Beauty Ribbon Great",
        img: 'super_contests/Beauty_Ribbon_Great',
        description: "Super Contest Beauty Category Great Rank winner!",
        games: [GAMES.DIAMOND, GAMES.PEARL, GAMES.PLATINUM]
    },
    {
        name: "Beauty Ribbon Ultra",
        img: 'super_contests/Beauty_Ribbon_Ultra',
        description: "Super Contest Beauty Category Ultra Rank winner!",
        games: [GAMES.DIAMOND, GAMES.PEARL, GAMES.PLATINUM]
    },
    {
        name: "Beauty Ribbon Master",
        img: 'super_contests/Beauty_Ribbon_Master_Sinnoh',
        description: "Super Contest Beauty Category Master Rank winner!",
        games: [GAMES.DIAMOND, GAMES.PEARL, GAMES.PLATINUM]
    },
    {
        name: "Cute Ribbon",
        img: 'super_contests/Cute_Ribbon_Sinnoh',
        description: "Super Contest Cute Category Normal Rank winner!",
        games: [GAMES.DIAMOND, GAMES.PEARL, GAMES.PLATINUM]
    },
    {
        name: "Cute Ribbon Great",
        img: 'super_contests/Cute_Ribbon_Great',
        description: "Super Contest Cute Category Great Rank winner!",
        games: [GAMES.DIAMOND, GAMES.PEARL, GAMES.PLATINUM]
    },
    {
        name: "Cute Ribbon Ultra",
        img: 'super_contests/Cute_Ribbon_Ultra',
        description: "Super Contest Cute Category Ultra Rank winner!",
        games: [GAMES.DIAMOND, GAMES.PEARL, GAMES.PLATINUM]
    },
    {
        name: "Cute Ribbon Master",
        img: 'super_contests/Cute_Ribbon_Master_Sinnoh',
        description: "Super Contest Cute Category Master Rank winner!",
        games: [GAMES.DIAMOND, GAMES.PEARL, GAMES.PLATINUM]
    },
    {
        name: "Smart Ribbon",
        img: 'super_contests/Smart_Ribbon_Sinnoh',
        description: "Super Contest Smart Category Normal Rank winner!",
        games: [GAMES.DIAMOND, GAMES.PEARL, GAMES.PLATINUM]
    },
    {
        name: "Smart Ribbon Great",
        img: 'super_contests/Smart_Ribbon_Great',
        description: "Super Contest Smart Category Great Rank winner!",
        games: [GAMES.DIAMOND, GAMES.PEARL, GAMES.PLATINUM]
    },
    {
        name: "Smart Ribbon Ultra",
        img: 'super_contests/Smart_Ribbon_Ultra',
        description: "Super Contest Smart Category Ultra Rank winner!",
        games: [GAMES.DIAMOND, GAMES.PEARL, GAMES.PLATINUM]
    },
    {
        name: "Smart Ribbon Master",
        img: 'super_contests/Smart_Ribbon_Master_Sinnoh',
        description: "Super Contest Smart Category Master Rank winner!",
        games: [GAMES.DIAMOND, GAMES.PEARL, GAMES.PLATINUM]
    },
    {
        name: "Tough Ribbon",
        img: 'super_contests/Tough_Ribbon_Sinnoh',
        description: "Super Contest Tough Category Normal Rank winner!",
        games: [GAMES.DIAMOND, GAMES.PEARL, GAMES.PLATINUM]
    },
    {
        name: "Tough Ribbon Great",
        img: 'super_contests/Tough_Ribbon_Great',
        description: "Super Contest Tough Category Great Rank winner!",
        games: [GAMES.DIAMOND, GAMES.PEARL, GAMES.PLATINUM]
    },
    {
        name: "Tough Ribbon Ultra",
        img: 'super_contests/Tough_Ribbon_Ultra',
        description: "Super Contest Tough Category Ultra Rank winner!",
        games: [GAMES.DIAMOND, GAMES.PEARL, GAMES.PLATINUM]
    },
    {
        name: "Tough Ribbon Master",
        img: 'super_contests/Tough_Ribbon_Master_Sinnoh',
        description: "Super Contest Tough Category Master Rank winner!",
        games: [GAMES.DIAMOND, GAMES.PEARL, GAMES.PLATINUM]
    },
    // Spectacular Contests
    {
        name: "Coolness Master Ribbon",
        img: 'spectacular_contests/40px-Coolness_Master_Ribbon_VIII',
        description: "A Ribbon awarded to a Pokémon that has perfectly embodied Coolness in Pokémon Contests.",
        games: [GAMES.OMEGA_RUBY, GAMES.ALPHA_SAPPHIRE, GAMES.BRILLIANT_DIAMOND, GAMES.SHINING_PEARL]
    },
    {
        name: "Beauty Master Ribbon",
        img: 'spectacular_contests/40px-Beauty_Master_Ribbon_VIII',
        description: "A Ribbon awarded to a Pokémon that has perfectly embodied Beauty in Pokémon Contests.",
        games: [GAMES.OMEGA_RUBY, GAMES.ALPHA_SAPPHIRE, GAMES.BRILLIANT_DIAMOND, GAMES.SHINING_PEARL]
    },
    {
        name: "Cuteness Master Ribbon",
        img: 'spectacular_contests/40px-Cuteness_Master_Ribbon_VIII',
        description: "A Ribbon awarded to a Pokémon that has perfectly embodied Cuteness in Pokémon Contests.",
        games: [GAMES.OMEGA_RUBY, GAMES.ALPHA_SAPPHIRE, GAMES.BRILLIANT_DIAMOND, GAMES.SHINING_PEARL]
    },
    {
        name: "Cleverness Master Ribbon",
        img: 'spectacular_contests/40px-Cleverness_Master_Ribbon_VIII',
        description: "A Ribbon awarded to a Pokémon that has perfectly embodied Cleverness in Pokémon Contests.",
        games: [GAMES.OMEGA_RUBY, GAMES.ALPHA_SAPPHIRE, GAMES.BRILLIANT_DIAMOND, GAMES.SHINING_PEARL]
    },
    {
        name: "Toughness Master Ribbon",
        img: 'spectacular_contests/40px-Toughness_Master_Ribbon_VIII',
        description: "A Ribbon awarded to a Pokémon that has perfectly embodied Toughness in Pokémon Contests.",
        games: [GAMES.OMEGA_RUBY, GAMES.ALPHA_SAPPHIRE, GAMES.BRILLIANT_DIAMOND, GAMES.SHINING_PEARL]
    },
    {
        name: "Contest Star Ribbon",
        img: 'spectacular_contests/40px-Contest_Star_Ribbon_VIII',
        description: "A Ribbon awarded to a Pokémon that has performed superbly in every kind of contest.",
        games: [GAMES.OMEGA_RUBY, GAMES.ALPHA_SAPPHIRE, GAMES.BRILLIANT_DIAMOND, GAMES.SHINING_PEARL]
    },
    {
        name: "Contest Star Ribbon",
        img: 'spectacular_contests/40px-Twinkling_Star_Ribbon_VIII',
        description: "A Ribbon awarded to a Pokémon that has perfectly embodied shining brilliance in Super Contest Shows.",
        games: [GAMES.BRILLIANT_DIAMOND, GAMES.SHINING_PEARL]
    },
    // Contest Memories
    {
        name: "Contest Memory Ribbon",
        img: 'memory_contests/40px-Contest_Memory_Ribbon_VIII',
        description: "A commemorative Ribbon representing all of the Ribbons you collected for contests somewhere long ago.",
        games: [GAMES.X, GAMES.Y, GAMES.OMEGA_RUBY, GAMES.ALPHA_SAPPHIRE]
    },
    {
        name: "Contest Memory Ribbon",
        img: 'memory_contests/40px-Contest_Memory_Ribbon_gold_VIII',
        description: "A commemorative Ribbon representing all of the Ribbons you collected for contests somewhere long ago.",
        games: [GAMES.X, GAMES.Y, GAMES.OMEGA_RUBY, GAMES.ALPHA_SAPPHIRE]
    },
    // Battle Towers
    {
        name: "Winning Ribbon",
        img: 'towers/Winning_Ribbon',
        description: "Ribbon awarded for clearing Hoenn's Battle Tower's Lv. 50 challenge.",
        games: [GAMES.RUBY, GAMES.SAPPHIRE, GAMES.EMERALD]
    },
    {
        name: "Victory Ribbon",
        img: 'towers/Victory_Ribbon',
        description: "A Ribbon awarded for defeating the Tower Tycoon at the Battle Tower.",
        games: [GAMES.RUBY, GAMES.SAPPHIRE, GAMES.EMERALD]
    },
    {
        name: "Great Ability Ribbon",
        img: 'towers/Great_Ability_Ribbon',
        description: "A Ribbon awarded for defeating the Tower Tycoon at the Battle Tower.",
        games: [GAMES.DIAMOND, GAMES.PEARL, GAMES.HEART_GOLD, GAMES.SOUL_SILVER]
    },
    {
        name: "Double Ability Ribbon",
        img: 'towers/Double_Ability_Ribbon',
        description: "A Ribbon awarded for completing the Battle Tower Double challenge.",
        games: [GAMES.DIAMOND, GAMES.PEARL, GAMES.HEART_GOLD, GAMES.SOUL_SILVER]
    },
    {
        name: "Multi Ability Ribbon",
        img: 'towers/Multi_Ability_Ribbon',
        description: "A Ribbon awarded for completing the Battle Tower Multi challenge.",
        games: [GAMES.DIAMOND, GAMES.PEARL, GAMES.HEART_GOLD, GAMES.SOUL_SILVER]
    },
    {
        name: "Pair Ability Ribbon",
        img: 'towers/Pair_Ability_Ribbon',
        description: "A Ribbon awarded for completing the Battle Tower Link Multi challenge.",
        games: [GAMES.DIAMOND, GAMES.PEARL, GAMES.HEART_GOLD, GAMES.SOUL_SILVER]
    },
    // Discontinued with the closure of DS WFC
    // {
    //     name: "World Ability Ribbon",
    //     img: 'towers/World_Ability_Ribbon',
    //     description: "A Ribbon awarded for completing the Wi-Fi Battle Tower challenge.",
    //     games: [GAMES.DIAMOND, GAMES.PEARL, GAMES.HEART_GOLD, GAMES.SOUL_SILVER]
    // },
    {
        name: "Skillful Battler Ribbon",
        img: 'towers/40px-Skillful_Battler_Ribbon_VIII',
        description: "A Ribbon that can be given to a Pokémon that has achieved victory in difficult battles.",
        games: [GAMES.X, GAMES.Y, GAMES.OMEGA_RUBY, GAMES.ALPHA_SAPPHIRE]
    },
    {
        name: "Expert Battler Ribbon",
        img: 'towers/40px-Expert_Battler_Ribbon_VIII',
        description: "A Ribbon that can be given to a brave Pokémon that has honed its battle skills to an art.",
        games: [GAMES.X, GAMES.Y, GAMES.OMEGA_RUBY, GAMES.ALPHA_SAPPHIRE]
    },
    {
        name: "Battle Tree Great Ribbon",
        img: 'towers/40px-Battle_Tree_Great_Ribbon_VIII',
        description: "A Ribbon awarded for winning against a Battle Legend in the Battle Tree.",
        games: [GAMES.SUN, GAMES.MOON, GAMES.ULTRA_SUN, GAMES.ULTRA_MOON]
    },
    {
        name: "Battle Tree Master Ribbon",
        img: 'towers/40px-Battle_Tree_Master_Ribbon_VIII',
        description: "A Ribbon awarded for winning against a Battle Legend in super battles in the Battle Tree.",
        games: [GAMES.SUN, GAMES.MOON, GAMES.ULTRA_SUN, GAMES.ULTRA_MOON]
    },
    {
        name: "Tower Master Ribbon",
        img: 'towers/40px-Tower_Master_Ribbon_VIII',
        description: "A Ribbon awarded for winning against a champion in the Battle Tower.",
        games: [GAMES.SWORD, GAMES.SHIELD, GAMES.BRILLIANT_DIAMOND, GAMES.SHINING_PEARL]
    },
    // Tower Memories
    {
        name: "Battle Memory Ribbon",
        img: 'memory_towers/40px-Battle_Memory_Ribbon_VIII',
        description: "A commemorative Ribbon representing all of the Ribbons you collected for battling somewhere long ago.",
        games: [GAMES.X, GAMES.Y, GAMES.OMEGA_RUBY, GAMES.ALPHA_SAPPHIRE]
    },
    {
        name: "Battle Memory Ribbon",
        img: 'memory_towers/40px-Battle_Memory_Ribbon_gold_VIII',
        description: "A commemorative Ribbon representing all of the Ribbons you collected for battling somewhere long ago.",
        games: [GAMES.X, GAMES.Y, GAMES.OMEGA_RUBY, GAMES.ALPHA_SAPPHIRE]
    },
    // Memorial
    {
        name: "Artist Ribbon",
        img: 'memorial/40px-Artist_Ribbon_VIII',
        description: "A Ribbon awarded for being chosen as a super sketch model in the Hoenn region.",
        games: [GAMES.RUBY, GAMES.SAPPHIRE, GAMES.EMERALD]
    },
    {
        name: "Effort Ribbon",
        img: 'memorial/40px-Effort_Ribbon_VIII',
        description: "A Ribbon awarded for being an exceptionally hard worker.",
        games: [GAMES.RUBY, GAMES.SAPPHIRE, GAMES.EMERALD, GAMES.DIAMOND, GAMES.PEARL, GAMES.PLATINUM, GAMES.HEART_GOLD, GAMES.SOUL_SILVER, GAMES.X, GAMES.Y, GAMES.OMEGA_RUBY, GAMES.ALPHA_SAPPHIRE, GAMES.SUN, GAMES.MOON, GAMES.ULTRA_SUN, GAMES.ULTRA_MOON, GAMES.SWORD, GAMES.SHIELD, GAMES.BRILLIANT_DIAMOND, GAMES.SHINING_PEARL, GAMES.SCARLET, GAMES.VIOLET]
    },
    {
        name: "Alert Ribbon",
        img: 'memorial/40px-Alert_Ribbon_VIII',
        description: "A Ribbon for recalling an invigorating event that created life energy.",
        games: [GAMES.DIAMOND, GAMES.PEARL, GAMES.PLATINUM, GAMES.HEART_GOLD, GAMES.SOUL_SILVER, GAMES.X, GAMES.Y, GAMES.OMEGA_RUBY, GAMES.ALPHA_SAPPHIRE, GAMES.BRILLIANT_DIAMOND, GAMES.SHINING_PEARL]
    },
    {
        name: "Shock Ribbon",
        img: 'memorial/40px-Shock_Ribbon_VIII',
        description: "A Ribbon for recalling a thrilling event that made life more exciting.",
        games: [GAMES.DIAMOND, GAMES.PEARL, GAMES.PLATINUM, GAMES.HEART_GOLD, GAMES.SOUL_SILVER, GAMES.X, GAMES.Y, GAMES.OMEGA_RUBY, GAMES.ALPHA_SAPPHIRE, GAMES.BRILLIANT_DIAMOND, GAMES.SHINING_PEARL]
    },
    {
        name: "Downcast Ribbon",
        img: 'memorial/40px-Downcast_Ribbon_VIII',
        description: "A Ribbon for recalling feelings of sadness that added spice to life.",
        games: [GAMES.DIAMOND, GAMES.PEARL, GAMES.PLATINUM, GAMES.HEART_GOLD, GAMES.SOUL_SILVER, GAMES.X, GAMES.Y, GAMES.OMEGA_RUBY, GAMES.ALPHA_SAPPHIRE, GAMES.BRILLIANT_DIAMOND, GAMES.SHINING_PEARL]
    },
    {
        name: "Careless Ribbon",
        img: 'memorial/40px-Careless_Ribbon_VIII',
        description: "A Ribbon for recalling a careless error that helped steer life decisions.",
        games: [GAMES.DIAMOND, GAMES.PEARL, GAMES.PLATINUM, GAMES.HEART_GOLD, GAMES.SOUL_SILVER, GAMES.X, GAMES.Y, GAMES.OMEGA_RUBY, GAMES.ALPHA_SAPPHIRE, GAMES.BRILLIANT_DIAMOND, GAMES.SHINING_PEARL]
    },
    {
        name: "Relax Ribbon",
        img: 'memorial/40px-Relax_Ribbon_VIII',
        description: "A Ribbon for recalling a refreshing event that added sparkle to life.",
        games: [GAMES.DIAMOND, GAMES.PEARL, GAMES.PLATINUM, GAMES.HEART_GOLD, GAMES.SOUL_SILVER, GAMES.X, GAMES.Y, GAMES.OMEGA_RUBY, GAMES.ALPHA_SAPPHIRE, GAMES.BRILLIANT_DIAMOND, GAMES.SHINING_PEARL]
    },
    {
        name: "Snooze Ribbon",
        img: 'memorial/40px-Snooze_Ribbon_VIII',
        description: "A Ribbon for recalling a deep slumber that made life soothing.",
        games: [GAMES.DIAMOND, GAMES.PEARL, GAMES.PLATINUM, GAMES.HEART_GOLD, GAMES.SOUL_SILVER, GAMES.X, GAMES.Y, GAMES.OMEGA_RUBY, GAMES.ALPHA_SAPPHIRE, GAMES.BRILLIANT_DIAMOND, GAMES.SHINING_PEARL]
    },
    {
        name: "Smile Ribbon",
        img: 'memorial/40px-Smile_Ribbon_VIII',
        description: "A Ribbon for recalling that smiles enrich the quality of life.",
        games: [GAMES.DIAMOND, GAMES.PEARL, GAMES.PLATINUM, GAMES.HEART_GOLD, GAMES.SOUL_SILVER, GAMES.X, GAMES.Y, GAMES.OMEGA_RUBY, GAMES.ALPHA_SAPPHIRE, GAMES.BRILLIANT_DIAMOND, GAMES.SHINING_PEARL]
    },
    {
        name: "Gorgeous Ribbon",
        img: 'memorial/40px-Gorgeous_Ribbon_VIII',
        description: "An extraordinarily gorgeous and extravagant Ribbon.",
        games: [GAMES.DIAMOND, GAMES.PEARL, GAMES.PLATINUM, GAMES.OMEGA_RUBY, GAMES.ALPHA_SAPPHIRE, GAMES.BRILLIANT_DIAMOND, GAMES.SHINING_PEARL]
    },
    {
        name: "Royal Ribbon",
        img: 'memorial/40px-Royal_Ribbon_VIII',
        description: "An incredibly regal Ribbon with an air of nobility.",
        games: [GAMES.DIAMOND, GAMES.PEARL, GAMES.PLATINUM, GAMES.OMEGA_RUBY, GAMES.ALPHA_SAPPHIRE, GAMES.BRILLIANT_DIAMOND, GAMES.SHINING_PEARL]
    },
    {
        name: "Gorgeous Royal Ribbon",
        img: 'memorial/40px-Gorgeous_Royal_Ribbon_VIII',
        description: "A gorgeous and regal Ribbon that is the peak of fabulous.",
        games: [GAMES.DIAMOND, GAMES.PEARL, GAMES.PLATINUM, GAMES.OMEGA_RUBY, GAMES.ALPHA_SAPPHIRE, GAMES.BRILLIANT_DIAMOND, GAMES.SHINING_PEARL]
    },
    {
        name: "Footprint Ribbon",
        img: 'memorial/40px-Footprint_Ribbon_VIII',
        description: "A Ribbon awarded to a Pokémon deemed to have a top-quality footprint.",
        games: [GAMES.DIAMOND, GAMES.PEARL, GAMES.PLATINUM, GAMES.X, GAMES.Y, GAMES.OMEGA_RUBY, GAMES.ALPHA_SAPPHIRE, GAMES.SUN, GAMES.MOON, GAMES.ULTRA_SUN, GAMES.ULTRA_MOON, GAMES.BRILLIANT_DIAMOND, GAMES.SHINING_PEARL]
    },
    // Had never been made available
    // {
    //     name: "Record Ribbon",
    //     img: 'memorial/40px-Record_Ribbon_VIII',
    //     description: "A Ribbon awarded for setting an incredible record.",
    //     games: []
    // },
    {
        name: "Legend Ribbon",
        img: 'memorial/40px-Legend_Ribbon_VIII',
        description: "A Ribbon awarded for setting a legendary record.",
        games: [GAMES.HEART_GOLD, GAMES.SOUL_SILVER]
    },
    {
        name: "Best Friends Ribbon",
        img: 'memorial/40px-Best_Friends_Ribbon_VIII',
        description: "A Ribbon that can be given to a Pokémon with which you share a close and meaningful bond.",
        games: [GAMES.X, GAMES.Y, GAMES.OMEGA_RUBY, GAMES.ALPHA_SAPPHIRE, GAMES.SUN, GAMES.MOON, GAMES.ULTRA_SUN, GAMES.ULTRA_MOON, GAMES.SWORD, GAMES.SHIELD, GAMES.BRILLIANT_DIAMOND, GAMES.SHINING_PEARL, GAMES.SCARLET, GAMES.VIOLET]
    },
    {
        name: "Training Ribbon",
        img: 'memorial/40px-Training_Ribbon_VIII',
        description: "A Ribbon that can be given to a Pokémon that has overcome rigorous trials and training.",
        games: [GAMES.X, GAMES.Y, GAMES.OMEGA_RUBY, GAMES.ALPHA_SAPPHIRE]
    },
    {
        name: "Battle Royal Master Ribbon",
        img: 'memorial/40px-Battle_Royal_Master_Ribbon_VIII',
        description: "A Ribbon that can be given to a Pokémon that has achieved victory in the Battle Royal.",
        games: [GAMES.SUN, GAMES.MOON, GAMES.ULTRA_SUN, GAMES.ULTRA_MOON]
    },
    {
        name: "Master Rank Ribbon",
        img: 'memorial/40px-Master_Rank_Ribbon_VIII',
        description: "A Ribbon awarded for winning against a Trainer in the Master Ball Tier of Ranked Battles.",
        games: [GAMES.SWORD, GAMES.SHIELD, GAMES.SCARLET, GAMES.VIOLET]
    },
    {
        name: "Hisui Ribbon",
        img: 'memorial/40px-Hisui_Ribbon_IX',
        description: "A ribbon awarded to a Pokémon that posed for a photograph in Hisui in the distant past.",
        games: [GAMES.LEGENDS_ARCEUS]
    },
    // Event Ribbons
    {
        name: "National Ribbon",
        img: 'memorial/40px-National_Ribbon_VIII',
        description: "A Ribbon awarded for overcoming all difficult challenges.",
        games: [GAMES.COLOSSEUM, GAMES.XD]
    },
    {
        name: "Earth Ribbon",
        img: 'memorial/40px-Earth_Ribbon_VIII',
        description: "A Ribbon awarded for winning one hundred battles in a row.",
        games: [GAMES.COLOSSEUM, GAMES.XD]
    },
]