
import { createContext, useContext, useState, ReactNode } from "react";

// Define property types
export interface Property {
  id: number;
  name: string;
  location: string;
  description: string;
  price: number;
  size: number;
  image: string;
  bookmarked: boolean;
  landlordName: string;
  landlordRating: number;
  utilities: {
    internet: number;
    electricity: number;
    water: number;
  };
  deposit: number;
}

export interface Review {
  id: number;
  propertyId: number;
  rating: number; // 1-5
  guestType: string; // "Stayed", "Currently", "Called"
  stayPeriod: string; // Duration of stay
  hygiene: number;
  location: number;
  service: number;
  comment: string;
}

// Context state type
interface PropertyContextType {
  properties: Property[];
  bookmarkedProperties: Property[];
  reviews: Review[];
  toggleBookmark: (id: number) => void;
  addReview: (review: Review) => void;
  getProperty: (id: number) => Property | undefined;
  getReviews: (propertyId: number) => Review[];
}

// Create context
const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

// Sample data
const sampleProperties: Property[] = [
  {
    id: 1,
    name: "ABC Condo",
    location: "Chiangmai Rd, Pathumthani",
    description: "Modern condo in a quiet area with great amenities including pool and fitness center.",
    price: 9000,
    size: 30,
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2070&auto=format&fit=crop",
    bookmarked: false,
    landlordName: "Somkiat",
    landlordRating: 4.5,
    utilities: {
      internet: 500,
      electricity: 8,
      water: 30
    },
    deposit: 20000
  },
  {
    id: 2,
    name: "JEF Dormitory",
    location: "University Area, Bangkok",
    description: "Affordable dormitory near the campus with basic amenities and secure access.",
    price: 6000,
    size: 28,
    image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=2070&auto=format&fit=crop",
    bookmarked: false,
    landlordName: "Jaidee",
    landlordRating: 3.8,
    utilities: {
      internet: 300,
      electricity: 7,
      water: 25
    },
    deposit: 12000
  },
  {
    id: 3,
    name: "Riverside Apartment",
    location: "Riverside District, Bangkok",
    description: "Luxury apartment with river view and high-end facilities.",
    price: 15000,
    size: 45,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop",
    bookmarked: false,
    landlordName: "River Properties Co.",
    landlordRating: 4.7,
    utilities: {
      internet: 600,
      electricity: 9,
      water: 35
    },
    deposit: 30000
  }
];

const sampleReviews: Review[] = [
  {
    id: 1,
    propertyId: 1,
    rating: 4,
    guestType: "Stayed",
    stayPeriod: "> 1 year",
    hygiene: 4,
    location: 5,
    service: 4,
    comment: "Great place to stay. The landlord was very responsive and helpful."
  },
  {
    id: 2,
    propertyId: 1,
    rating: 5,
    guestType: "Currently",
    stayPeriod: "> 2 year",
    hygiene: 5,
    location: 5,
    service: 5,
    comment: "I've been living here for two years and I love it. The facilities are well-maintained."
  },
  {
    id: 3,
    propertyId: 2,
    rating: 3,
    guestType: "Stayed",
    stayPeriod: "< 1 year",
    hygiene: 3,
    location: 4,
    service: 3,
    comment: "Decent for the price but the walls are a bit thin. Great location though."
  }
];

export const PropertyProvider = ({ children }: { children: ReactNode }) => {
  const [properties, setProperties] = useState<Property[]>(sampleProperties);
  const [reviews, setReviews] = useState<Review[]>(sampleReviews);

  // Get bookmarked properties
  const bookmarkedProperties = properties.filter(property => property.bookmarked);

  // Toggle bookmark status
  const toggleBookmark = (id: number) => {
    setProperties(properties.map(property => 
      property.id === id 
        ? { ...property, bookmarked: !property.bookmarked } 
        : property
    ));
  };

  // Add a new review
  const addReview = (review: Review) => {
    setReviews([...reviews, { ...review, id: reviews.length + 1 }]);
  };

  // Get property by ID
  const getProperty = (id: number) => {
    return properties.find(property => property.id === id);
  };

  // Get reviews for a property
  const getReviews = (propertyId: number) => {
    return reviews.filter(review => review.propertyId === propertyId);
  };

  return (
    <PropertyContext.Provider value={{
      properties,
      bookmarkedProperties,
      reviews,
      toggleBookmark,
      addReview,
      getProperty,
      getReviews
    }}>
      {children}
    </PropertyContext.Provider>
  );
};

// Custom hook to use the context
export const usePropertyContext = () => {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error("usePropertyContext must be used within a PropertyProvider");
  }
  return context;
};
