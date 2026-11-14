export interface SiteAddress {
  streetAddress: string;
  locality: string;
  region: string;
  postalCode: string;
  countryCode: string;
  countryName: string;
}

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface OpeningHoursSpec {
  dayOfWeek: string[];
  opens: string;
  closes: string;
}

export interface AmenityConfig {
  id: string;
  label: string;
  description: string;
  iconName: string;
}

export interface MenuHighlight {
  name: string;
  category: string;
  description: string;
  priceInr: number;
  isVeg: boolean;
}

export interface RestaurantConfig {
  name: string;
  tagline: string;
  description: string;
  cuisines: string[];
  openingHoursDisplay: string;
  openingHoursSpec: OpeningHoursSpec[];
  menuUrl: string;
  heroImage: string;
  menuHighlights: MenuHighlight[];
}

export interface TestimonialConfig {
  author: string;
  source: string;
  rating: number;
  quote: string;
}

export interface FaqConfig {
  question: string;
  answer: string;
}

export interface GalleryImageConfig {
  src: string;
  alt: string;
  caption: string;
  category: "exterior" | "rooms" | "restaurant" | "common";
}

export interface NearbyAttraction {
  name: string;
  distance: string;
}

export interface SiteConfig {
  name: string;
  shortName: string;
  tagline: string;
  logo: string;
  description: string;
  url: string;
  currency: "INR";
  priceRange: string;
  address: SiteAddress;
  geo: GeoCoordinates;
  mapsUrl: string;
  phonePrimary: string;
  phoneSecondary?: string;
  whatsappNumber: string;
  email: string;
  social: {
    instagram?: string;
    facebook?: string;
  };
  checkInTime: string;
  checkOutTime: string;
  checkInSchemaTime: string;
  checkOutSchemaTime: string;
  frontDeskHours: string;
  amenities: AmenityConfig[];
  trustHighlights: string[];
  policies: {
    cancellation: string;
    idProof: string;
    pets: string;
    children: string;
  };
  googleRating: {
    score: number;
    reviewCount: number;
    listingUrl: string;
    isPlaceholder: boolean;
  };
  restaurant: RestaurantConfig;
  showTestimonials: boolean;
  testimonials: TestimonialConfig[];
  faqs: FaqConfig[];
  nearbyAttractions: NearbyAttraction[];
  heroImage: string;
  gallery: GalleryImageConfig[];
}
