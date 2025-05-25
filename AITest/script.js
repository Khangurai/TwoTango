// Initialize map
const map = L.map('map').setView([51.505, -0.09], 13); // Default center (London)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Local storage for expenses and places
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let places = JSON.parse(localStorage.getItem('places')) || [];
let markers = [];

// Expense Tracker Functions
function addExpense(desc, amount, date, category) {
    expenses.push({ desc, amount: parseFloat(amount), date, category });
    localStorage.setItem('expenses', JSON.stringify(expenses));
    renderExpenses();
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    renderExpenses();
}

function renderExpenses() {
    const $list = $('#expense-list');
    $list.empty();
    let total = 0;
    expenses.forEach((exp, index) => {
        total += exp.amount;
        $list.append(`
            <li class="list-item">
                ${exp.desc} - $${exp.amount.toFixed(2)} (${exp.category}, ${exp.date})
                <button class="btn btn-sm bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 delete-expense" data-index="${index}">Delete</button>
            </li>
        `);
    });
    $('#expense-total').text(total.toFixed(2));
}

// Map Tracker Functions
function addPlace(name, note, lat, lng) {
    places.push({ name, note, lat: parseFloat(lat), lng: parseFloat(lng) });
    localStorage.setItem('places', JSON.stringify(places));
    renderPlaces();
}

function deletePlace(index) {
    places.splice(index, 1);
    localStorage.setItem('places', JSON.stringify(places));
    renderPlaces();
}

function renderPlaces() {
    const $list = $('#place-list');
    $list.empty();
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    places.forEach((place, index) => {
        $list.append(`
            <li class="list-item">
                ${place.name} - ${place.note} (${place.lat}, ${place.lng})
                <button class="btn btn-sm bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 delete-place" data-index="${index}">Delete</button>
            </li>
        `);
        const marker = L.marker([place.lat, place.lng]).addTo(map)
            .bindPopup(`<b>${place.name}</b><br>${place.note}`);
        markers.push(marker);
    });

    if (places.length > 0) {
        const coords = places.map(p => [p.lat, p.lng]);
        map.fitBounds(coords);
    }
}

// Tab Switching
function showSection(section) {
    $('.section').addClass('hidden');
    $(`#${section}-section`).removeClass('hidden');
    $('#expense-tab, #map-tab').removeClass('active-tab');
    $(`#${section}-tab`).addClass('active-tab');
}

// Event Listeners
$(document).ready(() => {
    // Expense form submission
    $('#expense-form').on('submit', (e) => {
        e.preventDefault();
        const desc = $('#expense-desc').val();
        const amount = $('#expense-amount').val();
        const date = $('#expense-date').val();
        const category = $('#expense-category').val();
        addExpense(desc, amount, date, category);
        $('#expense-form')[0].reset();
    });

    // Place form submission
    $('#place-form').on('submit', (e) => {
        e.preventDefault();
        const name = $('#place-name').val();
        const note = $('#place-note').val();
        const lat = $('#place-lat').val();
        const lng = $('#place-lng').val();
        addPlace(name, note, lat, lng);
        $('#place-form')[0].reset();
    });

    // Delete expense
    $(document).on('click', '.delete-expense', function() {
        const index = $(this).data('index');
        deleteExpense(index);
    });

    // Delete place
    $(document).on('click', '.delete-place', function() {
        const index = $(this).data('index');
        deletePlace(index);
    });

    // Initialize
    renderExpenses();
    renderPlaces();
});