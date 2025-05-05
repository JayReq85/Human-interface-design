export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  priceUnit: 'per month' | 'per week' | 'per night';
  type: 'apartment' | 'house' | 'studio' | 'dorm';
  bedrooms: number;
  bathrooms: number;
  size: number;
  distance: number;
  distanceUnit: 'km' | 'miles';
  images: string[];
  description: string;
  facilities: string[];
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  featured?: boolean;
  landlordId?: string;
  landlordName?: string;
  landlordRating?: number;
  bookmarked?: boolean;
  deposit?: number;
  utilities?: {
    internet: number;
    electricity: number;
    water: number;
  };
}

export const properties: Property[] = [
  // First property
  {
    id: '1',
    title: 'Modern Studio Apartment',
    location: 'Near University Campus, City Center',
    price: 8500,
    priceUnit: 'per month',
    type: 'studio',
    bedrooms: 1,
    bathrooms: 1,
    size: 35,
    distance: 0.5,
    distanceUnit: 'km',
    images: ['/placeholder.svg'],
    description: 'A cozy studio apartment perfect for students. Fully furnished with high-speed internet included.',
    facilities: ['Wi-Fi', 'Furnished', 'Washing Machine', 'Kitchen'],
    rating: 4.5,
    reviewCount: 12,
    isAvailable: true,
    featured: true,
    landlordName: 'John Smith',
    landlordRating: 4.8,
    deposit: 1100,
    utilities: {
      internet: 500,
      electricity: 7,
      water: 18
    }
  },
  // Second property
  {
    id: '2',
    title: 'Shared Dormitory Room',
    location: 'TU Student Village, East Campus',
    price: 6500,
    priceUnit: 'per month',
    type: 'dorm',
    bedrooms: 1,
    bathrooms: 1,
    size: 20,
    distance: 0.2,
    distanceUnit: 'km',
    images: ['/placeholder.svg'],
    description: 'Shared room in the student village with access to common areas and meal plans.',
    facilities: ['Meal Plan', 'Laundry', 'Study Room', 'Wi-Fi'],
    rating: 4.0,
    reviewCount: 28,
    isAvailable: true
  },
  // Third property
  {
    id: '3',
    title: 'Luxury 2-Bedroom Apartment',
    location: 'Downtown, City Center',
    price: 14500,
    priceUnit: 'per month',
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 1,
    size: 65,
    distance: 1.8,
    distanceUnit: 'km',
    images: ['/placeholder.svg'],
    description: 'Modern apartment with high-end finishes, perfect for sharing with a roommate.',
    facilities: ['Balcony', 'Dishwasher', 'Gym Access', 'Parking'],
    rating: 4.8,
    reviewCount: 9,
    isAvailable: true,
    featured: true
  },
  // Additional 10 properties
  {
    id: '4',
    title: 'Cozy 1-Bedroom Near Library',
    location: 'North Campus Area',
    price: 8900,
    priceUnit: 'per month',
    type: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    size: 40,
    distance: 0.7,
    distanceUnit: 'km',
    images: ['/placeholder.svg'],
    description: 'Perfect student apartment located near the university library. Quiet neighborhood ideal for studying.',
    facilities: ['Wi-Fi', 'Study Desk', 'Washing Machine', 'Heating'],
    rating: 4.3,
    reviewCount: 17,
    isAvailable: true
  },
  {
    id: '5',
    title: 'Spacious 3-Bedroom House',
    location: 'Residential Area, 10 min from Campus',
    price: 15000,
    priceUnit: 'per month',
    type: 'house',
    bedrooms: 3,
    bathrooms: 2,
    size: 110,
    distance: 2.5,
    distanceUnit: 'km',
    images: ['/placeholder.svg'],
    description: 'Large house perfect for a group of students. Features a backyard and plenty of space.',
    facilities: ['Garden', 'Parking', 'Dishwasher', 'Laundry Room'],
    rating: 4.7,
    reviewCount: 8,
    isAvailable: true
  },
  {
    id: '6',
    title: 'Economy Single Dorm',
    location: 'TU Main Campus',
    price: 6900,
    priceUnit: 'per month',
    type: 'dorm',
    bedrooms: 1,
    bathrooms: 1,
    size: 15,
    distance: 0.1,
    distanceUnit: 'km',
    images: ['/placeholder.svg'],
    description: 'Budget-friendly single dorm room with shared kitchen and bathroom facilities.',
    facilities: ['Shared Kitchen', 'Laundry', 'Internet', 'Heating'],
    rating: 3.8,
    reviewCount: 32,
    isAvailable: true
  },
  {
    id: '7',
    title: 'Modern Studio with View',
    location: 'City Center, 15 min to Campus',
    price: 9500,
    priceUnit: 'per month',
    type: 'studio',
    bedrooms: 1,
    bathrooms: 1,
    size: 38,
    distance: 3.0,
    distanceUnit: 'km',
    images: ['/placeholder.svg'],
    description: 'Contemporary studio apartment with city views and excellent transport connections.',
    facilities: ['City View', 'Security System', 'Modern Kitchen', 'Wi-Fi'],
    rating: 4.6,
    reviewCount: 14,
    isAvailable: true,
    featured: true
  },
  {
    id: '8',
    title: 'Shared 2-Bedroom Flat',
    location: 'Student District',
    price: 7200,
    priceUnit: 'per month',
    type: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    size: 60,
    distance: 1.2,
    distanceUnit: 'km',
    images: ['/placeholder.svg'],
    description: 'Share a room in this well-maintained apartment. Price is per person.',
    facilities: ['Shared Living Room', 'Washing Machine', 'Balcony', 'Wi-Fi'],
    rating: 4.2,
    reviewCount: 23,
    isAvailable: true
  },
  {
    id: '9',
    title: 'Premium Private Room',
    location: 'Luxury Student Residence',
    price: 9800,
    priceUnit: 'per month',
    type: 'dorm',
    bedrooms: 1,
    bathrooms: 1,
    size: 25,
    distance: 0.8,
    distanceUnit: 'km',
    images: ['/placeholder.svg'],
    description: 'Upscale private room in student residence with access to premium amenities.',
    facilities: ['Gym', 'Swimming Pool', 'Study Rooms', '24/7 Security'],
    rating: 4.9,
    reviewCount: 19,
    isAvailable: true,
    featured: true
  },
  {
    id: '10',
    title: 'Rustic Cottage Studio',
    location: 'Quiet Area, 5 min from Campus',
    price: 8800,
    priceUnit: 'per month',
    type: 'studio',
    bedrooms: 1,
    bathrooms: 1,
    size: 30,
    distance: 1.0,
    distanceUnit: 'km',
    images: ['/placeholder.svg'],
    description: 'Charming rustic studio with wooden finishes and a cozy atmosphere.',
    facilities: ['Private Garden', 'Wooden Interior', 'Fully Equipped', 'Quiet Area'],
    rating: 4.4,
    reviewCount: 11,
    isAvailable: true
  },
  {
    id: '11',
    title: 'Budget Student Apartment',
    location: 'South Campus',
    price: 7500,
    priceUnit: 'per month',
    type: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    size: 35,
    distance: 0.9,
    distanceUnit: 'km',
    images: ['/placeholder.svg'],
    description: 'Affordable apartment close to campus with basic amenities for students.',
    facilities: ['Basic Furniture', 'Heating', 'Shared Laundry', 'Bike Storage'],
    rating: 3.9,
    reviewCount: 27,
    isAvailable: true
  },
  {
    id: '12',
    title: 'Upscale 2-Bedroom Flat',
    location: 'Premium Residence Area',
    price: 13800,
    priceUnit: 'per month',
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    size: 75,
    distance: 2.2,
    distanceUnit: 'km',
    images: ['/placeholder.svg'],
    description: 'Premium apartment with high-end finishes and spacious rooms in quiet area.',
    facilities: ['Smart Home System', 'Underground Parking', 'Concierge Service', 'Modern Design'],
    rating: 4.8,
    reviewCount: 7,
    isAvailable: true,
    featured: true
  },
  {
    id: '13',
    title: 'Townhouse for Students',
    location: '15 min bus to Campus',
    price: 14000,
    priceUnit: 'per month',
    type: 'house',
    bedrooms: 4,
    bathrooms: 2,
    size: 120,
    distance: 3.5,
    distanceUnit: 'km',
    images: ['/placeholder.svg'],
    description: 'Spacious townhouse perfect for a group of 4 students with shared living spaces.',
    facilities: ['Backyard', '2 Floors', 'Furnished', 'Storage Room'],
    rating: 4.5,
    reviewCount: 13,
    isAvailable: true
  }
];
