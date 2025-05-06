// Test data for multiple tournaments
const testTournaments = [
    {
      id: "test1",
      title: "Morning Tournament",
      date: "2024-03-20",
      location: "Test Location 1",
      fields: 4,
      players: Array(8).fill().map((_, i) => ({
        name: `Player ${i + 1}`,
        email: `player${i + 1}@test.com`,
        phone: `123-456-${i + 1}`,
        paymentStatus: i % 2 === 0 ? 'paid' : 'pending'
      }))
    },
    {
      id: "test2",
      title: "Afternoon Tournament",
      date: "2024-03-20",
      location: "Test Location 1",
      fields: 4,
      players: Array(6).fill().map((_, i) => ({
        name: `Player ${i + 9}`,
        email: `player${i + 9}@test.com`,
        phone: `123-456-${i + 9}`,
        paymentStatus: i % 2 === 0 ? 'paid' : 'pending'
      }))
    },
    {
      id: "test3",
      title: "Evening Tournament",
      date: "2024-03-20",
      location: "Test Location 1",
      fields: 4,
      players: Array(10).fill().map((_, i) => ({
        name: `Player ${i + 15}`,
        email: `player${i + 15}@test.com`,
        phone: `123-456-${i + 15}`,
        paymentStatus: i % 2 === 0 ? 'paid' : 'pending'
      }))
    }
  ];
  
  // Function to run tests
  function runTests() {
    console.log("Starting tournament scheduling tests...");
    
    // Test 1: Check court availability
    console.log("\nTest 1: Court Availability");
    testTournaments.forEach((tournament, index) => {
      const requiredCourts = Math.ceil(tournament.players.length / 2);
      const isAvailable = checkCourtAvailability(tournament.date, requiredCourts);
      console.log(`Tournament ${index + 1}: ${tournament.title}`);
      console.log(`Required courts: ${requiredCourts}`);
      console.log(`Available: ${isAvailable}`);
    });
    
    // Test 2: Check court bookings
    console.log("\nTest 2: Court Bookings");
    const bookings = getCourtBookings("2024-03-20");
    console.log("Bookings for 2024-03-20:", bookings);
    
    // Test 3: Calculate court allocation
    console.log("\nTest 3: Court Allocation");
    testTournaments.forEach((tournament, index) => {
      const allocation = calculateCourtAllocation(tournament);
      console.log(`\nTournament ${index + 1}: ${tournament.title}`);
      console.log("Allocation:", allocation);
    });
    
    // Test 4: Display tournament details
    console.log("\nTest 4: Display Tournament Details");
    testTournaments.forEach((tournament, index) => {
      console.log(`\nDisplaying details for Tournament ${index + 1}: ${tournament.title}`);
      displayTournamentDetails(tournament);
    });
  }
  
  // Run tests when the page loads
  document.addEventListener('DOMContentLoaded', () => {
    // Save test tournaments to localStorage
    localStorage.setItem("tournamentPlans", JSON.stringify(testTournaments));
    
    // Run tests
    runTests();
  }); 