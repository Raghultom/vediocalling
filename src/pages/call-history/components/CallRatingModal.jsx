import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CallRatingModal = ({ 
  isOpen, 
  onClose, 
  call, 
  onSubmitRating 
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStarClick = (starRating) => {
    setRating(starRating);
  };

  const handleStarHover = (starRating) => {
    setHoveredRating(starRating);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    setIsSubmitting(true);
    try {
      await onSubmitRating({
        callId: call?.id,
        rating,
        feedback: feedback?.trim()
      });
      onClose();
      // Reset form
      setRating(0);
      setFeedback('');
    } catch (error) {
      console.error('Failed to submit rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingText = (ratingValue) => {
    switch (ratingValue) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return 'Select Rating';
    }
  };

  if (!isOpen || !call) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-300" onClick={onClose} />
      {/* Modal */}
      <div className="fixed inset-0 z-310 flex items-center justify-center p-4">
        <div className="bg-card rounded-lg shadow-elevation w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Rate Call</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              iconName="X"
              iconSize={20}
            />
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Participant Info */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Icon name="User" size={20} className="text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">{call?.participant?.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {call?.participant?.business || call?.participant?.role}
                </p>
              </div>
            </div>

            {/* Rating Stars */}
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground mb-3">How was your call experience?</p>
              <div className="flex items-center justify-center space-x-2 mb-2">
                {[1, 2, 3, 4, 5]?.map((star) => (
                  <button
                    key={star}
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => handleStarHover(star)}
                    onMouseLeave={handleStarLeave}
                    className="p-1 transition-micro"
                  >
                    <Icon
                      name="Star"
                      size={32}
                      className={`transition-micro ${
                        star <= (hoveredRating || rating)
                          ? 'text-warning fill-current' :'text-muted-foreground'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm font-medium text-foreground">
                {getRatingText(hoveredRating || rating)}
              </p>
            </div>

            {/* Feedback */}
            <div className="mb-6">
              <Input
                label="Additional Feedback (Optional)"
                type="text"
                placeholder="Share your thoughts about the call..."
                value={feedback}
                onChange={(e) => setFeedback(e?.target?.value)}
                className="resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3">
              <Button
                variant="ghost"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleSubmit}
                disabled={rating === 0 || isSubmitting}
                loading={isSubmitting}
              >
                Submit Rating
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CallRatingModal;