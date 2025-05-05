
import { createContext, useContext, useState, ReactNode } from 'react';
import { properties as initialProperties } from '../data/propertyData';

export interface Property {
  id: string;
  title: string;
  name: string;  // Adding name field explicitly
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
  landlordRating?: number; // For PropertyCard
  bookmarked?: boolean;
  image?: string; // For backwards compatibility
}

export interface Review {
  id: string;
  propertyId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface PropertyContextProps {
  properties: Property[];
  featuredProperties: Property[];
  bookmarkedProperties: Property[];
  reviews: Review[];
  toggleBookmark: (propertyId: string) => void;
  getProperty: (id: string) => Property | undefined;
  getReviews: (propertyId: string) => Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
}

// Sample reviews data
const initialReviews: Review[] = [
  {
    id: '1',
    propertyId: '1',
    userId: 'user1',
    userName: 'John Doe',
    rating: 4.5,
    comment: 'Great place, very clean and comfortable.',
    date: '2023-04-15'
  },
  {
    id: '2',
    propertyId: '1',
    userId: 'user2',
    userName: 'Jane Smith',
    rating: 4.0,
    comment: 'Nice location, but a bit noisy at night.',
    date: '2023-03-22'
  },
  {
    id: '3',
    propertyId: '2',
    userId: 'user3',
    userName: 'Mike Johnson',
    rating: 5.0,
    comment: 'Excellent experience! Would definitely recommend.',
    date: '2023-05-01'
  }
];

const PropertyContext = createContext<PropertyContextProps | undefined>(undefined);

interface PropertyProviderProps {
  children: ReactNode;
}

export const PropertyProvider: React.FC<PropertyProviderProps> = ({ children }) => {
  // Map properties to ensure each property has a name field (using title as name)
  const mappedProperties = initialProperties.map(property => ({
    ...property,
    name: property.title, // Set name equal to title
    image: property.images[0] || '/placeholder.svg', // Ensure each property has an image field
  }));

  const [allProperties] = useState<Property[]>(mappedProperties);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  const [bookmarkedProperties, setBookmarkedProperties] = useState<Property[]>(() => {
    try {
      const storedBookmarks = localStorage.getItem('bookmarks');
      return storedBookmarks
        ? JSON.parse(storedBookmarks)
        : allProperties.filter(property => property.bookmarked);
    } catch (error) {
      console.error("Error parsing bookmarks from localStorage:", error);
      return allProperties.filter(property => property.bookmarked);
    }
  });

  const toggleBookmark = (propertyId: string) => {
    const updatedProperties = allProperties.map(property =>
      property.id === propertyId ? { ...property, bookmarked: !property.bookmarked } : property
    );

    const updatedBookmarks = updatedProperties.filter(property => property.bookmarked);
    setBookmarkedProperties(updatedBookmarks);

    localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
  };

  const getProperty = (id: string): Property | undefined => {
    return allProperties.find(property => property.id === id);
  };

  const getReviews = (propertyId: string): Review[] => {
    return reviews.filter(review => review.propertyId === propertyId);
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...reviewData,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    };
    
    setReviews(prevReviews => [...prevReviews, newReview]);
  };

  const featuredProperties = allProperties.filter(property => property.featured);

  return (
    <PropertyContext.Provider value={{ 
      properties: allProperties,
      featuredProperties,
      bookmarkedProperties,
      reviews,
      toggleBookmark,
      getProperty,
      getReviews,
      addReview
    }}>
      {children}
    </PropertyContext.Provider>
  );
};

export const usePropertyContext = (): PropertyContextProps => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error("usePropertyContext must be used within a PropertyProvider");
  }
  return context;
};
