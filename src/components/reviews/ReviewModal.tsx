import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { useReviews, type NewReview } from '@/hooks/useReviews';

// Country options for dropdown
const countries = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'RU', name: 'Russia' },
  { code: 'CN', name: 'China' },
  { code: 'JP', name: 'Japan' },
  { code: 'PT', name: 'Portugal' },
  { code: 'BR', name: 'Brazil' },
  { code: 'EG', name: 'Egypt' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'AE', name: 'UAE' },
  { code: 'AU', name: 'Australia' },
  { code: 'CA', name: 'Canada' },
];

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReviewModal({ isOpen, onClose }: ReviewModalProps) {
  const { submitReview } = useReviews();
  const [formData, setFormData] = useState({
    name: '',
    emailOrPhone: '',
    comment: '',
    countryCode: 'US',
  });
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name || !formData.comment || rating === 0) {
      return;
    }

    setIsSubmitting(true);

    // Determine if emailOrPhone is email or phone
    const isEmail = formData.emailOrPhone.includes('@');
    const newReview: NewReview = {
      customer_name: formData.name,
      rating,
      comment: formData.comment,
      country_code: formData.countryCode,
      email: isEmail ? formData.emailOrPhone : undefined,
      phone: !isEmail && formData.emailOrPhone ? formData.emailOrPhone : undefined,
    };

    try {
      await submitReview.mutateAsync(newReview);
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', emailOrPhone: '', comment: '', countryCode: 'US' });
    setRating(0);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-black border-2 border-primary/60 max-w-md p-0 overflow-hidden">
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary" />

        <div className="p-6 pt-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-center font-playfair text-2xl text-primary tracking-wide">
              Share Your Experience
            </DialogTitle>
            <p className="text-center text-primary/60 text-sm mt-1">
              Share More Tales
            </p>
          </DialogHeader>

          <div className="space-y-4">
            {/* Name Input */}
            <Input
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-transparent border-primary/40 text-primary placeholder:text-primary/40 focus:border-primary h-12"
            />

            {/* Email/Phone Input */}
            <Input
              placeholder="Email/Phone"
              value={formData.emailOrPhone}
              onChange={(e) => setFormData({ ...formData, emailOrPhone: e.target.value })}
              className="bg-transparent border-primary/40 text-primary placeholder:text-primary/40 focus:border-primary h-12"
            />

            {/* Country Select */}
            <select
              value={formData.countryCode}
              onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
              className="w-full bg-transparent border border-primary/40 text-primary h-12 px-3 rounded-md focus:border-primary focus:outline-none"
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code} className="bg-black">
                  {country.name}
                </option>
              ))}
            </select>

            {/* Comment Textarea */}
            <Textarea
              placeholder="Your Comment"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              className="bg-transparent border-primary/40 text-primary placeholder:text-primary/40 focus:border-primary min-h-[100px] resize-none"
            />

            {/* Star Rating */}
            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? 'fill-primary text-primary'
                        : 'fill-primary/20 text-primary/40'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.name || !formData.comment || rating === 0}
                className="flex-1 bg-gradient-to-r from-primary via-primary/90 to-primary text-black font-semibold h-12 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </Button>
              <Button
                onClick={handleClose}
                variant="outline"
                className="flex-1 border-primary/50 text-primary bg-transparent hover:bg-primary/10 h-12"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
