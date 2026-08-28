
// Global booking state
async function fetchFleetFromSupabase() {
    if (!window.supabase) return;
    try {
        const [motoRes, carRes, optionsRes, pricingRes] = await Promise.all([
            window.supabase.from('motorcycles').select('*').order('display_order', { ascending: true }),
            window.supabase.from('cars').select('*').order('display_order', { ascending: true }),
            window.supabase.from('rental_options').select('*').order('id', { ascending: true }),
            window.supabase.from('pricing_rules').select('*').order('id', { ascending: true })
        ]);

        if (!motoRes.error && motoRes.data && motoRes.data.length > 0) {
            const fetched = motoRes.data.map(row => ({
                id: row.id,
                name: row.name,
                type: row.type,
                pricePerDay: row.price_per_day,
                imageUrl: row.image_url,
                specs: {
                    engine: row.engine,
                    power: row.power,
                    seatHeight: row.seat_height,
                    weight: row.weight
                }
            }));
            MOTORCYCLES.splice(0, MOTORCYCLES.length, ...fetched);
        }

        if (!carRes.error && carRes.data && carRes.data.length > 0) {
            const fetched = carRes.data.map(row => ({
                id: row.id,
                name: row.name,
                type: row.type,
                pricePerDay: row.price_per_day,
                imageUrl: row.image_url,
                specs: {
                    engine: row.engine,
                    drive: row.drive,
                    seats: row.seats,
                    fuel: row.fuel
                }
            }));
            FOURXFOUR.splice(0, FOURXFOUR.length, ...fetched);
        }

        if (!optionsRes.error && optionsRes.data && optionsRes.data.length > 0) {
            const fetched = optionsRes.data.map(row => ({
                id: row.id,
                name: row.name,
                price: row.price_per_day,
                type: row.type,
                description: row.description
            }));
            RENTAL_OPTIONS.splice(0, RENTAL_OPTIONS.length, ...fetched);
        }

        if (!pricingRes.error && pricingRes.data && pricingRes.data.length > 0) {
            const fetched = pricingRes.data.map(row => ({
                id: row.id,
                name: row.name,
                type: row.type,
                impactType: row.impact_type,
                value: row.value,
                start: row.start_date || '',
                end: row.end_date || ''
            }));
            if (typeof PRICING_RULES !== 'undefined') {
                PRICING_RULES.splice(0, PRICING_RULES.length, ...fetched);
            }
        }
    } catch (e) {
        console.warn('Failed to fetch fleet from Supabase, using fallback', e);
    }
}

async function fetchPromoCodesFromSupabase() {
    if (!window.supabase) return;
    try {
        const { data, error } = await window.supabase
            .from('promo_codes')
            .select('*');

        if (error) throw error;

        const promos = {};
        if (data && data.length > 0) {
            data.forEach(row => {
                promos[row.code] = {
                    discount: row.discount,
                    description: row.description
                };
            });
            localStorage.setItem('admin_promo_codes', JSON.stringify(promos));
        }
    } catch (e) {
        console.warn('Failed to fetch promo codes from Supabase, using fallback', e);
    }
}

function formatOptions(options) {
    const optionNames = {
        'helmet': 'Casque',
        'insurance': 'Assurance supplémentaire',
        'gps': 'GPS Navigation',
        'side-cases': 'Sacs latéraux'
    };
    return Object.keys(options).map(key => ({
        name: optionNames[key] || key,
        price: formatCurrency(options[key])
    }));
}

function formatOrderOptions(options) {
    const optionNames = {
        'helmet': 'Casque',
        'insurance': 'Assurance supplémentaire',
        'gps': 'GPS Navigation',
        'side-cases': 'Sacs latéraux'
    };
    
    return Object.keys(options).map(key => ({
        name: optionNames[key] || key,
        price: formatCurrency(options[key])
    }));
}

