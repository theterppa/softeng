// Function to get query parameters from the URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Get the plan ID from the URL
const planId = getQueryParam("planId");

// Retrieve the plan data from localStorage
const plans = JSON.parse(localStorage.getItem("tournamentPlans")) || [];
const plan = plans[planId];

// Check if the plan exists
if (!plan) {
    document.getElementById("tournament-output").innerHTML = "<p>Plan not found.</p>";
} else {
    // Generate and display the plan details
    const output = document.getElementById("tournament-output");
    output.innerHTML = `
        <h2>${plan.title}</h2>
        <p>Date: ${plan.date}</p>
        <p>Game Mode: ${plan.gameMode}</p>
        <p>Number of Fields: ${plan.fields}</p>
        <h3>Players:</h3>
        <ul>${plan.players.map(player => `<li>${player}</li>`).join("")}</ul>
        <h3>Tournament Chart:</h3>
        ${generateChart(plan.players, plan.gameMode)}
    `;
}

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

// Back button functionality
document.getElementById("back-button").addEventListener("click", () => {
    window.location.href = "main.html"; // Redirect back to the main page
});