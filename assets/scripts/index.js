
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

        // Check for missing information
        const missingInfo = [];
        if (!plan.players.length || plan.players.some(player => player.startsWith("Player"))) {
            missingInfo.push(`<span class="missing-info"><i class="fas fa-exclamation-circle"></i> Missing Players</span>`);
        }
        if (plan.date === "TBA") {
            missingInfo.push(`<span class="missing-info"><i class="fas fa-exclamation-circle"></i> Missing Date</span>`);
        }

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

// Function to delete a plan
function deletePlan(index) {
    const plans = JSON.parse(localStorage.getItem("tournamentPlans")) || [];
    plans.splice(index, 1); // Remove the plan at the specified index
    localStorage.setItem("tournamentPlans", JSON.stringify(plans)); // Save updated plans to localStorage
    loadPlans(); // Refresh the "Own Plan List View"
}

// Function to edit a plan
function editPlan(index) {
    const plans = JSON.parse(localStorage.getItem("tournamentPlans")) || [];
    const plan = plans[index];

    // Populate the form with the plan's information
    document.getElementById("title").value = plan.title;
    document.getElementById("date").value = plan.date === "TBA" ? "" : plan.date;
    document.getElementById("game-mode").value = plan.gameMode;
    document.getElementById("fields").value = plan.fields;
    document.getElementById("players").value = plan.players.join("\n");

    // Add a temporary attribute to track the plan being edited
    document.getElementById("tournament-form").setAttribute("data-edit-index", index);
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

    // Refresh the plan list and close the modal
    loadPlans();
    closeModal();
});

// Close the modal when the close button is clicked
closeButton.addEventListener("click", closeModal);

// Close the modal when clicking outside the modal content
window.addEventListener("click", function (event) {
    if (event.target === modal) {
        closeModal();
    }
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


document.addEventListener("DOMContentLoaded", function () {
    // 检查登录状态
    const userData = localStorage.getItem("currentUser");
    if (!userData) {
        window.location.href = "pages/login.html";
        return;
    }

    const currentUser = JSON.parse(userData);

    // 获取DOM元素
    const userInfoBtn = document.getElementById("userInfoBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const modal = document.getElementById("userInfoModal");
    const span = document.getElementsByClassName("close")[0];
    const userInfoContent = document.getElementById("userInfoContent");

    // 显示用户信息
    function showUserInfo() {
        userInfoContent.innerHTML = `
            <p><strong>UserName:</strong> ${currentUser.username}</p>
            <p><strong>Team:</strong> ${currentUser.id}</p>
            <p><strong>Role:</strong> ${currentUser.role}</p>
            <p><strong>Email:</strong> ${currentUser.email}</p>
            <p><strong>LoginTime:</strong> ${new Date(currentUser.loginTime).toLocaleString()}</p>
        `;
        modal.style.display = "block";
    }

    // 点击用户信息按钮
    userInfoBtn.addEventListener("click", showUserInfo);

    // 点击关闭按钮
    span.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // 点击模态框外部关闭
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // // 登出功能
    // logoutBtn.addEventListener("click", function() {
    //     localStorage.removeItem("currentUser");
    //     window.location.href = "pages/login.html";
    // });
});