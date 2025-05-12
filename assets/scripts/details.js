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
      // Back to Plans event listener
      document.getElementById("back-button").addEventListener("click", () => {
      window.location.href = "../index.html";
      });
});
