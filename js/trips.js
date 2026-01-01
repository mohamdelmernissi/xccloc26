function initTripsPage() {
    renderAllTrips();
}

function renderAllTrips() {
    const container = document.getElementById('trips-container');
    if (!container) return;

    container.innerHTML = '';
    TRIPS.forEach(trip => {
        const card = document.createElement('div');
        card.className = 'trip-card';
        
        card.innerHTML = `
            <div class="coming-soon-badge">Coming Soon</div>
            <img src="${trip.imageUrl}" alt="${trip.title}" class="trip-image">
            <div class="trip-content">
                <h3 class="trip-title">${trip.title}</h3>
                <p class="trip-description">${trip.description}</p>
                <div class="trip-details">
                    <div class="trip-distance">${trip.distance}</div>
                    <div class="trip-bike">Recommended: ${trip.recommendedBike}</div>
                </div>
                <button class="btn" onclick="showTripDetails('${trip.id}')">Learn More</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function showTripDetails(tripId) {
    const trip = TRIPS.find(t => t.id === tripId);
    if (trip) {
        const modalHtml = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <button class="modal-close">&times;</button>
                    <div class="modal-body">
                        <img src="${trip.imageUrl}" alt="${trip.title}" class="modal-image">
                        <div class="modal-details">
                            <h2>${trip.title}</h2>
                            <p class="modal-description">${trip.description}</p>
                            <div class="modal-info">
                                <div class="info-item">
                                    <strong>Distance:</strong>
                                    <span>${trip.distance}</span>
                                </div>
                                <div class="info-item">
                                    <strong>Recommended Bike:</strong>
                                    <span>${trip.recommendedBike}</span>
                                </div>
                                <div class="info-item">
                                    <strong>Difficulty:</strong>
                                    <span>${getTripDifficulty(trip.id)}</span>
                                </div>
                                <div class="info-item">
                                    <strong>Best Time:</strong>
                                    <span>${getBestTime(trip.id)}</span>
                                </div>
                            </div>
                            <div class="trip-highlights">
                                <h3>Trip Highlights</h3>
                                <ul>
                                    ${getTripHighlights(trip.id)}
                                </ul>
                            </div>
                            <a href="contact.html" class="btn">Book This Trip</a>
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
                margin-bottom: 1rem;
            }
            .modal-description {
                color: var(--brand-silver);
                margin-bottom: 1.5rem;
                line-height: 1.6;
            }
            .modal-info {
                margin: 1.5rem 0;
            }
            .info-item {
                display: flex;
                justify-content: space-between;
                padding: 0.5rem 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            .trip-highlights {
                margin: 1.5rem 0;
            }
            .trip-highlights h3 {
                margin-bottom: 1rem;
            }
            .trip-highlights ul {
                list-style: disc;
                margin-left: 1.5rem;
                color: var(--brand-silver);
            }
            .trip-highlights li {
                margin-bottom: 0.5rem;
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

function getTripDifficulty(tripId) {
    const difficulties = {
        'atlas-mountains': 'Intermediate',
        'essaouira-coast': 'Easy',
        'ourika-valley': 'Easy',
        'zagora-desert': 'Advanced'
    };
    return difficulties[tripId] || 'Moderate';
}

function getBestTime(tripId) {
    const bestTimes = {
        'atlas-mountains': 'March - June, September - November',
        'essaouira-coast': 'April - October',
        'ourika-valley': 'Year-round',
        'zagora-desert': 'October - April'
    };
    return bestTimes[tripId] || 'Year-round';
}

function getTripHighlights(tripId) {
    const highlights = {
        'atlas-mountains': `
            <li>Spectacular mountain passes</li>
            <li>Traditional Berber villages</li>
            <li>Breathtaking panoramic views</li>
            <li>Photo opportunities at every turn</li>
        `,
        'essaouira-coast': `
            <li>Coastal roads with ocean views</li>
            <li>Historic medina and fortifications</li>
            <li>Fresh seafood restaurants</li>
            <li>Relaxed coastal atmosphere</li>
        `,
        'ourika-valley': `
            <li>Lush green valley landscapes</li>
            <li>Beautiful waterfalls</li>
            <li>Traditional markets</li>
            <li>Easy day trip from Marrakech</li>
        `,
        'zagora-desert': `
            <li>Desert landscapes and dunes</li>
            <li>Palm groves and oases</li>
            <li>Desert camping experience</li>
            <li>Starry night skies</li>
        `
    };
    return highlights[tripId] || `
        <li>Beautiful scenery</li>
        <li>Cultural experiences</li>
        <li>Great riding roads</li>
    `;
}

// Initialize trips page when DOM is loaded
document.addEventListener('DOMContentLoaded', initTripsPage);