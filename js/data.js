console.log('data.js loaded');

// Motorcycles Data - Comprehensive list from main.js
const MOTORCYCLES = [
    {
        id: 'KTM390AdventureR',
        name: 'KTM 390 Adventure R',
        type: 'Adventure',
        pricePerDay: 79,
        imageUrl: '/images/logo/motocycles/ktm.webp',
        specs: {
            engine: ' 399 cc',
            power: '45 ch',
            seatHeight: '870 mm',
            weight: '176 kg',
        },
    },
    {
        id: 'CFMOTO450MT',
        name: 'CF MOTO 450 MT',
        type: 'Adventure',
        pricePerDay: 75,
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
        pricePerDay: 75,
        imageUrl: '/images/logo/motocycles/himalayan.webp',
        specs: {
            engine: '452 cc',
            power: '40 ch',
            seatHeight: '825 mm',
            weight: '199 kg',
        },
    },
    {
        id: 'CFMOTO800MT',
        name: 'CF MOTO 800 MT Explorer',
        type: 'Adventure',
        pricePerDay: 99,
        imageUrl: '/images/logo/motocycles/CF MOTO 800 MT Explorer.webp',
        specs: {
            engine: '799 cc',
            power: '95 ch',
            seatHeight: '825 mm',
            weight: '220 kg',
        },
    },
    {
        id: 'cf-moto-mtx-800',
        name: 'CF MOTO 800 MTX',
        type: 'Adventure',
        pricePerDay: 109,
        imageUrl: '/images/logo/motocycles/mtx.webp',
        specs: {
            engine: '799 cc',
            power: '94 ch',
            seatHeight: '870 mm',
            weight: '196 kg',
        },
    },
    {
        id: 'voge800Rally',
        name: 'Voge 800 Rally',
        type: 'Adventure',
        pricePerDay: 99,
        imageUrl: '/images/logo/motocycles/Voge 800 Rally.webp',
        specs: {
            engine: '799 cc',
            power: '95 ch',
            seatHeight: '915 mm',
            weight: '213 kg',
        },
    },
    {
        id: 'Kove-450-Rally',
        name: 'Kove 450 Rally',
        type: 'Adventure',
        pricePerDay: 179,
        imageUrl: '/images/logo/motocycles/kove.webp',
        specs: {
            engine: '449 cc',
            power: '42 ch',
            seatHeight: '960 mm',
            weight: '150 kg',
        },
    },
    {
        id: 'Kove-800-Rally',
        name: 'Kove 800 Rally',
        type: 'Adventure',
        pricePerDay: 129,
        imageUrl: '/images/logo/motocycles/kove800.webp',
        specs: {
            engine: '799 cc',
            power: '95 ch',
            seatHeight: '895 mm',
            weight: '176 kg',
        },
    },
    {
        id: 'yamaha-tenere-700',
        name: 'Yamaha Ténéré 700',
        type: 'Adventure',
        pricePerDay: 129,
        imageUrl: '/images/logo/motocycles/Yamaha Ténéré 700.webp',
        specs: {
            engine: '689 cc',
            power: '72 ch',
            seatHeight: '875 mm',
            weight: '204 kg',
        },
    },
    {
        id: 'kawasaki-z-900',
        name: 'Kawasaki Z 900',
        type: 'Sport',
        pricePerDay: 129,
        imageUrl: '/images/logo/motocycles/z900.webp',
        specs: {
            engine: '948 cc',
            power: '120 ch',
            seatHeight: '~820 mm',
            weight: '210 kg',
        },
    },
    {
        id: 'Hondaxadv750',
        name: 'Honda X-ADV 750',
        type: 'Scooter',
        pricePerDay: 119,
        imageUrl: '/images/logo/motocycles/Honda X-ADV 750.webp',
        specs: {
            engine: '745 cc',
            power: '58.6 ch',
            seatHeight: '820 mm',
            weight: '226 kg',
        },
    },
    {
        id: 'vespa-primavera-50',
        name: 'Vespa Primavera 50',
        type: 'Scooter',
        pricePerDay: 19,
        imageUrl: '/images/logo/motocycles/Vespa Primavera 50.webp',
        specs: {
            engine: '49 cc',
            power: '3.2 ch',
            seatHeight: '790 mm',
            weight: '130 kg',
        },
    },
    {
        id: 'cfmoto-zforce-z10',
        name: 'CFMoto ZForce Z10',
        type: 'Buggy',
        pricePerDay: 499,
        imageUrl: '/images/logo/motocycles/zf.webp',
        specs: {
            engine: '998 cc',
            power: '143 ch',
            seatHeight: '-',
            weight: '955 kg',
        },
    },
];

