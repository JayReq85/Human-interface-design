
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBookingContext, Booking } from '../context/BookingContext';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MessageSquare, FileText, Check, Clock, Info } from 'lucide-react';
import BookingDetail from '../components/BookingDetail';

export default function BookingRequests() {
  const { bookings } = useBookingContext();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'accepted'>('all');

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
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">My Booking Requests</h1>
        
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
              <CardTitle className="text-lg">Booking Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Move-in Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.propertyName}</TableCell>
                      <TableCell>{new Date(booking.moveInDate).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedBooking(booking)}
                            >
                              <Info className="mr-1 h-4 w-4" /> Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            {selectedBooking && (
                              <BookingDetail booking={selectedBooking} />
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No booking requests found</h3>
            <p className="text-gray-500 mb-6">You haven't made any booking requests yet.</p>
            <Link to="/">
              <Button>Browse Properties</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