function formatCalendarDate(dateString, timeString) {
    const date = new Date(dateString + 'T' + timeString);
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

// New helper functions required by orderEmailParams
function generateBookingNumber() {
    // Generates a reasonably unique booking reference
    return 'XCC-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
}

function formatCurrency(amount) {
    // Normalizes input and formats using French locale, suffix with €
    const num = Number(String(amount).replace(/[^\d.-]+/g, '')) || 0;
    // Use up to 2 decimal places but drop decimals for whole numbers
    const formatted = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(num);
    return formatted + ' €';
}

function formatDate(dateString) {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('fr-FR');
}

function calculateBasePrice() {
    const vehicle = bookingState.vehicle || bookingState.motorcycle;
    if (!vehicle || !bookingState.pickupDate || !bookingState.returnDate) {
        return 0;
    }
    const days = calculateRentalDays();
    const pickup = new Date(bookingState.pickupDate);
    let total = 0;
    for (let i = 0; i < days; i++) {
        const d = new Date(pickup);
        d.setDate(d.getDate() + i);
        const currentDate = d.toISOString().split('T')[0];
        total += getEffectivePrice(vehicle.pricePerDay, currentDate);
    }
    return total;
}

function buildEmailHTMLOption(data) {
  const optionsArray = Object.entries(data.options).map(([name, price]) => ({
    name,
    price,
  }));

  const hasOptions = optionsArray.length > 0;

  // Build the PRICE SECTION
  const priceHTML = optionsArray
    .map(
      (opt) => `
        <div class="detail-item">
            <span class="detail-label">${opt.name} </span>
            <span class="detail-value">${opt.price} €</span>
        </div>
    `
    )
    .join("");

  // Build the OPTIONS YES/NO section
  const optionsHTML = hasOptions
    ? optionsArray
        .map(
          (opt) => `
            <div class="detail-item">
                <span class="detail-label">${opt.name}:</span>
                <span class="detail-value">OUI</span>
            </div>
        `
        )
        .join("")
    : `
            <div class="detail-item">
                <span class="detail-label">Options:</span>
                <span class="detail-value">AUCUNE</span>
            </div>
        `;

  const vehicle = data.vehicle || data.motorcycle;
  const bookingDate = data.pickupDate || new Date().toISOString().split('T')[0];
    // Final HTML
  return `
        <div class="section">
            <h2 class="section-title">💰 DÉTAILS FINANCIERS</h2>

            <div class="info-grid">
                <div class="info-card">
                    <h3>💵 DÉCOMPTE</h3>

                    <div class="detail-item">
                        <span class="detail-label">Location:</span>
                        <span class="detail-value">${getEffectivePrice(vehicle.pricePerDay, bookingDate)} €</span>
                    </div>

                    ${priceHTML} 
                </div>

                <div class="info-card">
                    <h3>📊 OPTIONS</h3>
                    ${optionsHTML}
                </div>
            </div>
        </div>
    `;
}

// Supabase table expectation (create this table in your Supabase project):
//
// create table public.bookings (
//   id uuid default gen_random_uuid() primary key,
//   created_at timestamptz default now() not null,
//   status text default 'pending',
//   vehicle_type text,
//   vehicle_id text,
//   vehicle_name text,
//   vehicle_price_per_day numeric,
//   vehicle_image_url text,
//   pickup_date date,
//   return_date date,
//   pickup_time text,
//   return_time text,
//   total_days integer,
//   total_cost numeric,
//   options jsonb,
//   promo_code text,
//   discount_percent numeric,
//   original_price numeric,
//   first_name text,
//   last_name text,
//   email text,
//   phone text,
//   country text,
//   license_number text,
//   agree_terms boolean,
//   admin_note text
// );
//
// IMPORTANT: Do NOT expose a privileged service role key to the browser. Use the anon key
// with Row Level Security (RLS) policies that only allow inserts to `bookings`.
// Alternatively, route inserts through a server endpoint that uses a service key.

let bookingState = {
  vehicle: null,
  vehicleType: 'motorcycle', // 'motorcycle' or 'car'
  pickupDate: "",
  returnDate: "",
  pickupTime: "",
  returnTime: "",
  options: {},
  personalInfo: {},
  totalCost: 0,
  promoCode: null,
  discount: 0,
  originalPrice: 0,
};

document.addEventListener("DOMContentLoaded", function () {
  // Show modal on link click
  function showTermsCard(e) {
    e.preventDefault();
    var card = document.getElementById("Information-policy-terms");
    if (card) card.style.display = "block";
  }
  var showLinks = [
    document.getElementById("show-terms-link"),
    document.getElementById("show-terms-link2"),
  ];
  showLinks.forEach(function (link) {
    if (link) link.addEventListener("click", showTermsCard);
  });

  // Hide modal on close button
  var closeBtn = document.getElementById("close-terms-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      var card = document.getElementById("Information-policy-terms");
      if (card) card.style.display = "none";
    });
  }
});

async function sendBookingConfirmationEmail(bookingRequest) {
  // Format dates for email display
  const emailData = {
    ...bookingRequest,
    rental: {
      ...bookingRequest.rental,
      pickupDate: formatDate(bookingRequest.rental.pickupDate),
      returnDate: formatDate(bookingRequest.rental.returnDate)
    }
  };

  const payload = {
    type: "initial",
    data: emailData
  };

  try {
    const response = await fetch("/api/send-booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (result.success) {
      console.log("Emails sent successfully via Resend");
      return true;
    } else {
      console.error("Backend error:", result.error);
      return false;
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return false;
  }
}

async function initBookingPage() {
  await fetchFleetFromSupabase();
  await fetchPromoCodesFromSupabase();
  renderMotorcycleOptions();
  renderCarOptions();
  setupVehicleTypeTabs();
  setupDateInputs();
  setupStepNavigation();
  setupFormValidation();
  updateSidebarSummary();
  setupPreSelectedMotorcycle();
  
  // Check for step and vehicleId parameters in URL
  const urlParams = new URLSearchParams(window.location.search);
  const stepParam = urlParams.get('step');
  const vehicleIdParam = urlParams.get('vehicleId');
  
  // If vehicleId is provided, switch to car tab and pre-select the vehicle
  if (vehicleIdParam) {
    const motorcycleContainer = document.getElementById('motorcycle-options');
    const carContainer = document.getElementById('car-options');
    const tabs = document.querySelectorAll('.vehicle-tab');
    
    // Update tab active state directly without triggering click handlers
    tabs.forEach(t => t.classList.remove('active'));
    const carTab = document.querySelector('.vehicle-tab[data-type="car"]');
    if (carTab) {
      carTab.classList.add('active');
    }
    
    // Show/hide appropriate container directly
    if (motorcycleContainer && carContainer) {
      motorcycleContainer.style.display = 'none';
      carContainer.style.display = 'grid';
      bookingState.vehicleType = 'car';
    }
    
    // Find and select the car option
    setTimeout(() => {
      const carOption = document.querySelector(`.car-option[data-id="${vehicleIdParam}"]`);
      if (carOption) {
        carOption.click();
      }
    }, 100);
  }
  
  // Check for step parameter in URL and navigate to that step
  if (stepParam) {
    const stepNumber = parseInt(stepParam);
    if (stepNumber >= 2 && stepNumber <= 4) {
      // For step 2 and above, switch to "Cars & 4x4" tab if coming from assistance page
      if (!vehicleIdParam) {
        const motorcycleContainer = document.getElementById('motorcycle-options');
        const carContainer = document.getElementById('car-options');
        const tabs = document.querySelectorAll('.vehicle-tab');
        
        // Update tab active state directly without triggering click handlers
        tabs.forEach(t => t.classList.remove('active'));
        const carTab = document.querySelector('.vehicle-tab[data-type="car"]');
        if (carTab) {
          carTab.classList.add('active');
        }
        
        // Show/hide appropriate container directly
        if (motorcycleContainer && carContainer) {
          motorcycleContainer.style.display = 'none';
          carContainer.style.display = 'grid';
          bookingState.vehicleType = 'car';
        }
      }
      
      // Navigate to the step
      goToStep(stepNumber);
    } else if (stepNumber === 1) {
      goToStep(stepNumber);
    }
  }
}

// Setup vehicle type tabs (Motorcycle/Car toggle)
function setupVehicleTypeTabs() {
  const tabs = document.querySelectorAll('.vehicle-tab');
  const motorcycleContainer = document.getElementById('motorcycle-options');
  const carContainer = document.getElementById('car-options');
  
  if (!tabs.length || !motorcycleContainer || !carContainer) return;
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const type = this.dataset.type;
      
      // Update tab active state
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // Show/hide appropriate container
      if (type === 'motorcycle') {
        motorcycleContainer.style.display = 'grid';
        carContainer.style.display = 'none';
        bookingState.vehicleType = 'motorcycle';
      } else {
        motorcycleContainer.style.display = 'none';
        carContainer.style.display = 'grid';
        bookingState.vehicleType = 'car';
      }
      
      // Clear selection when switching tabs
      bookingState.vehicle = null;
      bookingState.motorcycle = null;
      document.querySelectorAll('.motorcycle-option, .car-option').forEach(opt => {
        opt.classList.remove('selected');
      });
      updateSidebarSummary();
    });
  });
}

