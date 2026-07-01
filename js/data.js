console.log('data.js loaded');

// Motorcycles Data - Comprehensive list from main.js
const MOTORCYCLES = JSON.parse(localStorage.getItem('admin_motorcycles')) || [];

// Trips Data
const TRIPS = JSON.parse(localStorage.getItem('admin_trips')) || [];

// Testimonials Data
const TESTIMONIALS = JSON.parse(localStorage.getItem('admin_testimonials')) || [];

// 4x4 Vehicles Data
const FOURXFOUR = JSON.parse(localStorage.getItem('admin_cars')) || [];

// Rental Options Data
const RENTAL_OPTIONS = JSON.parse(localStorage.getItem('admin_rental_options')) || [];

let PRICING_RULES = JSON.parse(localStorage.getItem('admin_pricing_rules')) || [];

// Export data for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MOTORCYCLES, TRIPS, TESTIMONIALS, FOURXFOUR, RENTAL_OPTIONS, PRICING_RULES };
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MOTORCYCLES, TRIPS, TESTIMONIALS, FOURXFOUR, RENTAL_OPTIONS };
}
