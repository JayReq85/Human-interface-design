
import React from 'react';
import { usePropertyContext } from '@/context/PropertyContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StarRating from '@/components/StarRating';
import Navbar from '@/components/Navbar';

const Reviews = () => {
  const { reviews, getProperty } = usePropertyContext();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">All Reviews</h1>
        
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Reviews</TabsTrigger>
            <TabsTrigger value="my">My Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review) => {
                const property = getProperty(review.propertyId);
                return (
                  <Card key={review.id} className="mb-4">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex justify-between items-center">
                        <span>{property?.name || 'Unknown Property'}</span>
                        <StarRating rating={review.rating} size="sm" readOnly={true} />
                      </CardTitle>
                      <div className="text-sm text-muted-foreground">
                        {review.guestType} • {review.stayPeriod}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-2">{review.comment}</p>
                      
                      <div className="flex flex-wrap gap-3 mt-3 text-sm">
                        <span className="bg-secondary rounded-full px-3 py-1">
                          Hygiene: {review.hygiene}/5
                        </span>
                        <span className="bg-secondary rounded-full px-3 py-1">
                          Location: {review.location}/5
                        </span>
                        <span className="bg-secondary rounded-full px-3 py-1">
                          Service: {review.service}/5
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No reviews found.
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="my" className="space-y-4">
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                You haven't submitted any reviews yet.
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reviews;