// Render car/4x4 options from FOURXFOUR data
function renderCarOptions() {
  const container = document.getElementById('car-options');
  if (!container || typeof FOURXFOUR === 'undefined') return;
  
  container.innerHTML = '';
  FOURXFOUR.forEach((car) => {
    const option = document.createElement('div');
    option.className = 'car-option';
    option.dataset.id = car.id;
    if (isVehicleBlocked(car.id)) {
      option.classList.add('blocked');
    }
    option.innerHTML = `
      <img src="${car.imageUrl}" alt="${car.name}" class="option-image">
      <div class="option-name">${car.name}</div>
      <span class="option-type">${car.type}</span>
      <div class="option-specs">
        <div class="option-spec">
          <div class="spec-label">Engine</div>
          <div class="spec-value">${car.specs.engine}</div>
        </div>
        <div class="option-spec">
          <div class="spec-label">Drive</div>
          <div class="spec-value">${car.specs.drive}</div>
        </div>
        <div class="option-spec">
          <div class="spec-label">Seats</div>
          <div class="spec-value">${car.specs.seats}</div>
        </div>
        <div class="option-spec">
          <div class="spec-label">Fuel</div>
          <div class="spec-value">${car.specs.fuel}</div>
        </div>
      </div>
      <div class="option-price">${getEffectivePrice(car.pricePerDay, new Date().toISOString().split('T')[0])} €/day</div>
    `;
    
    option.addEventListener('click', () => {
      if (isVehicleBlocked(car.id)) {
        const blockInfo = getVehicleBlockInfo(car.id);
        if (blockInfo) {
          showBlockPopup(car.name, blockInfo.reason, blockInfo.start, blockInfo.end);
        }
        return;
      }
      // Remove selected class from all car options
      document.querySelectorAll('.car-option').forEach(opt => {
        opt.classList.remove('selected');
      });
      // Also remove from motorcycle options
      document.querySelectorAll('.motorcycle-option').forEach(opt => {
        opt.classList.remove('selected');
      });
      
      // Add selected class to clicked option
      option.classList.add('selected');
      
      // Store car as vehicle in booking state for calculations
      bookingState.vehicle = car;
      bookingState.motorcycle = car; // Store in motorcycle for backward compatibility
      bookingState.vehicleType = 'car';
      
      updateSidebarSummary();
      // Automatically go to next step (Rental Details)
      goToStep(2);
    });
    
    container.appendChild(option);
  });
}

function setupPreSelectedMotorcycle() {
  const preSelectedId = getPreSelectedMotorcycle();
  if (preSelectedId) {
    // Trouver l'option moto correspondante
    const motorcycleOption = document.querySelector(
      `.motorcycle-option[data-id="${preSelectedId}"]`
    );
    if (motorcycleOption) {
      motorcycleOption.click();
    }
    clearPreSelectedMotorcycle();
  }
}

