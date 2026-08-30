async function renderSlides() {
    const sliderContainer = document.querySelector('.slider-container');
    if (!sliderContainer) return;

    let slides = [];
    if (window.supabase) {
        try {
             const { data, error } = await window.supabase
                .from('slides')
                .select('*')
                .order('display_order', { ascending: true });
            if (!error && data && data.length > 0) {
                slides = data.map(row => ({
                    id: row.id,
                    imageUrl: row.image_url,
                    heading: row.heading,
                    subtext: row.subtext,
                    buttonText: row.button_text,
                    buttonLink: row.button_link
                }));
            }
        } catch (e) {
            console.warn('Failed to fetch slides from Supabase, using fallback', e);
        }
    }

    if (!slides.length) {
        const savedSlides = JSON.parse(localStorage.getItem('admin_slides'));
        if (!savedSlides || !savedSlides.length) return;
        slides = savedSlides;
    }

    sliderContainer.innerHTML = '';
    slides.forEach((slide, index) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = `slide ${index === 0 ? 'active' : ''}`;
        slideDiv.innerHTML = `
            <img src="${slide.imageUrl}" alt="${slide.heading}">
            <div class="slide-content">
                <h1>${slide.heading}</h1>
                <p>${slide.subtext}</p>
                <a href="${slide.buttonLink}" class="btn">${slide.buttonText}</a>
            </div>
        `;
        sliderContainer.appendChild(slideDiv);
    });
}

async function initSlider() {
    await renderSlides();
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

    // Clear existing dots
    dotsContainer.innerHTML = '';
    
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
            ${discountBadgeHtml(motorcycle.pricePerDay, new Date().toISOString().split('T')[0], motorcycle.id)}
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
                <div class="motorcycle-price">${renderPriceTag(motorcycle.pricePerDay, new Date().toISOString().split('T')[0], motorcycle.id, '€/day')}</div>
                <a href="motorcycles.html" class="btn">View Details</a>
            </div>
        `;
        container.appendChild(card);
    });
}

async function renderTestimonials() 
{
    const container = document.getElementById('testimonials-container');
    if (!container) return;

    container.innerHTML = `
        <div class="testimonials-slider-container">
            <div class="testimonials-track-container">
                <div class="testimonials-track"></div>
            </div>
            <button class="testimonials-prev">‹</button>
            <button class="testimonials-next">›</button>
            <div class="testimonials-dots"></div>
        </div>
    `;

    const track = container.querySelector('.testimonials-track');
    const dotsContainer = container.querySelector('.testimonials-dots');
    
    let testimonials = [];
    if (window.supabase) {
        try {
            const { data, error } = await window.supabase
                .from('testimonials')
                .select('*')
                .order('id', { ascending: true });
            if (!error && data && data.length > 0) {
                testimonials = data.map(row => ({
                    id: row.id,
                    name: row.author,
                    text: row.content,
                    avatarUrl: row.image_url,
                    rating: row.rating || 5
                }));
            }
        } catch (e) {
            console.warn('Failed to fetch testimonials from Supabase, using fallback', e);
        }
    }
    
    if (!testimonials.length && typeof TESTIMONIALS !== 'undefined') {
        testimonials = TESTIMONIALS;
    }
    
    if (!testimonials || !testimonials.length) return;

    testimonials.forEach((testimonial, index) => {
        const slide = document.createElement('div');
        slide.className = 'testimonial-slide';
        slide.innerHTML = `
            <div class="testimonial-card google-review">
                <div class="review-header">
                    <img src="${testimonial.avatarUrl}" alt="${testimonial.name}" class="reviewer-avatar">
                    <div class="reviewer-info">
                        <div class="reviewer-name-row">
                            <span class="reviewer-name">${testimonial.name}</span>
                            <img src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" class="google-icon" alt="Google">
                        </div>
                         <!--  <div class="reviewer-meta">Local Guide • ${Math.floor(Math.random() * 20) + 5} reviews</div> -->
                        <div class="review-rating-row">
                            <div class="stars">${'★'.repeat(testimonial.rating)}${'☆'.repeat(5 - testimonial.rating)}</div>
                            <!-- <span class="review-time">${Math.floor(Math.random() * 11) + 1} months ago</span> -->
                        </div>
                    </div>
                </div>
                <div class="review-content">
                   <p class="testimonial-text">${testimonial.text.replace(/\n/g, "<br>")}</p>
                </div>
                <div class="review-footer">
                    <span class="helpful-text">Helpful?</span>
                    <div class="footer-actions">
                        <!-- <span class="action-btn">👍 Yes</span> -->
                        <!-- <span class="action-btn">Share</span> -->
                    </div>
                </div>
            </div>
        `;
        track.appendChild(slide);

        // Create dot
        const dot = document.createElement('button');
        dot.className = `testimonials-dot ${index === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dotsContainer.appendChild(dot);
    });

    initTestimonialsSlider();
}

