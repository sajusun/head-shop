import React, { useState } from 'react';
import { User, CornerDownRight, Trash2 } from 'lucide-react';
import RatingStars from '../../components/RatingStars';
import Button from '../../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { addReply } from './reviewSlice';

const ReviewItem = ({ review }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handleReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    
    dispatch(addReply({ 
      reviewId: review.id, 
      replyData: { userName: user?.name || 'Guest', comment: replyText } 
    }));
    setReplyText('');
    setShowReplyForm(false);
  };

  return (
    <div className="py-6 border-b border-gray-100 last:border-0">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <User size={20} />
          </div>
          <div>
            <h4 className="font-bold text-text">{review.userName}</h4>
            <span className="text-xs text-gray-400">{review.date}</span>
          </div>
        </div>
        <RatingStars rating={review.rating} size={14} />
      </div>
      
      <p className="text-gray-600 mb-4 ml-13">
        {review.comment}
      </p>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 ml-13 mb-4">
        <button 
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="text-sm font-medium text-primary hover:underline focus:outline-none"
        >
          Reply
        </button>
      </div>

      {/* Reply Form */}
      {showReplyForm && (
        <form onSubmit={handleReply} className="ml-13 mb-6 bg-gray-50 p-4 rounded-xl">
          <textarea
            className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            placeholder="Write a reply..."
            rows="2"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <div className="flex justify-end gap-2 mt-2">
            <Button size="sm" variant="ghost" onClick={() => setShowReplyForm(false)}>Cancel</Button>
            <Button size="sm" type="submit">Post Reply</Button>
          </div>
        </form>
      )}

      {/* Replies */}
      {review.replies && review.replies.length > 0 && (
        <div className="ml-13 space-y-4">
          {review.replies.map((reply) => (
            <div key={reply.id} className="flex gap-3 bg-gray-50 p-4 rounded-xl">
              <CornerDownRight size={16} className="text-gray-400 shrink-0 mt-1" />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h5 className="text-sm font-bold text-text">{reply.userName}</h5>
                  <span className="text-[10px] text-gray-400">{reply.date}</span>
                </div>
                <p className="text-sm text-gray-600">{reply.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewItem;
