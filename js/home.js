function initHomePage() {
    initSlider();
    renderFeaturedMotorcycles();
    renderTestimonials();
}

function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.querySelector('.slider-dots');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    
    if (!slides.length || !dotsContainer) return;
    
    let currentSlide = 0;
    let autoSlideInterval = null;
    let isTransitioning = false;
    const SLIDE_DURATION = 3000;  // Time between slides (4 seconds)
    const TRANSITION_DURATION = 500;  // Match CSS transition duration (0.5s)

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'slider-dot';
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => handleManualNavigation(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.slider-dot');

    function goToSlide(index) {
        if (index === currentSlide || isTransitioning) return;
        
        isTransitioning = true;
        
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        currentSlide = index;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
        
        // Reset transitioning flag after animation completes
        setTimeout(() => {
            isTransitioning = false;
        }, TRANSITION_DURATION);
    }

    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        goToSlide(next);
    }

    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(prev);
    }

    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(nextSlide, SLIDE_DURATION);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }

    function handleManualNavigation(index) {
        if (isTransitioning) return;
        stopAutoSlide();
        if (typeof index === 'number') {
            goToSlide(index);
        }
        startAutoSlide();
    }

    // Event listeners with debounce protection
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (isTransitioning) return;
            stopAutoSlide();
            prevSlide();
            startAutoSlide();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (isTransitioning) return;
            stopAutoSlide();
            nextSlide();
            startAutoSlide();
        });
    }

    // Pause auto-slide on hover
    const sliderContainer = document.querySelector('.hero-slider');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopAutoSlide);
        sliderContainer.addEventListener('mouseleave', startAutoSlide);
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            handleManualNavigation();
            prevSlide();
            startAutoSlide();
        } else if (e.key === 'ArrowRight') {
            handleManualNavigation();
            nextSlide();
            startAutoSlide();
        }
    });

    // Start auto slide
    startAutoSlide();
}

function renderFeaturedMotorcycles() {
    const container = document.getElementById('featured-motorcycles-container');
    if (!container) return;

    // Show only first 3 motorcycles
    const featuredMotorcycles = MOTORCYCLES.slice(0, 3);
    
    container.innerHTML = '';
    featuredMotorcycles.forEach(motorcycle => {
        const card = document.createElement('div');
        card.className = 'motorcycle-card';
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
                        <div class="spec-label">Weight</div>
                        <div class="spec-value">${motorcycle.specs.weight}</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Seat Height</div>
                        <div class="spec-value">${motorcycle.specs.seatHeight}</div>
                    </div>
                </div>
                <div class="motorcycle-price">${motorcycle.pricePerDay} DH/day</div>
                <a href="motorcycles.html" class="btn">View Details</a>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderTestimonials() {
    const container = document.getElementById('testimonials-container');
    if (!container) return;

    container.innerHTML = '';
    TESTIMONIALS.forEach(testimonial => {
        const card = document.createElement('div');
        card.className = 'testimonial-card';
        card.innerHTML = `
            <p class="testimonial-text">${testimonial.text}</p>
            <div class="testimonial-author">
                <img src="${testimonial.avatarUrl}" alt="${testimonial.name}" class="author-avatar">
                <div class="author-info">
                    <div class="author-name">${testimonial.name}</div>
                    <div class="author-rating">${'★'.repeat(testimonial.rating)}</div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Initialize home page when DOM is loaded
document.addEventListener('DOMContentLoaded', initHomePage);