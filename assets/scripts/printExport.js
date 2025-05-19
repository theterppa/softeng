document.addEventListener("DOMContentLoaded", () => {
    // Cache DOM references
    const infoModal = document.getElementById("info-selection-modal"); 
    const previewModal = document.getElementById("print-preview-modal"); 
    const cancelBtn = document.getElementById("cancel-print-export");
    const confirmBtn = document.getElementById("confirm-print-export");
    const printNowBtn = document.getElementById("print-now-btn");
    const closePreviewBtn = document.getElementById("close-preview-btn");
    const form = document.getElementById("print-options-form");
    const previewContent = document.getElementById("print-preview-content");
    const selectAllLink = document.getElementById("select-all");
    const clearAllLink = document.getElementById("clear-all");

    const PREFERENCES_KEY = "printExportPreferences";
    // Open the info selection modal
    document.getElementById("print-export-btn").addEventListener("click", () => {
        console.log("Print & PDF button clicked");
        loadPreferences();
        infoModal.classList.add("visible"); 
        infoModal.setAttribute("aria-hidden", "false");
        infoModal.focus();
    });

    // Close the info selection modal
    cancelBtn.addEventListener("click", closeinfoModal);
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && infoModal.classList.contains("visible")) {
            closeinfoModal();
        }
    });

    function closeinfoModal() {
        infoModal.classList.remove("visible");
        infoModal.setAttribute("aria-hidden", "true");
    }

    // Handle "Select All" and "Clear All" links
    selectAllLink.addEventListener("click", (e) => {
        e.preventDefault();
        toggleCheckboxes(true);
    });

    clearAllLink.addEventListener("click", (e) => {
        e.preventDefault();
        toggleCheckboxes(false);
    });

    function toggleCheckboxes(state) {
        form.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
            checkbox.checked = state;
        });
        savePreferences();
        generateLivePreview();
    }

    // Event delegation for checkboxes
    form.addEventListener("change", (e) => {
        if (e.target.type === "checkbox") {
            savePreferences();
            generateLivePreview();
        }
    });

    function savePreferences() {
        const preferences = {};
        form.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
            preferences[checkbox.name] = checkbox.checked;
        });
        localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
    }

    // Load preferences from localStorage
    function loadPreferences() {
        const savedPreferences = JSON.parse(localStorage.getItem(PREFERENCES_KEY));
        if (savedPreferences) {
            form.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
                checkbox.checked = !!savedPreferences[checkbox.name]; // Default to false if not found
            });
            generateLivePreview();
        }
    }


    function generateContentHTML(formData) {
    const urlParams = new URLSearchParams(window.location.search);
    const planId = parseInt(urlParams.get("planId"), 10);
    const plans = JSON.parse(localStorage.getItem("tournamentPlans")) || [];
    const plan = plans[planId];

    let content = "";

    if (!plan) {
        return "<p>Plan not found.</p>";
    }

    // Title
    if (formData.has("includeTitle")) {
        content += `<h1>${plan.title}</h1>`;
    }

    // Meta info (date, player count, game mode)
    let meta = [];
    if (formData.has("includeDate")) meta.push(`Date: ${plan.date}`);
    if (formData.has("includePlayerCount")) meta.push(`Players: ${plan.players.length}`);
    if (formData.has("includeGameMode")) meta.push(`Game Mode: ${plan.gameMode}`);
    if (meta.length) content += `<div style="margin-bottom:1em;"><strong>${meta.join(" | ")}</strong></div>`;

    // Warning labels (optional)
    if (formData.has("includeWarnings") && typeof getPlanWarnings === "function") {
        content += getPlanWarnings(plan).join(" ");
    }

    // Tournament chart
    if (formData.has("includeChart")) {
        if (window.generateBracket && typeof window.generateBracket === "function") {
            const bracketNode = window.generateBracket(plan.players, plan.fields || 2, planId);
            const tempDiv = document.createElement("div");
            tempDiv.appendChild(bracketNode);
            content += tempDiv.innerHTML;
        } else {
            content += `<div id="print-chart">[Tournament Chart Not Available]</div>`;
        }
    }

    // Player/payment table
    if (formData.has("includePlayerPaymentStatus")) {
        content += `<h3>Players & Payment Status</h3>
        <table style="width:100%;border-collapse:collapse;border:1px solid #000;">
            <thead>
                <tr>
                    <th style="border:1px solid #000;">Player</th>
                    <th style="border:1px solid #000;">Status</th>
                </tr>
            </thead>
            <tbody>`;
        plan.players.forEach((player, idx) => {
            const status = plan.paymentStatus && plan.paymentStatus[idx] ? plan.paymentStatus[idx] : "Unpaid";
            content += `<tr>
                <td style="border:1px solid #000;">${player}</td>
                <td style="border:1px solid #000;">${status}</td>
            </tr>`;
        });
        content += `</tbody></table>`;
    }

    // Player names
    if (formData.has("includePlayerNames")) {
        content += `<h3>Players</h3><ul>`;
        plan.players.forEach(player => {
            content += `<li>${player}</li>`;
        });
        content += `</ul>`;
    }

    // Schedule (if you have it)
    if (formData.has("includeSchedule")) {
        content += `<div>[Schedule Placeholder]</div>`;
    }

    return content;
    }

    function generateLivePreview() {
        const formData = new FormData(form);
        const preview = document.getElementById("live-preview");
        preview.innerHTML = generateContentHTML(formData);
    }

    // Confirm Print (open print preview modal)
    confirmBtn.addEventListener("click", () => {
        const formData = new FormData(form);

        // Guard against no selections
        if (
            !formData.has("includeTitle") &&
            !formData.has("includeDate") &&
            !formData.has("includeChart") &&
            !formData.has("includePlayerPaymentStatus") &&
            !formData.has("includePlayerNames") &&
            !formData.has("includeSchedule")
        ) {
            alert("Choose at least one item to print.");
            return;
        }

        // Update the live preview with the latest content
        generateLivePreview();
    
        window.print();
    });


});      