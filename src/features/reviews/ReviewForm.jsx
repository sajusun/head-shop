import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addReview } from './reviewSlice';
import Button from '../../components/Button';
import RatingStars from '../../components/RatingStars';

const ReviewForm = ({ productId }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    dispatch(addReview({
      productId,
      userId: user.id,
      userName: user.name,
      rating,
      comment,
    }));

    setComment('');
    setRating(5);
  };

  if (!user) {
    return (
      <div className="bg-gray-50 border border-dashed border-gray-300 p-6 rounded-2xl text-center">
        <p className="text-gray-600 mb-2">Please login to write a review</p>
        <Button variant="outline" size="sm">Login</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
      <h3 className="text-lg font-bold text-text mb-4">Write a Review</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
        <RatingStars rating={rating} onRate={setRating} size={24} />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Your Comment</label>
        <textarea
          rows="4"
          className="w-full border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          placeholder="What did you think about this product?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full">Submit Review</Button>
    </form>
  );
};

export default ReviewForm;
