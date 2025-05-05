
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define the Booking type
export type BookingStatus = 'pending' | 'accepted' | 'rejected';

export interface Booking {
  id: string;
  propertyId: string; 
  propertyName: string;
  name: string;
  phone: string;
  stayPeriod: string;
  moveInDate: string;
  additionalNote?: string;
  status: BookingStatus;
  createdAt: string;
  messages: Message[];
}

export interface Message {
  id: string;
  bookingId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

// Create a booking request input type (without id, status, createdAt)
export type BookingRequest = Omit<Booking, 'id' | 'status' | 'createdAt' | 'messages'>;

interface BookingContextProps {
  bookings: Booking[];
  addBooking: (request: BookingRequest) => void;
  getBooking: (id: string) => Booking | undefined;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  addMessage: (bookingId: string, text: string) => void;
}

const BookingContext = createContext<BookingContextProps | undefined>(undefined);

interface BookingProviderProps {
  children: ReactNode;
}

export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const storedBookings = localStorage.getItem('bookings');
      return storedBookings ? JSON.parse(storedBookings) : [];
    } catch (error) {
      console.error("Error parsing bookings from localStorage:", error);
      return [];
    }
  });

  // Save bookings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }, [bookings]);

  const addBooking = (request: BookingRequest) => {
    const newBooking: Booking = {
      ...request,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      messages: []
    };
    
    setBookings(prevBookings => [...prevBookings, newBooking]);
  };

  const getBooking = (id: string): Booking | undefined => {
    return bookings.find(booking => booking.id === id);
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking.id === id ? { ...booking, status } : booking
      )
    );
  };

  const addMessage = (bookingId: string, text: string) => {
    // Mock user ID and name
    const currentUserId = "current-user";
    const currentUserName = "You";

    const newMessage: Message = {
      id: Date.now().toString(),
      bookingId,
      senderId: currentUserId,
      senderName: currentUserName,
      text,
      timestamp: new Date().toISOString()
    };

    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, messages: [...booking.messages, newMessage] }
          : booking
      )
    );
  };

  return (
    <BookingContext.Provider value={{
      bookings,
      addBooking,
      getBooking,
      updateBookingStatus,
      addMessage
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookingContext = (): BookingContextProps => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBookingContext must be used within a BookingProvider");
  }
  return context;
};
