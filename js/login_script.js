document.addEventListener("DOMContentLoaded", function () {
  // Handle login form submission
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    // Create error message element
    const errorDiv = document.createElement("div");
    errorDiv.className = "alert alert-danger mt-3 d-none";
    errorDiv.id = "loginError";
    loginForm.appendChild(errorDiv);

    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const username = document.getElementById("LoginUsername").value;
      const password = document.getElementById("LoginPassword").value;
      const errorElement = document.getElementById("loginError");

      // Clear previous errors
      errorElement.classList.add("d-none");
      errorElement.textContent = "";

      // Simple authentication
      if (username === "alice" && password === "alice") {
        // Redirect to admin dashboard
        window.location.href = "admin/index.html";
      } else if (username === "user" && password === "user") {
        // Redirect to user dashboard
        window.location.href = "user-dashboard.html";
      } else {
        // Show error in modal without closing it
        errorElement.textContent =
          "Invalid credentials. Try admin/admin or user/user";
        errorElement.classList.remove("d-none");

        // Focus back on username field
        document.getElementById("username").focus();

        // Don't close the modal - removed the modal.hide() line
      }
    });
  }
});
