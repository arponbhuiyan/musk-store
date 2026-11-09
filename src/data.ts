/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Category, Brand, Coupon, Banner, Blog, Review } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'earbuds',
    name: 'Wireless Earbuds',
    slug: 'wireless-earbuds',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=400&auto=format&fit=crop',
    productCount: 4
  },
  {
    id: 'headphones',
    name: 'Headphones',
    slug: 'headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop',
    productCount: 3
  },
  {
    id: 'neckbands',
    name: 'Wireless Neckbands',
    slug: 'neckbands',
    image: 'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?q=80&w=400&auto=format&fit=crop',
    productCount: 2
  },
  {
    id: 'watches',
    name: 'Smart Watches',
    slug: 'smart-watches',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=400&auto=format&fit=crop',
    productCount: 4
  },
  {
    id: 'speakers',
    name: 'Bluetooth Speakers',
    slug: 'bluetooth-speakers',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=400&auto=format&fit=crop',
    productCount: 3
  },
  {
    id: 'soundboxes',
    name: 'Sound Boxes & Bars',
    slug: 'sound-boxes',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=400&auto=format&fit=crop',
    productCount: 2
  },
  {
    id: 'powerbanks',
    name: 'Power Banks',
    slug: 'power-banks',
    image: 'https://images.unsplash.com/photo-1609592424109-dd0922e339ff?q=80&w=400&auto=format&fit=crop',
    productCount: 2
  },
  {
    id: 'covers',
    name: 'Mobile Covers & Cases',
    slug: 'mobile-covers',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=400&auto=format&fit=crop',
    productCount: 3
  },
  {
    id: 'ledstrips',
    name: 'LED Strip Lights',
    slug: 'led-strip-lights',
    image: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?q=80&w=400&auto=format&fit=crop',
    productCount: 2
  },
  {
    id: 'ringlights',
    name: 'Ring Lights',
    slug: 'ring-lights',
    image: 'https://images.unsplash.com/photo-1595935736128-db120a27ac7a?q=80&w=400&auto=format&fit=crop',
    productCount: 2
  },
  {
    id: 'portablefans',
    name: 'Portable Hand & Table Fans',
    slug: 'portable-fans',
    image: '/images/cyber_folding_fan_1790889147393.jpg',
    productCount: 4
  },
  {
    id: 'headlights',
    name: 'LED Headlights & Adventure Gear',
    slug: 'led-headlights',
    image: '/images/led_headlight_12000_1790889231830.jpg',
    productCount: 2
  },
  {
    id: 'accessories',
    name: 'Mobile Accessories & Rings',
    slug: 'mobile-accessories',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=400&auto=format&fit=crop',
    productCount: 4
  }
];

