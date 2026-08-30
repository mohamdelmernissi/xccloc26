async function initAssistancePage() {
    console.log('Initializing assistance page...');
    await fetchCarsFromSupabase();
    await fetchAvailabilityBlocks();
    console.log('FOURXFOUR:', FOURXFOUR);
    console.log('FOURXFOUR length:', FOURXFOUR ? FOURXFOUR.length : 0);
    renderAllVehicles();
    setupFiltering();
}

async function fetchCarsFromSupabase() {
    if (!window.supabase) return;
    try {
                const { data, error } = await window.supabase
                    .from('cars')
                    .select('*')
                    .order('display_order', { ascending: true });
        if (!error && data && data.length > 0) {
            const fetched = data.map(row => ({
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
    } catch (e) {
        console.warn('Failed to fetch cars from Supabase, using fallback', e);
    }
}

function setVehiclePreference(vehicleId) {
    localStorage.setItem('preSelectedVehicle', vehicleId);
}

function renderAllVehicles() {
    const container = document.getElementById('vehicles-container');
    if (!container) {
        console.error('vehicles-container not found!');
        return;
    }

    if (!FOURXFOUR || !Array.isArray(FOURXFOUR) || FOURXFOUR.length === 0) {
        console.error('FOURXFOUR is not defined or empty!');
        container.innerHTML = '<p style="text-align:center;padding:2rem;">No vehicles available.</p>';
        return;
    }

    console.log('Rendering', FOURXFOUR.length, 'vehicles...');
    container.innerHTML = '';
    FOURXFOUR.forEach(vehicle => {
        const card = document.createElement('div');
        card.className = 'vehicle-card';
        card.dataset.type = vehicle.type;
        const blocked = isVehicleBlocked(vehicle.id);
        if (blocked) {
            card.classList.add('blocked');
        }
        
        const blockInfo = blocked ? getVehicleBlockInfo(vehicle.id) : null;
        
        card.innerHTML = `
            <img src="${vehicle.imageUrl}" alt="${vehicle.name}" class="vehicle-image">
            ${discountBadgeHtml(vehicle.pricePerDay, new Date().toISOString().split('T')[0], vehicle.id)}
            <div class="vehicle-content">
                <h3 class="vehicle-name">${vehicle.name}</h3>
                <span class="vehicle-type">${vehicle.type}</span>
                <div class="vehicle-specs">
                    <div class="spec-item">
                        <div class="spec-label">Engine</div>
                        <div class="spec-value">${vehicle.specs.engine}</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Drive</div>
                        <div class="spec-value">${vehicle.specs.drive}</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Seats</div>
                        <div class="spec-value">${vehicle.specs.seats}</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Fuel</div>
                        <div class="spec-value">${vehicle.specs.fuel}</div>
                    </div>
                </div>
                <div class="vehicle-price">${renderPriceTag(vehicle.pricePerDay, new Date().toISOString().split('T')[0], vehicle.id, '€/day')}</div>
                <div class="vehicle-actions">
                    <button class="btn btn-details" onclick="showVehicleDetails('${vehicle.id}')">View Details</button>
                    ${blocked 
                        ? `<button class="btn btn-book book-blocked" data-name="${vehicle.name}" data-reason="${blockInfo.reason}" data-start="${blockInfo.start}" data-end="${blockInfo.end}">Book Now</button>`
                        : `<a href="booking.html?step=2&vehicleId=${vehicle.id}" class="btn btn-book">Book Now</a>`
                    }
                </div>
            </div>
        `;
        container.appendChild(card);
    });
    
    document.querySelectorAll('.book-blocked').forEach(btn => {
        btn.addEventListener('click', () => {
            showBlockPopup(
                btn.dataset.name,
                btn.dataset.reason,
                btn.dataset.start,
                btn.dataset.end
            );
        });
    });
}

function setupFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const vehicleCards = document.querySelectorAll('.vehicle-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filter = button.dataset.filter;
            
            vehicleCards.forEach(card => {
                if (filter === 'all' || card.dataset.type === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

function showVehicleDetails(vehicleId) {
    const vehicle = FOURXFOUR.find(v => v.id === vehicleId);
    if (vehicle) {
        const modalHtml = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <button class="modal-close">&times;</button>
                    <div class="modal-body">
                        <img src="${vehicle.imageUrl}" alt="${vehicle.name}" class="modal-image">
                        <div class="modal-details">
                            <h2>${vehicle.name}</h2>
                            <span class="vehicle-type">${vehicle.type}</span>
                            <div class="modal-specs">
                                <div class="spec-row">
                                    <span class="spec-label">Engine:</span>
                                    <span class="spec-value">${vehicle.specs.engine}</span>
                                </div>
                                <div class="spec-row">
                                    <span class="spec-label">Drive:</span>
                                    <span class="spec-value">${vehicle.specs.drive}</span>
                                </div>
                                <div class="spec-row">
                                    <span class="spec-label">Seats:</span>
                                    <span class="spec-value">${vehicle.specs.seats}</span>
                                </div>
                                <div class="spec-row">
                                    <span class="spec-label">Fuel:</span>
                                    <span class="spec-value">${vehicle.specs.fuel}</span>
                                </div>
                            </div>
                            <div class="modal-price">${renderPriceTag(vehicle.pricePerDay, new Date().toISOString().split('T')[0], vehicle.id, '€ per day')}</div>
                            <p class="modal-description">Perfect for ${getVehicleDescription(vehicle.type)} adventures in Morocco.</p>
                            <a href="booking.html?step=2&vehicleId=${vehicle.id}" class="btn btn-book">Book This Vehicle</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                padding: 1rem;
            }
            .modal-content {
                background: var(--brand-dark);
                border-radius: 0.5rem;
                max-width: 800px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
            }
            .modal-close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: var(--brand-red);
                border: none;
                color: white;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                font-size: 1.5rem;
                cursor: pointer;
                z-index: 1001;
            }
            .modal-body {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;
                padding: 2rem;
            }
            .modal-image {
                width: 100%;
                height: 300px;
                object-fit: cover;
                border-radius: 0.375rem;
            }
            .modal-details h2 {
                font-size: 1.5rem;
                margin-bottom: 0.5rem;
            }
            .modal-specs {
                margin: 1.5rem 0;
            }
            .spec-row {
                display: flex;
                justify-content: space-between;
                padding: 0.5rem 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            .modal-price {
                font-size: 1.75rem;
                font-weight: 900;
                color: var(--brand-red);
                margin: 1rem 0;
            }
            .modal-description {
                color: var(--brand-silver);
                margin-bottom: 1.5rem;
            }
            @media (max-width: 768px) {
                .modal-body {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Close modal functionality
        const modalOverlay = document.querySelector('.modal-overlay');
        const closeBtn = document.querySelector('.modal-close');
        
        closeBtn.addEventListener('click', () => {
            modalOverlay.remove();
            style.remove();
        });
        
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.remove();
                style.remove();
            }
        });
    }
}

function getVehicleDescription(type) {
    const descriptions = {
        'SUV': 'off-road and family',
        'Jeep': 'off-road and adventure',
        'Pickup': 'utility and exploration',
        'Hatchback': 'city and compact',
        'Sedan': 'comfortable and elegant'
    };
    return descriptions[type] || 'various';
}

// Initialize assistance page when DOM is loaded
document.addEventListener('DOMContentLoaded', initAssistancePage);
