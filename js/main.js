console.log('main.js loaded');

let availabilityBlocks = [];

async function fetchAvailabilityBlocks() {
    if (!window.supabase) return;
    try {
        const { data, error } = await window.supabase
            .from('availability')
            .select('*')
            .order('start_date', { ascending: true });
        if (!error && data && data.length > 0) {
            availabilityBlocks = data.map(row => ({
                id: row.id,
                vehicleId: row.vehicle_id,
                start: row.start_date,
                end: row.end_date,
                reason: row.reason,
                note: row.note
            }));
        }
    } catch (e) {
        console.warn('Failed to fetch availability blocks', e);
    }
}

function isVehicleBlocked(vehicleId) {
    const today = new Date().toISOString().split('T')[0];
    return availabilityBlocks.some(b => {
        if (b.vehicleId !== vehicleId) return false;
        return datesOverlap(new Date(b.start), new Date(b.end), new Date(today), new Date(today));
    });
}

function getVehicleBlockInfo(vehicleId) {
    const today = new Date().toISOString().split('T')[0];
    return availabilityBlocks.find(b => {
        if (b.vehicleId !== vehicleId) return false;
        return datesOverlap(new Date(b.start), new Date(b.end), new Date(today), new Date(today));
    }) || null;
}

function showBlockPopup(vehicleName, reason, start, end) {
    const existing = document.getElementById('vehicle-block-popup');
    if (existing) existing.remove();
    
    if (!document.getElementById('block-popup-styles')) {
        const style = document.createElement('style');
        style.id = 'block-popup-styles';
        style.textContent = `
            .block-popup-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
            }
            .block-popup {
                background: var(--brand-dark);
                border: 1px solid var(--brand-red);
                border-radius: 0.5rem;
                padding: 2rem;
                max-width: 400px;
                width: 90%;
                text-align: center;
                position: relative;
            }
            .block-popup h3 {
                color: var(--brand-light);
                margin-bottom: 1rem;
            }
            .block-popup p {
                color: var(--brand-silver);
                margin-bottom: 0.5rem;
                font-size: 0.95rem;
            }
            .block-popup-close {
                position: absolute;
                top: 0.5rem;
                right: 0.75rem;
                background: none;
                border: none;
                color: var(--brand-silver);
                font-size: 1.5rem;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);
    }
    
    const overlay = document.createElement('div');
    overlay.id = 'vehicle-block-popup';
    overlay.className = 'block-popup-overlay';
    overlay.innerHTML = `
        <div class="block-popup">
            <button class="block-popup-close" onclick="this.closest('.block-popup-overlay').remove()">&times;</button>
            <h3>Vehicle Unavailable</h3>
            <p><strong>${vehicleName}</strong> is currently under <strong>${reason}</strong>.</p>
            <p>Blocked from <strong>${start}</strong> to <strong>${end}</strong>.</p>
            <p>Please select another vehicle.</p>
        </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) overlay.remove();
    });
}

function datesOverlap(start1, end1, start2, end2) {
    return (start1 <= end2) && (end1 >= start2);
}

function getPricingRules() {
    try {
        if (typeof PRICING_RULES !== 'undefined' && PRICING_RULES.length > 0) {
            return PRICING_RULES;
        }
    } catch (e) {}
    try {
        return JSON.parse(localStorage.getItem('admin_pricing_rules') || '[]');
    } catch (e) {
        return [];
    }
}

async function fetchPricingRulesFromSupabase() {
    if (!window.supabase) return;
    try {
        const { data, error } = await window.supabase
            .from('pricing_rules')
            .select('*')
            .order('id', { ascending: true });

        if (error) throw error;

        const fetched = (data || []).map(row => ({
            id: row.id,
            name: row.name,
            type: row.type,
            impactType: row.impact_type,
            value: row.value,
            start: row.start_date || '',
            end: row.end_date || '',
            vehicleIds: row.vehicle_ids || []
        }));

        if (typeof PRICING_RULES !== 'undefined') {
            PRICING_RULES.splice(0, PRICING_RULES.length, ...fetched);
        }
        localStorage.setItem('admin_pricing_rules', JSON.stringify(fetched));
    } catch (e) {
        console.warn('Failed to fetch pricing rules from Supabase, using fallback', e);
    }
}