export const INITIAL_BRANDS: Brand[] = [
  { id: 'musk', name: 'MUSK Premium', slug: 'musk-premium' },
  { id: 'jbl', name: 'JBL', slug: 'jbl' },
  { id: 'itel', name: 'itel', slug: 'itel' },
  { id: 'keqiwear', name: 'KEQIWEAR Germany', slug: 'keqiwear' },
  { id: 'apple', name: 'Apple', slug: 'apple' },
  { id: 'anker', name: 'Anker Space', slug: 'anker' },
  { id: 'oraimo', name: 'Oraimo', slug: 'oraimo' },
  { id: 'xiaomi', name: 'Xiaomi', slug: 'xiaomi' },
  { id: 'baseus', name: 'Baseus', slug: 'baseus' }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-jbl-mini',
    name: 'JBL Sound Beyond Size Mini Bluetooth Speaker',
    slug: 'jbl-sound-beyond-size-mini-bluetooth-speaker',
    categoryId: 'speakers',
    categoryName: 'Bluetooth Speakers',
    brandId: 'jbl',
    brandName: 'JBL',
    regularPrice: 2200,
    discountPrice: 1450,
    isFlashSale: true,
    flashSalePrice: 1290,
    rating: 4.9,
    ratingCount: 184,
    specs: {
      'Sound Performance': 'JBL Signature Bass & Room-filling Acoustic Clarity',
      'Design Architecture': 'Ultra-compact dome capsule with precision aluminum grill',
      'Playtime': 'Up to 8 Hours Continuous Wireless Playback',
      'Connectivity': 'Bluetooth 5.3 Quick Pair & TWS Dual Link',
      'Portability': 'Ultra Portable Lightweight Pocket Design',
      'Charging Interface': 'USB Type-C Fast Charging (1.5 hours full charge)'
    },
    description: 'Experience immersive sound anywhere you go with the JBL Sound Beyond Size. Engineered to be compact, stylish, and built for every beat of your life. Delivers shockingly loud, distortion-free audio from a pocket-sized pebble form factor with premium metallic accents.',
    images: [
      '/images/jbl_mini_speaker_1790889124976.jpg',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=800&auto=format&fit=crop'
    ],
    stock: 45,
    colors: ['Matte Black', 'Electric Blue', 'Crimson Red'],
    isBestSeller: true,
    isNewArrival: true,
    sku: 'JBL-SBS-MINI',
    warranty: '1 Year Brand Replacement Warranty'
  },
  {
    id: 'prod-cyber-fan',
    name: 'High Speed Folding Cyber Cooling Fan with Digital LED Display',
    slug: 'high-speed-folding-cyber-cooling-fan-digital-led-display',
    categoryId: 'portablefans',
    categoryName: 'Portable Hand & Table Fans',
    brandId: 'musk',
    brandName: 'MUSK Premium',
    regularPrice: 1850,
    discountPrice: 1250,
    isFlashSale: true,
    flashSalePrice: 1090,
    rating: 4.9,
    ratingCount: 128,
    specs: {
      'Body Chassis': 'Transparent cyber aesthetic with visible gold-plated circuitry',
      'Smart Display': 'Digital LED battery % and speed level readout (up to 100 levels)',
      'Folding Mechanism': '180° Adjustable folding neck for both handheld and desktop standing',
      'Turbine Engine': 'High-velocity turbine brushless motor with extreme airflow',
      'Battery Power': 'High-density rechargeable lithium cell for all-day runtime',
      'Accessories Included': 'Braided neck lanyard, Type-C charging cable & retail box'
    },
    description: 'Next-generation cooling technology with a futuristic transparent cyber body. Features a precision digital LED screen showing real-time speed level and battery percentage, a 180° foldable neck for versatile desktop or pocket use, and ultra-quiet hurricane airspeed.',
    images: [
      '/images/cyber_folding_fan_1790889147393.jpg',
      'https://images.unsplash.com/photo-1622737133809-d95047b9e673?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=800&auto=format&fit=crop'
    ],
    stock: 60,
    colors: ['Cyber Smoke Black', 'Frosted Crystal'],
    isBestSeller: true,
    isNewArrival: true,
    sku: 'MSK-FAN-CYB',
    warranty: '6 Months Brand Replacement Warranty'
  },
  {
    id: 'prod-jbl-boombox-mini',
    name: 'JBL Boombox 4 Mini LED Portable Waterproof Bluetooth Speaker',
    slug: 'jbl-boombox-4-mini-led-portable-waterproof-bluetooth-speaker',
    categoryId: 'soundboxes',
    categoryName: 'Sound Boxes & Bars',
    brandId: 'jbl',
    brandName: 'JBL',
    regularPrice: 3800,
    discountPrice: 2650,
    isFlashSale: true,
    flashSalePrice: 2350,
    rating: 4.9,
    ratingCount: 96,
    specs: {
      'RGB Light Show': 'Dual circular pulsating multi-color RGB LED halo rings on side bass radiators',
      'Acoustic Power': 'Heavy Bass dual long-throw drivers with reinforced passive bass radiators',
      'Ergonomics': 'Integrated heavy-duty molded carry handle for grab-and-go portability',
      'Durability': 'Splash-proof IPX5 water resistance with rugged woven mesh body',
      'Playtime': 'Up to 15 Hours playtime with 4000mAh battery',
      'Multi-Source Input': 'Bluetooth 5.3, USB Flash Drive playback, TF MicroSD, AUX 3.5mm'
    },
    description: 'Unleash monster bass with dynamic RGB lighting! The JBL Boombox 4 Mini LED speaker combines punchy subwoofers with color-shifting LED halos on both side radiators. Features a sturdy integrated handle, water-resistant rugged mesh body, and multi-format audio playback.',
    images: [
      '/images/jbl_boombox_mini_1790889171557.jpg',
      'https://images.unsplash.com/photo-1543512214-318c7553f230?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop'
    ],
    stock: 30,
    colors: ['Stealth Black'],
    isBestSeller: true,
    isNewArrival: true,
    sku: 'JBL-BB4-MINI',
    warranty: '1 Year Brand Replacement Warranty'
  },
  {
    id: 'prod-itel-n500',
    name: 'itel N500 Halter-Neck Headphone Bass Edition',
    slug: 'itel-n500-halter-neck-headphone-bass-edition',
    categoryId: 'neckbands',
    categoryName: 'Wireless Neckbands',
    brandId: 'itel',
    brandName: 'itel',
    regularPrice: 1750,
    discountPrice: 1250,
    isFlashSale: false,
    rating: 4.8,
    ratingCount: 112,
    specs: {
      'Battery Playtime': '75 Hours Monster Long Playback on a single charge',
      'Clear Calling': 'Crystal Clear Calls with Built-In Speaker & HD Noise Reduction Mic',
      'Ergonomic Comfort': '3D Ergonomic Anti-Slip Design for secure fit during sports & long hours',
      'Fast Charging': 'Type-C Fast Charge (10 mins charging provides 10 hours playback)',
      'Earbud Convenience': 'Magnetized Earbuds for secure tangle-free neck hanging',
      'Sound Tuning': 'Bass Edition acoustic chamber for deep resonant bass'
    },
    description: 'Engineered for non-stop performance with an astounding 75 Hours of playback on a single charge. The itel N500 Halter-Neck Headphone Bass Edition features high-clarity voice calling, skin-friendly anti-slip silicone, Type-C fast charging, and magnetic clasps.',
    images: [
      '/images/itel_n500_neckband_1790889186175.jpg',
      'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?q=80&w=800&auto=format&fit=crop'
    ],
    stock: 50,
    colors: ['Cyber Yellow & Black', 'Midnight Black'],
    isBestSeller: true,
    isNewArrival: true,
    sku: 'ITL-N500-BS',
    warranty: '1 Year Brand Replacement Warranty'
  },
  {
    id: 'prod-musk-tf-neckband',
    name: 'MUSK UltraBass Wireless Neckband with Digital Display & TF Card Slot',
    slug: 'musk-ultrabass-wireless-neckband-digital-display-tf-card',
    categoryId: 'neckbands',
    categoryName: 'Wireless Neckbands',
    brandId: 'musk',
    brandName: 'MUSK Premium',
    regularPrice: 1950,
    discountPrice: 1350,
    isFlashSale: true,
    flashSalePrice: 1190,
    rating: 4.9,
    ratingCount: 156,
    specs: {
      'TF Card Player': 'Independent MicroSD / TF card slot — play MP3 music directly without phone',
      'Digital Equalizer': 'Dynamic digital LED status and battery graphic display on collar module',
      'Bluetooth Core': 'Bluetooth 5.3 ultra-stable wireless connection with zero latency',
      'Battery Life': 'Up to 20 Hours continuous playtime with fast Type-C recharging',
      'Acoustic Drivers': 'Hi-Fi Sound Architecture with Deep Punchy Bass',
      'Microphone': 'Built-in omnidirectional HD mic for clear phone calls',
      'Build': 'Premium metallic gunmetal finish built to last'
    },
    description: '"Freedom To Move, Music That Stays." The MUSK UltraBass Wireless Neckband is the ultimate standalone companion: slot in a TF/MicroSD memory card to listen to all your music without needing your phone! Features a vibrant digital LED status display, Bluetooth 5.3, and signature Hi-Fi deep bass.',
    images: [
      '/images/musk_tf_neckband_1790889201182.jpg',
      'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?q=80&w=800&auto=format&fit=crop'
    ],
    stock: 75,
    colors: ['Titanium Gunmetal', 'Cyber Black'],
    isBestSeller: true,
    isNewArrival: true,
    sku: 'MSK-NB-TF20',
    warranty: '1 Year Brand Replacement Warranty'
  },
  {
    id: 'prod-kw2-max-watch',
    name: 'KW2 MAX Smart Watch (3-in-1 Changeable Bands Bundle)',
    slug: 'kw2-max-smart-watch-3-in-1-changeable-bands-bundle',
    categoryId: 'watches',
    categoryName: 'Smart Watches',
    brandId: 'keqiwear',
    brandName: 'KEQIWEAR Germany',
    regularPrice: 3400,
    discountPrice: 2250,
    isFlashSale: true,
    flashSalePrice: 1890,
    rating: 4.9,
    ratingCount: 245,
    specs: {
      'Display': '1.99" Full Touch HD Ultra-Narrow Bezel Curved Display',
      'Included Straps': '3-in-1 Bands (Black Ocean Wave band + Orange Alpine Loop + Cream Silicone strap)',
      'Calling': 'Bluetooth HD Calling with high-clarity speaker and microphone',
      'Health Monitoring': 'Heart Rate, Blood Oxygen (SpO2), Blood Pressure & Sleep tracking',
      'Sports Tracking': 'Multiple Dedicated Sports Modes for indoor & outdoor activities',
      'Waterproof': 'IP67 Water and Sweat Resistant certified',
      'Charging Dock': 'Magnetic wireless fast charging puck included in retail gift box',
      'App Ecosystem': 'FereFit app compatibility with 100+ customizable watch faces'
    },
    description: 'Style Meets Smartness! Upgrade your life — smarter, faster, better with the KW2 MAX Smart Watch (KEQIWEAR Germany). Comes packed with 3 distinct interchangeable straps (Black Ocean, Orange Alpine, Cream Silicone) to match every mood and outfit. Features crisp Bluetooth calling, 1.99" HD display, and full health tracking.',
    images: [
      '/images/kw2_max_watch_1790889216779.jpg',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=800&auto=format&fit=crop'
    ],
    stock: 55,
    colors: ['3-in-1 Triple Band Pack (Black + Orange + Cream)'],
    isBestSeller: true,
    isNewArrival: true,
    sku: 'KW2-MAX-3IN1',
    warranty: '1 Year Brand Replacement Warranty'
  },
  {
    id: 'prod-led-headlight-12000',
    name: 'Rechargeable 12000LM Dual LED Headlight with Magnetic Base',
    slug: 'rechargeable-12000lm-dual-led-headlight-magnetic-base',
    categoryId: 'headlights',
    categoryName: 'LED Headlights & Adventure Gear',
    brandId: 'musk',
    brandName: 'MUSK Premium',
    regularPrice: 1350,
    discountPrice: 850,
    isFlashSale: true,
    flashSalePrice: 690,
    rating: 4.9,
    ratingCount: 215,
    specs: {
      'Brightness Output': '12,000 Lumens Ultra Super Bright beam intensity',
      'Dual Beam System': 'Long-range Focus Spotlight + Wide-angle COB floodlight strip',
      'Magnetic Design': 'Strong side neodymium magnet to snap securely onto car hoods or metal pipes',
      'Battery & Charging': '100% Rechargeable built-in high-capacity lithium battery via USB',
      'Water Resistance': 'Weather-resistant IPX4 sealed against rain and splashes',
      'Headband Comfort': 'Breathable, adjustable elastic headband with reflective safety markings',
      'Ideal Use Cases': 'Fishing, Cycling, Hiking, Camping, Night Running & Emergency Vehicle Repair'
    },
    description: '"অন্ধকারে আপনার সাহসী সঙ্গী — Powerful Light For Every Adventure." The 12000LM Rechargeable LED Headlight features dual illumination with a penetrating focus beam and wide floodlight bar. Includes a strong side magnetic base that attaches instantly to car bodies for hands-free repair work.',
    images: [
      '/images/led_headlight_12000_1790889231830.jpg',
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop'
    ],
    stock: 90,
    colors: ['Tactical Black with Reflective Band'],
    isBestSeller: true,
    isNewArrival: true,
    sku: 'MSK-HL-12K',
    warranty: '6 Months Brand Replacement Warranty'
  },
  {
    id: 'prod-1',
    name: 'MUSK AirAura X7 Premium ANC Earbuds',
    slug: 'musk-airaura-x7-premium-anc-earbuds',
    categoryId: 'earbuds',
    categoryName: 'Wireless Earbuds',
    brandId: 'musk',
    brandName: 'MUSK Premium',
    regularPrice: 4200,
    discountPrice: 2850,
    isFlashSale: true,
    flashSalePrice: 2490,
    rating: 4.8,
    ratingCount: 142,
    specs: {
      'Active Noise cancellation': 'Up to 35dB hybrid ANC',
      'Driver Unit': '11mm Dynamic titanium',
      'Battery Life': 'Up to 38 Hours (with case)',
      'Charging Time': '1.5 Hours via USB-C & Wireless Charging',
      'Bluetooth Version': 'v5.4 Ultra Stable',
      'Waterproof': 'IPX5 Sweat resistance'
    },
    description: 'Immerse yourself in acoustic perfection with the MUSK AirAura X7. Engineered with 35dB Active Noise Cancellation and an advanced titanium 11mm diaphragm, these earbuds offer high-fidelity resonance customized for smart audiophiles. Perfect for daily commutes, workout marathons, and seamless workspace integrations.',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1588444839799-eb6429979d45?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 25,
    colors: ['Stellar Black', 'Ceramic White', 'Nordic Blue'],
    isBestSeller: true,
    isNewArrival: false,
    sku: 'MSK-EA-071',
    warranty: '1 Year Brand Replacement Warranty'
  },
  {
    id: 'prod-2',
    name: 'Anker Soundcore Space One Hybrid ANC Headphones',
    slug: 'anker-soundcore-space-one-hybrid-anc-headphones',
    categoryId: 'headphones',
    categoryName: 'Headphones',
    brandId: 'anker',
    brandName: 'Anker Space',
    regularPrice: 9500,
    discountPrice: 7890,
    isFlashSale: false,
    rating: 4.7,
    ratingCount: 88,
    specs: {
      'Driver Size': '40mm customized dynamic driver',
      'Noise Cancelling': 'Up to 98% reduced noise floor',
      'Playtime': '55 Hours (ANC Off) / 40 Hours (ANC On)',
      'Audio Quality': 'Hi-Res Wireless LDAC certified',
      'Connectivity': 'Bluetooth 5.3 & AUX wired'
    },
    description: 'Engineered for travel and study, the Anker Soundcore Space One delivers unparalleled sound transparency and robust depth. Active tracking filters ambient clutter safely and adapts automatically to human ears. Discover premium over-ear ergonomics today.',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 15,
    colors: ['Midnight Black', 'Slate Blue', 'Latte White'],
    isBestSeller: true,
    isNewArrival: false,
    sku: 'ANK-HP-S1',
    warranty: '18 Months Official Warranty'
  },
  {
    id: 'prod-3',
    name: 'MUSK ChronoElite Smartwatch 2 Ultra',
    slug: 'musk-chronoelite-smartwatch-2-ultra',
    categoryId: 'watches',
    categoryName: 'Smart Watches',
    brandId: 'musk',
    brandName: 'MUSK Premium',
    regularPrice: 6500,
    discountPrice: 4200,
    isFlashSale: true,
    flashSalePrice: 3890,
    rating: 4.9,
    ratingCount: 210,
    specs: {
      'Screen Size': '2.02 Inch AMOLED Curved Retina Display',
      'Peak Brightness': '1000 nits Outdoor visibility',
      'Health Sensors': 'Dual Heartrate, SpO2, Sleep, Blood Pressure',
      'Sports Tracking': '120+ Dedicated Sport profiles',
      'Waterproofing': 'IP68 Swimproof certified',
      'Calling': 'Single-chip Bluetooth HD voice call support'
    },
    description: 'Technology for smartness reaches its peak configuration with the dynamic ChronoElite Smartwatch. Styled with a premium titanium frame and an ultra-vivid 2.02" Retina display, it packs medical-grade health monitoring trackers, customizable dial spheres, and dual-band GPS. The ultimate companion for modern lifestyle professionals.',
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517502884422-41eaaced0168?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 45,
    colors: ['Titanium Orange', 'Stealth Graphite', 'Alpine Green'],
    isBestSeller: true,
    isNewArrival: true,
    sku: 'MSK-SW-2U',
    warranty: '1 Year Brand Replacement Warranty'
  },
  {
    id: 'prod-4',
    name: 'Oraimo Necklace 4 Long-Battery Neckband',
    slug: 'oraimo-necklace-4-long-battery-neckband',
    categoryId: 'neckbands',
    categoryName: 'Wireless Neckbands',
    brandId: 'oraimo',
    brandName: 'Oraimo',
    regularPrice: 2400,
    discountPrice: 1850,
    isFlashSale: false,
    rating: 4.6,
    ratingCount: 64,
    specs: {
      'Battery life': 'Up to 50 Hours monster playing',
      'Driver Size': '12.4mm heavy bass driver',
      'Neckband Material': 'Medical grade liquid silicone',
      'Charging': '10 Mins charging gives 10 hours vibe',
      'Low Latency': '50ms Ultra-low game mode delay'
    },
    description: 'Keep the rhythm beating constantly without battery anxiety. The Oraimo Necklace 3 delivers ultra-rich studio-grade audio with smart magnetic controls and dual-device pairing capabilities.',
    images: [
      'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 20,
    colors: ['Nebula Black', 'Forest Green'],
    isBestSeller: false,
    isNewArrival: true,
    sku: 'ORA-NB-N4',
    warranty: '1 Year Official Warranty'
  },
  {
    id: 'prod-5',
    name: 'MUSK Horizon 360 Sound Box & Speaker',
    slug: 'musk-horizon-360-sound-box-speaker',
    categoryId: 'soundboxes',
    categoryName: 'Sound Boxes & Bars',
    brandId: 'musk',
    brandName: 'MUSK Premium',
    regularPrice: 8500,
    discountPrice: 5900,
    isFlashSale: false,
    rating: 4.8,
    ratingCount: 57,
    specs: {
      'Power Output': '40W RMS Premium Audio output',
      'Connectivity': 'Bluetooth 5.3, AUX, TF, Optical Input',
      'Dual Subwoofers': 'Dual passive radiators',
      'Battery Power': '5200mAh (Playtime: Up to 12 Hrs)'
    },
    description: 'Turn your room into an acoustic stadium. With a full 360-degree cylindrical sound stage, deep resonance chambers, and beautiful light synching ambient glow, this high-performance sound box is the perfect living room hub.',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 12,
    colors: ['Ash Carbon', 'Oak Bronze'],
    isBestSeller: true,
    isNewArrival: true,
    sku: 'MSK-SB-H3',
    warranty: '1 Year Brand Replacement Warranty'
  },
  {
    id: 'prod-6',
    name: 'Baseus 20000mAh 22.5W QC Power Bank',
    slug: 'baseus-20000mah-22-5w-qc-power-bank',
    categoryId: 'powerbanks',
    categoryName: 'Power Banks',
    brandId: 'baseus',
    brandName: 'Baseus',
    regularPrice: 2800,
    discountPrice: 1950,
    isFlashSale: true,
    flashSalePrice: 1790,
    rating: 4.5,
    ratingCount: 165,
    specs: {
      'Capacity': '20,000mAh / 3.7V',
      'Maximum Output': '22.5W Super Fast QC Charging',
      'Supported protocols': 'PD 3.0, QC 3.0, FCP, SCP',
      'Display screen': 'Smart LED Digital capacity indicator',
      'Weight': '340g lightweight profile'
    },
    description: 'Ensure your smart devices always stay powered with the Baseus premium backup charger. Protects from surge, heating, and short-circuits. Charges up to 3 devices simultaneously.',
    images: [
      'https://images.unsplash.com/photo-1609592424109-dd0922e339ff?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 60,
    colors: ['Premium Indigo', 'Sleek Black'],
    isBestSeller: true,
    isNewArrival: false,
    sku: 'BAS-PB-22',
    warranty: '6 Months Official Warranty'
  },
  {
    id: 'prod-7',
    name: 'MUSK AuraGlow Smart LED Strip Lights',
    slug: 'musk-auraglow-smart-led-strip-lights',
    categoryId: 'ledstrips',
    categoryName: 'LED Strip Lights',
    brandId: 'musk',
    brandName: 'MUSK Premium',
    regularPrice: 1800,
    discountPrice: 1200,
    isFlashSale: false,
    rating: 4.7,
    ratingCount: 304,
    specs: {
      'Length': '5 Meters / 16.4 Ft flexible tape',
      'Control module': 'Tuya Smart App + Infrared Remote control',
      'LED Density': '60 LEDs per Meter (RGBIC Dynamic color)',
      'Voice Assistant': 'Compatible with Google Home and Alexa'
    },
    description: 'Paint your home office, gaming den, or bedroom with vibrant, customizable lighting. Supports sound sync modes, 16 million gradients, and schedules directly via wifi.',
    images: [
      'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 40,
    colors: ['Multicolor RGBIC'],
    isBestSeller: true,
    isNewArrival: false,
    sku: 'MSK-LED-A5',
    warranty: '6 Months Brand Replacement Warranty'
  },
  {
    id: 'prod-8',
    name: 'MUSK FrostBreeze Portable Hand Fan',
    slug: 'musk-frostbreeze-portable-hand-fan',
    categoryId: 'portablefans',
    categoryName: 'Portable Hand & Table Fans',
    brandId: 'musk',
    brandName: 'MUSK Premium',
    regularPrice: 1600,
    discountPrice: 990,
    isFlashSale: true,
    flashSalePrice: 850,
    rating: 4.8,
    ratingCount: 77,
    specs: {
      'Motor Speed': 'Up to 9000 RPM high velocity brushless motor',
      'Battery Capacity': '4000mAh Lithium cell',
      'Speed Levels': '5 Adjustable cooling speeds',
      'Runtime': 'Up to 12 Hours on eco speed',
      'Extra Feature': 'LED display, cooling metal ice-plate'
    },
    description: 'Beat the extreme summer heat in style. This compact portable hand fan operates smoothly with a specialized high-speed quiet brushless motor. Includes a cooling metallic touch plate that feels instantly like ice on skin. Crucial tool for commuting.',
    images: [
      'https://images.unsplash.com/photo-1622737133809-d95047b9e673?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 35,
    colors: ['Snow White', 'Ice Blue', 'Mint Green'],
    isBestSeller: true,
    isNewArrival: true,
    sku: 'MSK-FAN-FB',
    warranty: '6 Months Brand Warranty'
  },
  {
    id: 'prod-9',
    name: 'Luxury Suede Anti-Fall MagSafe Mobile Cover',
    slug: 'luxury-suede-anti-fall-magsafe-mobile-cover',
    categoryId: 'covers',
    categoryName: 'Mobile Covers & Cases',
    brandId: 'apple',
    brandName: 'Apple',
    regularPrice: 1950,
    discountPrice: 1250,
    isFlashSale: false,
    rating: 4.4,
    ratingCount: 52,
    specs: {
      'Material': 'Genuine Alcántara Suede',
      'Magnet Power': '15W N52 Strong MagSafe Core',
      'Protection': 'Military Grade 3.0 Drop proof structure',
      'Scratch Rating': 'Suede self-healing surface'
    },
    description: 'Add a touch of absolute luxury to your iPhone. This premium protective sleeve is crafted from genuine Italian suede with reinforced metal buttons, offering solid tactile response and reliable magnetic grip.',
    images: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 50,
    colors: ['Ocean Navy', 'Forest Olive', 'Carbon Gray'],
    isBestSeller: false,
    isNewArrival: true,
    sku: 'APL-CVS-M15',
    warranty: 'No Warranty'
  },
  {
    id: 'prod-10',
    name: 'Xiaomi Xiaoai Premium Bluetooth Speaker 2',
    slug: 'xiaomi-xiaoai-premium-bluetooth-speaker-2',
    categoryId: 'speakers',
    categoryName: 'Bluetooth Speakers',
    brandId: 'xiaomi',
    brandName: 'Xiaomi',
    regularPrice: 3500,
    discountPrice: 2450,
    isFlashSale: false,
    rating: 4.6,
    ratingCount: 119,
    specs: {
      'Sound range': '360 Omni acoustic layout',
      'Power Output': '12W tuned acoustic dynamic range',
      'Microphone': 'Array microphones for voice calls',
      'Control': 'Top touch controller interface'
    },
    description: 'A masterpiece of minimalism. The Xiaomi Bluetooth Speaker 2 brings rich acoustic warmth with compact dimensions. It serves as an elegant desktop accent with easy touch tracking and full smart speaker capacities.',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 18,
    colors: ['Alpine Gray', 'Stealth Charcoal'],
    isBestSeller: false,
    isNewArrival: false,
    sku: 'XIA-SP-X2',
    warranty: '6 Months Brand Warranty'
  },
  {
    id: 'prod-11',
    name: 'Professional Studio 18 Inch Ring Light with Stand',
    slug: 'professional-studio-18-inch-ring-light-with-stand',
    categoryId: 'ringlights',
    categoryName: 'Ring Lights',
    brandId: 'baseus',
    brandName: 'Baseus',
    regularPrice: 4800,
    discountPrice: 3200,
    isFlashSale: false,
    rating: 4.8,
    ratingCount: 95,
    specs: {
      'Dimension': '18 Inch outer ring diameter',
      'Light Source': '480 SMD LEDs ultra high brightness',
      'Stand Height': 'Extended up to 7 Feet sturdy metallic tripod',
      'Color Temp': '3200K - 6500K dynamic bi-color',
      'Cell Mounts': '3 Slots for multi-camera streaming'
    },
    description: 'The preferred choice for digital creators, vloggers, and makeup professionals. Provides perfectly shadowless even glow with customizable tone controls and high-durability metallic tripod components.',
    images: [
      'https://images.unsplash.com/photo-1595935736128-db120a27ac7a?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 14,
    colors: ['Universal Black'],
    isBestSeller: false,
    isNewArrival: false,
    sku: 'BAS-RG-18',
    warranty: '1 Year Warranty'
  },
  {
    id: 'prod-12',
    name: 'MUSK Carbon Luxe Key Holder & Wallet',
    slug: 'musk-carbon-luxe-key-holder-wallet',
    categoryId: 'accessories',
    categoryName: 'Mobile Accessories & Rings',
    brandId: 'musk',
    brandName: 'MUSK Premium',
    regularPrice: 1500,
    discountPrice: 850,
    isFlashSale: true,
    flashSalePrice: 750,
    rating: 4.9,
    ratingCount: 180,
    specs: {
      'Material': 'Military standard aerospace Carbon Fiber',
      'Key limit': 'Safely organizes up to 8 keys',
      'Weight': '20g incredibly featherlight',
      'Extra Utility': 'Built-in Bottle opener and quick clip'
    },
    description: 'Solve pocket clutter once and for all. Organized keys slide in and out like a Swiss pocketknife, shielded in premium scratch-resistant authentic 3K weave carbon fiber. A statement accessory for minimalist everyday carry.',
    images: [
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 100,
    colors: ['Carbon Black', 'Deep Copper Rose', 'Chrono Gray'],
    isBestSeller: true,
    isNewArrival: true,
    sku: 'MSK-KH-CB',
    warranty: 'Lifetime Replacement Warranty on Frame'
  }
];

export const INITIAL_BANNERS: Banner[] = [
  {
    id: 'banner-1',
    title: 'Smart Gadgets For Everyday Life',
    subtitle: 'MUSK Premium Edition',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1200&auto=format&fit=crop',
    link: 'shop',
    buttonText: 'Explore Store',
    badge: 'NEW ARRIVALS 2026'
  },
  {
    id: 'banner-2',
    title: 'Latest Earbuds & Smart Watches',
    subtitle: 'Technology For Smartness',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1200&auto=format&fit=crop',
    link: 'shop?category=watches',
    buttonText: 'Claim 20% Discount',
    badge: 'FLASH INTRO DEAL'
  },
  {
    id: 'banner-3',
    title: 'Exclusive Deals On Accessories',
    subtitle: 'Premium Minimalist Design Essentials',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1200&auto=format&fit=crop',
    link: 'shop?category=accessories',
    buttonText: 'Shop Best Sellers',
    badge: 'LIMITED COVERS & KEYS'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'SMARTMUSK',
    discountValue: 15,
    discountType: 'percentage',
    minOrderValue: 1000,
    description: '15% savings on order subtotals above 1,000 ৳',
    active: true
  },
  {
    code: 'FLASH20',
    discountValue: 200,
    discountType: 'fixed',
    minOrderValue: 2000,
    description: 'Flat 200 ৳ off on premium items above 2,000 ৳',
    active: true
  },
  {
    code: 'FREESHIP',
    discountValue: 100, // covers delivery
    discountType: 'fixed',
    minOrderValue: 1500,
    description: 'Saves 100 ৳ on deliveries above 1,500 ৳',
    active: true
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    userName: 'Tanvir Hossain',
    userEmail: 'tanvir@gmail.com',
    rating: 5,
    comment: 'The hybrid ANC power is absolute magic! Blocks all noise from Dhaka traffic! Built quality easily matches models twice its retail price! Huge thumbs up to MUSK team.',
    date: '2026-05-12',
    isVerified: true
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    userName: 'Nusrat Jahan',
    userEmail: 'nusrat@outlook.com',
    rating: 4,
    comment: 'Sound clarity is stellar, charging case feels like a smooth marble egg. Battery easily lasted 3 days of rigorous meetings and podcast listening. Highly recommended!',
    date: '2026-05-20',
    isVerified: true
  },
  {
    id: 'rev-3',
    productId: 'prod-3',
    userName: 'Arpon Bhuiyan',
    userEmail: 'arponbhuiyan@gmail.com',
    rating: 5,
    comment: 'Retina AMOLED panel is stunningly bright outdoors! Health logs are incredibly spot on with sleep schedules. The orange Alpine loop looks insanely sporty. Apple watch look with a fraction of cost!',
    date: '2026-06-01',
    isVerified: true
  },
  {
    id: 'rev-4',
    productId: 'prod-8',
    userName: 'Kamal Ahmed',
    userEmail: 'kamal@live.com',
    rating: 5,
    comment: 'Saved my life during electricity outages this week. Brushless speed levels are extremely solid, and that ice plate is magic! Highly recommend buying for anyone in Bangladesh.',
    date: '2026-06-03',
    isVerified: true
  }
];

export const INITIAL_BLOGS: Blog[] = [
  {
    id: 'blog-1',
    title: 'Why Hybrid Active Noise Cancellation is the Ultimate Commuters Tool',
    slug: 'hybrid-anc-ultimate-commuters-tool',
    excerpt: 'Loud motors, street arguments, and background buzz ruin your daily focus. Discover how smart audio filters block distraction.',
    content: 'Living in urban hubs like Dhaka presents a massive daily acoustic challenge. Traffic decibels frequently cross safe limits of 85dB. Standard cheap earphones boost sound to compete, which damages cells. Active Noise Cancellation (ANC) generates inverted soundwaves that cancel incoming noise, preserving your ears and introducing supreme focus on minimal decibels. Learn how MUSK incorporates hybrid feedback mechanisms in the premium AirAura collection to provide peaceful quiet hubs everywhere.',
    image: 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?q=80&w=600&auto=format&fit=crop',
    author: 'Chief Sound Architect',
    date: '2026-05-18',
    readTime: '4 min read',
    tags: ['Acoustics', 'ANC', 'Lifestyle']
  },
  {
    id: 'blog-2',
    title: 'Choosing Your Companion: AMOLED vs LCD Smartwatch Panels',
    slug: 'amoled-vs-lcd-smartwatch-panels',
    excerpt: 'Struggle to read texts under sunlight? A breakdown of peak brightness, power draws, and retina colors in smart wearables.',
    content: 'Most fitness bands save cost by packing LCD panels. Under direct afternoon light, these look washed out and trigger heavy visual fatigue. AMOLED screens light up individual pixels natively, creating infinite black ratios and peak outputs of 1000 nits. This means your tracking stats, notification alerts, and navigation routes glow crisp and clear even in hot summer heat, while battery drain stays low. Our ChronoElite dual-frame watch was engineered around this precise technological advantage.',
    image: 'https://images.unsplash.com/photo-1517502884422-41eaaced0168?q=80&w=600&auto=format&fit=crop',
    author: 'Wearables PM',
    date: '2026-06-02',
    readTime: '5 min read',
    tags: ['Smartwatch', 'Display', 'Wearables']
  }
];
