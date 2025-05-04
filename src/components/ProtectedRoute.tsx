
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireLogin?: boolean;
  requireProfile?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  requireLogin = true, 
  requireProfile = false 
}: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check authentication status
    const userData = localStorage.getItem('user');
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setIsAuthenticated(!!user.isLoggedIn);
        setHasProfile(!!user.profileCompleted);
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        setIsAuthenticated(false);
        setHasProfile(false);
      }
    } else {
      setIsAuthenticated(false);
      setHasProfile(false);
    }
    
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (requireLogin && !isAuthenticated) {
    toast({
      title: "Authentication required",
      description: "Please login to access this page",
      variant: "destructive",
    });
    return <Navigate to="/login" replace />;
  }

  if (requireProfile && !hasProfile) {
    toast({
      title: "Profile required",
      description: "Please complete your profile first",
    });
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
