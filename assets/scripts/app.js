document.addEventListener('DOMContentLoaded', function() {
  // Check if the user is logged in
  if (localStorage.getItem("isLoggedIn") !== "true") {
    // Redirect to login page if not logged in
    window.location.href = "../login/login.html";
    return;
}
    // Select all matches
    const matches = document.querySelectorAll('.match');
    
    // Add click event to each match
    matches.forEach(match => {
      match.addEventListener('click', function() {
        const matchNumber = this.getAttribute('data-match');
        const team1 = this.querySelectorAll('.team-name')[0].textContent;
        const team2 = this.querySelectorAll('.team-name')[1].textContent;
        
        // Skip if this is a TBD match in semifinals or final
        if (team1 === 'TBD' || team2 === 'TBD') return;
        
        // Ask for winner
        const winner = prompt(`Who won match ${matchNumber}? ${team1} vs ${team2}`, team1);
        
        if (winner && (winner === team1 || winner === team2)) {
          // Update next match if applicable
          updateNextMatch(matchNumber, winner);
          
          // If this is the final match, update champion
          if (matchNumber === '7') {
            document.querySelector('.winner-placeholder').textContent = winner;
          }
          
          // Visual feedback
          this.style.background = '#2a4a7a';
          this.querySelectorAll('.team-name').forEach(team => {
            if (team.textContent === winner) {
              team.style.color = '#f9c74f';
              team.innerHTML = `<i class="fas fa-crown"></i> ${winner}`;
            }
          });
        }
      });
    });
    
    // Function to update next match
    function updateNextMatch(currentMatch, winner) {
      let nextMatch, slot;
      
      switch(currentMatch) {
        case '1':
        case '2':
          nextMatch = '5';
          slot = currentMatch === '1' ? 0 : 1;
          break;
        case '3':
        case '4':
          nextMatch = '6';
          slot = currentMatch === '3' ? 0 : 1;
          break;
        case '5':
        case '6':
          nextMatch = '7';
          slot = currentMatch === '5' ? 0 : 1;
          break;
        default:
          return;
      }
      
      const nextMatchElement = document.querySelector(`.match[data-match="${nextMatch}"]`);
      if (nextMatchElement) {
        const teams = nextMatchElement.querySelectorAll('.team-name');
        teams[slot].textContent = winner;
      }
    }
    
    // Add animation to trophy on hover
    const trophy = document.querySelector('.trophy-icon img');
    trophy.addEventListener('mouseover', function() {
      this.style.transform = 'scale(1.1)';
      this.style.transition = 'transform 0.3s ease';
    });
    
    trophy.addEventListener('mouseout', function() {
      this.style.transform = 'scale(1)';
    });
  });