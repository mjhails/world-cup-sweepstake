// ======================================
// HAILS VS PALMERS WORLD CUP SWEEPSTAKE
// SHARED APP FUNCTIONS
// ======================================

// ----------------------
// Firebase Setup
// ----------------------

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBmVb4vdoCJQg5uFC-yGogjKZzIsdhWZRY",
  authDomain: "world-cup-sweepstake-202-d2993.firebaseapp.com",
  projectId: "world-cup-sweepstake-202-d2993",
  storageBucket: "world-cup-sweepstake-202-d2993.firebasestorage.app",
  messagingSenderId: "417434337725",
  appId: "1:417434337725:web:7728561dc86974fee152d4",
  measurementId: "G-1YZKQ5ZT64"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

let tournamentData = null;

// ----------------------
// Load Data (Firebase first, fallback to data.json)
// ----------------------

async function loadData() {

    try {

        const docRef = doc(db, "tournament", "data");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {

            tournamentData = docSnap.data();
            return tournamentData;

        }

    } catch (error) {

        console.log("Firebase unavailable, falling back to data.json", error);

    }

    const response = await fetch("data.json");
    tournamentData = await response.json();
    return tournamentData;

}

// ----------------------
// Save Data to Firebase
// ----------------------

async function saveToFirebase() {

    if (!tournamentData) return;

    const docRef = doc(db, "tournament", "data");
    await setDoc(docRef, tournamentData);

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

        case "🏆 Champion":     return 100;
        case "⭐ Finalist":     return 90;
        case "🟣 Semi Final":   return 80;
        case "🔵 Quarter Final": return 70;
        case "🟠 Last 16":      return 60;
        case "🟡 Last 32":      return 50;
        case "🟢 Active":       return 40;
        default:                return 0;

    }

}

// ----------------------
// Leaderboard Ranking
// ----------------------

function rankPlayers(players){

    return [...players].sort((a,b)=>{

        const aScore = a.teams.reduce((total,team) =>
            total + getStatusScore(team.status), 0);

        const bScore = b.teams.reduce((total,team) =>
            total + getStatusScore(team.status), 0);

        return bScore - aScore;

    });

}

// ----------------------
// Save Local Admin Data (kept as backup)
// ----------------------

function saveLocalTournamentData(){

    localStorage.setItem(
        "hcp_tournament_data",
        JSON.stringify(tournamentData)
    );

}

// ----------------------
// Load Local Admin Data (kept as backup)
// ----------------------

function loadLocalTournamentData(){

    const saved = localStorage.getItem("hcp_tournament_data");

    if(saved){
        tournamentData = JSON.parse(saved);
    }

}

// ----------------------
// Export JSON
// ----------------------

function exportTournamentJSON(){

    return JSON.stringify(tournamentData, null, 2);

}

// ----------------------
// Download JSON
// ----------------------

function downloadJSON(){

    const json = exportTournamentJSON();
    const blob = new Blob([json], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "world-cup-data.json";
    a.click();
    URL.revokeObjectURL(url);

}

// ----------------------
// Profile Photos
// ----------------------

function saveProfilePhoto(playerName, imageData){
    localStorage.setItem(`photo-${playerName}`, imageData);
}

function getProfilePhoto(playerName){
    return localStorage.getItem(`photo-${playerName}`);
}

// ----------------------
// Shuffle Array
// ----------------------

function shuffle(array){

    for(let i=array.length-1; i>0; i--){

        const j = Math.floor(Math.random() * (i+1));
        [array[i],array[j]] = [array[j],array[i]];

    }

    return array;

}

// ----------------------
// Generate Draw
// ----------------------

function generateDraw(players, teams){

    players.forEach(player=>{ player.teams = []; });

    const pot1 = ["Argentina","France","Brazil","Spain","England","Portugal","Germany","Netherlands","Belgium","Croatia","Uruguay","Morocco"];
    const pot2 = ["USA","Mexico","Japan","Switzerland","Colombia","Senegal","South Korea","Ecuador","Norway","Sweden","Paraguay","Türkiye"];
    const pot3 = ["Canada","Austria","Ghana","Egypt","Algeria","Tunisia","Côte d'Ivoire","Panama","Scotland","Australia","Qatar","Saudi Arabia"];
    const pot4 = ["Bosnia & Herzegovina","Cape Verde","Curaçao","Czechia","DR Congo","Haiti","Iran","Iraq","Jordan","New Zealand","South Africa","Uzbekistan"];

    const pots = [pot1, pot2, pot3, pot4];

    pots.forEach(pot=>{

        const potTeams = shuffle(teams.filter(team => pot.includes(team.name)));

        for(let i=0; i<players.length; i++){
            if(i < potTeams.length){
                players[i].teams.push(potTeams[i]);
            }
        }

        const leftovers = potTeams.slice(players.length);

        leftovers.forEach(team=>{
            const randomPlayer = players[Math.floor(Math.random() * players.length)];
            randomPlayer.teams.push(team);
        });

    });

    return players;

}
