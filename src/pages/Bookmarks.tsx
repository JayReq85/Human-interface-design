
import React from 'react';
import { usePropertyContext } from '@/context/PropertyContext';
import { Card, CardContent } from '@/components/ui/card';
import PropertyCard from '@/components/PropertyCard';
import Navbar from '@/components/Navbar';

const Bookmarks = () => {
  const { bookmarkedProperties } = usePropertyContext();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Your Bookmarked Properties</h1>
        
        {bookmarkedProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarkedProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-gray-500">You haven't bookmarked any properties yet.</p>
              <p className="text-gray-500 mt-2">Browse properties and click the bookmark icon to save them here.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
