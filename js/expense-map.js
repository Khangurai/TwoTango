// Section Toggle Script
document.querySelectorAll("[data-target]").forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelectorAll(".content-section").forEach((content) => {
      content.classList.add("d-none");
    });
    const targetId = button.dataset.target;
    const contentToShow = document.getElementById(targetId);
    if (contentToShow) {
      contentToShow.classList.remove("d-none");
    }
    document.querySelectorAll(".nav__link").forEach((navLink) => {
      navLink.classList.remove("active-link");
    });
    button.classList.add("active-link");
  });
});

// Global variables
let mainMap;
let expenseMap;
let markers = [];
let geocoder;
let autocomplete;
let selectedLocation = null;
let currentFilter = "all";
let currentMarker;
let accuracyCircle;
let expenseDataTable;
let editingExpenseId = null;
let currentInfoWindow = null;

// Sample expenses
const sampleExpenses = [
  {
    id: "1749312657746",
    amount: 12000,
    category: "Food & Dining",
    date: "2024-06-10",
    paidBy: "Partner 1",
    notes: "Lunch at Shan restaurant",
    location: {
      name: "Shan Yoe Yar",
      address: "No. 23, 50th St, Yangon, Myanmar",
      lat: 16.780939,
      lng: 96.149081,
    },
  },
  {
    id: "1749312657747",
    amount: 45000,
    category: "Shopping",
    date: "2024-07-15",
    paidBy: "Partner 2",
    notes: "Clothes at Junction City",
    location: {
      name: "Junction City",
      address: "Corner of Bogyoke Aung San Road and Pyay Road, Yangon",
      lat: 16.781758,
      lng: 96.127708,
    },
  },
  {
    id: "1749312657748",
    amount: 8000,
    category: "Travel",
    date: "2024-08-22",
    paidBy: "Partner 1",
    notes: "Taxi fare",
    location: {
      name: "Downtown Yangon",
      address: "Yangon, Myanmar",
      lat: 16.786713,
      lng: 96.149772,
    },
  },
  {
    id: "1749312657749",
    amount: 35000,
    category: "Entertainment",
    date: "2024-09-05",
    paidBy: "Partner 2",
    notes: "Movie at Cinema",
    location: {
      name: "Nay Pyi Taw Cinema",
      address: "Yangon, Myanmar",
      lat: 16.824964,
      lng: 96.133369,
    },
  },
  {
    id: "1749312657750",
    amount: 28000,
    category: "Food & Dining",
    date: "2024-10-12",
    paidBy: "Partner 1",
    notes: "Dinner at BBQ place",
    location: {
      name: "BBQ Park",
      address: "Yangon, Myanmar",
      lat: 16.645494,
      lng: 96.155308,
    },
  },
  {
    id: "1749312657751",
    amount: 15000,
    category: "Other",
    date: "2024-11-18",
    paidBy: "Partner 2",
    notes: "Supermarket shopping",
    location: {
      name: "City Mart",
      address: "Yangon, Myanmar",
      lat: 16.805759,
      lng: 96.140487,
    },
  },
  {
    id: "1749312657752",
    amount: 60000,
    category: "Shopping",
    date: "2024-12-25",
    paidBy: "Partner 1",
    notes: "New headphones",
    location: {
      name: "Pazundaung Plaza",
      address: "Yangon, Myanmar",
      lat: 16.767704,
      lng: 96.169739,
    },
  },
  {
    id: "1749312657753",
    amount: 28000,
    category: "Food & Dining",
    date: "2025-01-07",
    paidBy: "Partner 2",
    notes: "Coffee and snacks",
    location: {
      name: "Coffee Club",
      address: "Yangon, Myanmar",
      lat: 16.793245,
      lng: 96.147893,
    },
  },
  {
    id: "1749312657754",
    amount: 25000,
    category: "Health",
    date: "2025-02-14",
    paidBy: "Partner 1",
    notes: "Pharmacy items",
    location: {
      name: "Sunshine Pharmacy",
      address: "Yangon, Myanmar",
      lat: 16.812345,
      lng: 96.156789,
    },
  },
  {
    id: "1749312657755",
    amount: 40000,
    category: "Food & Dining",
    date: "2025-03-21",
    paidBy: "Partner 2",
    notes: "Family dinner",
    location: {
      name: "Royal Garden",
      address: "Yangon, Myanmar",
      lat: 16.801234,
      lng: 96.145678,
    },
  },
  {
    id: "1749312657756",
    amount: 12000,
    category: "Travel",
    date: "2025-04-03",
    paidBy: "Partner 1",
    notes: "Bus tickets",
    location: {
      name: "Aung San Bus Station",
      address: "Yangon, Myanmar",
      lat: 16.825678,
      lng: 96.134567,
    },
  },
  {
    id: "1749312657757",
    amount: 30000,
    category: "Shopping",
    date: "2025-04-15",
    paidBy: "Partner 2",
    notes: "Gifts for friends",
    location: {
      name: "Bogyoke Market",
      address: "Yangon, Myanmar",
      lat: 16.784567,
      lng: 96.156789,
    },
  },
  {
    id: "1749312657758",
    amount: 28000,
    category: "Food & Dining",
    date: "2025-04-22",
    paidBy: "Partner 1",
    notes: "Lunch meeting",
    location: {
      name: "The Garden Restaurant",
      address: "Yangon, Myanmar",
      lat: 16.795678,
      lng: 96.148765,
    },
  },
  {
    id: "1749312657759",
    amount: 75000,
    category: "Other",
    date: "2025-05-05",
    paidBy: "Partner 2",
    notes: "New chair",
    location: {
      name: "Furniture Mall",
      address: "Yangon, Myanmar",
      lat: 16.814567,
      lng: 96.157654,
    },
  },
  {
    id: "1749312657760",
    amount: 15000,
    category: "Food & Dining",
    date: "2025-05-12",
    paidBy: "Partner 1",
    notes: "Breakfast",
    location: {
      name: "Rangoon Tea House",
      address: "Yangon, Myanmar",
      lat: 16.782345,
      lng: 96.158765,
    },
  },
  {
    id: "1749312657761",
    amount: 50000,
    category: "Electronics",
    date: "2025-05-18",
    paidBy: "Partner 2",
    notes: "Phone accessories",
    location: {
      name: "Hledan Center",
      address: "Yangon, Myanmar",
      lat: 16.823456,
      lng: 96.135678,
    },
  },
  {
    id: "1749312657762",
    amount: 28000,
    category: "Food & Dining",
    date: "2025-05-25",
    paidBy: "Partner 1",
    notes: "Dinner with friends",
    location: {
      name: "Monsoon Restaurant",
      address: "Yangon, Myanmar",
      lat: 16.779876,
      lng: 96.159876,
    },
  },
  {
    id: "1749312657763",
    amount: 12000,
    category: "Groceries",
    date: "2025-06-01",
    paidBy: "Partner 2",
    notes: "Weekly shopping",
    location: {
      name: "Ocean Supercenter",
      address: "Yangon, Myanmar",
      lat: 16.804567,
      lng: 96.143456,
    },
  },
  {
    id: "1749312657764",
    amount: 18000,
    category: "Travel",
    date: "2025-06-03",
    paidBy: "Partner 1",
    notes: "Taxi to meeting",
    location: {
      name: "Downtown Yangon",
      address: "Yangon, Myanmar",
      lat: 16.786713,
      lng: 96.149772,
    },
  },
  {
    id: "1749312657765",
    amount: 35000,
    category: "Food & Dining",
    date: "2025-06-07",
    paidBy: "Partner 2",
    notes: "Anniversary dinner",
    location: {
      name: "Le Planteur",
      address: "Yangon, Myanmar",
      lat: 16,
      lng: 98,
    },
  },
];

