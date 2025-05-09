
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBookingContext, Booking, BookingStatus } from '../context/BookingContext';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MessageSquare, FileText, Check, Clock, Info, X, UserRound } from 'lucide-react';
import BookingDetail from '../components/BookingDetail';
import { useToast } from '@/hooks/use-toast';

export default function BookingRequests() {
  const { bookings, updateBookingStatus } = useBookingContext();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'accepted'>('all');
  const [showUserProfile, setShowUserProfile] = useState(false);
  const { toast } = useToast();
  
  // Get user data to check if landlord
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  const isLandlord = user?.userType === 'landlord';

  // Only show the requests for the current user
  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return booking.status === 'pending';
    if (activeTab === 'accepted') return booking.status === 'accepted';
    return true;
  });

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"><Check className="h-3 w-3" /> Accepted</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1"><X className="h-3 w-3" /> Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">
          {isLandlord ? "Incoming Booking Requests" : "My Booking Requests"}
        </h1>
        
        <Tabs 
          defaultValue="all" 
          className="mb-6"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as 'all' | 'pending' | 'accepted')}
        >
          <TabsList>
            <TabsTrigger value="all">All Requests</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {filteredBookings.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {isLandlord ? "Manage Incoming Requests" : "Booking Requests"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    {isLandlord && <TableHead>Requested By</TableHead>}
                    <TableHead>Move-in Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.propertyName}</TableCell>
                      {isLandlord && (
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-auto font-normal text-blue-600 hover:text-blue-800 hover:bg-transparent"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowUserProfile(true);
                            }}
                          >
                            {booking.name}
                          </Button>
                        </TableCell>
                      )}
                      <TableCell>{new Date(booking.moveInDate).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setShowUserProfile(false);
                                }}
                              >
                                <Info className="mr-1 h-4 w-4" /> Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                              {selectedBooking && !showUserProfile && (
                                <BookingDetail booking={selectedBooking} />
                              )}
                              
                              {selectedBooking && showUserProfile && (
                                <>
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                      <UserRound className="h-5 w-5" />
                                      {selectedBooking.name}'s Profile
                                    </DialogTitle>
                                  </DialogHeader>
                                  <div className="py-4">
                                    <div className="space-y-4">
                                      <div className="flex items-center justify-center mb-6">
                                        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                                          <UserRound className="text-primary" size={40} />
                                        </div>
                                      </div>
                                      
                                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                          <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                                          <p className="font-medium">{selectedBooking.name}</p>
                                        </div>
                                        <div className="space-y-2">
                                          <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                                          <p className="font-medium">{selectedBooking.phone}</p>
                                        </div>
                                        <div className="space-y-2 sm:col-span-2">
                                          <p className="text-sm font-medium text-muted-foreground">Stay Period</p>
                                          <p className="font-medium">{selectedBooking.stayPeriod}</p>
                                        </div>
                                        <div className="space-y-2 sm:col-span-2">
                                          <p className="text-sm font-medium text-muted-foreground">Additional Notes</p>
                                          <p>{selectedBooking.additionalNote || "No additional notes provided."}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button 
                                      variant="outline" 
                                      onClick={() => setShowUserProfile(false)}
                                    >
                                      Back to Booking Details
                                    </Button>
                                  </DialogFooter>
                                </>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          {isLandlord && booking.status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="default"
                                onClick={() => handleStatusChange(booking.id, 'accepted')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Check className="mr-1 h-4 w-4" /> Accept
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleStatusChange(booking.id, 'rejected')}
                              >
                                <X className="mr-1 h-4 w-4" /> Decline
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">
              {isLandlord ? "No incoming requests found" : "No booking requests found"}
            </h3>
            <p className="text-gray-500 mb-6">
              {isLandlord 
                ? "When tenants request to book your properties, they will appear here." 
                : "You haven't made any booking requests yet."
              }
            </p>
            <Link to="/">
              <Button>Browse Properties</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