function renderMotorcycleOptions() {
  const container = document.getElementById("motorcycle-options");
  if (!container || typeof MOTORCYCLES === 'undefined') return;

  container.innerHTML = "";
  MOTORCYCLES.forEach((motorcycle) => {
    const option = document.createElement("div");
    option.className = "motorcycle-option";
    option.dataset.id = motorcycle.id;
    if (isVehicleBlocked(motorcycle.id)) {
      option.classList.add("blocked");
    }
    option.innerHTML = `
            <img src="${motorcycle.imageUrl}" alt="${motorcycle.name}" class="option-image">
            <div class="option-name">${motorcycle.name}</div>
            <span class="option-type">${motorcycle.type}</span>
            <div class="option-specs">
                <div class="option-spec">
                    <div class="spec-label">Engine</div>
                    <div class="spec-value">${motorcycle.specs.engine}</div>
                </div>
                <div class="option-spec">
                    <div class="spec-label">Power</div>
                    <div class="spec-value">${motorcycle.specs.power}</div>
                </div>
                <div class="option-spec">
                    <div class="spec-label">Weight</div>
                    <div class="spec-value">${motorcycle.specs.weight}</div>
                </div>
                <div class="option-spec">
                    <div class="spec-label">Seat Height</div>
                    <div class="spec-value">${motorcycle.specs.seatHeight}</div>
                </div>
            </div>
            <div class="option-price">${getEffectivePrice(motorcycle.pricePerDay, new Date().toISOString().split('T')[0])} €/day</div>
        `;

    option.addEventListener("click", () => {
      if (isVehicleBlocked(motorcycle.id)) {
        const blockInfo = getVehicleBlockInfo(motorcycle.id);
        if (blockInfo) {
          showBlockPopup(motorcycle.name, blockInfo.reason, blockInfo.start, blockInfo.end);
        }
        return;
      }
      // Remove selected class from all options
      document.querySelectorAll(".motorcycle-option").forEach((opt) => {
        opt.classList.remove("selected");
      });
      // Also remove from car options
      document.querySelectorAll('.car-option').forEach(opt => {
        opt.classList.remove('selected');
      });
      // Add selected class to clicked option
      option.classList.add("selected");
      bookingState.motorcycle = motorcycle;
      bookingState.vehicle = motorcycle;
      bookingState.vehicleType = 'motorcycle';
      updateSidebarSummary();
      // Automatically go to next step (Rental Details)
      goToStep(2);
    });

    container.appendChild(option);
  });
}

function setupDateInputs() {
  const pickupDateInput = document.getElementById("pickup-date");
  const returnDateInput = document.getElementById("return-date");

  if (!pickupDateInput || !returnDateInput) return;

  // Set minimum date to today
  const today = new Date().toISOString().split("T")[0];
  pickupDateInput.min = today;
  returnDateInput.min = today;

  // Update return date min when pickup date changes
  pickupDateInput.addEventListener("change", function () {
    returnDateInput.min = this.value;
    bookingState.pickupDate = this.value;

    // If return date is before new pickup date, clear it
    if (returnDateInput.value && returnDateInput.value < this.value) {
      returnDateInput.value = "";
      bookingState.returnDate = "";
    }

    updateSidebarSummary();
  });

  returnDateInput.addEventListener("change", function () {
    bookingState.returnDate = this.value;
    updateSidebarSummary();
  });

  // Setup time inputs
  const pickupTimeInput = document.getElementById("pickup-time");
  const returnTimeInput = document.getElementById("return-time");

  if (pickupTimeInput) {
    pickupTimeInput.addEventListener("change", function () {
      bookingState.pickupTime = this.value;
      updateSidebarSummary();
    });
  }

  if (returnTimeInput) {
    returnTimeInput.addEventListener("change", function () {
      bookingState.returnTime = this.value;
      updateSidebarSummary();
    });
  }

  // Setup option checkboxes
  const optionCheckboxes = document.querySelectorAll(
    '.option-checkbox input[type="checkbox"]'
  );
  optionCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      if (this.checked) {
        bookingState.options[this.name] = parseFloat(this.value);
      } else {
        delete bookingState.options[this.name];
      }
      updateSidebarSummary();
    });
  });
  
  // Setup promo code button
  const promoButton = document.querySelector('.btn-apply-promo');
  if (promoButton) {
    promoButton.addEventListener('click', applyPromoCode);
  }
  
  // Setup promo code input (Enter key)
  const promoInput = document.getElementById('promo-code');
  if (promoInput) {
    promoInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        applyPromoCode();
      }
    });
  }
  
  // Setup remove promo button
  const removePromoButton = document.querySelector('.btn-remove-promo');
  if (removePromoButton) {
    removePromoButton.addEventListener('click', removePromoCode);
  }
}

function setupStepNavigation() {
  // Next buttons
  const nextButtons = document.querySelectorAll(".btn-next");
  nextButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const formStep = this.closest(".form-step");
      if (!formStep) return;
      const currentStep = parseInt(formStep.dataset.step);
      const nextStep = parseInt(this.dataset.next);
      if (validateStep(currentStep)) {
        goToStep(nextStep);
      }
    });
  });

  // Previous buttons
  const prevButtons = document.querySelectorAll(".btn-prev");
  prevButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const prevStep = parseInt(this.dataset.prev);
      goToStep(prevStep);
    });
  });

  // Form submission
  const bookingForm = document.getElementById("booking-form");
  if (bookingForm) {
    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (validateStep(4)) {
        submitBooking();
      }
    });
  }
}

function goToStep(stepNumber) {
  // Scroll to top of page smoothly
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

  // Hide all steps
  document.querySelectorAll(".form-step").forEach((step) => {
    step.classList.remove("active");
    step.style.display = "none";
  });

  // Show target step with fade-in effect
  const targetStep = document.querySelector(
    `.form-step[data-step="${stepNumber}"]`
  );
  if (targetStep) {
    targetStep.classList.add("active");
    targetStep.style.display = "block";
    targetStep.style.opacity = 0;
    setTimeout(() => {
      targetStep.style.opacity = 1;
    }, 10);
  }

  // Update step indicators
  document.querySelectorAll(".step").forEach((step) => {
    step.classList.remove("active");
  });
  const targetStepIndicator = document.querySelector(
    `.step[data-step="${stepNumber}"]`
  );
  if (targetStepIndicator) {
    targetStepIndicator.classList.add("active");
  }

  // Update summary on step 4
  if (stepNumber === 4) {
    updateBookingSummary();
  }
}

