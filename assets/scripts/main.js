// Set the minimum date to today
const dateInput = document.getElementById("date");
const today = new Date().toISOString().split("T")[0];
dateInput.setAttribute("min", today);

document.getElementById("tournament-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    // Get form values
    const title = document.getElementById("title").value;
    const date = document.getElementById("date").value || "TBA";
    const gameMode = document.getElementById("game-mode").value;
    const fields = parseInt(document.getElementById("fields").value, 10);
    const playersInput = document.getElementById("players").value.trim();

    // Generate players list
    let players = playersInput ? playersInput.split("\n") : [];
    const totalPlayers = fields * 2; // 2 players per field
    while (players.length < totalPlayers) {
        players.push(`Player ${players.length + 1}`); // Add mockup players
    }

    // Generate tournament chart
    const output = document.getElementById("tournament-output");
    output.innerHTML = `
        <h2>${title}</h2>
        <p>Date: ${date}</p>
        <p>Game Mode: ${gameMode}</p>
        <p>Number of Fields: ${fields}</p>
        <h3>Players:</h3>
        <ul>${players.map(player => `<li>${player}</li>`).join("")}</ul>
        <h3>Tournament Chart:</h3>
        ${generateChart(players, gameMode)}
    `;
});

// Function to generate a simple tournament chart
function generateChart(players, gameMode) {
    if (gameMode === "cup") {
        let chart = "<ul>";
        for (let i = 0; i < players.length; i += 2) {
            chart += `<li>${players[i]} vs ${players[i + 1]}</li>`;
        }
        chart += "</ul>";
        return chart;
    } else if (gameMode === "pool") {
        let chart = "<ul>";
        for (let i = 0; i < players.length; i++) {
            chart += `<li>${players[i]}</li>`;
        }
        chart += "</ul>";
        return chart;
    }
    return "<p>No chart available for this game mode.</p>";
}