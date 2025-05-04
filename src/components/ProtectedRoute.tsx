
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
  const [shouldRedirect, setShouldRedirect] = useState<string | null>(null);
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

  useEffect(() => {
    // Handle redirects and toasts after state is set
    if (!loading) {
      if (requireLogin && !isAuthenticated) {
        toast({
          title: "Authentication required",
          description: "Please login to access this page",
          variant: "destructive",
        });
        setShouldRedirect('/login');
      } else if (requireProfile && !hasProfile) {
        toast({
          title: "Profile required",
          description: "Please complete your profile first",
        });
        setShouldRedirect('/profile');
      }
    }
  }, [loading, isAuthenticated, hasProfile, requireLogin, requireProfile, toast]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (shouldRedirect) {
    return <Navigate to={shouldRedirect} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
