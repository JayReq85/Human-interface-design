
import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  setRating?: (rating: number) => void;
  readOnly?: boolean;
}

const StarRating = ({ rating, setRating, readOnly = false }: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState<number>(0);

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={readOnly ? 18 : 24}
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