// Initialize Google Maps and other components
function initMap() {
  const defaultLocation = { lat: 16.8409, lng: 96.1735 };

  mainMap = new google.maps.Map(document.getElementById("mainMap"), {
    center: defaultLocation,
    zoom: 12,
    gestureHandling: "greedy",
  });

  expenseMap = new google.maps.Map(document.getElementById("expenseMap"), {
    center: defaultLocation,
    zoom: 12,
  });

  geocoder = new google.maps.Geocoder();
  const input = document.getElementById("autocomplete");
  autocomplete = new google.maps.places.Autocomplete(input);

  input.addEventListener("click", () => {
    input.value = "";
  });

  const locationButton = document.createElement("button");
  locationButton.className = "location-button";
  locationButton.title = "Show your location";
  locationButton.innerHTML = `
    <svg class="location-icon" viewBox="0 0 24 24">
      <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52-6.83 3.06 11H1v2h2h6.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
    </svg>
  `;
  expenseMap.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
    locationButton
  );
  locationButton.addEventListener("click", getCurrentLocationForExpense);

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (!place.geometry) {
      document.getElementById("locationInfo").textContent =
        "No details available for input: '" + place.name + "'";
      return;
    }
    if (currentMarker) currentMarker.setMap(null);
    if (accuracyCircle) accuracyCircle.setMap(null);
    selectedLocation = {
      name: place.name,
      address: place.formatted_address,
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };
    expenseMap.setCenter(place.geometry.location);
    expenseMap.setZoom(15);
    currentMarker = new google.maps.Marker({
      position: place.geometry.location,
      map: expenseMap,
      title: place.name,
    });
    document.getElementById("locationInfo").classList.remove("d-none");
    document.getElementById(
      "locationInfo"
    ).textContent = `Selected: ${place.name}, ${place.formatted_address}`;
  });

  input.addEventListener("input", () => {
    if (input.value === "") {
      if (currentMarker) currentMarker.setMap(null);
      if (accuracyCircle) accuracyCircle.setMap(null);
      currentMarker = null;
      accuracyCircle = null;
      selectedLocation = null;
      document.getElementById("locationInfo").classList.add("d-none");
    }
  });

  document
    .getElementById("includeLocation")
    .addEventListener("change", function () {
      document
        .getElementById("locationSection")
        .classList.toggle("d-none", !this.checked);
      selectedLocation = null;
      document.getElementById("locationInfo").classList.add("d-none");
      document.getElementById("autocomplete").value = "";
      if (currentMarker) currentMarker.setMap(null);
      if (accuracyCircle) accuracyCircle.setMap(null);
      currentMarker = null;
      accuracyCircle = null;
      expenseMap.setCenter(defaultLocation);
      expenseMap.setZoom(12);
    });

  document.getElementById("dateFilter").addEventListener("change", function () {
    currentFilter = this.value;
    if (this.value === "custom") {
      document.getElementById("customDateRange").style.display = "flex";
    } else {
      document.getElementById("customDateRange").style.display = "none";
      filterExpenses(this.value);
    }
  });

  const today = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(today.getDate() - 7);
  document.getElementById("startDate").valueAsDate = oneWeekAgo;
  document.getElementById("endDate").valueAsDate = today;
  document.getElementById("date").valueAsDate = today;

  loadData();
}

