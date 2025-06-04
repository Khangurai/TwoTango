// Data and State
let expenses = JSON.parse(localStorage.getItem("twotango-expenses")) || [];
let editingExpenseId = null;
let includeLocation = false;
let locationMethod = "current";
let formData = {
  description: "",
  amount: "",
  category: "",
  date: new Date().toISOString().split("T")[0],
  paidBy: "",
  notes: "",
  location: null,
  customAddress: "",
};

// DOM Elements
const expenseFormCard = document.getElementById("expenseFormCard");
const expenseForm = document.getElementById("expenseForm");
const expensesList = document.getElementById("expensesList");
const toastEl = document.getElementById("toast");
const toastBody = toastEl.querySelector(".toast-body");
const toast = new bootstrap.Toast(toastEl);
const includeLocationCheckbox = document.getElementById("includeLocation");
const locationSection = document.getElementById("locationSection");
const currentLocationSection = document.getElementById(
  "currentLocationSection"
);
const customLocationSection = document.getElementById("customLocationSection");
const locationInfo = document.getElementById("locationInfo");
const getCurrentLocationBtn = document.getElementById("getCurrentLocation");
const setCustomLocationBtn = document.getElementById("setCustomLocation");
const addExpenseBtn = document.getElementById("addExpenseBtn");
const cancelExpenseBtn = document.getElementById("cancelExpense");

// Categories
const categories = [
  "Food & Dining",
  "Travel",
  "Entertainment",
  "Shopping",
  "Utilities",
  "Health",
  "Other",
];

// Toggle Form Visibility
addExpenseBtn.addEventListener("click", () => {
  expenseFormCard.classList.toggle("d-none");
});

// Initialize Form
function resetForm() {
  formData = {
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    paidBy: "",
    notes: "",
    location: null,
    customAddress: "",
  };
  expenseForm.reset();
  includeLocationCheckbox.checked = false;
  locationSection.classList.add("d-none");
  currentLocationSection.classList.remove("d-none");
  customLocationSection.classList.add("d-none");
  locationInfo.classList.add("d-none");
  document.getElementById("currentLocation").checked = true;
  locationMethod = "current";
  editingExpenseId = null;
  document.getElementById("submitExpense").innerHTML =
    '<i class="bi bi-plus me-1"></i> Add Expense';
  expenseFormCard.classList.add("d-none");
}

// Show Toast
function showToast(message, isError = false) {
  toastBody.textContent = message;
  toastEl.classList.toggle("text-bg-danger", isError);
  toastEl.classList.toggle("text-bg-success", !isError);
  toast.show();
}

// Get Current Location
getCurrentLocationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    showToast("Geolocation is not supported by this browser", true);
    return;
  }
  getCurrentLocationBtn.disabled = true;
  getCurrentLocationBtn.textContent = "Getting Location...";
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      formData.location = {
        name: "Current Location",
        address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
      };
      locationInfo.textContent = `📍 Location: ${formData.location.address}`;
      locationInfo.classList.remove("d-none");
      getCurrentLocationBtn.disabled = false;
      getCurrentLocationBtn.textContent = "Use Current Location";
      showToast("Location captured! 📍");
    },
    (error) => {
      console.error("Error getting location:", error);
      getCurrentLocationBtn.disabled = false;
      getCurrentLocationBtn.textContent = "Use Current Location";
      showToast("Could not get your location. Please try again.", true);
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
});

// Set Custom Location
setCustomLocationBtn.addEventListener("click", () => {
  if (!formData.location || !formData.location.name) {
    showToast("Please select a location using the autocomplete", true);
    return;
  }
  locationInfo.textContent = `📍 Location: ${formData.location.name}, ${formData.location.address}`;
  locationInfo.classList.remove("d-none");
  showToast("Location set! 📍");
});

// Toggle Location Section
includeLocationCheckbox.addEventListener("change", (e) => {
  includeLocation = e.target.checked;
  locationSection.classList.toggle("d-none", !includeLocation);
  if (!includeLocation) {
    formData.location = null;
    locationInfo.classList.add("d-none");
  }
});

// Toggle Location Method
document.querySelectorAll('input[name="locationMethod"]').forEach((radio) => {
  radio.addEventListener("change", (e) => {
    locationMethod = e.target.value;
    currentLocationSection.classList.toggle(
      "d-none",
      locationMethod !== "current"
    );
    customLocationSection.classList.toggle(
      "d-none",
      locationMethod !== "custom"
    );
  });
});

