
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { CheckIcon, Search, MapPin, ArrowRight, Star, X } from 'lucide-react';
import { usePropertyContext } from '@/context/PropertyContext';
import PropertyCard from '@/components/PropertyCard';

const Welcome = () => {
  const { properties } = usePropertyContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [priceRange, setPriceRange] = useState('');
  
  // Filter properties based on search query and filters
  const filteredProperties = properties.filter(property => {
    // Ensure property and its properties exist before accessing them
    if (!property || !property.name || !property.location) {
      console.error('Property missing required fields:', property);
      return false;
    }

    // Search filter
    const searchMatch = property.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       property.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Location filter
    const locationMatch = locationFilter ? property.location.includes(locationFilter) : true;
    
    // Price filter
    let priceMatch = true;
    if (priceRange === 'low') {
      priceMatch = property.price < 7000;
    } else if (priceRange === 'medium') {
      priceMatch = property.price >= 7000 && property.price <= 12000;
    } else if (priceRange === 'high') {
      priceMatch = property.price > 12000;
    }
    
    return searchMatch && locationMatch && priceMatch;
  });

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setLocationFilter('');
    setPriceRange('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-blue-700 text-white py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Find Your Perfect Accommodation</h1>
          <p className="text-xl mb-8">Discover the best places to live near your university</p>
          
          {/* Search input */}
          <div className="max-w-xl mx-auto relative">
            <Input
              placeholder="Search for properties..."
              className="pl-10 h-12 text-black"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </div>
          
          <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
            <Button 
              variant="secondary"
              className="flex gap-2 items-center"
            >
              <MapPin size={18} />
              Explore Properties
              <ArrowRight size={16} />
            </Button>
            
            <Button 
              variant="outline" 
              className="bg-white/20 border-white hover:bg-white/30"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
      
      {/* Filters Section */}
      <div className="bg-secondary py-6 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <div className="w-full md:w-auto">
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bangkok">Bangkok</SelectItem>
                  <SelectItem value="Pathumthani">Pathumthani</SelectItem>
                  <SelectItem value="Riverside">Riverside</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-auto">
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Below 7,000 ฿</SelectItem>
                  <SelectItem value="medium">7,000 - 12,000 ฿</SelectItem>
                  <SelectItem value="high">Above 12,000 ฿</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full md:w-auto"
            >
              Apply Filters
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full md:w-auto"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>
      
      {/* Properties Section */}
      <div className="container mx-auto max-w-6xl py-12 px-4">
        <h2 className="text-2xl font-bold mb-6">Available Properties</h2>
        
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-gray-500">No properties found matching your criteria.</p>
              <Button variant="link" onClick={clearFilters}>
                Clear filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Feature Section */}
      <div className="bg-secondary py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold mb-8 text-center text-[#E2A54D]">Why Choose Our Platform</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <CheckIcon className="text-primary" size={24} />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Verified Properties</h3>
                  <p className="text-gray-500 text-sm">All properties are verified to ensure quality and accuracy.</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Star className="text-primary" size={24} />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Trusted Reviews</h3>
                  <p className="text-gray-500 text-sm">Read genuine reviews from previous and current tenants.</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <MapPin className="text-primary" size={24} />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Prime Locations</h3>
                  <p className="text-gray-500 text-sm">Find accommodation in the best locations near your university.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
