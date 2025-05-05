import { createContext, useContext, useState, ReactNode } from 'react';
import { properties, Property } from '../data/propertyData';

interface PropertyContextProps {
  properties: Property[];
  featuredProperties: Property[];
  bookmarkedProperties: Property[];
  toggleBookmark: (propertyId: string) => void;
}

const PropertyContext = createContext<PropertyContextProps | undefined>(undefined);

interface PropertyProviderProps {
  children: ReactNode;
}

export const PropertyProvider: React.FC<PropertyProviderProps> = ({ children }) => {
  const [allProperties] = useState<Property[]>(properties);

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

  const featuredProperties = allProperties.filter(property => property.featured);

  return (
    <PropertyContext.Provider value={{ 
      properties: allProperties,
      featuredProperties,
      bookmarkedProperties,
      toggleBookmark
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