function getCurrentLocationForExpense() {
  const locationButton = document.querySelector(".location-button");
  const locationIcon = locationButton.querySelector(".location-icon");
  if (!navigator.geolocation) {
    showToast("Geolocation is not supported by this browser.");
    return;
  }
  locationIcon.classList.add("loading");
  locationIcon.innerHTML = `<path d="M12 2v4m0 12v4M4 12H2m20 0h-2m4.22-7.78l-2.83 2.83m-12.73 2.83l-2.83-2.83"/>`;
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      const accuracy = position.coords.accuracy;
      if (currentMarker) currentMarker.setMap(null);
      if (accuracyCircle) accuracyCircle.setMap(null);
      accuracyCircle = new google.maps.Circle({
        center: pos,
        radius: accuracy,
        fillColor: "#4285F4",
        fillOpacity: 0.15,
        strokeColor: "#4285F4",
        strokeOpacity: 0.5,
        strokeWeight: 1,
        map: expenseMap,
      });
      currentMarker = new google.maps.Marker({
        position: pos,
        map: expenseMap,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#4285F4",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
        title: "Your current location",
      });
      expenseMap.setCenter(pos);
      let zoom = 16;
      if (accuracy > 1000) zoom = 12;
      else if (accuracy > 500) zoom = 14;
      else if (accuracy > 100) zoom = 15;
      expenseMap.setZoom(zoom);
      geocoder.geocode({ location: pos }, (results, status) => {
        if (status === "OK" && results[0]) {
          selectedLocation = {
            name: results[0].formatted_address.split(",")[0],
            address: results[0].formatted_address,
            lat: pos.lat,
            lng: pos.lng,
          };
          document.getElementById("locationInfo").classList.remove("d-none");
          document.getElementById(
            "locationInfo"
          ).textContent = `Selected: ${selectedLocation.name}, ${selectedLocation.address}`;
        } else {
          showToast("Geocoder failed due to: " + status);
        }
      });
      locationIcon.classList.remove("loading");
      locationIcon.innerHTML = `<path d="M12 2a2 2 0 0 0-2 2c0 1.11.89 2 2 2 1.11 0 2-.89 2-2a2 2 0 0 0-2-2zm0 16a2 2 0 0 0-2 2c0 1.11.89 2 2 2 1.11 0 2-.89 2-2a2 2 0 0 0-2-2zm-8-8a2 2 0 0 0-2 2c0 1.11.89 2 2 2 1.11 0 2-.89 2-2a2 2 0 0 0-2-2zm16 0a2 2 0 0 0-2 2c0 1.11.89 2 2 2 1.11 0 2-.89 2-2a2 2 0 0 0-2-2z"/>`;
      locationIcon.style.fill = "#1a73e8";
      locationButton.classList.add("active-location");
    },
    (error) => {
      let errorMessage = "Unable to retrieve your location.";
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Location access denied by user.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Location information unavailable.";
          break;
        case error.TIMEOUT:
          errorMessage = "Location request timed out.";
          break;
      }
      showToast(errorMessage);
      locationIcon.classList.remove("loading");
      locationIcon.innerHTML = `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>`;
      locationIcon.style.fill = "#d93025";
      locationButton.classList.remove("active-location");
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    }
  );
}

