import React from 'react';
import { Star } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const RatingStars = ({ rating, max = 5, size = 16, onRate, className }) => {
  return (
    <div className={twMerge('flex items-center gap-1', className)}>
      {[...Array(max)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;
        
        return (
          <button
            key={index}
            type="button"
            disabled={!onRate}
            onClick={() => onRate?.(starValue)}
            className={twMerge(
              'transition-colors duration-200 focus:outline-none',
              onRate ? 'hover:scale-110 active:scale-95 cursor-pointer' : 'cursor-default'
            )}
          >
            <Star
              size={size}
              className={twMerge(
                isFilled ? 'fill-accent text-accent' : 'text-gray-300'
              )}
            />
          </button>
        );
      })}
      {!onRate && rating > 0 && (
        <span className="ml-2 text-sm font-medium text-gray-600">{rating.toFixed(1)}</span>
      )}
    </div>
  );
};

export default RatingStars;
