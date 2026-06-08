function findTeams() {

    const player =
    document.getElementById("playerName").value;

    alert("Button clicked: " + player);

    if(player === ""){
        alert("Please enter your name");
        return;
    }

    window.location =
    `teams.html?player=${player}`;

}