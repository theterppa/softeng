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


    // Generate live preview and print content
    function generateContentHTML(formData) {
        let content = "";
        if (formData.has("includeTitle")) {
            content += `<h1>${document.getElementById("tournament-title").textContent}</h1>`;
        }
        if (formData.has("includeDate")) {
            content += `<p>${document.getElementById("tournament-date").textContent}</p>`;
        }
        if (formData.has("includeChart")) {
            content += `<p>[Tournament Chart Placeholder]</p>`;
        }
        if (formData.has("includePlayerPaymentStatus")) {
            content += `<p>[Player Payment Status Placeholder]</p>`;
        }
        if (formData.has("includeSchedule")) {
            content += `<p>[Schedule Placeholder]</p>`;
        }
        if (formData.has("includePlayerNames")) { // Ensure Player Names are included
        content += `<ul>`;
        document.querySelectorAll("#tournament-players li").forEach((player) => {
            content += `<li>${player.textContent}</li>`;
        });
        content += `</ul>`;
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

        // Generate print preview content
        const contentHTML = generateContentHTML(formData);

        // Close the info selection modal
        closeinfoModal();

        // Show the print preview modal
        previewContent.innerHTML = contentHTML;
        previewModal.classList.add("visible");
        previewModal.setAttribute("aria-hidden", "false");
        previewModal.focus();
    });
    // Handle "Print" button in the preview modal
    printNowBtn.addEventListener("click", () => {
        window.print();
    });

    // Handle "Close" button in the preview modal
    closePreviewBtn.addEventListener("click", () => {
        previewModal.classList.remove("visible");
        previewModal.setAttribute("aria-hidden", "true");
    });
});      