function validateStep(stepNumber) {
  let isValid = true;

  switch (stepNumber) {
    case 1:
      if (!bookingState.motorcycle && !bookingState.vehicle) {
        showNotification("Please select a vehicle", "error");
        isValid = false;
      }
      break;

    case 2:
      const pickupDate = document.getElementById("pickup-date").value;
      const returnDate = document.getElementById("return-date").value;
      const pickupTime = document.getElementById("pickup-time").value;
      const returnTime = document.getElementById("return-time").value;

      if (!pickupDate || !returnDate || !pickupTime || !returnTime) {
        showNotification("Please fill all rental details", "error");
        isValid = false;
      } 
      
      else if (new Date(returnDate) < new Date(pickupDate)) {
        showNotification("Return date cannot be before pickup date", "error");
        isValid = false;
      }

      else {
        const vehicle = bookingState.vehicle || bookingState.motorcycle;
        const availCheck = checkVehicleAvailability(vehicle.id, pickupDate, returnDate);
        if (!availCheck.available) {
          showNotification(availCheck.reason, "error");
          isValid = false;
        }
      }
      break;

    case 3:
      const requiredFields = [
        "first-name",
        "last-name",
        "email",
        "phone",
        "country",
        "license-number",
      ];
      const personalInfo = {};

      requiredFields.forEach((field) => {
        const input = document.getElementById(field);
        if (!input.value.trim()) {
          showFieldError(input, "This field is required");
          isValid = false;
        } else {
          personalInfo[field] = input.value.trim();
        }
      });

      // Email validation
      const emailInput = document.getElementById("email");
      if (emailInput.value && !isValidEmail(emailInput.value)) {
        showFieldError(emailInput, "Please enter a valid email address");
        isValid = false;
      }

      if (isValid) {
        bookingState.personalInfo = personalInfo;
      }
      break;

    case 4:
      const termsCheckbox = document.getElementById("agree-terms");
      if (!termsCheckbox.checked) {
        showNotification("Please agree to the terms and conditions", "error");
        isValid = false;
      }
      break;
  }

  return isValid;
}

function setupFormValidation() {
  // Real-time validation for personal info fields
  const personalFields = [
    "first-name",
    "last-name",
    "email",
    "phone",
    "license-number",
  ];

  personalFields.forEach((field) => {
    const input = document.getElementById(field);
    if (input) {
      input.addEventListener("blur", function () {
        validateField(this);
      });
      input.addEventListener("input", function () {
        clearFieldError(this);
      });
    }
  });
}

function validateField(field) {
  const value = field.value.trim();
  let isValid = true;

  clearFieldError(field);

  if (field.hasAttribute("required") && !value) {
    isValid = false;
    showFieldError(field, "This field is required");
  }

  if (field.type === "email" && value && !isValidEmail(value)) {
    isValid = false;
    showFieldError(field, "Please enter a valid email address");
  }

  return isValid;
}

function showFieldError(field, message) {
  field.style.borderColor = "#ef4444";

  let errorElement = field.parentNode.querySelector(".field-error");
  if (!errorElement) {
    errorElement = document.createElement("div");
    errorElement.className = "field-error";
    field.parentNode.appendChild(errorElement);
  }

  errorElement.textContent = message;
  errorElement.style.color = "#ef4444";
  errorElement.style.fontSize = "0.875rem";
  errorElement.style.marginTop = "0.25rem";
}

