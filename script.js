// Section Toggle Script
document.querySelectorAll("[data-target]").forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();

    // Hide all contents
    document.querySelectorAll(".content-section").forEach((content) => {
      content.classList.add("d-none");
    });

    // Show target content
    const targetId = button.dataset.target; // or button.getAttribute('data-target')
    const contentToShow = document.getElementById(targetId);
    if (contentToShow) {
      contentToShow.classList.remove("d-none");
    }

    // Update active state
    document.querySelectorAll(".nav__link").forEach((navLink) => {
      navLink.classList.remove("active-link");
    });
    button.classList.add("active-link");
  });
});

// google Map Section
let expenseMap,
  mapMap,
  expenseMarker,
  mapMarker,
  expenseAutocomplete,
  mapAutocomplete;

function initMap() {
  // Expense Map Initialization
  const defaultLocation = { lat: 16.8661, lng: 96.1951 }; // Yangon
  expenseMap = new google.maps.Map(document.getElementById("expenseMap"), {
    center: defaultLocation,
    zoom: 13,
  });
  expenseMarker = new google.maps.Marker({ map: expenseMap });

  const expenseInput = document.getElementById("autocomplete");
  expenseAutocomplete = new google.maps.places.Autocomplete(expenseInput);
  expenseAutocomplete.bindTo("bounds", expenseMap);

  expenseAutocomplete.addListener("place_changed", () => {
    const place = expenseAutocomplete.getPlace();
    if (!place.geometry) return;

    expenseMap.setCenter(place.geometry.location);
    expenseMap.setZoom(15);
    expenseMarker.setPosition(place.geometry.location);

    // formData ကို သင့် script.js ကနေ သုံးမယ်လို့ ယူထားပါတယ်
    window.formData = window.formData || {};
    window.formData.location = {
      name: place.name,
      address: place.formatted_address,
    };

    document.getElementById("location-info").innerHTML = `
        <strong>${place.name}</strong><br>
        Address: ${place.formatted_address}
      `;
  });

  expenseInput.addEventListener("click", () => {
    expenseInput.value = "";
  });

  // Map Section Initialization
  mapMap = new google.maps.Map(document.getElementById("mapMap"), {
    center: defaultLocation,
    zoom: 13,
  });
  mapMarker = new google.maps.Marker({ map: mapMap });

  const mapInput = document.getElementById("searchInput");
  mapAutocomplete = new google.maps.places.Autocomplete(mapInput);
  mapAutocomplete.bindTo("bounds", mapMap);

  mapAutocomplete.addListener("place_changed", () => {
    const place = mapAutocomplete.getPlace();
    if (!place.geometry) {
      alert("No details available for input: '" + place.name + "'");
      return;
    }

    mapMap.setCenter(place.geometry.location);
    mapMap.setZoom(15);

    if (mapMarker) mapMarker.setMap(null);
    mapMarker = new google.maps.Marker({
      map: mapMap,
      position: place.geometry.location,
    });
  });

  mapInput.addEventListener("click", () => {
    mapInput.value = "";
  });
}

// expense section
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
  includeLocation = !!expense.location; // location ရှိရင် true
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


// Call the map initialization when the expense section is loaded
document.addEventListener("DOMContentLoaded", () => {
  const expenseSection = document.getElementById("expense");
  if (expenseSection) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (!expenseSection.classList.contains("d-none")) {
          initializeExpenseMap();
          observer.disconnect(); // Stop observing once map is initialized
        }
      });
    });
    observer.observe(expenseSection, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }
});

// music
const musicContainer = document.getElementById("music-container");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const audio = document.getElementById("audio");
const progress = document.getElementById("progress");
const progressContainer = document.getElementById("progress-container");
const title = document.getElementById("music-title");
const cover = document.getElementById("cover");
const currTime = document.querySelector("#currTime");
const durTime = document.querySelector("#durTime");

// Visualizer Elements
const visualizerBars = document.querySelectorAll(".visualizer-bar");

// Song titles
const songs = ["hey", "summer", "ukulele", "EternalGosh", "Emoji"];

// Keep track of song
let songIndex = 2;

// Audio Visualization Variables
let audioContext = null;
let analyser = null;
let dataArray = null;
let animationFrameId = null;

// Initially load song details into DOM
loadSong(songs[songIndex]);

