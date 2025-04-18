// Test user credentials
const testUser = {
    username: "User",
    password: "Pass"
};

// Add event listener to the form
document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    // Get input values
    const username = document.querySelector("input[name='username']").value;
    const password = document.querySelector("input[name='password']").value;

    // Validate credentials
    if (username === testUser.username && password === testUser.password) {
        // Redirect to main.html
        window.location.href = "../main.html";
    } else {
        alert("Invalid username or password.");
    }
});