// READ: Loads sample data into local storage and triggers data display
function loadSampleData() {
  localStorage.setItem("expenses", JSON.stringify(sampleExpenses));
  loadData();
  showToast("Sample data loaded successfully!");
}

// READ: Retrieves expenses from local storage and updates UI (map, table, summary)
function loadData() {
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  clearMarkers();
  renderExpenseList();
  updateSummaryCard();
}

// CREATE: Saves a new expense to local storage
function saveExpense(expense) {
  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  expenses.push(expense);
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function addMarker(expense) {
  if (!expense.location.lat || !expense.location.lng) return;

  const categoryEmoji = getCategoryEmoji(expense.category);

  const marker = new google.maps.Marker({
    position: { lat: expense.location.lat, lng: expense.location.lng },
    map: mainMap,
    title: `${expense.location.name} - ${expense.amount} MMK (${expense.notes})`,
    id: expense.id,
    label: {
      text: categoryEmoji,
      fontSize: "16px",
      color: "#000000",
    },
    icon: null,
  });

  const infoWindowContent = `
    <div style="
      font-family: 'Open Sans', sans-serif;
      color: var(--title-color, #1c1c1e);
      padding: 15px;
      max-width: 250px;
    ">
      <h3 style="
        font-size: 1.3rem;
        font-weight: 600;
        color: var(--rose-600, #e11d48);
        margin-bottom: 8px;
      ">${categoryEmoji} ${expense.location.name}</h3>
      <p style="margin-bottom: 4px;"><strong>Address:</strong> ${
        expense.location.address || "Not specified"
      }</p>
      <p style="margin-bottom: 4px;"><strong>Amount:</strong> <span style="
        color: var(--pink-500, #ec4899);
        font-weight: bold;
        font-size: 1.1em;
      ">${expense.amount} MMK</span></p>
      <p style="margin-bottom: 4px;"><strong>Category:</strong>
        <span style="
          background-color: #f7d6e0;
          color: var(--rose-600);
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 0.85em;
          font-weight: 600;
        ">${expense.category}</span>
      </p>
      <p style="margin-bottom: 4px;"><strong>Paid By:</strong> ${
        expense.paidBy
      }</p>
      <p style="margin-bottom: 4px;"><strong>Notes:</strong> ${
        expense.notes ||
        '<span style="font-style: italic; color: #777;">No notes</span>'
      }</p>
      <p style="margin-bottom: 0;"><strong>Date:</strong> ${new Date(
        expense.date
      ).toLocaleDateString()}</p>
      <button
        onclick="deleteExpense('${expense.id}')"
        class="delete-btn"
        style="
          margin-top: 15px;
          padding: 8px 15px;
          font-size: 0.95rem;
          background-color: var(--rose-600, #e11d48);
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        "
        onmouseover="this.style.backgroundColor='var(--rose-700, #be123c)'"
        onmouseout="this.style.backgroundColor='var(--rose-600, #e11d48)'"
      >
        Delete
      </button>
    </div>
  `;

  const infoWindow = new google.maps.InfoWindow({
    content: infoWindowContent,
  });

  marker.addListener("click", () => {
    if (currentInfoWindow) {
      currentInfoWindow.close();
    }
    infoWindow.open(mainMap, marker);
    currentInfoWindow = infoWindow;
  });

  markers.push(marker);
}

function getCategoryEmoji(category) {
  const emojiMap = {
    "Food & Dining": "🍽️",
    Travel: "✈️",
    Entertainment: "🎮",
    Shopping: "🛍️",
    Utilities: "💡",
    Health: "🩺",
    Other: "🔖",
  };
  return emojiMap[category] || "📍";
}

// READ: Filters expenses based on date range and displays them
function filterExpenses(filterType) {
  clearMarkers();
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  const now = new Date();
  let filteredExpenses = [];

  switch (filterType) {
    case "today":
      const today = now.toISOString().split("T")[0];
      filteredExpenses = expenses.filter((expense) => expense.date === today);
      break;
    case "this-week":
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      filteredExpenses = expenses.filter(
        (expense) => new Date(expense.date) >= startOfWeek
      );
      break;
    case "last-7-days":
      const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredExpenses = expenses.filter(
        (expense) => new Date(expense.date) >= last7Days
      );
      break;
    case "this-month":
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      filteredExpenses = expenses.filter(
        (expense) => new Date(expense.date) >= startOfMonth
      );
      break;
    case "last-30-days":
      const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filteredExpenses = expenses.filter(
        (expense) => new Date(expense.date) >= last30Days
      );
      break;
    case "this-year":
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      filteredExpenses = expenses.filter(
        (expense) => new Date(expense.date) >= startOfYear
      );
      break;
    case "all":
      filteredExpenses = [...expenses];
      break;
    case "custom":
      const startDate = new Date(document.getElementById("startDate").value);
      const endDate = new Date(document.getElementById("endDate").value);
      endDate.setHours(23, 59, 59, 999);
      filteredExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startDate && expenseDate <= endDate;
      });
      break;
  }

  filteredExpenses.forEach((expense) => addMarker(expense));
  if (filteredExpenses.length > 0) {
    const bounds = new google.maps.LatLngBounds();
    filteredExpenses.forEach((expense) => {
      if (expense.location.lat && expense.location.lng) {
        bounds.extend(
          new google.maps.LatLng(expense.location.lat, expense.location.lng)
        );
      }
    });
    if (mainMap && !bounds.isEmpty()) {
      mainMap.fitBounds(bounds);
    } else if (mainMap) {
      mainMap.setCenter({ lat: 16.8409, lng: 96.1735 });
      mainMap.setZoom(12);
    }
  } else if (mainMap) {
    mainMap.setCenter({ lat: 16.8409, lng: 96.1735 });
    mainMap.setZoom(12);
  }
  updateSummaryCard();
  renderFilteredExpenseList(filteredExpenses);
}

