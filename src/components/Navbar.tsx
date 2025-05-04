
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, User, Bookmark, Star, MessageSquare, CreditCard } from 'lucide-react';

const Navbar = () => {
  return (
    <div className="bg-white shadow-md px-4 py-3 flex justify-between items-center">
      <div className="flex items-center">
        <Link to="/" className="text-xl font-bold text-primary">
          TU ACCOMMODATION
        </Link>
      </div>
      <div className="flex space-x-4">
        <Link to="/" className="flex flex-col items-center text-xs">
          <Home size={20} className="mb-1" />
          Home
        </Link>
        <Link to="/profile" className="flex flex-col items-center text-xs">
          <User size={20} className="mb-1" />
          Profile
        </Link>
        <Link to="/bookmarks" className="flex flex-col items-center text-xs">
          <Bookmark size={20} className="mb-1" />
          Bookmarks
        </Link>
        <Link to="/reviews" className="flex flex-col items-center text-xs">
          <Star size={20} className="mb-1" />
          Reviews
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
