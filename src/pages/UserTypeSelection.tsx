
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Building, User } from 'lucide-react';

const UserTypeSelection = () => {
  const navigate = useNavigate();

  const handleUserTypeSelect = (userType: 'tenant' | 'landlord') => {
    // Store the user type in localStorage
    localStorage.setItem('userType', userType);
    // Navigate to login page
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Welcome to TU Accommodation</CardTitle>
          <CardDescription className="text-lg mt-2">
            Please select your user type to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <Button 
            variant="outline" 
            className="h-40 flex flex-col items-center justify-center gap-4 hover:bg-primary/5 border-2"
            onClick={() => handleUserTypeSelect('tenant')}
          >
            <User size={50} className="text-primary" />
            <div className="text-center">
              <div className="font-bold text-lg">I am a Tenant</div>
              <p className="text-sm text-muted-foreground mt-1">Looking for accommodation</p>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-40 flex flex-col items-center justify-center gap-4 hover:bg-primary/5 border-2"
            onClick={() => handleUserTypeSelect('landlord')}
          >
            <Building size={50} className="text-primary" />
            <div className="text-center">
              <div className="font-bold text-lg">I am a Landlord</div>
              <p className="text-sm text-muted-foreground mt-1">Offering accommodation</p>
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserTypeSelection;