function clearFieldError(field) {
  field.style.borderColor = "rgba(255, 255, 255, 0.2)";

  const errorElement = field.parentNode.querySelector(".field-error");
  if (errorElement) {
    errorElement.remove();
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function updateSidebarSummary() {
  const vehicle = bookingState.vehicle || bookingState.motorcycle;
  
  // Vehicle
  const vehicleElement = document.getElementById("sidebar-motorcycle");
  if (vehicleElement) {
    const valueElement = vehicleElement.querySelector(".value");
    valueElement.textContent = vehicle ? vehicle.name : "Not selected";
  }

  // Duration
  const durationElement = document.getElementById("sidebar-duration");
  if (durationElement && bookingState.pickupDate && bookingState.returnDate) {
    const days = calculateRentalDays();
    const valueElement = durationElement.querySelector(".value");
    valueElement.textContent = `${days} day${days !== 1 ? "s" : ""}`;
  }

  // Base price
  const basePriceElement = document.getElementById("sidebar-base-price");
  if (
    basePriceElement &&
    vehicle &&
    bookingState.pickupDate &&
    bookingState.returnDate
  ) {
    const days = calculateRentalDays();
    const basePrice = days * vehicle.pricePerDay;
    const valueElement = basePriceElement.querySelector(".value");
    valueElement.textContent = `${basePrice} €`;
  }

  // Options
  const optionsElement = document.getElementById("sidebar-options");
  if (optionsElement) {
    const optionsTotal = calculateOptionsTotal();
    const valueElement = optionsElement.querySelector(".value");
    valueElement.textContent = `${optionsTotal} €`;
  }
  
  // Discount
  const discountElement = document.getElementById("sidebar-discount");
  if (discountElement) {
    const discountAmount = calculateDiscountAmount();
    if (discountAmount > 0) {
      discountElement.style.display = 'flex';
      const valueElement = discountElement.querySelector(".value");
      valueElement.textContent = `-${discountAmount} €`;
    } else {
      discountElement.style.display = 'none';
    }
  }

  // Total
  const totalElement = document.getElementById("sidebar-total");
  if (totalElement) {
    const total = calculateTotalCost();
    totalElement.textContent = `${total} €`;
    bookingState.totalCost = total;
  }
}

function calculateRentalDays() {
  if (!bookingState.pickupDate || !bookingState.returnDate) return 0;

  const pickupTime = bookingState.pickupTime || "00:00";
  const returnTime = bookingState.returnTime || "00:00";

  const pickup = new Date(`${bookingState.pickupDate}T${pickupTime}:00`);
  const returnD = new Date(`${bookingState.returnDate}T${returnTime}:00`);

  const timeDiff = returnD.getTime() - pickup.getTime();

  if (timeDiff <= 0) {
    return timeDiff === 0 ? 1 : 0;
  }

  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
}

function calculateOptionsTotal() {
  let total = 0;
  const days = calculateRentalDays();

  // Get options data from global RENTAL_OPTIONS (from data.js)
  // Fallback if not loaded
  const optionsData = typeof RENTAL_OPTIONS !== 'undefined' ? RENTAL_OPTIONS : [];

  // Add option prices
  Object.keys(bookingState.options).forEach((optionId) => {
    const optionDef = optionsData.find(o => o.id === optionId);
    const basePrice = bookingState.options[optionId];
    
    if (optionDef && optionDef.type === 'per_day') {
      total += basePrice * days;
    } else {
      total += basePrice;
    }
  });

  // Helmet is free for multi-day rentals
  if (bookingState.options.helmet && days > 1) {
    const helmetDef = optionsData.find(o => o.id === 'helmet');
    const helmetPrice = helmetDef ? helmetDef.price : bookingState.options.helmet;
    
    // If it's per_day, we subtract helmetPrice * days, else just helmetPrice
    if (helmetDef && helmetDef.type === 'per_day') {
        total -= helmetPrice * days;
    } else {
        total -= helmetPrice;
    }
  }

  return total;
}

function calculateTotalCost() {
  const vehicle = bookingState.vehicle || bookingState.motorcycle;
  if (
    !vehicle ||
    !bookingState.pickupDate ||
    !bookingState.returnDate
  ) {
    return 0;
  }

  const days = calculateRentalDays();
  const pickup = new Date(bookingState.pickupDate);
  
  let totalBasePrice = 0;
  for (let i = 0; i < days; i++) {
    const d = new Date(pickup);
    d.setDate(d.getDate() + i);
    const currentDate = d.toISOString().split('T')[0];
    totalBasePrice += getEffectivePrice(vehicle.pricePerDay, currentDate);
  }
  
  const optionsTotal = calculateOptionsTotal();
  const subtotal = totalBasePrice + optionsTotal;
  
  // Store original price before discount
  if (!bookingState.originalPrice || bookingState.discount === 0) {
    bookingState.originalPrice = subtotal;
  }
  
  // Apply discount if promo code is active
  const discountAmount = bookingState.discount > 0 
    ? (subtotal * bookingState.discount) / 100 
    : 0;
  
  return Math.round(subtotal - discountAmount);
}

function calculateDiscountAmount() {
  if (!bookingState.discount || bookingState.discount === 0) {
    return 0;
  }
  
  const vehicle = bookingState.vehicle || bookingState.motorcycle;
  const days = calculateRentalDays();
  const pickup = new Date(bookingState.pickupDate);
  
  let basePrice = 0;
  for (let i = 0; i < days; i++) {
    const d = new Date(pickup);
    d.setDate(d.getDate() + i);
    const currentDate = d.toISOString().split('T')[0];
    basePrice += getEffectivePrice(vehicle?.pricePerDay || 0, currentDate);
  }
  
  const optionsTotal = calculateOptionsTotal();
  const subtotal = basePrice + optionsTotal;
  
  return Math.round((subtotal * bookingState.discount) / 100);
}

function updateBookingSummary() {
  const vehicle = bookingState.vehicle || bookingState.motorcycle;
  
  // Vehicle summary
  const vehicleSummary = document.getElementById("summary-motorcycle");
  if (vehicleSummary && vehicle) {
    const specs = vehicle.specs;
    const specValue = specs?.engine || specs?.drive || 'N/A';
    vehicleSummary.innerHTML = `
            <strong>${vehicle.name}</strong><br>
            ${vehicle.type} - ${specValue}<br>
            ${getEffectivePrice(vehicle.pricePerDay, bookingState.pickupDate)} € per day
        `;
  }

  // Dates summary
  const datesSummary = document.getElementById("summary-dates");
  if (datesSummary && bookingState.pickupDate && bookingState.returnDate) {
    const days = calculateRentalDays();
    const pickupDate = new Date(bookingState.pickupDate).toLocaleDateString();
    const returnDate = new Date(bookingState.returnDate).toLocaleDateString();

    datesSummary.innerHTML = `
            <strong>${days} day${days !== 1 ? "s" : ""} rental</strong><br>
            Pickup: ${pickupDate} at ${bookingState.pickupTime || "TBD"}<br>
            Return: ${returnDate} at ${bookingState.returnTime || "TBD"}
        `;
  }

  // Options summary
  const optionsSummary = document.getElementById("summary-options");
  if (optionsSummary) {
    const optionsTotal = calculateOptionsTotal();
    let optionsHtml = "";

    if (Object.keys(bookingState.options).length === 0) {
      optionsHtml = "No additional options selected";
    } else {
      Object.keys(bookingState.options).forEach((option) => {
        const price = bookingState.options[option];
        const optionName = getOptionDisplayName(option);
        optionsHtml += `${optionName}: ${price} €<br>`;
      });
    }

    optionsSummary.innerHTML = optionsHtml;
  }

  // Personal info summary
  const personalSummary = document.getElementById("summary-personal");
  if (personalSummary && bookingState.personalInfo) {
    personalSummary.innerHTML = `
            <strong>${bookingState.personalInfo["first-name"]} ${bookingState.personalInfo["last-name"]}</strong><br>
            Email: ${bookingState.personalInfo.email}<br>
            Phone: ${bookingState.personalInfo.phone}<br>
            License: ${bookingState.personalInfo["license-number"]}
        `;
  }
  
  // Promo code summary
  const promoSummary = document.getElementById("summary-promo");
  if (promoSummary) {
    if (bookingState.promoCode && bookingState.discount > 0) {
      const discountAmount = calculateDiscountAmount();
      promoSummary.innerHTML = `
        <strong>Promo Code: ${bookingState.promoCode}</strong><br>
        Discount: ${bookingState.discount}% (-${discountAmount} €)
      `;
      promoSummary.style.display = 'block';
    } else {
      promoSummary.style.display = 'none';
    }
  }

  // Total summary
  const totalSummary = document.getElementById("summary-total");
  if (totalSummary) {
    totalSummary.textContent = `${bookingState.totalCost} €`;
  }
}

function getOptionDisplayName(optionKey) {
  const names = {
    helmet: "Helmet Rental",
    insurance: "Extra Insurance",
    gps: "GPS Navigation",
    "side-cases": "Side Cases",
  };

  return names[optionKey] || optionKey;
}

async function submitBooking() {
  const submitBtn = document.querySelector(".btn-confirm");
  if (!submitBtn) return;
  
  const originalText = submitBtn.textContent;

  // Show loading state
  submitBtn.textContent = "Processing...";
  submitBtn.disabled = true;

  // Create booking request object for admin
  const vehicle = bookingState.vehicle || bookingState.motorcycle;
  const bookingRequest = 
  {
    id: 'BK-' + Date.now(),
    submittedAt: new Date().toISOString(),
    status: 'pending',
    vehicle: {
      type: bookingState.vehicleType,
      id: vehicle.id,
      name: vehicle.name,
      pricePerDay: getEffectivePrice(vehicle.pricePerDay, bookingState.pickupDate),
      imageUrl: vehicle.imageUrl,
    },
    rental: {
      pickupDate: bookingState.pickupDate,
      returnDate: bookingState.returnDate,
      pickupTime: bookingState.pickupTime,
      returnTime: bookingState.returnTime,
      totalDays: calculateRentalDays(),
      totalPrice: calculateBasePrice(),
      options: bookingState.options,
      totalCost: bookingState.totalCost,
      originalPrice: bookingState.originalPrice,
      discountPercent: bookingState.discount,
      promoCode: bookingState.promoCode
    },
    customer: {
      firstName: bookingState.personalInfo["first-name"],
      lastName: bookingState.personalInfo["last-name"],
      email: bookingState.personalInfo.email,
      phone: bookingState.personalInfo.phone,
      country: bookingState.personalInfo.country,
      licenseNumber: bookingState.personalInfo["license-number"],
    },
    adminNote: '',
  };

  //here
  // Save to localStorage
  // Try to insert into Supabase `bookings` table if client is configured
  async function insertToSupabase(br) 
  {
    if (!window.supabase) return { ok: false, error: new Error('Supabase client not configured') };

    // Flatten payload for DB columns
const v = br.vehicle;
const r = br.rental;
const c = br.customer;

const dbRow = {
  id: br.id,
  created_at: br.submittedAt,
  status: br.status || "pending",

  vehicle_type: v?.type || "unknown",
  vehicle_id: String(v?.id ?? ""),
  vehicle_name: v?.name || "unknown",
  vehicle_price_per_day: Number(v?.pricePerDay) || 0,
  vehicle_image_url: v?.imageUrl || "",

  pickup_date: r?.pickupDate || null,
  return_date: r?.returnDate || null,
  pickup_time: r?.pickupTime || "",
  return_time: r?.returnTime || "",
  total_days: Number(r?.totalDays) || 0,

  options: r?.options || {},

  promo_code: bookingState.promoCode || null,
  discount_percent: Number(bookingState.discount) || 0,
  original_price: Number(bookingState.originalPrice) || 0,

  total_cost: Number(r?.totalCost || 0),

  first_name: c?.firstName || "",
  last_name: c?.lastName || "",
  email: c?.email || "",
  phone: c?.phone || "",
  country: c?.country || "",
  license_number: c?.licenseNumber || "",

  agree_terms: !!document.getElementById("agree-terms")?.checked,

  admin_note: br.adminNote || ""
};

try {
  // wait only here until supabase is ready
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      clearInterval(check);
      reject(new Error('Supabase client initialization timed out'));
    }, 3000);
    const check = setInterval(() => {
      if (window.supabase?.from) {
        clearInterval(check);
        clearTimeout(timeout);
        resolve();
      }
    }, 50);
  });

  if (!window.supabase) {
    console.error("Supabase not ready");
    return { ok: false, error: "Supabase not initialized" };
  }

  const res = await window.supabase
    .from("bookings")
    .insert(dbRow)
    .select();

  console.log("FULL SUPABASE RESPONSE:");
  console.log(JSON.stringify(res, null, 2));

  if (res.error) {
    console.error("SUPABASE ERROR MESSAGE:", res.error.message);
    console.error("SUPABASE ERROR DETAILS:", res.error.details);
    console.error("SUPABASE ERROR HINT:", res.error.hint);
    console.error("SUPABASE ERROR CODE:", res.error.code);
  }
  if (res.error) {
    console.error("Supabase error:", res.error);
    return { ok: false, error: res.error };
  }

  return { ok: true, data: res.data };

} catch (err) {
  console.log("FULL SUPABASE RESPONSE:=======================>", res);
  return { ok: false, error: err };
}
  }

  // Try to insert into Supabase and wait so navigation doesn't cancel it
  let supaResult = null;
  try {
    supaResult = await insertToSupabase(bookingRequest);
  } catch (err) {
    supaResult = { ok: false, error: err };
  }

  if (!supaResult || !supaResult.ok) {
    console.warn('Supabase insert failed or not configured:', supaResult?.error);
    showNotification('Warning: Could not save booking to server. Saved locally instead.', 'warning');
    // Save to localStorage as fallback
    const existingBookings = JSON.parse(localStorage.getItem('admin_bookings') || '[]');
    existingBookings.push(bookingRequest);
    localStorage.setItem('admin_bookings', JSON.stringify(existingBookings));
  } else {
    console.log('Booking saved to Supabase:', supaResult.data);
  }

  // Send confirmation email (await so user sees correct status)
  let emailRes = null;
  try {
    emailRes = await sendBookingConfirmationEmail(bookingRequest);
  } catch (err) {
    console.error('Email sending failed:', err);
    emailRes = null;
  }

  if (!emailRes) {
    showNotification('Failed to send confirmation email. Please try again later.', 'error');
    // Re-enable button so user can retry
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    return;
  }

  // Success: notify user and redirect
  showNotification('Booking confirmed! We have sent a confirmation email with all the details.', 'success');
  // Reset form and redirect after delay
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 3000);
}

