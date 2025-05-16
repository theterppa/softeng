// Test user credentials
const testUser = {
    username: "User",
    password: "Pass",
    // 新增用户信息
    team: "user001",
    role: "admin",
    email: "user@test.com"
};

// Add event listener to the form
document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    // Get input values
    const username = document.querySelector("input[name='username']").value;
    const password = document.querySelector("input[name='password']").value;

    // Validate credentials
    if (username === testUser.username && password === testUser.password) {
        localStorage.setItem("isLoggedIn", "true"); // Store login status
        // 存储完整的用户信息
        localStorage.setItem("currentUser", JSON.stringify({
            id: testUser.id,
            username: testUser.username,
            name: testUser.name,
            role: testUser.role,
            email: testUser.email,
            loginTime: new Date().toISOString()
        }));
        window.location.href = "../index.html"; // Redirect to main page
    } else {
        alert("Invalid username or password.");
    }
});