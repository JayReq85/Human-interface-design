
import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Star } from 'lucide-react';
import { usePropertyContext, Property } from '../context/PropertyContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const { toggleBookmark } = usePropertyContext();

  return (
    <Card className="card-hover overflow-hidden">
      <div className="relative">
        <img 
          src={property.image || property.images[0]} 
          alt={property.name} 
          className="property-image"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 rounded-full"
          onClick={(e) => {
            e.preventDefault();
            toggleBookmark(property.id);
          }}
        >
          <Bookmark 
            fill={property.bookmarked ? "currentColor" : "none"} 
            className={`${property.bookmarked ? "text-primary" : "text-gray-500"}`}
          />
        </Button>
      </div>
      
      <CardHeader className="py-3">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{property.name}</h3>
          <span className="text-primary font-bold">{property.price.toLocaleString()} ฿/month</span>
        </div>
        <p className="text-sm text-gray-500">{property.location}</p>
      </CardHeader>
      
      <CardContent className="py-2">
        <div className="flex justify-between text-sm">
          <span>Size: {property.size} m²</span>
          <div className="flex items-center">
            <Star className="text-yellow-400 mr-1" size={14} fill="currentColor" />
            <span>{(property.landlordRating || property.rating).toFixed(1)}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="py-3">
        <Link to={`/property/${property.id}`} className="w-full">
          <Button variant="outline" className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
