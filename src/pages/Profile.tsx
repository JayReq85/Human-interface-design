
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { UserRound, Lock, Bell, Edit, Calendar, Check, FileText, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBookingContext, Booking } from '../context/BookingContext';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import BookingDetail from '../components/BookingDetail';
import { Alert, AlertDescription } from "@/components/ui/alert";

const profileSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  address: z.string().min(5, { message: "Please enter your address" }),
  bio: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const passwordSchema = z.object({
  currentPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  newPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

const Profile = () => {
  const [user, setUser] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { bookings } = useBookingContext();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [verificationDocument, setVerificationDocument] = useState<File | null>(null);
  const [documentPreviewUrl, setDocumentPreviewUrl] = useState<string | null>(null);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      address: "",
      bio: "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Populate form with existing data if available
      if (parsedUser.fullName) {
        profileForm.setValue('fullName', parsedUser.fullName);
      }
      if (parsedUser.phone) {
        profileForm.setValue('phone', parsedUser.phone);
      }
      if (parsedUser.address) {
        profileForm.setValue('address', parsedUser.address);
      }
      if (parsedUser.bio) {
        profileForm.setValue('bio', parsedUser.bio);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate('/login');
    }
  }, [navigate, profileForm]);

  const onProfileSubmit = (data: ProfileFormValues) => {
    // Update user data with profile information
    if (user) {
      const updatedUser = {
        ...user,
        ...data,
        profileCompleted: true,
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated",
      });
    }
  };

  const onPasswordSubmit = (data: PasswordFormValues) => {
    // In a real app, we would send this to an API
    // Here we'll just show a success message
    toast({
      title: "Password Updated",
      description: "Your password has been successfully changed",
    });
    
    passwordForm.reset();
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVerificationDocument(file);
      
      // Create preview URL for the document
      const previewUrl = URL.createObjectURL(file);
      setDocumentPreviewUrl(previewUrl);
      
      // Update user verification status to pending
      if (user) {
        const updatedUser = {
          ...user,
          verificationStatus: 'pending',
          verificationDate: new Date().toISOString(),
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        toast({
          title: "Document Uploaded",
          description: "Your verification document has been uploaded and is pending review",
        });
      }
    }
  };

  // For demo purposes, approve verification after 3 seconds
  const approveVerification = () => {
    if (user && user.verificationStatus === 'pending') {
      setTimeout(() => {
        const updatedUser = {
          ...user,
          verificationStatus: 'verified',
          verifiedAt: new Date().toISOString(),
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        toast({
          title: "Verification Complete",
          description: "Your account has been verified successfully",
        });
      }, 3000);
    }
  };

  useEffect(() => {
    if (user?.verificationStatus === 'pending') {
      approveVerification();
    }
  }, [user?.verificationStatus]);

  // Get verification status badge
  const getVerificationBadge = (status?: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1"><Clock className="h-3 w-3" /> Pending Verification</Badge>;
      case 'verified':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"><Check className="h-3 w-3" /> Verified</Badge>;
      default:
        return null;
    }
  };

  // Get status badge for bookings
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Filter incoming bookings (for landlords)
  const incomingBookings = user?.userType === 'landlord' ? bookings : [];

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 py-10 px-4">
        <div className="container mx-auto max-w-3xl">
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="profile">Profile Information</TabsTrigger>
              <TabsTrigger value="bookings">{user.userType === 'landlord' ? 'Incoming Requests' : 'My Bookings'}</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-center mb-4">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center relative">
                      <UserRound className="text-primary" size={40} />
                      {user.verificationStatus === 'verified' && (
                        <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-center">
                    <CardTitle className="text-2xl">
                      {isEditing ? "Edit Profile" : "Your Profile"}
                    </CardTitle>
                    <CardDescription>
                      {isEditing 
                        ? "Update your personal information" 
                        : "Manage your personal information"}
                    </CardDescription>
                    <div className="mt-2">
                      {getVerificationBadge(user.verificationStatus)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {!isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                          <p className="font-medium">{user.fullName}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                          <p className="font-medium">{user.phone}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">Email</p>
                          <p className="font-medium">{user.email}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">User Type</p>
                          <p className="font-medium capitalize">{user.userType}</p>
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <p className="text-sm font-medium text-muted-foreground">Address</p>
                          <p className="font-medium">{user.address}</p>
                        </div>
                        {user.bio && (
                          <div className="space-y-2 sm:col-span-2">
                            <p className="text-sm font-medium text-muted-foreground">Bio</p>
                            <p>{user.bio}</p>
                          </div>
                        )}
                      </div>
                      
                      {user.userType === 'landlord' && !user.verificationStatus && (
                        <div className="mt-6">
                          <Alert className="bg-blue-50 border border-blue-200">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <AlertDescription>
                              Please upload a verification document (passport or ID) to get verified status
                            </AlertDescription>
                          </Alert>
                          <div className="mt-4">
                            <FormItem>
                              <FormLabel>Upload Verification Document</FormLabel>
                              <FormControl>
                                <Input 
                                  type="file" 
                                  accept="image/*,.pdf" 
                                  onChange={handleFileChange} 
                                />
                              </FormControl>
                              <p className="text-sm text-muted-foreground mt-1">
                                Accepted formats: JPG, PNG, PDF
                              </p>
                            </FormItem>
                          </div>
                        </div>
                      )}
                      
                      {user.userType === 'landlord' && user.verificationStatus === 'pending' && (
                        <div className="mt-6">
                          <Alert className="bg-yellow-50 border border-yellow-200">
                            <Clock className="h-4 w-4 text-yellow-500" />
                            <AlertDescription>
                              Your verification document is currently under review. This process usually takes 1-2 business days.
                            </AlertDescription>
                          </Alert>
                          {documentPreviewUrl && (
                            <div className="mt-4">
                              <p className="text-sm font-medium mb-2">Uploaded Document:</p>
                              <div className="border rounded p-2">
                                <img 
                                  src={documentPreviewUrl} 
                                  alt="Verification Document" 
                                  className="max-h-40 object-contain mx-auto"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {user.userType === 'landlord' && user.verificationStatus === 'verified' && (
                        <div className="mt-6">
                          <Alert className="bg-green-50 border border-green-200">
                            <Check className="h-4 w-4 text-green-500" />
                            <AlertDescription>
                              Your account is verified! Tenants can now see that you are a verified landlord.
                            </AlertDescription>
                          </Alert>
                        </div>
                      )}
                      
                      <Button 
                        onClick={toggleEdit} 
                        className="w-full mt-6"
                        variant="outline"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Information
                      </Button>
                    </div>
                  ) : (
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                        <FormField
                          control={profileForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="+1 234 567 8900" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input placeholder="123 Main St, City, Country" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bio (Optional)</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Tell us a bit about yourself..." 
                                  className="min-h-[120px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex gap-4">
                          <Button type="submit" className="flex-1">
                            Save Profile
                          </Button>
                          <Button 
                            type="button" 
                            onClick={toggleEdit} 
                            variant="outline" 
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </Form>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-center mb-4">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="text-primary" size={40} />
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-center">
                    {user.userType === 'landlord' ? 'Incoming Booking Requests' : 'My Booking Requests'}
                  </CardTitle>
                  <CardDescription className="text-center">
                    {user.userType === 'landlord' 
                      ? 'View and manage booking requests for your properties'
                      : 'View and manage all your property booking requests'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(user.userType === 'tenant' && bookings.length > 0) || 
                   (user.userType === 'landlord' && incomingBookings.length > 0) ? (
                    <div className="space-y-4">
                      {(user.userType === 'tenant' ? bookings : incomingBookings).map((booking) => (
                        <div 
                          key={booking.id}
                          className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="mb-2 sm:mb-0">
                            <h3 className="font-medium">{booking.propertyName}</h3>
                            <p className="text-sm text-gray-500">
                              {user.userType === 'landlord' 
                                ? <span>From: {booking.name}</span>
                                : <span>Move-in: {formatDate(booking.moveInDate)}</span>
                              }
                            </p>
                          </div>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                            {getStatusBadge(booking.status)}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSelectedBooking(booking)}
                                >
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px]">
                                {selectedBooking && (
                                  <BookingDetail booking={selectedBooking} />
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <h3 className="text-lg font-medium mb-2">
                        {user.userType === 'landlord' 
                          ? 'No incoming booking requests yet' 
                          : 'No booking requests yet'
                        }
                      </h3>
                      <p className="text-gray-500 mb-6">
                        {user.userType === 'landlord' 
                          ? 'When tenants request to book your properties, they will appear here.'
                          : 'You haven\'t made any booking requests for properties yet.'
                        }
                      </p>
                      <Link to="/">
                        <Button>Browse Properties</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-center mb-4">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <Lock className="text-primary" size={40} />
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-center">Change Password</CardTitle>
                  <CardDescription className="text-center">
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full">
                        Update Password
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
