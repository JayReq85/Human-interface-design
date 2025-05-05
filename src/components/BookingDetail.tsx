import React, { useState } from 'react';
import { Booking, useBookingContext } from '../context/BookingContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MessageSquare, FileText, Send, Info } from 'lucide-react';

interface BookingDetailProps {
  booking: Booking;
}

export default function BookingDetail({ booking }: BookingDetailProps) {
  const [messageText, setMessageText] = useState('');
  const { addMessage } = useBookingContext();
  const [activeTab, setActiveTab] = useState('details');

  const handleSendMessage = () => {
    if (messageText.trim()) {
      addMessage(booking.id, messageText);
      setMessageText('');
    }
  };

  const getStatusColor = () => {
    switch (booking.status) {
      case 'pending': return 'text-yellow-600';
      case 'accepted': return 'text-green-600';
      case 'rejected': return 'text-red-600';
      default: return '';
    }
  };

  // Format date string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time for chat messages
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Booking for {booking.propertyName}</DialogTitle>
        <DialogDescription>
          <Badge 
            variant="outline" 
            className={`${getStatusColor()} mt-2`}
          >
            Status: {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Badge>
        </DialogDescription>
      </DialogHeader>

      <Tabs defaultValue="details" className="mt-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">
            <Info className="mr-2 h-4 w-4" />
            Details
          </TabsTrigger>
          <TabsTrigger value="chat">
            <MessageSquare className="mr-2 h-4 w-4" />
            Chat
          </TabsTrigger>
          {booking.status === 'accepted' && (
            <TabsTrigger value="contract">
              <FileText className="mr-2 h-4 w-4" />
              Contract
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="details" className="py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Name</h4>
              <p>{booking.name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Phone</h4>
              <p>{booking.phone}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Stay Period</h4>
              <p>
                {booking.stayPeriod === '<6months' && 'Less than 6 months'}
                {booking.stayPeriod === '6-12months' && '6-12 months'}
                {booking.stayPeriod === '>12months' && 'More than 1 year'}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Move-in Date</h4>
              <p className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(booking.moveInDate)}
              </p>
            </div>
          </div>

          {booking.additionalNote && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-500">Additional Note</h4>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-md mt-1">
                {booking.additionalNote}
              </p>
            </div>
          )}

          <div className="mt-2">
            <h4 className="text-sm font-medium text-gray-500">Submitted on</h4>
            <p>{formatDate(booking.createdAt)}</p>
          </div>
        </TabsContent>

        <TabsContent value="chat" className="py-4">
          <div className="border rounded-md h-64 mb-4 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-2">
            {booking.messages.length === 0 ? (
              <div className="text-center text-gray-500 my-auto">
                No messages yet. Start the conversation with the landlord.
              </div>
            ) : (
              booking.messages.map(message => (
                <div 
                  key={message.id}
                  className={`p-3 rounded-lg max-w-[80%] ${
                    message.senderId === 'current-user' 
                      ? 'bg-primary text-primary-foreground ml-auto' 
                      : 'bg-gray-200 mr-auto'
                  }`}
                >
                  <div className="text-xs opacity-80 mb-1">
                    {message.senderName} • {formatTime(message.timestamp)}
                  </div>
                  <div>{message.text}</div>
                </div>
              ))
            )}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
              type="submit"
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        {booking.status === 'accepted' && (
          <TabsContent value="contract" className="py-4">
            <div className="text-center border rounded-md p-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <h3 className="text-lg font-medium mb-2">Rental Contract</h3>
              <p className="mb-4 text-gray-600">
                Your rental contract is ready. You can download it or view it online.
              </p>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Download Contract
              </Button>
            </div>
          </TabsContent>
        )}
      </Tabs>

      <DialogFooter className="mt-4">
        {booking.status === 'pending' && (
          <p className="text-sm text-muted-foreground">
            Waiting for landlord to respond to your booking request.
          </p>
        )}
      </DialogFooter>
    </>
  );
}
