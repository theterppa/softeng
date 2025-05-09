// Function to get query parameters from the URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Function to calculate tournament brackets
function calculateTournamentBrackets(players) {
  const numPlayers = players.length;
  const isOdd = numPlayers % 2 !== 0;
  const brackets = {
    round1: [],
    round2: [],
    final: []
  };

  // Handle odd number of players
  if (isOdd) {
    // First round: all players except one
    const firstRoundPlayers = [...players];
    const byePlayer = firstRoundPlayers.pop();
    brackets.round1 = firstRoundPlayers;
    brackets.round2 = [byePlayer];
  } else {
    brackets.round1 = players;
  }

  return brackets;
}

// Function to create tournament bracket chart
function createTournamentBracketChart(plan) {
  const ctx = document.getElementById('tournamentBracketChart').getContext('2d');
  const brackets = calculateTournamentBrackets(plan.players);
  const isOdd = plan.players.length % 2 !== 0;
  
  const data = {
    labels: ['Round 1', 'Round 2', 'Final'],
    datasets: [{
      label: 'Number of Players',
      data: [
        brackets.round1.length,
        brackets.round2.length,
        brackets.final.length
      ],
      backgroundColor: [
        'rgba(249, 199, 79, 0.7)',
        'rgba(41, 81, 163, 0.7)',
        'rgba(40, 167, 69, 0.7)'
      ],
      borderColor: [
        'rgba(249, 199, 79, 1)',
        'rgba(41, 81, 163, 1)',
        'rgba(40, 167, 69, 1)'
      ],
      borderWidth: 1
    }]
  };

  new Chart(ctx, {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#ffffff'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        },
        x: {
          ticks: {
            color: '#ffffff'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: '#ffffff'
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.dataset.label || '';
              const value = context.raw;
              const round = context.label;
              let extraInfo = '';
              
              if (isOdd && round === 'Round 2') {
                extraInfo = ' (including bye player)';
              }
              
              return `${label}: ${value}${extraInfo}`;
            }
          }
        }
      }
    }
  });
}

// Function to update payment status
function updatePaymentStatus(planId, playerIndex, status) {
  const plans = JSON.parse(localStorage.getItem("tournamentPlans")) || [];
  if (!plans[planId] || !plans[planId].players[playerIndex]) return;

  // Initialize paymentStatus array if it doesn't exist
  if (!plans[planId].paymentStatus) {
    plans[planId].paymentStatus = new Array(plans[planId].players.length).fill('unpaid');
  }

  plans[planId].paymentStatus[playerIndex] = status;
  localStorage.setItem("tournamentPlans", JSON.stringify(plans));
  
  // Refresh the display
  displayPlayers(planId, plans[planId]);
  createPaymentStatusChart(plans[planId]);
}

// Function to create payment status chart
function createPaymentStatusChart(plan) {
  const ctx = document.getElementById('paymentStatusChart').getContext('2d');
  const paymentStatus = plan.paymentStatus || new Array(plan.players.length).fill('unpaid');
  
  const statusCounts = {
    paid: paymentStatus.filter(status => status === 'paid').length,
    pending: paymentStatus.filter(status => status === 'pending').length,
    unpaid: paymentStatus.filter(status => status === 'unpaid').length
  };
  
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Paid', 'Pending', 'Unpaid'],
      datasets: [{
        data: [statusCounts.paid, statusCounts.pending, statusCounts.unpaid],
        backgroundColor: [
          'rgba(40, 167, 69, 0.7)',
          'rgba(255, 193, 7, 0.7)',
          'rgba(220, 53, 69, 0.7)'
        ],
        borderColor: [
          'rgba(40, 167, 69, 1)',
          'rgba(255, 193, 7, 1)',
          'rgba(220, 53, 69, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#ffffff'
          }
        }
      }
    }
  });
}

