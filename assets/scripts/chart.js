function getBracketWinners(planId) {
    const plans = JSON.parse(localStorage.getItem("tournamentPlans")) || [];
    const plan = plans[planId];
    return (plan && plan.bracketWinners) ? plan.bracketWinners : {};
}
function saveBracketWinners(planId, bracketWinners) {
    const plans = JSON.parse(localStorage.getItem("tournamentPlans")) || [];
    const plan = plans[planId];
    if (!plan) return;
    plan.bracketWinners = bracketWinners;
    plans[planId] = plan;
    localStorage.setItem("tournamentPlans", JSON.stringify(plans));
}

function generateBracket(players, courts = 2, planId = null) {
    // 1. Create first round matches based on number of courts
    const matches = [];
    let i = 0;
    while (i < players.length) {
        const left = players[i++];
        const right = i < players.length ? players[i++] : "BYE";
        matches.push({ left: { name: left }, right: { name: right } });
    }

    // 2. If matches < courts, add BYE matches
    while (matches.length < courts) {
        matches.push({ left: { name: "BYE" }, right: { name: "BYE" } });
    }

    // 3. Build rounds for the bracket (single-sided)
    function buildRounds(matches) {
        const rounds = [];
        let current = matches;
        while (current.length > 1) {
            rounds.push(current);
            const next = [];
            for (let i = 0; i < current.length; i += 2) {
                next.push({
                    left: { name: "" },
                    right: { name: "" }
                });
            }
            current = next;
        }
        if (current.length === 1) rounds.push(current);
        return rounds;
    }

    const rounds = buildRounds(matches);

    // Fill round 1 with player names
    rounds[0] = matches;

    // 4. Render bracket with titles row first
    const wrapperDiv = document.createElement("div");
    wrapperDiv.className = "bracket-outer";

    // Create titles row first
    const titlesDiv = document.createElement("div");
    titlesDiv.className = "bracket-titles";
    rounds.forEach((round, idx) => {
        const titleDiv = document.createElement("div");
        titleDiv.className = "bracket-round-title";
        titleDiv.textContent = (idx === rounds.length - 1) ? "Final" : `Round ${idx + 1}`;
        titlesDiv.appendChild(titleDiv);
    });
    wrapperDiv.appendChild(titlesDiv);

    // Then create bracket container without titles in rounds
    const bracketDiv = document.createElement("div");
    bracketDiv.className = "bracket-container";

    // Store references to player elements for updating
    const playerRefs = [];

    rounds.forEach((round, roundIdx) => {
        const roundDiv = document.createElement("div");
        roundDiv.className = `bracket-round round-${roundIdx + 1}`;

        let matchHeight = 56; // height + margin (40px + 16px)

        round.forEach((match, matchIdx) => {
            const matchDiv = document.createElement("div");
            matchDiv.className = roundIdx === rounds.length - 1 ? "bracket-final-match" : "bracket-match";

            // For rounds after the first, leave names empty
            let leftName = (roundIdx === 0) ? match.left.name : "";
            let rightName = (roundIdx === 0) ? match.right.name : "";

            matchDiv.innerHTML = `
                <div class="bracket-player" data-round="${roundIdx}" data-match="${matchIdx}" data-side="left">${leftName}</div>
                <div class="bracket-vs">vs</div>
                <div class="bracket-player" data-round="${roundIdx}" data-match="${matchIdx}" data-side="right">${rightName}</div>
            `;

            // For rounds after the first, center the match between its two source matches
            if (roundIdx > 0) {
                const matchesPerBlock = Math.pow(2, roundIdx);
                const center = (matchesPerBlock * matchHeight) / 2;
                const top = matchIdx * matchesPerBlock * matchHeight + center - matchHeight / 2;
                matchDiv.style.position = "absolute";
                matchDiv.style.top = `${top}px`;
                matchDiv.style.left = "0";
            }

            // Store references for updating
            if (!playerRefs[roundIdx]) playerRefs[roundIdx] = [];
            playerRefs[roundIdx][matchIdx] = matchDiv;

            roundDiv.appendChild(matchDiv);
        });

        // For rounds after the first, set the roundDiv to relative and height to fit
        if (roundIdx > 0) {
            roundDiv.style.position = "relative";
            roundDiv.style.height = `${round.length * Math.pow(2, roundIdx) * matchHeight}px`;
        }

        bracketDiv.appendChild(roundDiv);
    });

    wrapperDiv.appendChild(bracketDiv);

    let bracketWinners = planId !== null ? getBracketWinners(planId) : {};

    function updateWinner(roundIdx, matchIdx, side, playerName) {
        if (!bracketWinners[roundIdx]) bracketWinners[roundIdx] = {};
        bracketWinners[roundIdx][matchIdx + "-" + side] = playerName;
        if (planId !== null) saveBracketWinners(planId, bracketWinners);
    }
    function clearWinner(roundIdx, matchIdx, side) {
        if (bracketWinners[roundIdx]) {
            delete bracketWinners[roundIdx][matchIdx + "-" + side];
            if (Object.keys(bracketWinners[roundIdx]).length === 0) delete bracketWinners[roundIdx];
            if (planId !== null) saveBracketWinners(planId, bracketWinners);
        }
    }

    function advanceWinner(roundIdx, matchIdx, side, playerName, isToggle = false) {
        if (roundIdx + 1 >= rounds.length) return; // No next round
        const nextMatchIdx = Math.floor(matchIdx / 2);
        const nextSide = (matchIdx % 2 === 0) ? "left" : "right";
        const nextRound = rounds[roundIdx + 1];
        if (!nextRound) return;

        // If toggling off, clear winner in next round
        if (isToggle) {
            nextRound[nextMatchIdx][nextSide].name = "";
            clearWinner(roundIdx + 1, nextMatchIdx, nextSide);
            // Update DOM
            const nextMatchDiv = playerRefs[roundIdx + 1][nextMatchIdx];
            if (nextMatchDiv) {
                const playerDivs = nextMatchDiv.querySelectorAll('.bracket-player');
                if (nextSide === "left") {
                    playerDivs[0].textContent = "";
                } else {
                    playerDivs[1].textContent = "";
                }
            }
            // Also clear recursively in further rounds if this player was advanced
            if (roundIdx + 2 < rounds.length) {
                advanceWinner(roundIdx + 1, nextMatchIdx, nextSide, "", true);
            }
            return;
        }

        // Set winner in next round
        nextRound[nextMatchIdx][nextSide].name = playerName;
        updateWinner(roundIdx + 1, nextMatchIdx, nextSide, playerName);

        // Update DOM
        const nextMatchDiv = playerRefs[roundIdx + 1][nextMatchIdx];
        if (nextMatchDiv) {
            const playerDivs = nextMatchDiv.querySelectorAll('.bracket-player');
            if (nextSide === "left") {
                playerDivs[0].textContent = playerName;
            } else {
                playerDivs[1].textContent = playerName;
            }
        }

        // If the other side is BYE, auto-advance
        const otherSide = nextSide === "left" ? "right" : "left";
        const otherName = nextRound[nextMatchIdx][otherSide].name;
        if (otherName === "BYE" && playerName !== "") {
            advanceWinner(roundIdx + 1, nextMatchIdx, nextSide, playerName);
        }
    }

    // Add click handlers for all rounds except the last
    for (let roundIdx = 0; roundIdx < rounds.length - 1; roundIdx++) {
        const roundPlayers = wrapperDiv.querySelectorAll(`.bracket-round.round-${roundIdx + 1} .bracket-player`);
        roundPlayers.forEach((playerDiv) => {
            playerDiv.style.cursor = "pointer";
            playerDiv.addEventListener("click", function () {
                const matchIdx = parseInt(playerDiv.getAttribute("data-match"), 10);
                const side = playerDiv.getAttribute("data-side");
                const playerName = playerDiv.textContent;
                if (playerName === "BYE" || !playerName) return;

                const nextMatchIdx = Math.floor(matchIdx / 2);
                const nextSide = (matchIdx % 2 === 0) ? "left" : "right";
                const nextRound = rounds[roundIdx + 1];
                let alreadyWinner = false;
                if (
                    nextRound &&
                    nextRound[nextMatchIdx] &&
                    nextRound[nextMatchIdx][nextSide] &&
                    nextRound[nextMatchIdx][nextSide].name === playerName
                ) {
                    alreadyWinner = true;
                }
                if (alreadyWinner) {
                    advanceWinner(roundIdx, matchIdx, side, playerName, true);
                    clearWinner(roundIdx + 1, nextMatchIdx, nextSide);
                } else {
                    advanceWinner(roundIdx, matchIdx, side, playerName);
                    updateWinner(roundIdx + 1, nextMatchIdx, nextSide, playerName);
                }
            });
        });
    }
    

    // Auto-advance BYE players in round 1
    rounds[0].forEach((match, matchIdx) => {
        if (match.left.name === "BYE" && match.right.name !== "BYE") {
            advanceWinner(0, matchIdx, "right", match.right.name);
        }
        if (match.right.name === "BYE" && match.left.name !== "BYE") {
            advanceWinner(0, matchIdx, "left", match.left.name);
        }
    });

    // On load, restore winners from localStorage
    if (planId !== null && bracketWinners) {
        Object.entries(bracketWinners).forEach(([roundIdx, matches]) => {
            Object.entries(matches).forEach(([key, playerName]) => {
                const [matchIdx, side] = key.split("-");
                if (rounds[roundIdx] && rounds[roundIdx][matchIdx]) {
                    rounds[roundIdx][matchIdx][side].name = playerName;
                    const matchDiv = playerRefs[roundIdx][matchIdx];
                    if (matchDiv) {
                        const playerDivs = matchDiv.querySelectorAll('.bracket-player');
                        const playerDiv = side === "left" ? playerDivs[0] : playerDivs[1];
                        playerDiv.textContent = playerName;
                    }
                }
            });
        });
    }

    return wrapperDiv;
}

// On details page, inject bracket
document.addEventListener("DOMContentLoaded", () => {
    if (!document.getElementById("tournament-chart-section")) return;
    const urlParams = new URLSearchParams(window.location.search);
    const planId = parseInt(urlParams.get("planId"), 10);
    const plans = JSON.parse(localStorage.getItem("tournamentPlans")) || [];
    const plan = plans[planId];
    if (!plan) return;
    const chartPlaceholder = document.getElementById("tournament-chart-placeholder");
    if (chartPlaceholder) chartPlaceholder.innerHTML = "";
    // Pass planId to generateBracket for winner persistence
    const bracket = generateBracket(plan.players, plan.fields || 2, planId);
    chartPlaceholder.appendChild(bracket);
});
window.generateBracket = generateBracket;