
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, User, Bookmark, Star, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setIsLoggedIn(user.isLoggedIn);
      setUsername(user.fullName || user.email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    
    navigate('/login');
  };

  return (
    <div className="bg-primary shadow-md px-4 py-3 flex justify-between items-center">
      <div className="flex items-center">
        <Link to="/" className="text-xl font-bold text-primary-foreground">
          TU ACCOMMODATION
        </Link>
      </div>
      
      <div className="flex items-center space-x-4">
        <Link to="/" className="flex flex-col items-center text-xs text-primary-foreground">
          <Home size={20} className="mb-1" />
          Home
        </Link>
        
        {isLoggedIn ? (
          <>
            <Link to="/profile" className="flex flex-col items-center text-xs text-primary-foreground">
              <User size={20} className="mb-1" />
              Profile
            </Link>
            <Link to="/bookmarks" className="flex flex-col items-center text-xs text-primary-foreground">
              <Bookmark size={20} className="mb-1" />
              Bookmarks
            </Link>
            <Link to="/reviews" className="flex flex-col items-center text-xs text-primary-foreground">
              <Star size={20} className="mb-1" />
              Reviews
            </Link>
            
            <div className="border-l border-primary-foreground/30 pl-4 ml-2">
              <div className="text-xs font-medium mb-1 text-primary-foreground">
                {username}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-8 px-2 text-primary-foreground hover:text-primary-foreground/80"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </>
        ) : (
          <Link to="/login" className="flex flex-col items-center text-xs text-primary-foreground">
            <LogIn size={20} className="mb-1" />
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
