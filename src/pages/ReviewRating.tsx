import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePropertyContext } from '../context/PropertyContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import StarRating from '../components/StarRating';
import { useToast } from "@/hooks/use-toast";

const ReviewRating = () => {
  const { id } = useParams();
  // Convert id to string directly, no parseInt needed
  const propertyId = id || "";
  const { getProperty, addReview } = usePropertyContext();
  const property = getProperty(propertyId);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [rating, setRating] = useState(0);
  const [hygiene, setHygiene] = useState(0);
  const [location, setLocation] = useState(0);
  const [service, setService] = useState(0);
  const [comment, setComment] = useState('');
  const [guestType, setGuestType] = useState('');
  const [stayPeriod, setStayPeriod] = useState('');
  
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please provide an overall rating for this property.",
        variant: "destructive",
      });
      return;
    }
    
    if (!guestType) {
      toast({
        title: "Guest Type Required",
        description: "Please select your guest type.",
        variant: "destructive",
      });
      return;
    }
    
    if (!stayPeriod) {
      toast({
        title: "Stay Period Required",
        description: "Please select your stay period.",
        variant: "destructive",
      });
      return;
    }
    
    if (comment.trim().length < 10) {
      toast({
        title: "Review Text Required",
        description: "Please write a review of at least 10 characters.",
        variant: "destructive",
      });
      return;
    }
    
    // Add the review
    addReview({
      propertyId,
      userId: "current-user", // Placeholder user ID
      userName: "Current User", // Placeholder username
      rating,
      guestType,
      stayPeriod,
      hygiene: hygiene || rating,
      location: location || rating,
      service: service || rating,
      comment,
    });
    
    toast({
      title: "Review Submitted",
      description: "Thank you for sharing your experience!",
    });
    
    // Navigate to payment page after review
    navigate(`/payment/${propertyId}`);
  };
  
  if (!property) {
    return <div className="text-center py-10">Property not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto max-w-3xl px-4 py-6">
        {/* Navigation */}
        <div className="mb-6">
          <Link to={`/property/${propertyId}`} className="flex items-center text-primary hover:text-primary/80">
            <ArrowLeft size={16} className="mr-1" />
            Back to Property Details
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Write a Review</h1>
          
          <div className="mb-6 pb-6 border-b">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden mr-4">
                <img 
                  src={property.image} 
                  alt={property.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{property.name}</h2>
                <p className="text-gray-500">{property.location}</p>
                <div className="flex items-center mt-1 text-sm">
                  <span className="text-gray-600 mr-2">Landlord:</span>
                  <span>{property.landlordName}</span>
                </div>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmitReview}>
            <div className="space-y-6">
              {/* Overall Rating */}
              <div className="space-y-2">
                <label className="text-lg font-medium block">Overall Rating</label>
                <div className="flex items-center">
                  <StarRating rating={rating} setRating={setRating} />
                  <span className="ml-2 text-gray-500">
                    {rating ? `${rating}/5` : "Select a rating"}
                  </span>
                </div>
              </div>
              
              {/* Guest Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block font-medium">Guest Type</label>
                  <Select onValueChange={setGuestType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Stayed">Stayed</SelectItem>
                      <SelectItem value="Currently">Currently Living</SelectItem>
                      <SelectItem value="Called">Called</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="block font-medium">Stay Period</label>
                  <Select onValueChange={setStayPeriod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="< 1 year">Less than 1 year</SelectItem>
                      <SelectItem value="> 1 year">More than 1 year</SelectItem>
                      <SelectItem value="> 2 year">More than 2 years</SelectItem>
                      <SelectItem value="> 3 year">More than 3 years</SelectItem>
                      <SelectItem value="> 4 year">More than 4 years</SelectItem>
                      <SelectItem value="> 5 year">More than 5 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Specific Ratings */}
              <div className="space-y-4">
                <label className="text-lg font-medium block">Specific Ratings</label>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Hygiene</label>
                    <StarRating rating={hygiene} setRating={setHygiene} />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Location</label>
                    <StarRating rating={location} setRating={setLocation} />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Service</label>
                    <StarRating rating={service} setRating={setService} />
                  </div>
                </div>
              </div>
              
              {/* Review Comment */}
              <div className="space-y-2">
                <label className="text-lg font-medium block">Your Review</label>
                <p className="text-sm text-gray-500">
                  Share your experience to help others. Your review will be anonymous.
                </p>
                <Textarea 
                  placeholder="Share your review here. Your review and rating will be anonymous."
                  rows={5}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="resize-none"
                />
              </div>
              
              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  Submit Review
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  className="flex-1"
                  onClick={() => navigate(`/payment/${propertyId}`)}
                >
                  Skip to Payment
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewRating;
