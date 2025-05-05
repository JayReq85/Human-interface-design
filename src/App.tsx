
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PropertyProvider } from "./context/PropertyContext";
import { useEffect, useState } from "react";

// Pages
import Index from "./pages/Index";
import PropertyDetail from "./pages/PropertyDetail";
import ReviewRating from "./pages/ReviewRating";
import Payment from "./pages/Payment";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Reviews from "./pages/Reviews";
import Bookmarks from "./pages/Bookmarks";
import UserTypeSelection from "./pages/UserTypeSelection";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check login status when app loads
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setIsLoggedIn(user.isLoggedIn);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <PropertyProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Welcome page - entry point */}
              <Route path="/welcome" element={<UserTypeSelection />} />
              
              {/* Redirect root to welcome page */}
              <Route path="/" element={
                <ProtectedRoute requireLogin={true} requireProfile={true}>
                  <Index />
                </ProtectedRoute>
              } />
              
              <Route path="/login" element={<Login />} />
              
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute requireLogin={true} requireProfile={false}>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/reviews" 
                element={
                  <ProtectedRoute requireLogin={true} requireProfile={true}>
                    <Reviews />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/bookmarks" 
                element={
                  <ProtectedRoute requireLogin={true} requireProfile={true}>
                    <Bookmarks />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/property/:id" 
                element={
                  <ProtectedRoute requireLogin={true} requireProfile={true}>
                    <PropertyDetail />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/review/:id" 
                element={
                  <ProtectedRoute requireLogin={true} requireProfile={true}>
                    <ReviewRating />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/payment/:id" 
                element={
                  <ProtectedRoute requireLogin={true} requireProfile={true}>
                    <Payment />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </PropertyProvider>
    </QueryClientProvider>
  );
};

export default App;
