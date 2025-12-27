function initMotorcyclesPage() {
    renderAllMotorcycles();
    setupFiltering();
}

function setMotorcyclePreference(motorcycleId) {
    localStorage.setItem('preSelectedMotorcycle', motorcycleId);
}

function renderAllMotorcycles() {
    const container = document.getElementById('motorcycles-container');
    if (!container) return;

    container.innerHTML = '';
    MOTORCYCLES.forEach(motorcycle => {
        const card = document.createElement('div');
        card.className = 'motorcycle-card';
        card.dataset.type = motorcycle.type;
        
        card.innerHTML = `
            <img src="${motorcycle.imageUrl}" alt="${motorcycle.name}" class="motorcycle-image">
            <div class="motorcycle-content">
                <h3 class="motorcycle-name">${motorcycle.name}</h3>
                <span class="motorcycle-type">${motorcycle.type}</span>
                <div class="motorcycle-specs">
                    <div class="spec-item">
                        <div class="spec-label">Engine</div>
                        <div class="spec-value">${motorcycle.specs.engine}</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Power</div>
                        <div class="spec-value">${motorcycle.specs.power}</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Seat Height</div>
                        <div class="spec-value">${motorcycle.specs.seatHeight}</div>
                    </div>
                </div>
                <div class="motorcycle-price">${motorcycle.pricePerDay} DH/day</div>
                <div class="motorcycle-actions">
                    <button class="btn btn-details" onclick="showMotorcycleDetails('${motorcycle.id}')">View Details</button>
                    <a href="booking.html" class="btn btn-book" onclick="setMotorcyclePreference('${motorcycle.id}')">Book Now</a>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function setupFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const motorcycleCards = document.querySelectorAll('.motorcycle-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filter = button.dataset.filter;
            
            motorcycleCards.forEach(card => {
                if (filter === 'all' || card.dataset.type === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

function showMotorcycleDetails(motorcycleId) {
    const motorcycle = MOTORCYCLES.find(m => m.id === motorcycleId);
    if (motorcycle) {
        const modalHtml = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <button class="modal-close">&times;</button>
                    <div class="modal-body">
                        <img src="${motorcycle.imageUrl}" alt="${motorcycle.name}" class="modal-image">
                        <div class="modal-details">
                            <h2>${motorcycle.name}</h2>
                            <span class="motorcycle-type">${motorcycle.type}</span>
                            <div class="modal-specs">
                                <div class="spec-row">
                                    <span class="spec-label">Engine:</span>
                                    <span class="spec-value">${motorcycle.specs.engine}</span>
                                </div>
                                <div class="spec-row">
                                    <span class="spec-label">Power:</span>
                                    <span class="spec-value">${motorcycle.specs.power}</span>
                                </div>
                                <div class="spec-row">
                                    <span class="spec-label">Seat Height:</span>
                                    <span class="spec-value">${motorcycle.specs.seatHeight}</span>
                                </div>
                            </div>
                            <div class="modal-price">${motorcycle.pricePerDay} DH per day</div>
                            <p class="modal-description">Perfect for ${getMotorcycleDescription(motorcycle.type)} adventures in Morocco.</p>
                            <a href="booking.html" class="btn" onclick="setMotorcyclePreference('${motorcycle.id}')">Book This Motorcycle</a>
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

function getMotorcycleDescription(type) {
    const descriptions = {
        'Adventure': 'off-road and mountain',
        'Scooter': 'city and urban',
        'Cruiser': 'comfortable long-distance',
        'Sport': 'high-performance'
    };
    return descriptions[type] || 'various';
}

// Initialize motorcycles page when DOM is loaded
document.addEventListener('DOMContentLoaded', initMotorcyclesPage);