function getEffectivePrice(basePrice, dateStr, vehicleId) {
    const rules = getPricingRules();
    if (!rules.length) return basePrice;

    const d = new Date(dateStr);
    const date = d.toISOString().split('T')[0];
    const isWeekend = [0, 5, 6].includes(d.getDay());

    let adjustment = 0;
    rules.forEach(rule => {
        let apply = false;
        if (rule.type === 'seasonal' && rule.start && rule.end && date >= rule.start && date <= rule.end) {
            apply = true;
        } else if (rule.type === 'weekend' && isWeekend) {
            apply = true;
        }

        if (apply) {
            const ruleVehicles = rule.vehicleIds || [];
            if (ruleVehicles.length > 0) {
                if (vehicleId === undefined || vehicleId === null || !ruleVehicles.map(String).includes(String(vehicleId))) {
                    return;
                }
            }
            if (rule.impactType === 'percentage') {
                adjustment += (basePrice * rule.value) / 100;
            } else {
                adjustment += rule.value;
            }
        }
    });

    return basePrice + adjustment;
}

function renderPriceTag(basePrice, dateStr, vehicleId, unit) {
    const effective = getEffectivePrice(basePrice, dateStr, vehicleId);
    const u = unit || '€/day';
    if (effective < basePrice) {
        return `<span class="old-price">${basePrice} ${u}</span><span class="new-price">${effective} ${u}</span>`;
    }
    return `${effective} ${u}`;
}

function discountBadgeHtml(basePrice, dateStr, vehicleId) {
    const effective = getEffectivePrice(basePrice, dateStr, vehicleId);
    if (effective >= basePrice) return '';
    const pct = Math.round((basePrice - effective) / basePrice * 100);
    const info = getPricingRuleInfo(dateStr, vehicleId);
    if (!info) return `<span class="discount-badge">-${pct}%</span>`;
    if (info.type === 'seasonal') {
        return `<span class="discount-badge" data-countdown="${info.endMs}">-${pct}% · Reste <span class="cd"></span> (${info.endLabel})</span>`;
    }
    return `<span class="discount-badge">-${pct}% · ${info.label}</span>`;
}

function getPricingRuleInfo(dateStr, vehicleId) {
    const rules = getPricingRules();
    const d = new Date(dateStr);
    const date = d.toISOString().split('T')[0];
    const isWeekend = [0, 5, 6].includes(d.getDay());
    let info = null;
    (rules || []).forEach(rule => {
        let apply = false;
        if (rule.type === 'seasonal' && rule.start && rule.end && date >= rule.start && date <= rule.end) {
            apply = true;
        } else if (rule.type === 'weekend' && isWeekend) {
            apply = true;
        }
        if (!apply) return;
        const ruleVehicles = rule.vehicleIds || [];
        if (ruleVehicles.length > 0 && (vehicleId === undefined || vehicleId === null || !ruleVehicles.map(String).includes(String(vehicleId)))) return;
        if (rule.type === 'seasonal') {
            const parts = rule.end.split('-');
            info = {
                type: 'seasonal',
                endMs: new Date(rule.end + 'T23:59:59').getTime(),
                endLabel: `${parts[2]}/${parts[1]}`
            };
        } else {
            info = { type: 'weekend', label: 'Week-end' };
        }
    });
    return info;
}

function formatCountdown(ms) {
    const s = Math.floor(ms / 1000);
    const days = Math.floor(s / 86400);
    return days > 0 ? days + 'j' : '0j';
}

function updateCountdowns() {
    const now = Date.now();
    document.querySelectorAll('.discount-badge[data-countdown]').forEach(badge => {
        const cd = badge.querySelector('.cd');
        if (!cd) return;
        const remaining = parseInt(badge.getAttribute('data-countdown'), 10) - now;
        cd.textContent = remaining <= 0 ? 'Terminé' : formatCountdown(remaining);
    });
}

function startCountdownTimer() {
    updateCountdowns();
    setInterval(updateCountdowns, 1000);
}

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
    
    // Live countdown timer for seasonal discount badges
    startCountdownTimer();

    console.log('RideMarrakech - Common functionality initialized');
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
