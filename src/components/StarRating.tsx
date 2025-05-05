
import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  setRating?: (rating: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
}

const StarRating = ({ rating, setRating, readOnly = false, size = "md" }: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState<number>(0);

  // Determine star size based on the size prop
  const getStarSize = () => {
    switch(size) {
      case "sm": return 16;
      case "lg": return 28;
      case "md":
      default: return 24;
    }
  };

  const starSize = readOnly ? (size === "sm" ? 16 : 18) : getStarSize();

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={starSize}
          className={`${
            (hoverRating || rating) >= star ? "text-yellow-400" : "text-gray-300"
          } ${!readOnly && "cursor-pointer"} mx-0.5`}
          fill={(hoverRating || rating) >= star ? "currentColor" : "none"}
          onClick={() => !readOnly && setRating && setRating(star)}
          onMouseEnter={() => !readOnly && setHoverRating(star)}
          onMouseLeave={() => !readOnly && setHoverRating(0)}
        />
      ))}
    </div>
  );
};

export default StarRating;