// Form Input Updates
document
  .querySelectorAll(
    "#expenseForm input, #expenseForm select, #expenseForm textarea"
  )
  .forEach((input) => {
    input.addEventListener("change", (e) => {
      const { id, value } = e.target;
      formData[id] = value;
    });
  });

// Cancel Button
cancelExpenseBtn.addEventListener("click", () => {
  resetForm();
});

// Form Submission
expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (
    !formData.description ||
    !formData.amount ||
    !formData.category ||
    !formData.paidBy
  ) {
    showToast("Please fill in all required fields", true);
    return;
  }
  const expenseData = {
    id: editingExpenseId || Date.now().toString(),
    description: formData.description,
    amount: parseFloat(formData.amount),
    category: formData.category,
    date: formData.date,
    paidBy: formData.paidBy,
    notes: formData.notes,
    ...(includeLocation &&
      formData.location && { location: formData.location }),
  };
  if (editingExpenseId) {
    expenses = expenses.map((exp) =>
      exp.id === editingExpenseId ? expenseData : exp
    );
    showToast("Expense updated successfully! 💖");
  } else {
    expenses.unshift(expenseData);
    showToast("Expense added successfully! 💖");
  }
  localStorage.setItem("twotango-expenses", JSON.stringify(expenses));
  resetForm();
  updateUI();
});

// Edit Expense
function startEditing(expense) {
  editingExpenseId = expense.id;
  formData = {
    description: expense.description,
    amount: expense.amount.toString(),
    category: expense.category,
    date: expense.date,
    paidBy: expense.paidBy,
    notes: expense.notes || "",
    location: expense.location,
    customAddress: expense.location?.address || "",
  };
  document.getElementById("description").value = formData.description;
  document.getElementById("amount").value = formData.amount;
  document.getElementById("category").value = formData.category;
  document.getElementById("date").value = formData.date;
  document.getElementById("paidBy").value = formData.paidBy;
  document.getElementById("notes").value = formData.notes;
  includeLocation = !expense.location;
  includeLocationCheckbox.checked = includeLocation;
  locationSection.classList.toggle("d-none", !includeLocation);
  if (expense.location) {
    locationInfo.textContent = `📍 Location: ${expense.location.name}, ${expense.location.address}`;
    locationInfo.classList.remove("d-none");
  }
  document.getElementById("submitExpense").innerHTML =
    '<i class="bi bi-save me-1"></i> Update Expense';
  expenseFormCard.classList.remove("d-none");
}

// Delete Expense
function deleteExpense(id) {
  expenses = expenses.filter((exp) => exp.id !== id);
  localStorage.setItem("twotango-expenses", JSON.stringify(expenses));
  showToast("Expense deleted");
  updateUI();
}

