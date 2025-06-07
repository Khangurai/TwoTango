// Set current year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Sidebar toggle for mobile
document.getElementById("sidebarToggle").addEventListener("click", function () {
  document.querySelector(".sidebar").classList.toggle("active");
});

// Initialize charts
document.addEventListener("DOMContentLoaded", function () {
  // User Growth Chart
  const growthCtx = document.getElementById("userGrowthChart").getContext("2d");
  const userGrowthChart = new Chart(growthCtx, {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      datasets: [
        {
          label: "New Users",
          data: [120, 190, 170, 220, 250, 280, 310],
          backgroundColor: "rgba(244, 63, 94, 0.1)",
          borderColor: "rgba(244, 63, 94, 1)",
          borderWidth: 2,
          tension: 0.3,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  // User Types Chart
  const typesCtx = document.getElementById("userTypesChart").getContext("2d");
  const userTypesChart = new Chart(typesCtx, {
    type: "doughnut",
    data: {
      labels: ["Free Users", "Premium Users"],
      datasets: [
        {
          data: [930, 324],
          backgroundColor: [
            "rgba(107, 114, 128, 0.8)",
            "rgba(251, 146, 60, 0.8)",
          ],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
      cutout: "70%",
    },
  });
});

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    // Redirect to home page
    window.location.href = "../index.html";
  });
}
