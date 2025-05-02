// Function to get query parameters from the URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
  // Get the plan ID from the URL
  const planId = getQueryParam("planId");

  // Retrieve the plan data from localStorage
  const plans = JSON.parse(localStorage.getItem("tournamentPlans")) || [];
  const plan = plans[planId];

  // Check if the plan exists
  if (!plan) {
    // Handle empty state
    document.getElementById("tournament-title").textContent = "No Tournament Selected";
    document.getElementById("tournament-date").innerHTML = `<span class="missing-info">Date: N/A</span>`;
    document.getElementById("tournament-game-mode").innerHTML = `<span class="missing-info">Game Mode: N/A</span>`;
    document.getElementById("tournament-players").innerHTML = `<li class="missing-info">No players available.</li>`;
  } else {
    // Populate the tournament details
    document.getElementById("tournament-title").textContent = plan.title || "Tournament Title";

    // Handle missing date
    const dateElement = document.getElementById("tournament-date");
    if (plan.date != "TBA") {
      dateElement.textContent = `Date: ${plan.date}`;
    } else {
      dateElement.innerHTML = `Date: TBA <span class="missing-info">!<span class="tooltip">Date is missing</span></span>`;
    }

    // Handle missing game mode
    const gameModeElement = document.getElementById("tournament-game-mode");
    if (plan.gameMode) {
      gameModeElement.textContent = `Game Mode: ${plan.gameMode}`;
    } else {
      gameModeElement.innerHTML = `Game Mode: Missing <span class="missing-info">!<span class="tooltip">Game mode is missing</span></span>`;
    }

    // Populate the players list
    const playersList = document.getElementById("tournament-players");
    if (plan.players && plan.players.length > 0) {
      plan.players.forEach((player, index) => {
        const listItem = document.createElement("li");
        if (player != `Player ${index + 1}`) {
          listItem.textContent = player;
        } else {
          listItem.innerHTML = `Player ${index + 1} <span class="missing-info">!<span class="tooltip">Name is missing</span></span>`;
        }
        playersList.appendChild(listItem);
      });
    } else {
      const listItem = document.createElement("li");
      listItem.className = "missing-info";
      listItem.textContent = "No players available.";
      playersList.appendChild(listItem);
    }
  }
});