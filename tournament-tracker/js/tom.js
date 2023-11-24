/**
 * 
 * @param {File} file - The file to load.
 * @returns {Promise<string>}
 */
function loadFileWrapper(file){
    var reader = new FileReader();
    reader.readAsText(file,'UTF-8');
    // here we tell the reader what to do when it's done reading...
    const promise = new Promise((resolve, reject) =>
    reader.onload = readerEvent => {
        try{
            const content = readerEvent.target.result;
            resolve(content);
        }catch(e){
            reject(e);
        }
    });
    return promise;
}

/**
 * A player data structure.
 * @typedef {Object} RosterPlayer
 * @property {string} division - The division of the player (JR, SR, MA).
 * @property {string} name - Name of the player.
 */

/**
 * A tournament roster data strcuture.
 * @typedef {Object} Roster
 * @property {RosterPlayer[]} players - The entire roster of the tourament.
 */

/**
 * Parses the TOM ...roster.html file contents into JSON.
 * @param {string} fileContent - The contents of the TOM file.
 * @returns {Roster} The tournament roster.
 */
function parseRosterFile(fileContent){
    const result = {
        players: []
    };
    var el = document.createElement('html');
    el.innerHTML = fileContent;
    for(const table of el.getElementsByClassName('players_table')){
        for(const row of table.querySelectorAll('tr')){
            const cells = row.querySelectorAll('td');
            if(cells.length >= 2){
                result.players.push({
                    name: cells[1].innerText,
                    division: cells[2].innerText
                });
            }
        }
    }
    el.remove();
    return result;
}

/**
 * A player data structure.
 * @typedef {Object} StandingsPlayer
 * @property {number} standing - The player's current standing.
 * @property {string} name - Name of the player.
 * @property {number} flight - ???
 * @property {number} dropRound - The round the player dropped in, if any. Will be 0 if they haven't dropped.
 * @property {string} record - The player's overall record, like 2/1/0 (6).
 * @property {number} points - The player's overall score.
 * @property {string} opponentsWinPercentage - The win percentage of this player's opponents.
 * @property {string} opponentsOpponentsWinPercentage - The win percentage of this player's opponents' opponents.
 */

/**
 * A tournament standings report data structure.
 * @typedef {Object} Standings
 * @property {number} currentRound - The current round this tournament is in.
 * @property {number} totalRounds - The total number of rounds in this tournament.
 * @property {StandingsPlayer[]} juniorsStandings - The relative standings of all Juniors-division players.
 * @property {StandingsPlayer[]} seniorsStandings - The relative standings of all Seniors-division players.
 * @property {StandingsPlayer[]} mastersStandings - The relative standings of all Masters-division players.
 * @property {StandingsPlayer[]} allStandings - The relative standings of all players.
 */

/**
 * Parses the TOM ...standings.html file contents into JSON.
 * @param {string} fileContent - The contents of the TOM file.
 * @returns {Standings} The tournament standings.
 */
function parseStandingsFile(fileContent){
    const result = {
        currentRound: 0,
        totalRounds: 0,
        juniorsStandings: [],
        seniorsStandings: [],
        mastersStandings: [],
        allStandings: []
    }
    var el = document.createElement('html');
    el.innerHTML = fileContent;
    for(const table of el.getElementsByClassName('report')){
        const standings = [];
        for(const row of table.querySelectorAll('tr')){
            const cells = row.querySelectorAll('td');
            if(cells.length >= 8){
                const player = {
                    standing: Number(cells[0].innerText),
                    name: cells[1].innerText,
                    flight: Number(cells[2].innerText),
                    dropRound: Number(cells[3].innerText),
                    record: cells[4].innerText,
                    points: Number(cells[5].innerText),
                    opponentsWinPercentage: cells[6].innerText,
                    opponentsOpponentsWinPercentage: cells[7].innerText
                }
                standings.push(player);
            }
        }
        const division = table.previousElementSibling?.innerText;
        if(division){
            if(division.includes('Master')){
                result.mastersStandings = standings;
            }else if(division.includes('Senior')){
                result.seniorsStandings = standings;
            }else if(division.includes('Junior')){
                result.juniorsStandings = standings;
            }else{
                result.allStandings = standings;
            }
        }
        const rounds = el.querySelector('h3')?.innerText;
        if(rounds){
            const split = rounds.match(/\d+/g);
            if(split.length == 2){
                result.currentRound = Number(split[0]);
                result.totalRounds = Number(split[1]);
            }
        }
    }
    el.remove();
    return result;
}