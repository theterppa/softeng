function getPlanWarnings(plan) {
    const warnings = [];
    if (!plan.players.length || plan.players.some(player => player.startsWith("Player"))) {
        warnings.push('<span class="missing-info"><i class="fas fa-exclamation-circle"></i> Missing Players</span>');
    }
    if (!plan.date || plan.date === "TBA") {
        warnings.push('<span class="missing-info"><i class="fas fa-exclamation-circle"></i> Missing Date</span>');
    }
    return warnings;
}