function applyCustomFilter() {
  filterExpenses("custom");
}

function clearMarkers() {
  markers.forEach((marker) => marker.setMap(null));
  markers = [];
}

// READ: Renders filtered expenses in the DataTable
function renderFilteredExpenseList(filteredExpenses) {
  // Destroy existing DataTable if initialized
  if ($.fn.DataTable.isDataTable("#expenseTable")) {
    expenseDataTable.destroy();
  }

  // Format data for proper sorting
  const formattedData = filteredExpenses.map((expense) => ({
    ...expense,
    dateSort: isNaN(new Date(expense.date).getTime())
      ? 0
      : new Date(expense.date).getTime(), // Numeric timestamp for sorting
    amountSort: isNaN(parseFloat(expense.amount))
      ? 0
      : parseFloat(expense.amount), // Ensure amount is numeric for sorting
    amountFormatted: `${parseFloat(expense.amount).toLocaleString()} MMK`, // Formatted for display
  }));

  // Initialize DataTable
  expenseDataTable = $("#expenseTable").DataTable({
    data: formattedData,
    responsive: {
      details: {
        display: $.fn.dataTable.Responsive.display.modal({
          header: function (row) {
            var data = row.data();
            return "Details for " + (data.location?.name || "General Expense");
          },
        }),
        renderer: $.fn.dataTable.Responsive.renderer.tableAll({
          tableClass: "table",
        }),
      },
    },
    order: [[4, "desc"]], // Default sort by date (descending)
    columns: [
      {
        data: "location.name",
        defaultContent: "General Expense",
        render: function (data, type, row) {
          const paidByColor = row.paidBy === "Partner 1" ? "blue" : "green";
          return `<span style="color: ${paidByColor};">${
            data || "General Expense"
          }</span>`;
        },
        className: "all",
      },
      {
        data: "notes",
        defaultContent: "",
        className: "desktop",
      },
      {
        data: "category",
        className: "desktop",
        render: function (data, type, row) {
          const paidByColor = row.paidBy === "Partner 1" ? "blue" : "green";
          return `<span style="color: ${paidByColor};">${data}</span>`;
        },
      },
      {
        data: "paidBy",
        className: "all",
      },
      {
        data: "dateSort", // Use dateSort for sorting
        render: function (data, type, row) {
          // Display formatted date
          return type === "display" || type === "filter"
            ? new Date(row.date).toLocaleDateString("en-GB")
            : data; // Return numeric timestamp for sorting
        },
        className: "all",
        type: "num", // Explicitly set to numeric for sorting
      },
      {
        data: "amountSort", // Use amountSort for sorting
        render: function (data, type, row) {
          // Display formatted amount
          return type === "display" || type === "filter"
            ? row.amountFormatted
            : data; // Return numeric amount for sorting
        },
        className: "all",
        type: "num", // Explicitly set to numeric for sorting
      },
      {
        data: null,
        orderable: false,
        render: function (data, type, row) {
          return `
            <button class="btn btn-outline-primary btn-sm edit-btn" onclick="editExpense('${row.id}')">
              Edit
            </button>
            <button class="btn btn-danger btn-sm delete-btn" onclick="deleteExpense('${row.id}')">
              Delete
            </button>
          `;
        },
        className: "all",
      },
    ],
    columnDefs: [
      {
        orderable: false,
        targets: [6], // Disable sorting on action buttons
      },
      { responsivePriority: 1, targets: [5] }, // Amount
      { responsivePriority: 2, targets: [0] }, // Location
      { responsivePriority: 3, targets: [3] }, // Paid By
      { responsivePriority: 4, targets: [4] }, // Date
      { responsivePriority: 5, targets: [6] }, // Actions
      { responsivePriority: 10001, targets: [1] }, // Notes
      { responsivePriority: 10002, targets: [2] }, // Category
    ],
    language: {
      emptyTable: "No expenses found.",
    },
    rowCallback: function (row, data) {
      $(row).on("click", function (e) {
        if (
          $(e.target).hasClass("edit-btn") ||
          $(e.target).hasClass("delete-btn") ||
          $(e.target).closest(".edit-btn").length ||
          $(e.target).closest(".delete-btn").length
        ) {
          return;
        }
        if (data.location?.lat && data.location?.lng) {
          if (
            typeof mainMap !== "undefined" &&
            typeof bootstrap !== "undefined"
          ) {
            mainMap.setCenter({
              lat: data.location.lat,
              lng: data.location.lng,
            });
            mainMap.setZoom(18);
            const mapTab = new bootstrap.Tab(
              document.getElementById("map-tab")
            );
            mapTab.show();
          } else {
            console.warn(
              "mainMap or bootstrap not defined. Cannot show location on map."
            );
          }
        }
      });
    },
  });
}