// Update UI
function updateUI() {
  // Calculations
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const monthExpenses = expenses
    .filter((exp) => new Date(exp.date).getMonth() === new Date().getMonth())
    .reduce((sum, exp) => sum + exp.amount, 0);
  const expensesByCategory = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});
  const expensesWithLocation = expenses.filter((exp) => exp.location);
  const partner1Expenses = expenses
    .filter((exp) => exp.paidBy === "Partner 1")
    .reduce((sum, exp) => sum + exp.amount, 0);
  const partner2Expenses = expenses
    .filter((exp) => exp.paidBy === "Partner 2")
    .reduce((sum, exp) => sum + exp.amount, 0);
  const bothExpenses = expenses
    .filter((exp) => exp.paidBy === "Both")
    .reduce((sum, exp) => sum + exp.amount, 0);
  const totalSharedExpenses =
    partner1Expenses + partner2Expenses + bothExpenses;
  const eachShouldPay = totalSharedExpenses / 2;
  const partner1ActualPaid = partner1Expenses + bothExpenses / 2;
  const partner2ActualPaid = partner2Expenses + bothExpenses / 2;
  const partner1Balance = partner1ActualPaid - eachShouldPay;
  const partner2Balance = partner2ActualPaid - eachShouldPay;
  const partner1Percentage =
    totalSharedExpenses > 0
      ? Math.round((partner1ActualPaid / totalSharedExpenses) * 100)
      : 50;
  const partner2Percentage =
    totalSharedExpenses > 0
      ? Math.round((partner2ActualPaid / totalSharedExpenses) * 100)
      : 50;

  // Update Summary Cards
  document.getElementById(
    "totalExpenses"
  ).textContent = `$${totalExpenses.toFixed(2)}`;
  document.getElementById(
    "monthExpenses"
  ).textContent = `$${monthExpenses.toFixed(2)}`;
  document.getElementById("categoryCount").textContent =
    Object.keys(expensesByCategory).length;
  document.getElementById("geoTaggedCount").textContent =
    expensesWithLocation.length;

  // Update Partner Balance
  document.getElementById(
    "partner1Paid"
  ).textContent = `$${partner1ActualPaid.toFixed(0)}`;
  document.getElementById("partner2Paid").textContent = `${
    partner2Balance < 0 ? "-" : ""
  }$${Math.abs(partner2ActualPaid).toFixed(0)}`;
  document.getElementById(
    "partner1Percentage"
  ).textContent = `${partner1Percentage}%`;
  document.getElementById(
    "partner2Percentage"
  ).textContent = `${partner2Percentage}%`;
  document.getElementById("partner1Share").textContent = `$${
    totalSharedExpenses > 0
      ? (totalSharedExpenses * (partner1Percentage / 100)).toFixed(0)
      : "0"
  }`;
  document.getElementById("partner2Share").textContent = `$${
    totalSharedExpenses > 0
      ? (totalSharedExpenses * (partner2Percentage / 100)).toFixed(0)
      : "0"
  }`;

  // Update Settlement Summary
  const settlementSummary = document.getElementById("settlementSummary");
  if (totalSharedExpenses > 0) {
    if (partner1Balance > 0) {
      settlementSummary.innerHTML = `
            <h4 class="fw-semibold mb-2">Settlement Needed</h4>
            <p class="text-muted">Partner 2 owes Partner 1</p>
            <p class="fs-3 fw-bold text-danger">$${Math.abs(
              partner1Balance
            ).toFixed(2)}</p>
          `;
    } else if (partner2Balance > 0) {
      settlementSummary.innerHTML = `
            <h4 class="fw-semibold mb-2">Settlement Needed</h4>
            <p class="text-muted">Partner 1 owes Partner 2</p>
            <p class="fs-3 fw-bold text-danger">$${Math.abs(
              partner2Balance
            ).toFixed(2)}</p>
          `;
    } else {
      settlementSummary.innerHTML = `
            <h4 class="fw-semibold mb-2">Settlement Needed</h4>
            <p class="fs-5 fw-medium text-success">Everything is settled! 💕</p>
          `;
    }
  } else {
    settlementSummary.innerHTML = `
          <h4 class="fw-semibold mb-2">Settlement Needed</h4>
          <p class="fs-5 fw-medium text-success">Everything is settled! 💕</p>
        `;
  }

  // Update Expenses List
  if (expenses.length === 0) {
    expensesList.innerHTML = `
          <div class="card border-danger-subtle">
            <div class="card-body text-center py-5">
              <div class="display-3 mb-3">💕</div>
              <h3 class="fs-4 fw-semibold mb-2">No expenses yet</h3>
              <p class="text-muted">Start tracking your shared expenses together!</p>
            </div>
          </div>
        `;
  } else {
    expensesList.innerHTML = expenses
      .map(
        (exp) => `
          <div class="card border-danger-subtle mb-3">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <div class="d-flex align-items-center gap-3 mb-2">
                    <h3 class="fs-5 fw-semibold">${exp.description}</h3>
                    <span class="badge category-badge">${exp.category}</span>
                    ${
                      exp.location
                        ? `<span class="badge geo-badge"><i class="bi bi-geo-alt me-1"></i> Geo-tagged</span>`
                        : ""
                    }
                  </div>
                  <div class="d-flex gap-3 text-muted small">
                    <span><i class="bi bi-currency-dollar"></i> $${exp.amount.toFixed(
                      2
                    )}</span>
                    <span><i class="bi bi-calendar"></i> ${new Date(
                      exp.date
                    ).toLocaleDateString()}</span>
                    <span>Paid by: ${exp.paidBy}</span>
                  </div>
                  ${
                    exp.location
                      ? `<div class="text-danger small mt-1">📍 ${exp.location.name}, ${exp.location.address}</div>`
                      : ""
                  }
                  ${
                    exp.notes
                      ? `<p class="text-muted small mt-2">${exp.notes}</p>`
                      : ""
                  }
                </div>
                <div class="d-flex gap-2">
                  <button class="btn btn-outline-primary btn-sm" onclick='startEditing(${JSON.stringify(
                    exp
                  )})'>
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-outline-danger btn-sm" onclick="deleteExpense('${
                    exp.id
                  }')">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        `
      )
      .join("");
  }
}

// Initial Render
updateUI();

// Expose functions to global scope for button onclick
window.startEditing = startEditing;
window.deleteExpense = deleteExpense;