// Trips Data
const TRIPS = [
    {
        id: 'atlas-mountains',
        title: 'High Atlas Mountains Expedition',
        description: 'A breathtaking journey through the winding roads and stunning vistas of the Atlas Mountains. Perfect for adventure bikes.',
        distance: 'Approx. 350km loop',
        recommendedBike: 'Voge 800 Rally',
        imageUrl: '/images/trip/atlas-mountains.jpg',
        state:'Coming Soon'
    },
    {
        id: 'essaouira-coast',
        title: 'Coastal Ride to Essaouira',
        description: 'Enjoy the ocean breeze on this scenic route to the historic and vibrant coastal city of Essaouira.',
        distance: 'Approx. 190km one-way',
        recommendedBike: 'Any adventure bike',
        imageUrl: '/images/trip/essaouira-coast.jpg',
        state:'Coming Soon'
    },
    {
        id: 'ourika-valley',
        title: 'Ourika Valley Day Trip',
        description: 'A short but spectacular ride from Marrakech, leading you to the lush green landscapes and waterfalls of the Ourika Valley.',
        distance: 'Approx. 60km one-way',
        recommendedBike: 'Any bike or scooter',
        imageUrl:'/images/trip/ourika-valley.jpg',
        state:'180 €'
    },
    {
        id: 'zagora-desert',
        title: 'Gateway to the Desert: Zagora',
        description: 'An epic adventure for seasoned riders, crossing mountain passes to reach the desert town of Zagora.',
        distance: 'Approx. 350km one-way',
        recommendedBike: 'Yamaha Ténéré 700',
        imageUrl: '/images/trip/zagora-desert.jpg',
        state:'Coming Soon'
    },
];

// Testimonials Data
const TESTIMONIALS = [
    {
        id: '1',
        name: 'Alex Johnson',
        text: "Renting the GS1250 was our Morocco trip. The bike was in perfect condition and the the best decision of service from RideMarrakech was top-notch. The Atlas Mountains route they recommended was unforgettable!",
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

// 4x4 Vehicles Data
const FOURXFOUR = [
    {
        id: 'dacia-logan',
        name: 'Dacia Logan',
        type: 'Sedan',
        imageUrl: '/images/car/lg.webp',
        pricePerDay: 39,
        specs: {
            engine: '1.0L ',
            drive: 'FWD',
            seats: '5',
            fuel: 'Diesel'
        }
    },
    {
        id: 'peugeot-208',
        name: 'Peugeot 208',
        type: 'Hatchback',
        imageUrl: '/images/car/208.webp',
        pricePerDay: 39,
        specs: {
            engine: '1.2L ',
            drive: 'FWD',
            seats: '5',
            fuel: 'Diesel'
        }
    },
    {
        id: 'dacia-duster',
        name: 'Dacia Duster',
        type: 'SUV',
        imageUrl: '/images/car/dca.webp',
        pricePerDay: 49,
        specs: {
            engine: '1.5L ',
            drive: '4x4',
            seats: '5',
            fuel: 'Diesel'
        }
    },
    {
        id: 'dacia-duster-2',
        name: 'Dacia Duster + Mecanic',
        type: 'SUV',
        imageUrl: '/images/car/asdc.png',
        pricePerDay: 179,
        specs: {
            engine: '1.5L ',
            drive: '4x4',
            seats: '5',
            fuel: 'Diesel'
        }
    },
    {
        id: 'peugeot-landtrek',
        name: 'Peugeot Landtrek + Mecanic',
        type: 'Pickup',
        imageUrl: '/images/car/aspgt.png',
        pricePerDay: 229,
        specs: {
            engine: '1.9L ',
            drive: '4x4',
            seats: '5',
            fuel: 'Diesel'
        }
    },
    {
        id: 'nissan-navara',
        name: 'Nissan Navarra + Mecanic',
        type: 'Pickup',
        imageUrl: '/images/car/asnis.png',
        pricePerDay: 229,
        specs: {
            engine: '2.3L ',
            drive: '4x4',
            seats: '5',
            fuel: 'Diesel'
        }
    },
];

// Export data for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MOTORCYCLES, TRIPS, TESTIMONIALS, FOURXFOUR };
}