$(document).ready(function () {
  if (!$.fn.DataTable.isDataTable("#expenseTable")) {
    expenseDataTable = $("#expenseTable").DataTable({
      responsive: {
        details: {
          display: $.fn.dataTable.Responsive.display.modal({
            header: function (row) {
              var data = row.data();
              return (
                "Details for " + (data.location?.name || "General Expense")
              );
            },
          }),
          renderer: $.fn.dataTable.Responsive.renderer.tableAll({
            tableClass: "table",
          }),
        },
      },
      order: [[4, "desc"]],
      columns: [
        { data: "location.name", defaultContent: "General Expense" },
        { data: "notes", defaultContent: "" },
        { data: "category" },
        { data: "paidBy" },
        { data: "date" },
        { data: "amount" },
        { data: null, orderable: false },
      ],
      columnDefs: [
        { orderable: false, targets: [6] },
        { responsivePriority: 1, targets: [5] },
        { responsivePriority: 2, targets: [0] },
        { responsivePriority: 3, targets: [3] },
        { responsivePriority: 4, targets: [4] },
        { responsivePriority: 5, targets: [6] },
        { responsivePriority: 10001, targets: [1] },
        { responsivePriority: 10002, targets: [2] },
      ],
      language: {
        emptyTable: "No expenses found.",
      },
    });
  }
});

