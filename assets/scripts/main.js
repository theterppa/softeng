// Initialize test plans in localStorage
if (!localStorage.getItem("tournamentPlans")) {
    const testPlans = [
        {
            title: "Test Tournament 1",
            date: "2025-05-01",
            gameMode: "cup",
            fields: 2,
            players: ["Alice", "Bob", "Charlie", "Dave"]
        },
  
        {
            title: "Incomplete Tournament",
            date: "TBA",
            gameMode: "cup",
            fields: 1,
            players: [] // Missing player names
        }
    ];
    localStorage.setItem("tournamentPlans", JSON.stringify(testPlans));
}
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

     // Validate inputs
     if (!title || !gameMode || fields <= 0) {
        alert("Please fill out all required fields correctly.");
        return;
    }

    // Generate players list
    let players = playersInput ? playersInput.split("\n") : [];
    const totalPlayers = fields * 2; // 2 players per field
    while (players.length < totalPlayers) {
        players.push(`Player ${players.length + 1}`); // Add mockup players
    }
    // Create a new tournament plan object
    const newPlan = {
        title,
        date,
        gameMode,
        fields,
        players
    };
    // Save the new plan to localStorage
    const existingPlans = JSON.parse(localStorage.getItem("tournamentPlans")) || [];
    existingPlans.push(newPlan);
    localStorage.setItem("tournamentPlans", JSON.stringify(existingPlans));

    // Update the "Own Plan List View"
    loadPlans();

    // Clear the form
    document.getElementById("tournament-form").reset();
    dateInput.setAttribute("min", today); //reapply minimun date

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


function loadPlans() {
    const plans = JSON.parse(localStorage.getItem("tournamentPlans")) || [];
    const planList = document.getElementById("own-plan-list");
    planList.innerHTML = ""; // Clear the list

    plans.forEach((plan, index) => {
        const li = document.createElement("li");
        li.className = "plan-item";
        li.innerHTML = `
            <div class="plan-details">
                <span class="plan-title">${plan.title}</span>
                <span class="plan-meta">Date: ${plan.date} | Game Mode: ${plan.gameMode}</span>
            </div>
            ${!plan.players.length ? '<span class="missing-info">Missing Player Names</span>' : ''}
        `;
        li.addEventListener("click", () => {
            // Redirect to detail view with the plan index
            window.location.href = `../details/details.html?planId=${index}`;
        });
        planList.appendChild(li);
    });
}


function resetTestPlans() {
    const testPlans = [
        {
            title: "Test Tournament 1",
            date: "2025-05-01",
            gameMode: "cup",
            fields: 2,
            players: ["Alice", "Bob", "Charlie", "Dave"]
        },
        {
            title: "Test Tournament 2",
            date: "2025-05-10",
            gameMode: "pool",
            fields: 3,
            players: ["Eve", "Frank", "Grace", "Heidi", "Ivan", "Judy"]
        },
        {
            title: "Incomplete Tournament",
            date: "TBA",
            gameMode: "cup",
            fields: 1,
            players: [] // Missing player names
        }
    ];
    localStorage.setItem("tournamentPlans", JSON.stringify(testPlans));
    loadPlans();
}

//To reset the test plans when the button is clicked
//This function will be called when the button is clicked
document.getElementById("reset-plans-button").addEventListener("click", function () {
    if (confirm("Are you sure you want to reset the plans? This will overwrite all current plans.")) {
        resetTestPlans();
        alert("Test plans have been reset.");
    }
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

// Load plans on page load
document.addEventListener("DOMContentLoaded", loadPlans);