function initTestimonialsSlider() {
    const track = document.querySelector('.testimonials-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const nextButton = document.querySelector('.testimonials-next');
    const prevButton = document.querySelector('.testimonials-prev');
    const dots = document.querySelectorAll('.testimonials-dot');

    if (!track || slides.length === 0) return;

    let currentIdx = 0;
    let autoSlideInterval = null;

    const updateSlider = (index) => {
        const containerWidth = track.parentElement.offsetWidth;
        const slideWidth = slides[0].offsetWidth;
        const slidesVisible = Math.round(containerWidth / slideWidth);
        const maxIndex = slides.length - slidesVisible;
        
        let targetIndex = index;
        if (targetIndex < 0) targetIndex = maxIndex;
        if (targetIndex > maxIndex) targetIndex = 0;

        const movePercentage = 100 / slidesVisible;
        track.style.transform = `translateX(-${targetIndex * movePercentage}%)`;
        
        dots.forEach(d => d.classList.remove('active'));
        if (dots[targetIndex]) dots[targetIndex].classList.add('active');
        currentIdx = targetIndex;
    };

    const nextSlide = () => {
        const containerWidth = track.parentElement.offsetWidth;
        const slideWidth = slides[0].offsetWidth;
        const slidesVisible = Math.round(containerWidth / slideWidth);
        const maxIndex = slides.length - slidesVisible;
        
        let index = currentIdx + 1;
        if (index > maxIndex) index = 0;
        updateSlider(index);
    };

    const prevSlide = () => {
        const containerWidth = track.parentElement.offsetWidth;
        const slideWidth = slides[0].offsetWidth;
        const slidesVisible = Math.round(containerWidth / slideWidth);
        const maxIndex = slides.length - slidesVisible;

        let index = currentIdx - 1;
        if (index < 0) index = maxIndex;
        updateSlider(index);
    };

    if (nextButton) nextButton.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
    });

    if (prevButton) prevButton.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
    });

    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            updateSlider(idx);
            resetAutoSlide();
        });
    });

    const startAutoSlide = () => {
        autoSlideInterval = setInterval(nextSlide, 5000);
    };

    const resetAutoSlide = () => {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    };

    startAutoSlide();
}

// Initialize home page when DOM is loaded
async function initHomePage() {
    await fetchMotorcyclesFromSupabase();
    await initSlider();
    renderFeaturedMotorcycles();
    await renderTestimonials();
    initAdventuresGallery();
}

async function fetchMotorcyclesFromSupabase() {
    if (!window.supabase) return;
    try {
                const { data, error } = await window.supabase
                    .from('motorcycles')
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
                    power: row.power,
                    seatHeight: row.seat_height,
                    weight: row.weight
                }
            }));
            MOTORCYCLES.splice(0, MOTORCYCLES.length, ...fetched);
        }
    } catch (e) {
        console.warn('Failed to fetch motorcycles from Supabase, using fallback', e);
    }
}

document.addEventListener('DOMContentLoaded', initHomePage);

function initAdventuresGallery() {
    const adventureCards = document.querySelectorAll('.adventure-card');
    
    adventureCards.forEach(card => {
        card.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            const title = this.querySelector('h3').textContent;
            const description = this.querySelector('p').textContent;
            
            openAdventureModal(imgSrc, title, description);
        });
        
        // Make cards focusable
        card.setAttribute('tabindex', '0');
    });
}

function openAdventureModal(imgSrc, title, description) {
    const modalHtml = `
        <div class="adventure-modal" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 1rem;
        ">
            <div class="modal-content" style="
                background: var(--brand-dark);
                max-width: 800px;
                width: 100%;
                border-radius: 1rem;
                overflow: hidden;
                position: relative;
            ">
                <button class="modal-close" style="
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
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">×</button>
                
                <img src="${imgSrc}" alt="${title}" style="
                    width: 100%;
                    height: 400px;
                    object-fit: cover;
                ">
                
                <div style="padding: 2rem;">
                    <h3 style="color: white; font-size: 1.5rem; margin-bottom: 0.5rem;">${title}</h3>
                    <p style="color: var(--brand-silver); margin-bottom: 1.5rem;">${description}</p>

                    
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <a href="https://www.instagram.com/"
                           target="_blank"
                           rel="noopener noreferrer"
                           style="text-decoration: none;">
                            <button class="btn" style="background: var(--brand-red); color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 0.5rem; cursor: pointer;">
                                📸 Share on Instagram
                            </button>
                        </a>
                        <a href="contact.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            style="text-decoration: none;">
                            <button class="btn btn-outline" href="contact.html" style="background: transparent; color: var(--brand-red); padding: 0.75rem 1.5rem; border: 2px solid var(--brand-red); border-radius: 0.5rem; cursor: pointer;">
                                🏍️ Book This Adventure
                            </button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    const modal = document.querySelector('.adventure-modal');
    const closeBtn = modal.querySelector('.modal-close');
    
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function closeOnEscape(e) {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', closeOnEscape);
        }
    });
}