// Function to display players with payment status
function displayPlayers(planId, plan) {
  const playersList = document.getElementById("tournament-players");
  playersList.innerHTML = "";

  if (plan.players && plan.players.length > 0) {
    const brackets = calculateTournamentBrackets(plan.players);
    const isOdd = plan.players.length % 2 !== 0;
    
    plan.players.forEach((player, index) => {
      const row = document.createElement("tr");
      const status = plan.paymentStatus ? plan.paymentStatus[index] : 'unpaid';
      const isByePlayer = isOdd && brackets.round2.includes(player);
      
      row.innerHTML = `
        <td>
          ${player}
          ${isByePlayer ? '<span class="bye-player">(Bye)</span>' : ''}
        </td>
        <td>
          <span class="payment-status ${status}">
            ${status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </td>
        <td>
          <div class="action-buttons">
            <button class="status-button paid" onclick="updatePaymentStatus(${planId}, ${index}, 'paid')">Paid</button>
            <button class="status-button pending" onclick="updatePaymentStatus(${planId}, ${index}, 'pending')">Pending</button>
            <button class="status-button unpaid" onclick="updatePaymentStatus(${planId}, ${index}, 'unpaid')">Unpaid</button>
          </div>
        </td>
      `;
      playersList.appendChild(row);
    });
  } else {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td colspan="3" class="missing-info">No players available.</td>
    `;
    playersList.appendChild(row);
  }
}

// Function to create players per field chart
function createPlayersPerFieldChart(plan) {
  const ctx = document.getElementById('playersPerFieldChart').getContext('2d');
  const brackets = calculateTournamentBrackets(plan.players);
  const isOdd = plan.players.length % 2 !== 0;
  
  const data = {
    labels: ['Round 1', 'Round 2'],
    datasets: [{
      label: 'Players per Round',
      data: [
        brackets.round1.length,
        brackets.round2.length
      ],
      backgroundColor: [
        'rgba(249, 199, 79, 0.7)',
        'rgba(41, 81, 163, 0.7)'
      ],
      borderColor: [
        'rgba(249, 199, 79, 1)',
        'rgba(41, 81, 163, 1)'
      ],
      borderWidth: 1
    }]
  };

  new Chart(ctx, {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#ffffff'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        },
        x: {
          ticks: {
            color: '#ffffff'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: '#ffffff'
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.dataset.label || '';
              const value = context.raw;
              const round = context.label;
              let extraInfo = '';
              
              if (isOdd && round === 'Round 2') {
                extraInfo = ' (including bye player)';
              }
              
              return `${label}: ${value}${extraInfo}`;
            }
          }
        }
      }
    }
  });
}

// Function to create game mode distribution chart
function createGameModeDistributionChart(plan) {
  const ctx = document.getElementById('gameModeDistributionChart').getContext('2d');
  const gameMode = plan.gameMode;
  
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Cup', 'Pool'],
      datasets: [{
        data: [
          gameMode === 'cup' ? 1 : 0,
          gameMode === 'pool' ? 1 : 0
        ],
        backgroundColor: [
          'rgba(249, 199, 79, 0.7)',
          'rgba(41, 81, 163, 0.7)'
        ],
        borderColor: [
          'rgba(249, 199, 79, 1)',
          'rgba(41, 81, 163, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#ffffff'
          }
        }
      }
    }
  });
}

// Function to get all tournaments
function getAllTournaments() {
  return JSON.parse(localStorage.getItem("tournamentPlans")) || [];
}

// Function to get court bookings for a specific date
function getCourtBookings(date) {
  const tournaments = getAllTournaments();
  const bookings = {};
  
  tournaments.forEach(tournament => {
    if (tournament.date === date) {
      const allocation = calculateCourtAllocation(tournament);
      if (!bookings[date]) {
        bookings[date] = {
          totalCourts: tournament.fields,
          usedCourts: 0,
          tournaments: []
        };
      }
      bookings[date].tournaments.push({
        id: tournament.id,
        title: tournament.title,
        allocation: allocation
      });
      bookings[date].usedCourts += allocation.round1.courtsUsed;
    }
  });
  
  return bookings;
}

// Function to check court availability
function checkCourtAvailability(date, requiredCourts) {
  const bookings = getCourtBookings(date);
  if (!bookings[date]) return true;
  
  return (bookings[date].totalCourts - bookings[date].usedCourts) >= requiredCourts;
}

// Function to calculate court allocation with conflict checking
function calculateCourtAllocation(plan) {
  const numPlayers = plan.players.length;
  const numCourts = plan.fields;
  const isOdd = numPlayers % 2 !== 0;
  
  // Get existing bookings for the same date
  const bookings = getCourtBookings(plan.date);
  const availableCourts = bookings[plan.date] 
    ? bookings[plan.date].totalCourts - bookings[plan.date].usedCourts 
    : numCourts;
  
  // Calculate matches per round
  const matchesPerRound = Math.floor(numPlayers / 2);
  const roundsNeeded = Math.ceil(Math.log2(numPlayers));
  
  // Calculate optimal court usage considering availability
  const courtAllocation = {
    round1: {
      matches: matchesPerRound,
      courtsUsed: Math.min(matchesPerRound, availableCourts),
      matchesPerCourt: Math.ceil(matchesPerRound / Math.min(matchesPerRound, availableCourts)),
      startTime: null,
      endTime: null
    },
    round2: {
      matches: Math.ceil(matchesPerRound / 2),
      courtsUsed: Math.min(Math.ceil(matchesPerRound / 2), availableCourts),
      matchesPerCourt: Math.ceil(Math.ceil(matchesPerRound / 2) / Math.min(Math.ceil(matchesPerRound / 2), availableCourts)),
      startTime: null,
      endTime: null
    },
    final: {
      matches: 1,
      courtsUsed: 1,
      matchesPerCourt: 1,
      startTime: null,
      endTime: null
    }
  };

  // Calculate estimated times for each round
  const matchDuration = 30; // minutes per match
  const currentTime = new Date();
  
  courtAllocation.round1.startTime = new Date(currentTime);
  courtAllocation.round1.endTime = new Date(currentTime.getTime() + 
    (courtAllocation.round1.matchesPerCourt * matchDuration * 60000));
  
  courtAllocation.round2.startTime = new Date(courtAllocation.round1.endTime);
  courtAllocation.round2.endTime = new Date(courtAllocation.round2.startTime.getTime() + 
    (courtAllocation.round2.matchesPerCourt * matchDuration * 60000));
  
  courtAllocation.final.startTime = new Date(courtAllocation.round2.endTime);
  courtAllocation.final.endTime = new Date(courtAllocation.final.startTime.getTime() + 
    (matchDuration * 60000));

  return courtAllocation;
}

// Function to create court schedule table with time slots
function createCourtScheduleTable(plan) {
  const allocation = calculateCourtAllocation(plan);
  const scheduleContainer = document.getElementById('court-schedule');
  scheduleContainer.innerHTML = '';

  const table = document.createElement('table');
  table.className = 'schedule-table';
  
  // Create header
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>Round</th>
      <th>Matches</th>
      <th>Courts Used</th>
      <th>Matches per Court</th>
      <th>Start Time</th>
      <th>End Time</th>
    </tr>
  `;
  table.appendChild(thead);

  // Create body
  const tbody = document.createElement('tbody');
  const rounds = ['round1', 'round2', 'final'];
  const roundNames = ['Round 1', 'Round 2', 'Final'];
  
  rounds.forEach((round, index) => {
    const tr = document.createElement('tr');
    const startTime = allocation[round].startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endTime = allocation[round].endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    tr.innerHTML = `
      <td>${roundNames[index]}</td>
      <td>${allocation[round].matches}</td>
      <td>${allocation[round].courtsUsed}</td>
      <td>${allocation[round].matchesPerCourt}</td>
      <td>${startTime}</td>
      <td>${endTime}</td>
    `;
    tbody.appendChild(tr);
  });
  
  table.appendChild(tbody);
  scheduleContainer.appendChild(table);
}

// Function to create court allocation chart with time slots
function createCourtAllocationChart(plan) {
  const ctx = document.getElementById('courtAllocationChart').getContext('2d');
  const allocation = calculateCourtAllocation(plan);
  const bookings = getCourtBookings(plan.date);
  
  const data = {
    labels: ['Round 1', 'Round 2', 'Final'],
    datasets: [
      {
        label: 'Matches per Round',
        data: [
          allocation.round1.matches,
          allocation.round2.matches,
          allocation.final.matches
        ],
        backgroundColor: 'rgba(249, 199, 79, 0.7)',
        borderColor: 'rgba(249, 199, 79, 1)',
        borderWidth: 1,
        yAxisID: 'y'
      },
      {
        label: 'Courts Used',
        data: [
          allocation.round1.courtsUsed,
          allocation.round2.courtsUsed,
          allocation.final.courtsUsed
        ],
        backgroundColor: 'rgba(41, 81, 163, 0.7)',
        borderColor: 'rgba(41, 81, 163, 1)',
        borderWidth: 1,
        yAxisID: 'y1'
      }
    ]
  };

  new Chart(ctx, {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Matches',
            color: '#ffffff'
          },
          ticks: {
            color: '#ffffff'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Courts',
            color: '#ffffff'
          },
          ticks: {
            color: '#ffffff'
          },
          grid: {
            drawOnChartArea: false
          }
        },
        x: {
          ticks: {
            color: '#ffffff'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: '#ffffff'
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.dataset.label || '';
              const value = context.raw;
              const round = context.label;
              let extraInfo = '';
              
              if (context.dataset.label === 'Matches per Round') {
                const allocation = calculateCourtAllocation(plan);
                const roundKey = round.toLowerCase().replace(' ', '');
                const startTime = allocation[roundKey].startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const endTime = allocation[roundKey].endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                extraInfo = ` (${allocation[roundKey].matchesPerCourt} matches per court, ${startTime} - ${endTime})`;
              }
              
              return `${label}: ${value}${extraInfo}`;
            }
          }
        }
      }
    }
  });
}