function showNotification(message, type) {
  // Remove existing notification
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === "success" ? "#10b981" : "#ef4444"};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;

  document.body.appendChild(notification);

  // Remove notification after 5 seconds
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 5000);
}

// Add promo code validation
function getPromoCodes() {
  const savedPromos = JSON.parse(localStorage.getItem('admin_promo_codes'));
  if (savedPromos) return savedPromos;

  return {
    'XCCLOC20': { discount: 20, description: '20% discount' },
    'XCCLOC10': { discount: 10, description: '10% discount' },
    'XCCLOC05': { discount: 5, description: '5% discount' },
    'SAAD7': { discount: 7, description: '7% discount' },
    'SAAD10': { discount: 10, description: '10% discount' },
    'SAAD20': { discount: 20, description: '20% discount' },
    'XCCLOC15': { discount: 15, description: '15% discount' }
  };
}

function getAvailability() {
  return JSON.parse(localStorage.getItem('admin_availability') || '[]');
}

function checkVehicleAvailability(vehicleId, startDate, endDate) {
  return { available: true };
}

function validatePromoCode(code) {
  const promoCodes = getPromoCodes();
  const upperCode = code.toUpperCase().trim();
  return promoCodes[upperCode] || null;
}

function applyPromoCode() {
  const promoInput = document.getElementById('promo-code');
  const promoButton = document.querySelector('.btn-apply-promo');
  const removePromoButton = document.querySelector('.btn-remove-promo');
  
  if (!promoInput || !promoInput.value.trim()) {
    showPromoMessage('Please enter a promo code', 'error');
    return;
  }
  
  const promoData = validatePromoCode(promoInput.value);
  
  if (promoData) {
    bookingState.promoCode = promoInput.value.toUpperCase().trim();
    bookingState.discount = promoData.discount;
    
    // Disable input and apply button, show remove button
    promoInput.disabled = true;
    if (promoButton) {
      promoButton.style.display = 'none';
    }
    if (removePromoButton) {
      removePromoButton.style.display = 'inline-block';
    }
    
    showPromoMessage(`✓ Promo code applied: ${promoData.description}`, 'success');
    updateSidebarSummary();
  } else {
    bookingState.promoCode = null;
    bookingState.discount = 0;
    showPromoMessage('✗ Invalid promo code', 'error');
  }
}

