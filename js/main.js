// Data from constants.ts
const MOTORCYCLES = [
    {
        id: 'CFMOTO800MT',
        name: 'CF MOTO 800 MT Explorer',
        type: 'Adventure',
        pricePerDay: 900,
        imageUrl: '/images/logo/motocycles/CF MOTO 800 MT Explorer.webp',
        specs: {
            engine: '799 cc',
            power: '95 ch',
            seatHeight: '825 mm',
            weight: '220 kg',
        },
    },
    {
        id: 'voge800Rally',
        name: 'Voge 800 Rally',
        type: 'Adventure',
        pricePerDay: 1000,
        imageUrl: '/images/logo/motocycles/Voge 800 Rally.webp',
        specs: {
            engine: '799 cc',
            power: '95 ch',
            seatHeight: '915 mm',
            weight: '213 kg',
        },
    },
    {
        id: 'CFMOTO450MT',
        name: 'CF MOTO 450 MT',
        type: 'Adventure',
        pricePerDay: 700,
        imageUrl: '/images/logo/motocycles/CF MOTO 450 MT.webp',
        specs: {
            engine: '449 cc',
            power: '43.5 ch',
            seatHeight: '820 mm',
            weight: '190 kg',
        },
    },
    {
        id: 'Royal-Enfield-Himalayan-450',
        name: 'Royal Enfield Himalayan 450',
        type: 'Adventure',
        pricePerDay: 700,
        imageUrl: '/images/logo/motocycles/himalayan.webp',
        specs: {
            engine: '452 cc',
            power: '40 ch',
            seatHeight: '825 mm',
            weight: '199 kg',
        },
    },{
        id: 'Kove-450-Rally',
        name: 'Kove 450 Rally',
        type: 'Adventure',
        pricePerDay: 1200,
        imageUrl: '/images/logo/motocycles/kove.webp',
        specs: {
            engine: '449 cc',
            power: '42 ch',
            seatHeight: '960 mm',
            weight: '187 kg',
        },
    },
    {
        id: 'bmw-r1250gs',
        name: 'BMW R1250GS Adventure',
        type: 'Adventure',
        pricePerDay: 1700,
        imageUrl: '/images/logo/motocycles/BMW R1250GS Adventure.webp',
        specs: {
            engine: '1 254 cc',
            power: '136 ch',
            seatHeight: '890 mm',
            weight: '249 kg',
        },
    },
    {
        id: 'honda-africa-twin',
        name: 'Honda Africa Twin (CRF1100L)',
        type: 'Adventure',
        pricePerDay: 1500,
        imageUrl: '/images/logo/motocycles/Honda Africa Twin (CRF1100L).webp',
        specs: {
            engine: '1 084 cc',
            power: '102 ch',
            seatHeight: '850 mm',
            weight: '226 kg',
        },
    },
    {
        id: 'yamaha-tenere-700',
        name: 'Yamaha Ténéré 700',
        type: 'Adventure',
        pricePerDay: 1200,
        imageUrl: '/images/logo/motocycles/Yamaha Ténéré 700.webp',
        specs: {
            engine: '689 cc',
            power: '72 ch',
            seatHeight: '875 mm',
            weight: '204 kg',
        },
    },
    {
        id: 'Hondaxadv750',
        name: 'Honda X-ADV 750',
        type: 'Scooter',
        pricePerDay: 1000,
        imageUrl: '/images/logo/motocycles/Honda X-ADV 750.webp',
        specs: {
            engine: '745 cc',
            power: '58.6 ch',
            seatHeight: '820 mm',
            weight: '226 kg',
        },
    },
    {
        id: 'yamaha-tmax',
        name: 'Yamaha TMAX',
        type: 'Scooter',
        pricePerDay: 900,
        imageUrl: '/images/logo/motocycles/Yamaha TMAX.webp',
        specs: {
            engine: '562 cc',
            power: '48 ch',
            seatHeight: '800 mm',
            weight: '218 kg',
        },
    },
    {
        id: 'kawasaki-z-1100',
        name: 'Kawasaki Z 1100',
        type: 'Sport',
        pricePerDay: 1500,
        imageUrl: '/images/logo/motocycles/Kawasaki Z 1100.webp',
        specs: {
            engine: '1 089 cc',
            power: '120 ch',
            seatHeight: '~800 mm',
            weight: '235 kg',
        },
    },
    {
        id: 'vespa-primavera-50',
        name: 'Vespa Primavera 50',
        type: 'Scooter',
        pricePerDay: 200,
        imageUrl: '/images/logo/motocycles/Vespa Primavera 50.webp',
        specs: {
            engine: '49 cc',
            power: '3.2 ch',
            seatHeight: '790 mm',
            weight: '130 kg',
        },
    },
    {
        id: 'Can-Am-XRS',
        name: 'Can-Am XRS',
        type: 'Buggy',
        pricePerDay: 4000,
        imageUrl: '/images/logo/motocycles/can-am.webp',
        specs: {
            engine: '976 cc',
            power: '154 ch',
            seatHeight: '-',
            weight: '790 kg',
        },
    },
];

