// -----------------------------
// 1. Configuration & Data
// -----------------------------
const rows = 6;
const cols = 12; // desktop layout
const total = rows * cols;

// Two available seats (just for demo purposes)
const availableIndices = [10, 27];

// Build seat model
const seats = Array.from({length: total}, (_, i) => ({
  id: i+1,
  status: availableIndices.includes(i) ? 'available' : 'booked'
}));

let selected = new Set();

// -----------------------------
// 2. DOM Elements
// -----------------------------
const chart = document.getElementById('chart');
const availableCountEl = document.getElementById('available-count');
const selectedCountEl = document.getElementById('selected-count');
const confirmBtn = document.getElementById('confirm-btn');

// NEW: Grab the input fields
const nameInput = document.getElementById('user-name');
const emailInput = document.getElementById('user-email');

// -----------------------------
// 3. Render Function
// -----------------------------
function render(){
  chart.innerHTML = '';
  seats.forEach((seat, idx) => {
    const el = document.createElement('button');
    el.className = 'seat ' + seat.status;
    el.setAttribute('data-id', seat.id);
    el.setAttribute('aria-label', `Seat ${seat.id} - ${seat.status}`);
    el.innerHTML = seat.id;

    // Tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = seat.status === 'available' ? `Seat ${seat.id} — Available` : `Seat ${seat.id} — Booked`;
    el.appendChild(tooltip);

    // Event Listeners for Seats
    if(seat.status === 'available'){
      el.addEventListener('click', ()=>{ toggleSelect(idx, el); });
    } else {
      el.addEventListener('mouseenter', ()=> el.style.filter='grayscale(0.1)');
      el.addEventListener('mouseleave', ()=> el.style.filter='');
    }

    chart.appendChild(el);
  });

  updateCounts();
}

// -----------------------------
// 4. Selection Logic
// -----------------------------
function toggleSelect(index, el){
  const seat = seats[index];
  if(seat.status !== 'available') return;
  
  if(selected.has(index)){
    selected.delete(index);
    el.classList.remove('selected');
    el.classList.add('available');
  } else {
    selected.add(index);
    el.classList.remove('available');
    el.classList.add('selected');
  }
  
  updateCounts(); // Updates text and checks validation
}

// -----------------------------
// 5. Validation & Updates (MODIFIED)
// -----------------------------
function updateCounts(){
  const available = seats.filter(s => s.status === 'available').length;
  availableCountEl.textContent = available - selected.size;
  selectedCountEl.textContent = selected.size;

  // Change background if full
  if(available - selected.size <= 0){
    availableCountEl.parentElement.style.background = 'rgba(220,80,80,0.12)';
  } else {
    availableCountEl.parentElement.style.background = 'rgba(255,255,255,0.04)';
  }

  // CALL VALIDATION EVERY TIME A SEAT IS CLICKED
  checkFormState();
}

// NEW: Central Validation Function
function checkFormState() {
  const hasSeats = selected.size > 0;
  // Check if inputs exist (to prevent errors if HTML is missing) and have text
  const hasName = nameInput && nameInput.value.trim() !== "";
  const hasEmail = emailInput && emailInput.value.trim() !== "";

  if (hasSeats && hasName && hasEmail) {
    confirmBtn.disabled = false;
    confirmBtn.classList.add('active'); // Adds the purple color defined in CSS
  } else {
    confirmBtn.disabled = true;
    confirmBtn.classList.remove('active');
  }
}

// -----------------------------
// 6. Input Event Listeners
// -----------------------------
// Listen for typing in the input fields to trigger validation immediately
if(nameInput) nameInput.addEventListener('input', checkFormState);
if(emailInput) emailInput.addEventListener('input', checkFormState);


// -----------------------------
// 7. Confirm Booking Action
// -----------------------------
confirmBtn.addEventListener('click', ()=>{
  if(confirmBtn.disabled) return;

  // Mark seats as booked
  selected.forEach(i => { seats[i].status = 'booked'; });
  selected.clear();
  
  render(); // Re-render the chart
  
  // Custom alert using the Name Input
  const userName = nameInput.value;
  alert(`Thanks ${userName} — your seat(s) have been booked!`);
  
  // Optional: Reset inputs after booking
  nameInput.value = "";
  emailInput.value = "";
  checkFormState(); // Disable button again
});

// -----------------------------
// 8. Initialization
// -----------------------------
render();

// Keyboard support: 'b' to confirm (Only if valid)
document.addEventListener('keydown', (e)=>{
  if(e.key === 'b' && !confirmBtn.disabled){
    confirmBtn.click();
  }
});