// READ: Triggers expense list rendering (calls filterExpenses)
function renderExpenseList() {
  filterExpenses(currentFilter);
}

// UPDATE: Prepares form for editing an existing expense
function editExpense(id) {
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  const expense = expenses.find((exp) => exp.id === id);
  if (!expense) {
    showToast("Expense not found!");
    return;
  }

  editingExpenseId = id;

  document.getElementById("amount").value = expense.amount;
  document.getElementById("category").value = expense.category || "Other";
  document.getElementById("date").value = expense.date;
  document.getElementById("paidBy").value = expense.paidBy || "Partner 1";
  document.getElementById("notes").value = expense.notes || "";
  document.getElementById("includeLocation").checked = !!(
    expense.location &&
    expense.location.lat &&
    expense.location.lng
  );

  if (expense.location && expense.location.lat && expense.location.lng) {
    document.getElementById("locationSection").classList.remove("d-none");
    document.getElementById("autocomplete").value = expense.location.name || "";
    document.getElementById("locationInfo").classList.remove("d-none");
    document.getElementById(
      "locationInfo"
    ).textContent = `Selected: ${expense.location.name}, ${expense.location.address}`;
    selectedLocation = { ...expense.location };

    expenseMap.setCenter({
      lat: expense.location.lat,
      lng: expense.location.lng,
    });
    expenseMap.setZoom(15);
    if (currentMarker) currentMarker.setMap(null);
    if (accuracyCircle) accuracyCircle.setMap(null);
    currentMarker = new google.maps.Marker({
      position: { lat: expense.location.lat, lng: expense.location.lng },
      map: expenseMap,
      title: expense.location.name,
    });
  } else {
    document.getElementById("locationSection").classList.add("d-none");
    document.getElementById("locationInfo").classList.add("d-none");
    document.getElementById("autocomplete").value = "";
    selectedLocation = null;
    if (currentMarker) currentMarker.setMap(null);
    if (accuracyCircle) accuracyCircle.setMap(null);
    currentMarker = null;
    accuracyCircle = null;
  }

  document
    .getElementById("expenseFormCard")
    .querySelector(".card-title").textContent = "Edit Expense";
  document.getElementById("submitExpense").innerHTML =
    '<i class="bi bi-save me-1"></i> Save Changes';
}

// UPDATE: Updates an existing expense in local storage
function updateExpense(id) {
  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  const expenseIndex = expenses.findIndex((exp) => exp.id === id);
  if (expenseIndex === -1) {
    showToast("Expense not found!");
    return;
  }

  const amount = document.getElementById("amount").value.trim();
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;
  const paidBy = document.getElementById("paidBy").value;
  const notes = document.getElementById("notes").value;
  const includeLocation = document.getElementById("includeLocation").checked;

  if (!amount || !category || !date || !paidBy) {
    showToast("Please fill in all required fields");
    return;
  }

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    showToast("Please enter a valid positive amount");
    return;
  }

  const updatedExpense = {
    id: id,
    amount: parsedAmount,
    category: category,
    date: date,
    paidBy: paidBy,
    notes: notes,
    location:
      includeLocation && selectedLocation
        ? selectedLocation
        : {
            name: "Unknown",
            address: "No location provided",
            lat: null,
            lng: null,
          },
  };

  expenses[expenseIndex] = updatedExpense;
  localStorage.setItem("expenses", JSON.stringify(expenses));

  resetForm();
  loadData();
  showToast("Expense updated successfully!");
}

function resetForm() {
  document.getElementById("expenseForm").reset();
  document.getElementById("date").valueAsDate = new Date();
  document.getElementById("includeLocation").checked = false;
  document.getElementById("locationSection").classList.add("d-none");
  document.getElementById("locationInfo").classList.add("d-none");
  document.getElementById("autocomplete").value = "";
  selectedLocation = null;
  if (currentMarker) currentMarker.setMap(null);
  if (accuracyCircle) accuracyCircle.setMap(null);
  currentMarker = null;
  accuracyCircle = null;
  expenseMap.setCenter({ lat: 16.8409, lng: 96.1735 });
  expenseMap.setZoom(12);
  editingExpenseId = null;
  document
    .getElementById("expenseFormCard")
    .querySelector(".card-title").textContent = "Add New Expense";
  document.getElementById("submitExpense").innerHTML =
    '<i class="bi bi-plus me-1"></i> Add Transaction';
}

