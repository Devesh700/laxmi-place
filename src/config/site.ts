import type { SiteConfig } from "@/types/site";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const siteConfig: SiteConfig = {
  name: "Laxmi Chandra Palace",
  shortName: "LCP",
  tagline: "Stay Royal... Feel at Home...",
  logo: "/assets/logo.png",
  description:
    "Experience royal heritage hospitality in Ayodhya at Laxmi Chandra Palace. Comfortable air-conditioned rooms, delicious in-house dining, and warm service.",
  url: siteUrl,
  currency: "INR",
  // TODO(owner): Update indicative tariff range
  priceRange: "₹₹",

  address: {
    // TODO(owner): Replace with exact street address, city, state, PIN code
    streetAddress: "TODO(owner): Street Address / Landmark",
    locality: "Ayodhya",
    region: "Uttar Pradesh",
    postalCode: "224123",
    countryCode: "IN",
    countryName: "India",
  },

  geo: {
    // TODO(owner): Replace with exact Google Maps latitude & longitude (Ayodhya)
    latitude: 26.7922,
    longitude: 82.1998,
  },

  // TODO(owner): Replace with Google Maps share link
  mapsUrl: "https://maps.google.com/?q=26.7922,82.1998",

  // TODO(owner): Replace with real +91 phone numbers and WhatsApp number (digits only for wa.me)
  phonePrimary: "+910000000000",
  phoneSecondary: "+910000000001",
  whatsappNumber: "910000000000",
  email: "info@example.com", // TODO(owner): Replace with official email

  social: {
    // TODO(owner): Add real social URLs or leave undefined
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
  },

  // TODO(owner): Confirm check-in, check-out, and front desk timings
  checkInTime: "12:00 PM",
  checkOutTime: "11:00 AM",
  checkInSchemaTime: "12:00",
  checkOutSchemaTime: "11:00",
  frontDeskHours: "24/7 Front Desk",

  amenities: [
    {
      id: "wifi",
      label: "Free High-Speed Wi-Fi",
      description: "Complimentary wireless internet across all rooms and dining areas.",
      iconName: "Wifi",
    },
    {
      id: "parking",
      label: "On-Site Parking",
      description: "Convenient parking space for guests arriving by car.",
      iconName: "Car",
    },
    {
      id: "restaurant",
      label: "In-House Restaurant",
      description: "Freshly prepared meals served daily for breakfast, lunch, and dinner.",
      iconName: "UtensilsCrossed",
    },
    {
      id: "ac",
      label: "Air-Conditioned Rooms",
      description: "Climate-controlled rooms with clean linen and attached baths.",
      iconName: "Snowflake",
    },
    {
      id: "frontdesk",
      label: "24x7 Front Desk",
      description: "Round-the-clock assistance for check-in, travel tips, and room service.",
      iconName: "Clock",
    },
    {
      id: "power",
      label: "Power Backup",
      description: "Uninterrupted power supply for a comfortable stay.",
      iconName: "Zap",
    },
  ],

  trustHighlights: [
    "Book direct for best rates",
    "Pay at hotel option available", // TODO(owner): Confirm payment policy
    "24x7 Front Desk",
    "Free Wi-Fi & Parking",
  ],

  policies: {
    // TODO(owner): Replace with actual hotel policies
    cancellation:
      "TODO(owner): Specify free cancellation window (e.g., free cancellation up to 24 hours before check-in).",
    idProof: "Valid government-issued photo ID is required for all guests at check-in.",
    pets: "TODO(owner): Specify whether pets are allowed.",
    children: "TODO(owner): Specify extra bed / child stay policy.",
  },

  googleRating: {
    // TODO(owner): Replace with verified Google rating and link, set isPlaceholder: false
    score: 4.5,
    reviewCount: 0,
    listingUrl: "https://maps.google.com/?q=26.9124,75.7873",
    isPlaceholder: true,
  },

  restaurant: {
    // TODO(owner): Replace with in-house restaurant name, cuisines, hours, and menu items
    name: "Laxmi Chandra Dining",
    tagline: "Freshly Prepared Regional & Indian Cuisine",
    description:
      "TODO(owner): Describe the ambiance, seating capacity, and signature dishes of your in-house restaurant.",
    cuisines: ["Indian", "North Indian", "Vegetarian"],
    openingHoursDisplay: "7:30 AM – 10:30 PM Daily",
    openingHoursSpec: [
      {
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "07:30",
        closes: "22:30",
      },
    ],
    menuUrl: `${siteUrl}/restaurant#menu`,
    heroImage: "/assets/hotel-05.jpeg",
    menuHighlights: [
      {
        name: "TODO(owner): Signature Thali",
        category: "Main Course",
        description: "TODO(owner): Describe dish ingredients and accompaniments.",
        priceInr: 250,
        isVeg: true,
      },
      {
        name: "TODO(owner): Paneer Special",
        category: "Main Course",
        description: "TODO(owner): Describe dish preparation.",
        priceInr: 220,
        isVeg: true,
      },
      {
        name: "TODO(owner): Morning Breakfast Platter",
        category: "Breakfast",
        description: "TODO(owner): Describe breakfast items and beverage.",
        priceInr: 150,
        isVeg: true,
      },
    ],
  },

  // TODO(owner): Set showTestimonials to true only after replacing placeholders with real reviews
  showTestimonials: false,
  testimonials: [
    {
      author: "TODO(owner): Guest Name 1",
      source: "Direct Guest",
      rating: 5,
      quote: "TODO(owner): Replace with a real guest review.",
    },
    {
      author: "TODO(owner): Guest Name 2",
      source: "Direct Guest",
      rating: 5,
      quote: "TODO(owner): Replace with a real guest review.",
    },
    {
      author: "TODO(owner): Guest Name 3",
      source: "Direct Guest",
      rating: 5,
      quote: "TODO(owner): Replace with a real guest review.",
    },
  ],

  faqs: [
    {
      question: "What are the check-in and check-out times?",
      answer:
        "Standard check-in is at 12:00 PM and check-out is at 11:00 AM. Early check-in or late check-out is subject to availability.", // TODO(owner): Confirm times
    },
    {
      question: "How can I book a room or reserve a table?",
      answer:
        "You can book directly by calling us or sending a WhatsApp message using the buttons on our website for instant confirmation and direct rates.",
    },
    {
      question: "Is parking available at the hotel?",
      answer:
        "Yes, complimentary on-site parking is available for guests.", // TODO(owner): Confirm parking capacity
    },
    {
      question: "Does the hotel have an in-house restaurant?",
      answer:
        "Yes, our in-house restaurant serves freshly prepared meals daily. Room service is also available during dining hours.",
    },
  ],

  nearbyAttractions: [
    { name: "Shri Ram Janmabhoomi Mandir", distance: "Short drive" },
    { name: "Hanuman Garhi", distance: "Nearby" },
    { name: "Ram Ki Paidi & Saryu Ghat", distance: "Nearby" },
    { name: "Ayodhya Dham Railway Station", distance: "Convenient access" },
    { name: "Maharishi Valmiki Airport Ayodhya", distance: "Direct route" },
  ],

  heroImage: "/assets/hotel-01.jpeg",

  gallery: [
    {
      src: "/assets/hotel-01.jpeg",
      alt: "Laxmi Chandra Palace exterior facade",
      caption: "Property exterior & welcome entrance",
      category: "exterior",
    },
    {
      src: "/assets/hotel-02.jpeg",
      alt: "Laxmi Chandra Palace deluxe guest room",
      caption: "Deluxe guest room with warm lighting",
      category: "rooms",
    },
    {
      src: "/assets/hotel-03.jpeg",
      alt: "Laxmi Chandra Palace room interior",
      caption: "Clean linen & comfortable bedding",
      category: "rooms",
    },
    {
      src: "/assets/hotel-04.jpeg",
      alt: "Laxmi Chandra Palace family suite",
      caption: "Spacious suite accommodation",
      category: "rooms",
    },
    {
      src: "/assets/hotel-05.jpeg",
      alt: "Laxmi Chandra Dining hall",
      caption: "In-house restaurant dining space",
      category: "restaurant",
    },
    {
      src: "/assets/hotel-06.jpeg",
      alt: "Laxmi Chandra Palace reception lobby",
      caption: "Welcoming reception & lounge",
      category: "common",
    },
    {
      src: "/assets/hotel-07.jpeg",
      alt: "Laxmi Chandra Palace corridor and rooms",
      caption: "Quiet guest floor & interiors",
      category: "common",
    },
    {
      src: "/assets/hotel-08.jpeg",
      alt: "Laxmi Chandra Dining seating area",
      caption: "Family dining ambiance",
      category: "restaurant",
    },
    {
      src: "/assets/hotel-09.jpeg",
      alt: "Freshly prepared dining service",
      caption: "In-house kitchen & hospitality",
      category: "restaurant",
    },
    {
      src: "/assets/hotel-10.jpeg",
      alt: "Laxmi Chandra Palace guest room view",
      caption: "Air-conditioned room comfort",
      category: "rooms",
    },
    {
      src: "/assets/hotel-11.jpeg",
      alt: "Laxmi Chandra Palace room amenities",
      caption: "Thoughtful in-room furnishings",
      category: "rooms",
    },
    {
      src: "/assets/hotel-12.jpeg",
      alt: "Laxmi Chandra Palace courtyard & exterior",
      caption: "Evening property atmosphere",
      category: "exterior",
    },
    {
      src: "/assets/hotel-13.jpeg",
      alt: "Laxmi Chandra Palace suite seating",
      caption: "Relaxing lounge corner",
      category: "rooms",
    },
    {
      src: "/assets/hotel-14.jpeg",
      alt: "Laxmi Chandra Palace dining table setting",
      caption: "Prepared for your meal",
      category: "restaurant",
    },
    {
      src: "/assets/hotel-15.jpeg",
      alt: "Laxmi Chandra Palace bedroom detail",
      caption: "Restful night's sleep",
      category: "rooms",
    },
    {
      src: "/assets/hotel-16.jpeg",
      alt: "Laxmi Chandra Palace common lounge",
      caption: "Warm common area",
      category: "common",
    },
    {
      src: "/assets/hotel-17.jpeg",
      alt: "Laxmi Chandra Palace room view",
      caption: "Spacious double room",
      category: "rooms",
    },
    {
      src: "/assets/hotel-18.jpeg",
      alt: "Laxmi Chandra Palace property architecture",
      caption: "Heritage-inspired architecture",
      category: "exterior",
    },
    {
      src: "/assets/hotel-19.jpeg",
      alt: "Laxmi Chandra Palace hospitality spaces",
      caption: "Ready to welcome guests",
      category: "common",
    },
  ],
};
