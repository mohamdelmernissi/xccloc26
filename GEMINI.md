# Project Overview: XCC-LOC26 - Motorcycle & Car Rental

XCC-LOC26 is a static web application for a vehicle rental service based in Marrakech, Morocco. It specializes in motorcycle rentals (adventure bikes, scooters, cruisers), 4x4 car rentals, and organized adventure trips across landscapes like the Atlas Mountains and the Sahara Desert.

## Architecture and Technologies

- **Frontend:** Pure HTML5, CSS3, and Vanilla JavaScript.
- **Data Management:** Centralized data structures in `js/data.js` containing vehicle specs, pricing, trip details, and testimonials.
- **Integrations:** Uses [EmailJS](https://www.emailjs.com/) for handling booking confirmation emails.
- **Styling:** Custom CSS with a consistent color palette defined via CSS variables in `styles/main.css`.
- **Interactivity:** Modular JavaScript files for different sections (e.g., `home.js` for sliders, `booking.js` for the rental workflow).

## Directory Structure

- `index.html`: Main landing page.
- `booking.html`: Multi-step booking process.
- `motorcycles.html`, `cars.html`, `trips.html`: Catalog pages for different rental categories.
- `js/`:
  - `data.js`: The "source of truth" for all vehicle and trip data.
  - `main.js`: Global utilities and shared UI logic (navigation, smooth scroll).
  - `booking.js`: Logic for the rental calculator, form validation, and EmailJS integration.
- `styles/`: Scoped CSS files for each major page and `main.css` for global styles.
- `images/`: Organized by category (car, motorcycles, slider, trip, members).

## Building and Running

Since this is a static site, no build step is required.
- **Development:** Open `index.html` in any modern web browser or use a simple local server (e.g., VS Code Live Server).
- **Testing:** Manually verify responsiveness and form logic in the browser.
- **Deployment:** Can be hosted on any static hosting provider (GitHub Pages, Netlify, Vercel).

## Development Conventions

- **Data Driven:** Avoid hardcoding vehicle or trip details in HTML. Instead, update `js/data.js` and ensure the rendering functions (e.g., `renderMotorcycleOptions`) reflect the changes.
- **CSS Variables:** Use the defined variables for colors:
  - `--brand-red`: `#dc2626` (Primary Action)
  - `--brand-dark`: `#111827` (Main Background)
  - `--brand-light`: `#f3f4f6` (Text/Highlights)
  - `--brand-silver`: `#9ca3af` (Secondary Text)
- **Responsive Design:** Follow the existing mobile-first approach with a breakpoint at `768px`.
- **Form Validation:** Implement validation logic in JS before submission (see `validateStep` in `booking.js`).
- **Email Templates:** EmailJS templates are used for booking confirmations. Current service ID is `service_6meqbya`.

## Key Features

- **Booking Workflow:** 4-step process: Select Vehicle -> Rental Details -> Personal Info -> Confirmation.
- **Promo Codes:** Managed via `PROMO_CODES` object in `js/booking.js`.
- **Dynamic Pricing:** Real-time calculation of rental costs based on duration, vehicle type, and selected options (helmets, insurance, etc.).
