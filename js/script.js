function sendBookingEmails(bookingData) {
    // Email au client
    const clientEmailParams = {
        first_name: bookingData.personalInfo['first-name'],
        last_name: bookingData.personalInfo['last-name'],
        email: bookingData.personalInfo.email,
        phone: bookingData.personalInfo.phone,
        booking_number: generateBookingNumber(),
        booking_date: new Date().toLocaleDateString('fr-FR'),
        motorcycle_name: bookingData.motorcycle.name,
        motorcycle_type: bookingData.motorcycle.type,
        motorcycle_engine: bookingData.motorcycle.specs.engine,
        motorcycle_power: bookingData.motorcycle.specs.power,
        motorcycle_image: bookingData.motorcycle.imageUrl,
        pickup_date: formatDate(bookingData.pickupDate),
        pickup_time: bookingData.pickupTime,
        return_date: formatDate(bookingData.returnDate),
        return_time: bookingData.returnTime,
        rental_days: calculateRentalDays(),
        has_options: Object.keys(bookingData.options).length > 0,
        options: formatOptions(bookingData.options),
        base_price: formatCurrency(calculateBasePrice()),
        options_total: formatCurrency(calculateOptionsTotal()),
        total_amount: formatCurrency(bookingData.totalCost),
        promo_code: bookingData.promoCode || '',
        discount_amount: formatCurrency(bookingData.discountAmount || ''),
        original_price: formatCurrency(bookingData.originalPrice || ''),
    };

    // Email pour vous (ordre de réservation)
    const orderEmailParams = {
        first_name: bookingData.personalInfo['first-name'],
        last_name: bookingData.personalInfo['last-name'],
        email: bookingData.personalInfo.email,
        phone: bookingData.personalInfo.phone,
        license_number: bookingData.personalInfo['license-number'],
        country: bookingData.personalInfo.country,
        booking_number: generateBookingNumber(),
        booking_date: new Date().toLocaleDateString('fr-FR'),
        current_timestamp: new Date().toLocaleString('fr-FR'),
        motorcycle_name: bookingData.motorcycle.name,
        motorcycle_type: bookingData.motorcycle.type,
        daily_price: formatCurrency(bookingData.motorcycle.pricePerDay),
        pickup_date: formatDate(bookingData.pickupDate),
        pickup_time: bookingData.pickupTime,
        return_date: formatDate(bookingData.returnDate),
        return_time: bookingData.returnTime,
        rental_days: calculateRentalDays(),
        has_options: Object.keys(bookingData.options).length > 0,
        options: formatOrderOptions(bookingData.options),
        base_price: formatCurrency(calculateBasePrice()),
        total_amount: formatCurrency(bookingData.totalCost),
        calendar_start: formatCalendarDate(bookingData.pickupDate, bookingData.pickupTime),
        calendar_end: formatCalendarDate(bookingData.returnDate, bookingData.returnTime),
        promo_code: bookingData.promoCode || '',
        discount_amount: formatCurrency(bookingData.discountAmount || ''),
        original_price: formatCurrency(bookingData.originalPrice || ''),
    };

    // Envoyer email au client
    emailjs.send('YOUR_SERVICE_ID', 'CLIENT_CONFIRMATION_TEMPLATE_ID', clientEmailParams);
    
    // Envoyer email ordre de réservation
    emailjs.send('YOUR_SERVICE_ID', 'ORDER_NOTIFICATION_TEMPLATE_ID', orderEmailParams)
        .then(function(response) {
            console.log('Emails envoyés avec succès!');
            showNotification('Confirmation envoyée! Email reçu dans votre boîte.', 'success');
        });
}

