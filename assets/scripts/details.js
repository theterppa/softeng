document.addEventListener("DOMContentLoaded", () => {
    // Get planId from URL
    const urlParams = new URLSearchParams(window.location.search);
    const planId = parseInt(urlParams.get("planId"), 10);

    // Load plans from localStorage
    const plans = JSON.parse(localStorage.getItem("tournamentPlans")) || [];
    const plan = plans[planId];

    if (!plan) {
        alert("Tournament plan not found.");
        window.location.href = "../index.html";
        return;
    }

    // show the information of the tournament
    document.getElementById("tournament-title").textContent = plan.title;
    document.getElementById("tournament-date").textContent = `Date: ${plan.date}`;
    document.getElementById("tournament-player-count").textContent = `Players: ${plan.players.length}`;
    document.getElementById("tournament-game-mode").textContent = `Game Mode: ${plan.gameMode}`;
    document.getElementById("detail-missing-info").innerHTML = getPlanWarnings(plan).join(" ");

    // Refresh plans function for the editing modal
    window.refreshPlans = function() {

    // Reload the plan from localStorage and update the view
    const plans = JSON.parse(localStorage.getItem("tournamentPlans")) || [];
    const plan = plans[planId];
    //Update tournament info
    document.getElementById("tournament-title").textContent = plan.title;
    document.getElementById("tournament-date").textContent = `Date: ${plan.date}`;
    document.getElementById("tournament-player-count").textContent = `Players: ${plan.players.length}`;
    document.getElementById("tournament-game-mode").textContent = `Game Mode: ${plan.gameMode}`;
    
    //Update warning labels
    document.getElementById("detail-missing-info").innerHTML = getPlanWarnings(plan).join(" ");

    // Add paymentStatus array to plan if not present
    if (!plan.paymentStatus || plan.paymentStatus.length !== plan.players.length) {
        plan.paymentStatus = Array(plan.players.length).fill("Unpaid");
        // Save back to localStorage
        plans[planId] = plan;
        localStorage.setItem("tournamentPlans", JSON.stringify(plans));
    }

    // Render player list
    const tbody = document.querySelector("#player-payment-table tbody");
    tbody.innerHTML = "";
    plan.players.forEach((player, idx) => {
        const tr = document.createElement("tr");

        // Player name cell
        const nameTd = document.createElement("td");
        nameTd.textContent = player;
        tr.appendChild(nameTd);

        // Payment status label cell
        const statusTd = document.createElement("td");
        const statusLabel = document.createElement("span");
        statusLabel.textContent = plan.paymentStatus[idx];
        statusLabel.className = plan.paymentStatus[idx] === "Paid" ? "paid-label" : "unpaid-label";
        statusTd.appendChild(statusLabel);
        tr.appendChild(statusTd);

        // Actions cell
        const actionsTd = document.createElement("td");
        const paidBtn = document.createElement("button");
        paidBtn.textContent = "Paid";
        paidBtn.className = "paid-btn";
        paidBtn.addEventListener("click", () => {
            plan.paymentStatus[idx] = "Paid";
            updateStatus();
        });

        const unpaidBtn = document.createElement("button");
        unpaidBtn.textContent = "Unpaid";
        unpaidBtn.className = "unpaid-btn";
        unpaidBtn.addEventListener("click", () => {
            plan.paymentStatus[idx] = "Unpaid";
            updateStatus();
        });

        actionsTd.appendChild(paidBtn);
        actionsTd.appendChild(unpaidBtn);
        tr.appendChild(actionsTd);

        tbody.appendChild(tr);

        function updateStatus() {
            statusLabel.textContent = plan.paymentStatus[idx];
            statusLabel.className = plan.paymentStatus[idx] === "Paid" ? "paid-label" : "unpaid-label";
            // Save to localStorage
            plans[planId] = plan;
            localStorage.setItem("tournamentPlans", JSON.stringify(plans));
        }
    });
  }
      document.getElementById("edit-tournament-btn").addEventListener("click", () => {
        openEditModal(planId);
      });
      // Back to Plans event listener
      document.getElementById("back-button").addEventListener("click", () => {
        window.location.href = "../index.html";
      });
});
