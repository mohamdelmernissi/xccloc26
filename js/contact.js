function renderContactInfo() {
    const contactData = JSON.parse(localStorage.getItem('admin_contact'));
    if (!contactData) return;

    // Update Address
    const addressContainer = document.querySelector('.contact-item:nth-child(1) .contact-details p');
    if (addressContainer && contactData.address) {
        addressContainer.innerHTML = contactData.address.replace(/\n/g, '<br>');
    }

    // Update Phone
    const phoneContainer = document.querySelector('.contact-item:nth-child(2) .contact-details');
    if (phoneContainer) {
        let phoneHtml = '<h3>Phone</h3>';
        if (contactData.phone1) phoneHtml += `<p>${contactData.phone1}</p>`;
        if (contactData.phone2) phoneHtml += `<p>${contactData.phone2}</p>`;
        phoneContainer.innerHTML = phoneHtml;
    }

    // Update Email
    const emailContainer = document.querySelector('.contact-item:nth-child(3) .contact-details');
    if (emailContainer) {
        let emailHtml = '<h3>Email</h3>';
        if (contactData.email1) emailHtml += `<p>${contactData.email1}</p>`;
        if (contactData.email2) emailHtml += `<p>${contactData.email2}</p>`;
        emailContainer.innerHTML = emailHtml;
    }

    // Update Opening Hours
    const hoursContainer = document.querySelector('.contact-item:nth-child(4) .contact-details');
    if (hoursContainer) {
        let hoursHtml = '<h3>Opening Hours</h3>';
        if (contactData.hours1) hoursHtml += `<p>${contactData.hours1}</p>`;
        if (contactData.hours2) hoursHtml += `<p>${contactData.hours2}</p>`;
        hoursContainer.innerHTML = hoursHtml;
    }

    // Update Social Links
    const facebookLink = document.querySelector('.social-icons a[href*="facebook"]');
    if (facebookLink && contactData.facebookUrl) facebookLink.href = contactData.facebookUrl;

    const instagramLink = document.querySelector('.social-icons a[href*="instagram"]');
    if (instagramLink && contactData.instagramUrl) instagramLink.href = contactData.instagramUrl;

    const whatsappLink = document.querySelector('.social-icons a[href*="wa.me"]');
    if (whatsappLink && contactData.whatsappNumber) whatsappLink.href = `https://wa.me/${contactData.whatsappNumber.replace(/\D/g, '')}`;
}

async function initContactPage() {
    await fetchContactFromSupabase();
    renderContactInfo();
    setupContactForm();
    setupFAQ();
    setupFormValidation();
}

async function fetchContactFromSupabase() {
    if (!window.supabase) return;
    try {
        const { data, error } = await window.supabase
            .from('contact_info')
            .select('*')
            .eq('id', 'main')
            .single();
        if (!error && data) {
            const contactData = {
                address: data.address,
                phone1: data.phone1,
                phone2: data.phone2,
                email1: data.email1,
                email2: data.email2,
                hours1: data.hours1,
                hours2: data.hours2,
                facebookUrl: data.facebook_url,
                instagramUrl: data.instagram_url,
                whatsappNumber: data.whatsapp_number
            };
            localStorage.setItem('admin_contact', JSON.stringify(contactData));
        }
    } catch (e) {
        console.warn('Failed to fetch contact info from Supabase, using fallback', e);
    }
}

async function ReachOutEmail(formData) {
    
    
  const token = "q77q6xfg5kKCVfzcH"; // Your EmailJS public key

  try {
    const response = await emailjs.send(
      "service_ptynnoc", // your service ID
      "template_ludtls8", // your template ID
      {
        name: `${formData.firstName} ${formData.lastName}`,
        title: `New message from ${formData.firstName} ${formData.lastName}.`,
        message: `
        Message: ${formData.message}
        Phone: ${formData.phone}
        Email: ${formData.email}
                `,
      },
      token
    );

    console.log("Email sent:", response);
    return response;
  } catch (error) {
    console.error("Email failed:", error);
    throw error;
  }
}

function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitContactForm();
        }
    });
}

function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

function setupFormValidation() {
    const form = document.getElementById('contact-form');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous error
    clearFieldError({ target: field });
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.style.borderColor = '#ef4444';
    
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.style.color = '#ef4444';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
}

function clearFieldError(e) {
    const field = e.target;
    field.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function validateForm() {
    const form = document.getElementById('contact-form');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            showFieldError(field, 'This field is required');
        }
    });
    
    // Validate email if provided
    const emailField = form.querySelector('#email');
    if (emailField.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            isValid = false;
            showFieldError(emailField, 'Please enter a valid email address');
        }
    }
    
    return isValid;
}

function submitContactForm() {
    const form = document.getElementById('contact-form');
    const formData = new FormData(form);
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // In a real application, you would send the data to a server here
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        
        // Handle name field - can be single name or first + last
        const nameParts = formObject.name ? formObject.name.trim().split(' ') : ['', ''];
        const formDataObj = {
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            email: formObject.email || '',
            phone: formObject.phone || '',
            message: formObject.message || ''
        };
        
        ReachOutEmail(formDataObj);
        console.log('Form submitted:', formObject);
        
        // Show success message
        showNotification('Message sent successfully! We will get back to you within 24 hours.', 'success');
        
        // Reset form
        form.reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function showNotification(message, type) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    // Add keyframes for animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
            if (style.parentNode) {
                style.remove();
            }
        }, 300);
    }, 5000);
}

// Initialize contact page when DOM is loaded
document.addEventListener('DOMContentLoaded', initContactPage);