// Function to display tournament details
function displayTournamentDetails(plan) {
  const detailsContainer = document.getElementById('tournament-details');
  detailsContainer.innerHTML = '';

  // Check court availability
  const requiredCourts = Math.ceil(plan.players.length / 2);
  const isAvailable = checkCourtAvailability(plan.date, requiredCourts);
  const availabilityStatus = isAvailable 
    ? `<div class="availability available">Courts Available</div>`
    : `<div class="availability unavailable">Not Enough Courts Available</div>`;

  // Create tournament details HTML
  const detailsHTML = `
    <div class="tournament-info">
      <h2>${plan.title}</h2>
      <p><strong>Date:</strong> ${plan.date}</p>
      <p><strong>Location:</strong> ${plan.location}</p>
      <p><strong>Number of Players:</strong> ${plan.players.length}</p>
      <p><strong>Number of Courts:</strong> ${plan.fields}</p>
      ${availabilityStatus}
    </div>
    <div class="charts-container">
      <div class="chart-wrapper">
        <h3>Player Distribution</h3>
        <canvas id="playerDistributionChart"></canvas>
      </div>
      <div class="chart-wrapper">
        <h3>Game Modes</h3>
        <canvas id="gameModesChart"></canvas>
      </div>
      <div class="chart-wrapper">
        <h3>Payment Status</h3>
        <canvas id="paymentStatusChart"></canvas>
      </div>
      <div class="chart-wrapper">
        <h3>Court Allocation</h3>
        <canvas id="courtAllocationChart"></canvas>
      </div>
    </div>
    <div class="schedule-container">
      <h3>Court Schedule</h3>
      <div id="court-schedule"></div>
    </div>
    <div class="players-container">
      <h3>Players</h3>
      <div class="players-table-container">
        <table class="players-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Payment Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="players-list">
          </tbody>
        </table>
      </div>
    </div>
  `;

  detailsContainer.innerHTML = detailsHTML;

  // Create charts
  createPlayerDistributionChart(plan);
  createGameModesChart(plan);
  createPaymentStatusChart(plan);
  createCourtAllocationChart(plan);
  createCourtScheduleTable(plan);
  displayPlayersList(plan);
}

// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
  // Get the plan ID from the URL
  const planId = getQueryParam("planId");

  // Retrieve the plan data from localStorage
  const plans = JSON.parse(localStorage.getItem("tournamentPlans")) || [];
  const plan = plans[planId];

  // Check if the plan exists
  if (!plan) {
    // Handle empty state
    document.getElementById("tournament-title").textContent = "No Tournament Selected";
    document.getElementById("tournament-date").innerHTML = `<span class="missing-info">Date: N/A</span>`;
    document.getElementById("tournament-game-mode").innerHTML = `<span class="missing-info">Game Mode: N/A</span>`;
    document.getElementById("tournament-players").innerHTML = `<tr><td colspan="3" class="missing-info">No players available.</td></tr>`;
  } else {
    // Populate the tournament details
    document.getElementById("tournament-title").textContent = plan.title || "Tournament Title";

    // Handle missing date
    const dateElement = document.getElementById("tournament-date");
    if (plan.date != "TBA") {
      dateElement.textContent = `Date: ${plan.date}`;
    } else {
      dateElement.innerHTML = `Date: TBA <span class="missing-info">!<span class="tooltip">Date is missing</span></span>`;
    }

    // Handle missing game mode
    const gameModeElement = document.getElementById("tournament-game-mode");
    if (plan.gameMode) {
      gameModeElement.textContent = `Game Mode: ${plan.gameMode}`;
    } else {
      gameModeElement.innerHTML = `Game Mode: Missing <span class="missing-info">!<span class="tooltip">Game mode is missing</span></span>`;
    }

    // Display players with payment status
    displayPlayers(planId, plan);

    // Create charts
    createPlayersPerFieldChart(plan);
    createGameModeDistributionChart(plan);
    createPaymentStatusChart(plan);
    createTournamentBracketChart(plan);
    createCourtAllocationChart(plan);
    createCourtScheduleTable(plan);
  }
});