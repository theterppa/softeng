
const dateInput = document.getElementById("date");
const today = new Date().toISOString().split("T")[0];
dateInput.setAttribute("min", today);



// Function to load plans and update the "Own Plan List View"
function loadPlans() {
    const plans = JSON.parse(localStorage.getItem("tournamentPlans")) || [];
    const planList = document.getElementById("own-plan-list");
    planList.innerHTML = ""; // Clear the list

    if (plans.length === 0) {
        // Handle empty state
        planList.innerHTML = `<li class="empty-state">No tournament plans available. Create one using the form above!</li>`;
        return;
    }

    plans.forEach((plan, index) => {
        // Format the date to dd/mm/yyyy
        let formattedDate = plan.date;
        if (plan.date !== "TBA") {
            const dateParts = plan.date.split("-");
            formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
        }

        const missingInfo = getPlanWarnings(plan);

        const li = document.createElement("li");
        li.className = "plan-item";
        li.innerHTML = `
            <div class="plan-details">
                <span class="plan-title">${plan.title}</span>
                <span class="plan-meta">Date: ${formattedDate} | Game Mode: ${plan.gameMode}</span>
            </div>
            ${missingInfo.join(" ")}
        `;

        // Create the delete button
        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-plan-button";
        deleteButton.innerHTML = `<i class="fas fa-trash-alt"></i>`; // Trashcan icon


        // Add click event to delete button
        deleteButton.addEventListener("click", (event) => {
            event.stopPropagation(); // Prevent triggering the parent click event
            if (confirm(`Are you sure you want to delete the plan "${plan.title}"?`)) {
                deletePlan(index);
            }
        });

        // Create the edit button
        const editButton = document.createElement("button");
        editButton.className = "edit-plan-button";
        editButton.innerHTML = `<i class="fas fa-edit"></i>`; // Pen icon

        // Add click event to edit button
        editButton.addEventListener("click", (event) => {
            event.stopPropagation(); // Prevent triggering the parent click event
            editPlan(index);
        });

        // Append the buttons to the list item
        li.appendChild(editButton);
        li.appendChild(deleteButton);
        
        li.addEventListener("click", () => {
            // Redirect to detail view with the plan index
            window.location.href = `pages/details.html?planId=${index}`;
        });
        planList.appendChild(li);
    });
}
//refreshPlans 
window.refreshPlans = loadPlans;

// Function to delete a plan
function deletePlan(index) {
    const plans = JSON.parse(localStorage.getItem("tournamentPlans")) || [];
    plans.splice(index, 1); // Remove the plan at the specified index
    localStorage.setItem("tournamentPlans", JSON.stringify(plans)); // Save updated plans to localStorage
    loadPlans(); // Refresh the "Own Plan List View"
}


// Form submission handler
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
    dateInput.setAttribute("min", today); // Reapply minimum date
});

// Update the edit button to open the modal
function editPlan(index) {
    openEditModal(index);
}

// ==========================
// Initial Setup
// ==========================

// Load plans on page load
document.addEventListener("DOMContentLoaded", loadPlans);