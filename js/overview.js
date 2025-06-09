function updateOverview() {
  // Fetch all expenses from localStorage
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Calculate this month's expenses
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonthExpenses = expenses.filter(
    (exp) => new Date(exp.date) >= startOfMonth
  );
  const monthTotal = thisMonthExpenses.reduce(
    (sum, exp) => sum + exp.amount,
    0
  );

  // Count unique categories
  const categories = new Set(expenses.map((exp) => exp.category));
  const categoryCount = categories.size;

  // Count geo-tagged expenses
  const geoTaggedCount = expenses.filter(
    (exp) => exp.location.lat && exp.location.lng
  ).length;

  // Calculate partner payments
  let partner1Paid = 0;
  let partner2Paid = 0;
  expenses.forEach((exp) => {
    if (exp.paidBy === "Partner 1") {
      partner1Paid += exp.amount;
    } else if (exp.paidBy === "Partner 2") {
      partner2Paid += exp.amount;
    } else if (exp.paidBy === "Both") {
      partner1Paid += exp.amount / 2;
      partner2Paid += exp.amount / 2;
    }
  });

  // Calculate each partner's share and balance
  const totalShare = totalExpenses / 2;
  const partner1Balance = partner1Paid - totalShare;

  // Format amounts with MMK currency
  const formatAmount = (amount) =>
    amount.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }) + " MMK";

  // Update summary cards
  document.getElementById("totalExpenses").textContent =
    formatAmount(totalExpenses);
  document.getElementById("monthExpenses").textContent =
    formatAmount(monthTotal);
  document.getElementById("categoryCount").textContent = categoryCount;
  document.getElementById("geoTaggedCount").textContent = geoTaggedCount;

  // Update partner balance
  document.getElementById("partner1Paid").textContent =
    formatAmount(partner1Paid);
  document.getElementById("partner2Paid").textContent =
    formatAmount(partner2Paid);
  document.getElementById("partner1Share").textContent =
    formatAmount(totalShare);
  document.getElementById("partner2Share").textContent =
    formatAmount(totalShare);

  // Update settlement summary
  const settlementSummary = document.getElementById("settlementSummary");
  if (partner1Balance > 0) {
    settlementSummary.innerHTML = `
      <h4 class="fw-semibold mb-2">Settlement Needed</h4>
      <p class="text-muted">Partner 2 owes Partner 1 ${formatAmount(
        partner1Balance
      )}</p>
    `;
  } else if (partner1Balance < 0) {
    settlementSummary.innerHTML = `
      <h4 class="fw-semibold mb-2">Settlement Needed</h4>
      <p class="text-muted">Partner 1 owes Partner 2 ${formatAmount(
        -partner1Balance
      )}</p>
    `;
  } else {
    settlementSummary.innerHTML = `
      <h4 class="fw-semibold mb-2">Settlement Needed</h4>
      <p class="text-muted">Everything is settled! 💕</p>
    `;
  }
}

// Load data and update overview when expenses change
function loadData() {
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  updateOverview();
  filterExpenses(currentFilter); // Assuming filterExpenses is defined elsewhere
}

// Call loadData initially and after adding/deleting expenses
document.addEventListener("DOMContentLoaded", loadData);