function removePromoCode() {
  const promoInput = document.getElementById('promo-code');
  const promoButton = document.querySelector('.btn-apply-promo');
  const removePromoButton = document.querySelector('.btn-remove-promo');
  
  bookingState.promoCode = null;
  bookingState.discount = 0;
  bookingState.originalPrice = 0;
  
  if (promoInput) {
    promoInput.value = '';
    promoInput.disabled = false;
  }
  
  if (promoButton) {
    promoButton.style.display = 'inline-block';
  }
  
  if (removePromoButton) {
    removePromoButton.style.display = 'none';
  }
  
  showPromoMessage('Promo code removed', 'info');
  updateSidebarSummary();
}

function showPromoMessage(message, type) {
  const promoMessage = document.getElementById('promo-message');
  if (!promoMessage) return;
  
  const colors = {
    'success': '#10b981',
    'error': '#ef4444',
    'info': '#3b82f6'
  };
  
  promoMessage.textContent = message;
  promoMessage.style.color = colors[type] || '#ffffff';
  promoMessage.style.backgroundColor = colors[type] ? colors[type] + '20' : 'rgba(255,255,255,0.1)';
  promoMessage.style.padding = '0.5rem';
  promoMessage.style.borderRadius = '0.25rem';
  promoMessage.style.marginTop = '0.5rem';
  promoMessage.style.fontSize = '0.875rem';
  promoMessage.style.display = 'block';
  
  setTimeout(() => {
    promoMessage.style.display = 'none';
  }, 5000);
}

// Initialize booking page when DOM is loaded
document.addEventListener("DOMContentLoaded", initBookingPage);
