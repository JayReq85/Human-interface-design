
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePropertyContext } from '../context/PropertyContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Bookmark,
  ArrowLeft,
  ArrowRight,
  Star,
  MapPin,
  Home,
  Wifi,
  Droplet,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import Navbar from '../components/Navbar';
import StarRating from '../components/StarRating';
import { useToast } from "@/hooks/use-toast";

const PropertyDetail = () => {
  const { id } = useParams();
  const propertyId = parseInt(id || "0");
  const { getProperty, toggleBookmark, getReviews } = usePropertyContext();
  const property = getProperty(propertyId);
  const reviews = getReviews(propertyId);
  const { toast } = useToast();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Mock multiple images for the property
  const images = [
    property?.image || "",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop"
  ];
  
  const handleBookmark = () => {
    if (property) {
      toggleBookmark(property.id);
      toast({
        title: property.bookmarked ? "Removed from bookmarks" : "Added to bookmarks",
        description: property.bookmarked ? "Property removed from your saved list" : "Property saved to your bookmarks",
      });
    }
  };
  
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  
  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };
  
  if (!property) {
    return <div className="text-center py-10">Property not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto max-w-4xl px-4 py-6">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-4">
          <Link to="/" className="flex items-center text-primary hover:text-primary/80">
            <ArrowLeft size={16} className="mr-1" />
            Back to Properties
          </Link>
          
          <Button
            variant="outline"
            size="sm"
            className={`flex items-center ${property.bookmarked ? "text-primary" : ""}`}
            onClick={handleBookmark}
          >
            <Bookmark 
              size={16} 
              className="mr-1" 
              fill={property.bookmarked ? "currentColor" : "none"} 
            />
            {property.bookmarked ? "Bookmarked" : "Bookmark"}
          </Button>
        </div>
        
        {/* Property Images */}
        <div className="relative mb-6 rounded-lg overflow-hidden shadow-lg">
          <img 
            src={images[currentImageIndex]} 
            alt={property.name} 
            className="w-full h-80 object-cover"
          />
          
          <div className="absolute inset-0 flex items-center justify-between px-4">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full bg-white/80 hover:bg-white"
              onClick={handlePrevImage}
            >
              <ArrowLeft size={18} />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full bg-white/80 hover:bg-white"
              onClick={handleNextImage}
            >
              <ArrowRight size={18} />
            </Button>
          </div>
          
          <div className="absolute bottom-4 right-4">
            <span className="bg-black/70 text-white px-2 py-1 rounded text-sm">
              {currentImageIndex + 1} / {images.length}
            </span>
          </div>
        </div>
        
        {/* Property Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold">{property.name}</h1>
              <div className="flex items-center text-gray-600 mt-1">
                <MapPin size={16} className="mr-1" />
                <span>{property.location}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{property.price.toLocaleString()} ฿<span className="text-sm font-normal">/month</span></div>
              <div className="text-sm text-gray-500 mt-1">Deposit: {property.deposit.toLocaleString()} ฿</div>
            </div>
          </div>
          
          <hr className="my-4" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-3">Property Details</h2>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Home size={18} className="mr-2 text-gray-500" />
                  <span>Size: {property.size} m²</span>
                </li>
                <li className="flex items-center">
                  <Wifi size={18} className="mr-2 text-gray-500" />
                  <span>Internet: {property.utilities.internet} ฿/month</span>
                </li>
                <li className="flex items-center">
                  <Zap size={18} className="mr-2 text-gray-500" />
                  <span>Electricity: {property.utilities.electricity} ฿/unit</span>
                </li>
                <li className="flex items-center">
                  <Droplet size={18} className="mr-2 text-gray-500" />
                  <span>Water: {property.utilities.water} ฿/unit</span>
                </li>
              </ul>
              
              <p className="mt-4 text-gray-700">{property.description}</p>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-3">Landlord Information</h2>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  {property.landlordName.charAt(0)}
                </div>
                <div>
                  <div className="font-medium">{property.landlordName}</div>
                  <div className="flex items-center">
                    <StarRating rating={property.landlordRating} readOnly={true} />
                    <span className="ml-1 text-sm text-gray-500">({property.landlordRating.toFixed(1)})</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Link to={`/review/${property.id}`} className="w-full">
                  <Button className="w-full mb-3">Review Property</Button>
                </Link>
                <Link to={`/payment/${property.id}`} className="w-full">
                  <Button variant="outline" className="w-full">Proceed to Payment</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Reviews ({reviews.length})</h2>
            <Link to={`/review/${property.id}`} className="text-primary flex items-center">
              Write a Review <ArrowUpRight size={14} className="ml-1" />
            </Link>
          </div>
          
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map(review => (
                <Card key={review.id} className="overflow-hidden">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <StarRating rating={review.rating} readOnly={true} />
                        <div className="text-sm text-gray-500 mt-1">
                          <span className="font-medium">{review.guestType}</span> • Stay Period: {review.stayPeriod}
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="flex items-center justify-end mb-1">
                          <span className="mr-2">Hygiene:</span>
                          <StarRating rating={review.hygiene} readOnly={true} />
                        </div>
                        <div className="flex items-center justify-end mb-1">
                          <span className="mr-2">Location:</span>
                          <StarRating rating={review.location} readOnly={true} />
                        </div>
                        <div className="flex items-center justify-end">
                          <span className="mr-2">Service:</span>
                          <StarRating rating={review.service} readOnly={true} />
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-gray-700">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p>No reviews yet. Be the first to review this property!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
