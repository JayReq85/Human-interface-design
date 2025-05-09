
import React, { useEffect } from 'react';
import { usePropertyContext } from '@/context/PropertyContext';
import { useBookingContext, BookingStatus } from '@/context/BookingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PropertyCard from '@/components/PropertyCard';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, UserRound, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Bookmarks = () => {
  const { bookmarkedProperties } = usePropertyContext();
  const { bookings, updateBookingStatus, addBooking } = useBookingContext();
  const { toast } = useToast();
  
  // Get user data to check if landlord
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  const isLandlord = user?.userType === 'landlord';
  
  // Filter bookings for landlords
  const pendingBookings = isLandlord ? bookings.filter(booking => booking.status === 'pending') : [];
  const acceptedBookings = isLandlord ? bookings.filter(booking => booking.status === 'accepted') : [];
  const allBookings = isLandlord ? bookings : [];

  // Add sample fixed bookings if none exist and user is landlord
  useEffect(() => {
    if (isLandlord && bookings.length === 0) {
      // Add three fixed sample bookings
      const sampleBookings = [
        {
          propertyId: "prop-001",
          propertyName: "Modern Studio Apartment",
          name: "John Smith",
          phone: "092-456-7890",
          stayPeriod: "6 months",
          moveInDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          additionalNote: "I'm looking for a quiet place near the university."
        },
        {
          propertyId: "prop-002",
          propertyName: "Cozy 1-Bedroom Condo",
          name: "Sarah Johnson",
          phone: "098-765-4321",
          stayPeriod: "12 months",
          moveInDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
          additionalNote: "I need a place with good internet for remote work."
        },
        {
          propertyId: "prop-003",
          propertyName: "Spacious 2-Bedroom Apartment",
          name: "Michael Wong",
          phone: "091-234-5678",
          stayPeriod: "9 months",
          moveInDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days from now
          additionalNote: "Looking for a place with parking space."
        }
      ];
      
      // Add each booking to the context
      sampleBookings.forEach(booking => {
        addBooking(booking);
      });
    }
  }, [isLandlord, bookings.length, addBooking]);

  const handleStatusChange = (bookingId: string, newStatus: BookingStatus) => {
    updateBookingStatus(bookingId, newStatus);
    
    toast({
      title: newStatus === 'accepted' ? "Booking Accepted" : "Booking Declined",
      description: newStatus === 'accepted' 
        ? "You have accepted this booking request" 
        : "You have declined this booking request",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        {isLandlord ? (
          <>
            <h1 className="text-2xl font-bold mb-6">Incoming Booking Requests</h1>
            
            <Tabs defaultValue="all" className="mb-6">
              <TabsList>
                <TabsTrigger value="all">All Requests</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="accepted">Accepted</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                {allBookings.length > 0 ? (
                  <div className="space-y-4">
                    {allBookings.map((booking) => (
                      <Card key={booking.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-1/4 bg-gray-100 p-4 flex flex-col justify-center items-center">
                              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                <UserRound className="text-primary" size={32} />
                              </div>
                              <h3 className="font-medium text-center">{booking.name}</h3>
                              <p className="text-sm text-gray-500">{booking.phone}</p>
                            </div>
                            
                            <div className="w-full md:w-3/4 p-4">
                              <div className="flex flex-col md:flex-row justify-between mb-4">
                                <div>
                                  <h3 className="text-lg font-semibold">{booking.propertyName}</h3>
                                  <p className="text-sm">Move-in: {new Date(booking.moveInDate).toLocaleDateString()}</p>
                                  <p className="text-sm">Stay period: {booking.stayPeriod}</p>
                                </div>
                                
                                <div className="mt-2 md:mt-0">
                                  {booking.status === 'pending' && (
                                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
                                      <Clock className="h-3 w-3" /> Pending
                                    </Badge>
                                  )}
                                  {booking.status === 'accepted' && (
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                                      <Check className="h-3 w-3" /> Accepted
                                    </Badge>
                                  )}
                                  {booking.status === 'rejected' && (
                                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
                                      <X className="h-3 w-3" /> Declined
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              
                              {booking.additionalNote && (
                                <div className="mb-4">
                                  <p className="text-sm font-medium">Additional Note:</p>
                                  <p className="text-sm bg-gray-50 p-2 rounded">{booking.additionalNote}</p>
                                </div>
                              )}
                              
                              {booking.status === 'pending' && (
                                <div className="flex flex-wrap gap-2 justify-end mt-4">
                                  <Button 
                                    variant="outline"
                                    className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:text-green-800"
                                    onClick={() => handleStatusChange(booking.id, 'accepted')}
                                  >
                                    <Check className="mr-1 h-4 w-4" /> Accept
                                  </Button>
                                  <Button 
                                    variant="outline"
                                    className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:text-red-800"
                                    onClick={() => handleStatusChange(booking.id, 'rejected')}
                                  >
                                    <X className="mr-1 h-4 w-4" /> Decline
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardHeader className="text-center">
                      <CardTitle>No Requests</CardTitle>
                    </CardHeader>
                    <CardContent className="py-6 text-center">
                      <p className="text-gray-500">You don't have any booking requests at the moment.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="pending">
                {pendingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {pendingBookings.map((booking) => (
                      <Card key={booking.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-1/4 bg-gray-100 p-4 flex flex-col justify-center items-center">
                              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                <UserRound className="text-primary" size={32} />
                              </div>
                              <h3 className="font-medium text-center">{booking.name}</h3>
                              <p className="text-sm text-gray-500">{booking.phone}</p>
                            </div>
                            
                            <div className="w-full md:w-3/4 p-4">
                              <div className="flex flex-col md:flex-row justify-between mb-4">
                                <div>
                                  <h3 className="text-lg font-semibold">{booking.propertyName}</h3>
                                  <p className="text-sm">Move-in: {new Date(booking.moveInDate).toLocaleDateString()}</p>
                                  <p className="text-sm">Stay period: {booking.stayPeriod}</p>
                                </div>
                                
                                <div className="mt-2 md:mt-0">
                                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> Pending
                                  </Badge>
                                </div>
                              </div>
                              
                              {booking.additionalNote && (
                                <div className="mb-4">
                                  <p className="text-sm font-medium">Additional Note:</p>
                                  <p className="text-sm bg-gray-50 p-2 rounded">{booking.additionalNote}</p>
                                </div>
                              )}
                              
                              <div className="flex flex-wrap gap-2 justify-end mt-4">
                                <Button 
                                  variant="outline"
                                  className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:text-green-800"
                                  onClick={() => handleStatusChange(booking.id, 'accepted')}
                                >
                                  <Check className="mr-1 h-4 w-4" /> Accept
                                </Button>
                                <Button 
                                  variant="outline"
                                  className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:text-red-800"
                                  onClick={() => handleStatusChange(booking.id, 'rejected')}
                                >
                                  <X className="mr-1 h-4 w-4" /> Decline
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardHeader className="text-center">
                      <CardTitle>No Pending Requests</CardTitle>
                    </CardHeader>
                    <CardContent className="py-6 text-center">
                      <p className="text-gray-500">You don't have any pending booking requests at the moment.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="accepted">
                {acceptedBookings.length > 0 ? (
                  <div className="space-y-4">
                    {acceptedBookings.map((booking) => (
                      <Card key={booking.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-1/4 bg-gray-100 p-4 flex flex-col justify-center items-center">
                              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                <UserRound className="text-primary" size={32} />
                              </div>
                              <h3 className="font-medium text-center">{booking.name}</h3>
                              <p className="text-sm text-gray-500">{booking.phone}</p>
                            </div>
                            
                            <div className="w-full md:w-3/4 p-4">
                              <div className="flex flex-col md:flex-row justify-between mb-4">
                                <div>
                                  <h3 className="text-lg font-semibold">{booking.propertyName}</h3>
                                  <p className="text-sm">Move-in: {new Date(booking.moveInDate).toLocaleDateString()}</p>
                                  <p className="text-sm">Stay period: {booking.stayPeriod}</p>
                                </div>
                                
                                <div className="mt-2 md:mt-0">
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                                    <Check className="h-3 w-3" /> Accepted
                                  </Badge>
                                </div>
                              </div>
                              
                              {booking.additionalNote && (
                                <div className="mb-4">
                                  <p className="text-sm font-medium">Additional Note:</p>
                                  <p className="text-sm bg-gray-50 p-2 rounded">{booking.additionalNote}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardHeader className="text-center">
                      <CardTitle>No Accepted Requests</CardTitle>
                    </CardHeader>
                    <CardContent className="py-6 text-center">
                      <p className="text-gray-500">You don't have any accepted booking requests at the moment.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
