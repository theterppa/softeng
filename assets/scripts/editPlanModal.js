// Get modal elements
const modal = document.getElementById("edit-modal");
const closeButton = document.querySelector(".close-button");
const editForm = document.getElementById("edit-form");

// Function to open the modal and populate it with plan details
function openEditModal(index) {
    const plans = JSON.parse(localStorage.getItem("tournamentPlans")) || [];
    const plan = plans[index];

    // Populate modal form fields
    document.getElementById("edit-title").value = plan.title;
    document.getElementById("edit-date").value = plan.date === "TBA" ? "" : plan.date;
    document.getElementById("edit-game-mode").value = plan.gameMode;
    document.getElementById("edit-fields").value = plan.fields;
    document.getElementById("edit-players").value = plan.players.join("\n");

    // Store the index of the plan being edited
    editForm.setAttribute("data-edit-index", index);

    // Show the modal
    modal.style.display = "block";
}

// Function to close the modal
function closeModal() {
    modal.style.display = "none";
}
// Save changes when the edit form is submitted
editForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    const index = editForm.getAttribute("data-edit-index");
    const plans = JSON.parse(localStorage.getItem("tournamentPlans")) || [];

    // Get updated values from the modal form
    const title = document.getElementById("edit-title").value;
    const date = document.getElementById("edit-date").value || "TBA";
    const gameMode = document.getElementById("edit-game-mode").value;
    const fields = parseInt(document.getElementById("edit-fields").value, 10);
    const playersInput = document.getElementById("edit-players").value.trim();

    // Generate players list based on the updated number of fields
    let players = playersInput ? playersInput.split("\n") : [];
    const totalPlayers = fields * 2; // 2 players per field
    while (players.length < totalPlayers) {
        players.push(`Player ${players.length + 1}`); // Add mockup players
    }
    if (players.length > totalPlayers) {
        players = players.slice(0, totalPlayers); // Trim excess players
    }

    // Update the plan with new values
    plans[index] = {
        title,
        date,
        gameMode,
        fields,
        players,
    };

    // Save updated plans to localStorage
    localStorage.setItem("tournamentPlans", JSON.stringify(plans));

  
   // Optionally: call a callback to refresh the view
    window.location.reload();
});

// Close the modal when the close button is clicked
closeButton.addEventListener("click", closeModal);

// Close the modal when clicking outside the modal content
window.addEventListener("click", function (event) {
    if (event.target === modal) {
        closeModal();
    }
});