const TRIPS = [
    {
        id: 'atlas-mountains',
        title: 'High Atlas Mountains Expedition',
        description: 'A breathtaking journey through the winding roads and stunning vistas of the Atlas Mountains. Perfect for adventure bikes.',
        distance: 'Approx. 350km loop',
        recommendedBike: 'Voge 800 Rally',
        imageUrl: '/images/trip/atlas-mountains.jpg',
    },
    {
        id: 'essaouira-coast',
        title: 'Coastal Ride to Essaouira',
        description: 'Enjoy the ocean breeze on this scenic route to the historic and vibrant coastal city of Essaouira.',
        distance: 'Approx. 190km one-way',
        recommendedBike: 'Any adventure bike',
        imageUrl: '/images/trip/essaouira-coast.jpg',
    },
    {
        id: 'ourika-valley',
        title: 'Ourika Valley Day Trip',
        description: 'A short but spectacular ride from Marrakech, leading you to the lush green landscapes and waterfalls of the Ourika Valley.',
        distance: 'Approx. 60km one-way',
        recommendedBike: 'Any bike or scooter',
        imageUrl:'/images/trip/ourika-valley.jpg',
    },
    {
        id: 'zagora-desert',
        title: 'Gateway to the Desert: Zagora',
        description: 'An epic adventure for seasoned riders, crossing mountain passes to reach the desert town of Zagora.',
        distance: 'Approx. 350km one-way',
        recommendedBike: 'Yamaha Ténéré 700',
        imageUrl: '/images/trip/zagora-desert.jpg',
    },
];

const TESTIMONIALS = [
    {
        id: '1',
        name: 'Alex Johnson',
        text: "Renting the GS1250 was the best decision of our Morocco trip. The bike was in perfect condition and the service from RideMarrakech was top-notch. The Atlas Mountains route they recommended was unforgettable!",
        rating: 5,
        avatarUrl: 'https://picsum.photos/seed/alex/100/100',
    },
    {
        id: '2',
        name: 'Maria Garcia',
        text: "My partner and I rented a Vespa to explore Marrakech. It was so much fun and super easy to get around the city. The staff were friendly and gave us great tips. Highly recommended!",
        rating: 5,
        avatarUrl: 'https://picsum.photos/seed/maria/100/100',
    },
    {
        id: '3',
        name: 'Sam Chen',
        text: "The whole experience was seamless, from booking online to returning the bike. The Honda Africa Twin handled everything we threw at it. Will definitely be back for another adventure.",
        rating: 5,
        avatarUrl: 'https://picsum.photos/seed/sam/100/100',
    },
];

// Common functions
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
}

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navLinks = document.querySelector('.nav-links');
                if (navLinks) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });
}

function setActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Remove active class from all links
        link.classList.remove('active');
        
        // Add active class to current page link
        if ((currentPage === 'index.html' && href === 'index.html') || 
            (currentPage === href) ||
            (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
        
        // Special case for home page when no file is specified
        if (currentPage === '' && href === 'index.html') {
            link.classList.add('active');
        }
    });
}

function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
    return phoneRegex.test(phone);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function setQueryParam(param, value) {
    const url = new URL(window.location);
    url.searchParams.set(param, value);
    window.history.replaceState({}, '', url);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Initialize common functionality
function initCommon() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Smooth scrolling for anchor links
    setupSmoothScroll();
    
    // Set active navigation link
    setActiveNavigation();
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const mobileMenu = document.querySelector('.nav-links');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        const navLinks = document.querySelector('.nav-links');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        
        if (navLinks && navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            toggleMobileMenu();
        }
    });
    
    // Add loading state to buttons when forms are submitted
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Processing...';
                
                // Re-enable button after 5 seconds in case of error
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = submitBtn.dataset.originalText || 'Submit';
                }, 5000);
            }
        });
    });
    
    // Store original button text for forms
    document.querySelectorAll('form button[type="submit"]').forEach(btn => {
        btn.dataset.originalText = btn.textContent;
    });
    
    console.log('RideMarrakech - Common functionality initialized');
}

// Export data for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MOTORCYCLES, TRIPS, TESTIMONIALS };
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initCommon);

// Initialize when page is fully loaded
window.addEventListener('load', function() {
    // Add loaded class for any potential animations
    document.body.classList.add('loaded');
});

function getPreSelectedMotorcycle() {
    return localStorage.getItem('preSelectedMotorcycle');
}

function clearPreSelectedMotorcycle() {
    localStorage.removeItem('preSelectedMotorcycle');

}




