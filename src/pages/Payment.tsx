
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePropertyContext } from '../context/PropertyContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ArrowLeft, CreditCard } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useToast } from "@/hooks/use-toast";

const Payment = () => {
  const { id } = useParams();
  const propertyId = parseInt(id || "0");
  const { getProperty } = usePropertyContext();
  const property = getProperty(propertyId);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMethod === 'card') {
      // Validate card details
      if (!cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
        toast({
          title: "Invalid Card Number",
          description: "Please enter a valid 16-digit card number.",
          variant: "destructive",
        });
        return;
      }
      
      if (!cardName) {
        toast({
          title: "Card Name Required",
          description: "Please enter the name on your card.",
          variant: "destructive",
        });
        return;
      }
      
      if (!expiry.match(/^\d{2}\/\d{2}$/)) {
        toast({
          title: "Invalid Expiry Date",
          description: "Please enter a valid expiry date (MM/YY).",
          variant: "destructive",
        });
        return;
      }
      
      if (!cvv.match(/^\d{3,4}$/)) {
        toast({
          title: "Invalid CVV",
          description: "Please enter a valid CVV code (3-4 digits).",
          variant: "destructive",
        });
        return;
      }
    }
    
    // Process payment (simulated)
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully.",
      });
      // Navigate back to welcome page after successful payment
      navigate('/');
    }, 2000);
  };
  
  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  // Handle card expiry date format
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    
    if (val.length <= 2) {
      setExpiry(val);
    } else if (val.length <= 4) {
      setExpiry(`${val.substring(0, 2)}/${val.substring(2)}`);
    }
  };
  
  if (!property) {
    return <div className="text-center py-10">Property not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto max-w-4xl px-4 py-6">
        {/* Navigation */}
        <div className="mb-6">
          <Link to={`/property/${propertyId}`} className="flex items-center text-primary hover:text-primary/80">
            <ArrowLeft size={16} className="mr-1" />
            Back to Property
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold mb-6">Payment Details</h1>
              
              <Tabs defaultValue="card" onValueChange={(value) => setPaymentMethod(value)}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="card">Credit Card</TabsTrigger>
                  <TabsTrigger value="qr">QR Payment</TabsTrigger>
                </TabsList>
                
                <TabsContent value="card">
                  <form onSubmit={handlePayment}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <div className="relative">
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                            maxLength={19}
                            className="pl-10"
                          />
                          <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Cardholder Name</Label>
                        <Input
                          id="cardName"
                          placeholder="John Smith"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            value={expiry}
                            onChange={handleExpiryChange}
                            maxLength={5}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            maxLength={4}
                          />
                        </div>
                      </div>
                      
                      <Button type="submit" className="w-full mt-2" disabled={isProcessing}>
                        {isProcessing ? "Processing Payment..." : "Pay Now"}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
                
                <TabsContent value="qr">
                  <div className="text-center py-4">
                    <div className="border-2 border-gray-200 rounded-md p-4 inline-block mb-4">
                      <img 
                        src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PropertyPayment123" 
                        alt="Payment QR Code" 
                        className="w-48 h-48 mx-auto"
                      />
                    </div>
                    <div className="text-sm text-gray-500 mb-6">
                      <p>Scan this QR code with your banking app to complete the payment</p>
                      <p className="mt-2">Payment ID: IN000010</p>
                    </div>
                    
                    <Button 
                      onClick={() => {
                        toast({
                          title: "Payment Successful",
                          description: "Your QR payment has been verified and processed.",
                        });
                        navigate('/');
                      }}
                      className="w-full"
                    >
                      Verify Payment
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold mb-4">Order Summary</h2>
                
                <div className="flex items-start mb-4">
                  <img 
                    src={property.image} 
                    alt={property.name} 
                    className="w-16 h-16 object-cover rounded-md mr-3" 
                  />
                  <div>
                    <h3 className="font-medium">{property.name}</h3>
                    <p className="text-sm text-gray-500">{property.location}</p>
                  </div>
                </div>
                
                <div className="space-y-2 py-4 border-y">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Rent</span>
                    <span>{property.price.toLocaleString()} ฿</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Security Deposit</span>
                    <span>{property.deposit.toLocaleString()} ฿</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Internet Fee</span>
                    <span>{property.utilities.internet.toLocaleString()} ฿</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between font-bold text-lg mb-1">
                    <span>Total</span>
                    <span>{(property.price + property.deposit + property.utilities.internet).toLocaleString()} ฿</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Electricity and water will be charged based on actual usage
                  </p>
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <h3 className="font-medium mb-2">Payment Terms</h3>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc pl-4">
                    <li>First month's rent paid in advance</li>
                    <li>Security deposit refundable at end of contract</li>
                    <li>Monthly bills to be paid by the 5th of each month</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