// DELETE: Removes an expense from local storage
function deleteExpense(id) {
  if (confirm("Are you sure you want to delete this expense?")) {
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses = expenses.filter((expense) => expense.id !== id);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    loadData();
  }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// READ: Updates summary card with aggregated expense data
function updateSummaryCard() {
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  if (expenses.length === 0) {
    document.getElementById("totalExpenses").textContent = "0 MMK";
    document.getElementById("totalDistance").textContent = "0 km";
    document.getElementById("totalLocations").textContent = "0";
    document.getElementById("avgExpense").textContent = "0 MMK";
    return;
  }
  let total = 0;
  const locations = new Set();
  expenses.forEach((expense) => {
    total += parseFloat(expense.amount) || 0;
    locations.add(expense.location.name);
  });
  let distance = 0;
  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  for (let i = 1; i < sortedExpenses.length; i++) {
    const prev = sortedExpenses[i - 1];
    const curr = sortedExpenses[i];
    if (
      prev.location.lat &&
      prev.location.lng &&
      curr.location.lat &&
      curr.location.lng
    ) {
      distance += calculateDistance(
        prev.location.lat,
        prev.location.lng,
        curr.location.lat,
        curr.location.lng
      );
    }
  }
  const avg = expenses.length > 0 ? total / expenses.length : 0;
  document.getElementById("totalExpenses").textContent =
    total.toFixed(0) + " MMK";
  document.getElementById("totalDistance").textContent =
    distance.toFixed(2) + " km";
  document.getElementById("totalLocations").textContent = locations.size;
  document.getElementById("avgExpense").textContent = avg.toFixed(0) + " MMK";
}

// READ: Exports expenses from the last two months as CSV
function exportLastTwoMonthsData() {
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
  const filteredExpenses = expenses
    .filter((expense) => new Date(expense.date) >= twoMonthsAgo)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  const exportData = filteredExpenses.slice(0, 20);
  if (exportData.length === 0) {
    showToast("No data found for the last 2 months");
    return;
  }
  let csv =
    "Date,Location,Address,Amount,Category,PaidBy,Notes,Latitude,Longitude\n";
  exportData.forEach((expense) => {
    csv += `"${new Date(expense.date).toLocaleDateString()}","${
      expense.location.name
    }","${expense.location.address}","${expense.amount}","${
      expense.category
    }","${expense.paidBy}","${expense.notes || ""}","${
      expense.location.lat || ""
    }","${expense.location.lng || ""}"\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("hidden", "");
  a.setAttribute("href", url);
  a.setAttribute("download", "expense_data_last_2_months.csv");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// CREATE/UPDATE: Handles form submission for adding or updating expenses
document.getElementById("expenseForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const amount = document.getElementById("amount").value.trim();
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;
  const paidBy = document.getElementById("paidBy").value;
  const notes = document.getElementById("notes").value;
  const includeLocation = document.getElementById("includeLocation").checked;

  if (!amount || !category || !date || !paidBy) {
    showToast("Please fill in all required fields");
    return;
  }

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    showToast("Please enter a valid positive amount");
    return;
  }

  if (editingExpenseId) {
    updateExpense(editingExpenseId);
  } else {
    const expense = {
      id: Date.now().toString(),
      amount: parsedAmount,
      category: category,
      date: date,
      paidBy: paidBy,
      notes: notes,
      location:
        includeLocation && selectedLocation
          ? selectedLocation
          : {
              name: "Unknown",
              address: "No location provided",
              lat: null,
              lng: null,
            },
    };
    saveExpense(expense);
    loadData();
    showToast("Expense added successfully!");
  }

  resetForm();
});

document.getElementById("cancelExpense").addEventListener("click", () => {
  resetForm();
});

function showToast(message, type = "success") {
  const toastElement = document.getElementById("toast");
  const toastBody = toastElement.querySelector(".toast-body");

  // Set the message
  toastBody.textContent = message;

  // Apply type-specific styling
  toastElement.classList.remove("success", "error");
  toastElement.classList.add(type);

  // Initialize and show the toast
  const toast = new bootstrap.Toast(toastElement, {
    autohide: true,
    delay: 3000, // Auto-hide after 3 seconds
  });
  toast.show();
}

window.initMap = initMap;
