
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { PropertyProvider } from "./context/PropertyContext";

// Pages
import Welcome from "./pages/Welcome";
import PropertyDetail from "./pages/PropertyDetail";
import ReviewRating from "./pages/ReviewRating";
import Payment from "./pages/Payment";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <PropertyProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/property/:id" element={<PropertyDetail />} />
              <Route path="/review/:id" element={<ReviewRating />} />
              <Route path="/payment/:id" element={<Payment />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </PropertyProvider>
    </QueryClientProvider>
  );
};

export default App;
