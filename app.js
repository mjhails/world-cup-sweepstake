// ======================================
// HAILS VS PALMERS WORLD CUP SWEEPSTAKE
// SHARED APP FUNCTIONS
// ======================================

let tournamentData = null;

// ----------------------
// Load Data
// ----------------------

async function loadData() {

    const response = await fetch("data.json");

    tournamentData = await response.json();

    return tournamentData;
}

// ----------------------
// Tournament Message
// ----------------------

function getTournamentMessage() {

    if (!tournamentData) return "";

    return tournamentData.tournamentMessage || "";
}

// ----------------------
// Get Player
// ----------------------

function getPlayer(name) {

    if (!tournamentData) return null;

    return tournamentData.players.find(
        player =>
        player.name.toLowerCase() ===
        name.toLowerCase()
    );

}

// ----------------------
// Count Active Teams
// ----------------------

function countActiveTeams(player) {

    return player.teams.filter(team =>
        team.status !== "🔴 Eliminated"
    ).length;

}

// ----------------------
// Team Ranking Value
// ----------------------

function getStatusScore(status) {

    switch(status){

        case "🏆 Champion":
            return 100;

        case "⭐ Finalist":
            return 90;

        case "🟣 Semi Final":
            return 80;

        case "🔵 Quarter Final":
            return 70;

        case "🟠 Last 16":
            return 60;

        case "🟡 Last 32":
            return 50;

        case "🟢 Active":
            return 40;

        default:
            return 0;
    }

}

// ----------------------
// Leaderboard Ranking
// ----------------------

function rankPlayers(players){

    return [...players].sort((a,b)=>{

        const aScore =
        a.teams.reduce((total,team)=>
            total + getStatusScore(team.status),
        0);

        const bScore =
        b.teams.reduce((total,team)=>
            total + getStatusScore(team.status),
        0);

        return bScore - aScore;

    });

}

// ----------------------
// Save Local Admin Data
// ----------------------

function saveLocalTournamentData(){

    localStorage.setItem(
        "hcp_tournament_data",
        JSON.stringify(tournamentData)
    );

}

// ----------------------
// Load Local Admin Data
// ----------------------

function loadLocalTournamentData(){

    const saved =
    localStorage.getItem(
        "hcp_tournament_data"
    );

    if(saved){

        tournamentData =
        JSON.parse(saved);

    }

}

// ----------------------
// Export JSON
// ----------------------

function exportTournamentJSON(){

    const json =
    JSON.stringify(
        tournamentData,
        null,
        2
    );

    return json;

}

// ----------------------
// Download JSON
// ----------------------

function downloadJSON(){

    const json =
    exportTournamentJSON();

    const blob =
    new Blob(
        [json],
        {type:"application/json"}
    );

    const url =
    URL.createObjectURL(blob);

    const a =
    document.createElement("a");

    a.href = url;

    a.download =
    "world-cup-data.json";

    a.click();

    URL.revokeObjectURL(url);

}

// ----------------------
// Profile Photos
// ----------------------

function saveProfilePhoto(
    playerName,
    imageData
){

    localStorage.setItem(
        `photo-${playerName}`,
        imageData
    );

}

function getProfilePhoto(
    playerName
){

    return localStorage.getItem(
        `photo-${playerName}`
    );

}

// ----------------------
// Shuffle Array
// ----------------------

function shuffle(array){

    for(
        let i=array.length-1;
        i>0;
        i--
    ){

        const j =
        Math.floor(
            Math.random() *
            (i+1)
        );

        [array[i],array[j]] =
        [array[j],array[i]];

    }

    return array;

}

// ----------------------
// Generate Draw
// ----------------------

function generateDraw(players, teams){

    players.forEach(player=>{
        player.teams = [];
    });

    const pot1 = [
        "Argentina",
        "France",
        "Brazil",
        "Spain",
        "England",
        "Portugal",
        "Germany",
        "Netherlands",
        "Belgium",
        "Croatia",
        "Uruguay",
        "Morocco"
    ];

    const pot2 = [
        "USA",
        "Mexico",
        "Japan",
        "Switzerland",
        "Colombia",
        "Senegal",
        "South Korea",
        "Ecuador",
        "Norway",
        "Sweden",
        "Paraguay",
        "Türkiye"
    ];

    const pot3 = [
        "Canada",
        "Austria",
        "Ghana",
        "Egypt",
        "Algeria",
        "Tunisia",
        "Côte d'Ivoire",
        "Panama",
        "Scotland",
        "Australia",
        "Qatar",
        "Saudi Arabia"
    ];

    const pot4 = [
        "Bosnia & Herzegovina",
        "Cape Verde",
        "Curaçao",
        "Czechia",
        "DR Congo",
        "Haiti",
        "Iran",
        "Iraq",
        "Jordan",
        "New Zealand",
        "South Africa",
        "Uzbekistan"
    ];

    const pots = [
        pot1,
        pot2,
        pot3,
        pot4
    ];

    pots.forEach(pot=>{

        const potTeams =
        shuffle(
            teams.filter(team=>
                pot.includes(team.name)
            )
        );

        for(
            let i=0;
            i<players.length;
            i++
        ){

            if(i < potTeams.length){

                players[i].teams.push(
                    potTeams[i]
                );

            }

        }

        const leftovers =
        potTeams.slice(
            players.length
        );

        leftovers.forEach(team=>{

            const randomPlayer =
            players[
                Math.floor(
                    Math.random() *
                    players.length
                )
            ];

            randomPlayer.teams.push(team);

        });

    });

    return players;

}