// Update song details
function loadSong(song) {
  title.innerText = song;
  audio.src = `music/${song}.mp3`;
  cover.src = `images/${song}.jpg`;
}

// Play song
function playSong() {
  musicContainer.classList.add("play");
  playBtn.querySelector("i.fas").classList.remove("fa-play");
  playBtn.querySelector("i.fas").classList.add("fa-pause");

  audio.play();
  setupAudioVisualization();
}

// Pause song
function pauseSong() {
  musicContainer.classList.remove("play");
  playBtn.querySelector("i.fas").classList.add("fa-play");
  playBtn.querySelector("i.fas").classList.remove("fa-pause");

  audio.pause();
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
}

// Previous song
function prevSong() {
  songIndex--;

  if (songIndex < 0) {
    songIndex = songs.length - 1;
  }

  loadSong(songs[songIndex]);
  playSong();
}

// Next song
function nextSong() {
  songIndex++;

  if (songIndex > songs.length - 1) {
    songIndex = 0;
  }

  loadSong(songs[songIndex]);
  playSong();
}

// Update progress bar
function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
}

// Set progress bar
function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
}

// Get duration & currentTime for Time of song
function DurTime(e) {
  const { duration, currentTime } = e.srcElement;
  let sec;
  let sec_d;

  // Define minutes currentTime
  let min = currentTime == null ? 0 : Math.floor(currentTime / 60);
  min = min < 10 ? "0" + min : min;

  // Define seconds currentTime
  function get_sec(x) {
    if (Math.floor(x) >= 60) {
      for (let i = 1; i <= 60; i++) {
        if (Math.floor(x) >= 60 * i && Math.floor(x) < 60 * (i + 1)) {
          sec = Math.floor(x) - 60 * i;
          sec = sec < 10 ? "0" + sec : sec;
        }
      }
    } else {
      sec = Math.floor(x);
      sec = sec < 10 ? "0" + sec : sec;
    }
  }

  get_sec(currentTime);

  // Change currentTime DOM
  if (currTime) currTime.innerHTML = min + ":" + sec;

  // Define minutes duration
  let min_d = isNaN(duration) ? "0" : Math.floor(duration / 60);
  min_d = min_d < 10 ? "0" + min_d : min_d;

  function get_sec_d(x) {
    if (Math.floor(x) >= 60) {
      for (let i = 1; i <= 60; i++) {
        if (Math.floor(x) >= 60 * i && Math.floor(x) < 60 * (i + 1)) {
          sec_d = Math.floor(x) - 60 * i;
          sec_d = sec_d < 10 ? "0" + sec_d : sec_d;
        }
      }
    } else {
      sec_d = isNaN(duration) ? "0" : Math.floor(x);
      sec_d = sec_d < 10 ? "0" + sec_d : sec_d;
    }
  }

  // Define seconds duration
  get_sec_d(duration);

  // Change duration DOM
  if (durTime) durTime.innerHTML = min_d + ":" + sec_d;
}

// Setup Audio Visualization
function setupAudioVisualization() {
  if (audioContext) return;

  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audio);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);
    analyser.connect(audioContext.destination);

    animateBars();
  } catch (err) {
    console.error("Error setting up audio visualization:", err);
  }
}

// Animate Visualizer Bars
function animateBars() {
  if (!analyser || !dataArray) return;

  analyser.getByteFrequencyData(dataArray);

  visualizerBars.forEach((bar, i) => {
    const start = i * 4;
    const end = start + 4;
    const slice = dataArray.slice(start, end);
    const average = slice.reduce((a, b) => a + b, 0) / slice.length;
    const height = Math.max(20, (average / 255) * 80);
    bar.style.height = `${height}%`;
  });

  animationFrameId = requestAnimationFrame(animateBars);
}

// Event listeners
playBtn.addEventListener("click", () => {
  const isPlaying = musicContainer.classList.contains("play");
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

// Change song
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);

// Time/song update
audio.addEventListener("timeupdate", updateProgress);

// Click on progress bar
progressContainer.addEventListener("click", setProgress);

// Song ends
audio.addEventListener("ended", nextSong);

// Time of song
audio.addEventListener("timeupdate", DurTime);

//footer
document.getElementById("currentYear").textContent = new Date().getFullYear();
