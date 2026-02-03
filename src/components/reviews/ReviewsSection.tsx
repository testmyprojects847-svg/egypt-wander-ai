import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReviewCard } from './ReviewCard';
import { ReviewModal } from './ReviewModal';
import { useReviews } from '@/hooks/useReviews';
import { useI18n } from '@/contexts/I18nContext';

// Scarab icon component
function ScarabIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 64 64" 
      className={className}
      fill="currentColor"
    >
      <ellipse cx="32" cy="32" rx="14" ry="18" className="fill-primary" />
      <ellipse cx="32" cy="24" rx="8" ry="6" className="fill-primary/80" />
      <path d="M18 32 C10 28, 4 20, 8 14 L18 24 Z" className="fill-primary" />
      <path d="M46 32 C54 28, 60 20, 56 14 L46 24 Z" className="fill-primary" />
      <path d="M18 32 C8 36, 2 46, 10 52 L20 40 Z" className="fill-primary" />
      <path d="M46 32 C56 36, 62 46, 54 52 L44 40 Z" className="fill-primary" />
      <path d="M24 48 C22 56, 28 62, 32 62 C36 62, 42 56, 40 48 L32 52 Z" className="fill-primary" />
      <circle cx="28" cy="22" r="2" className="fill-black" />
      <circle cx="36" cy="22" r="2" className="fill-black" />
    </svg>
  );
}

// Sample reviews for initial display
const sampleReviews = [
  {
    id: '1',
    customer_name: 'Sarah K',
    rating: 5,
    comment: 'An unforgettable experience! The pyramids at sunset were absolutely breathtaking. Our guide was incredibly knowledgeable.',
    country_code: 'US',
    verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    customer_name: 'David M',
    rating: 5,
    comment: 'The Nile cruise exceeded all expectations. Every detail was perfect, from the accommodations to the temple visits.',
    country_code: 'GB',
    verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    customer_name: 'Lisa M',
    rating: 5,
    comment: 'A truly magical journey through ancient Egypt. The attention to detail and luxury service was outstanding.',
    country_code: 'DE',
    verified: true,
    created_at: new Date().toISOString(),
  },
];

export function ReviewsSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const { reviews: dbReviews, isLoading } = useReviews();
  const { t, isRTL } = useI18n();

  // Combine sample reviews with database reviews
  const allReviews = dbReviews.length > 0 ? dbReviews : sampleReviews;

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 360;
      const actualDirection = isRTL 
        ? (direction === 'left' ? 'right' : 'left') 
        : direction;
      scrollContainerRef.current.scrollBy({
        left: actualDirection === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScrollButtons, 300);
    }
  };

  return (
    <section className="bg-black py-16 md:py-24 px-6 md:px-16 relative">
      {/* Top separator line */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10"
        >
          {/* Title with Scarab */}
          <div className="flex items-center gap-4">
            <ScarabIcon className="w-10 h-10 text-primary" />
            <h2 className="font-playfair text-primary text-xl md:text-2xl tracking-[0.2em] uppercase">
              {t('whatTravelersSay')}
            </h2>
          </div>

          {/* Write a Review Button */}
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-black font-semibold px-6 py-2 hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all"
          >
            {t('writeReview')}
          </Button>
        </motion.div>

        {/* Cards Container */}
        <div className="relative px-8 md:px-12">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`absolute ${isRTL ? 'right-0' : 'left-0'} top-1/2 -translate-y-1/2 z-10 p-2 transition-all ${
              canScrollLeft
                ? 'text-primary hover:text-primary/80'
                : 'text-primary/30 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-8 h-8" strokeWidth={1} />
          </button>

          <div
            ref={scrollContainerRef}
            onScroll={checkScrollButtons}
            className="flex gap-6 overflow-x-auto scrollbar-hide py-4"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {isLoading ? (
              // Loading skeletons
              [...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-[300px] md:w-[340px] h-[160px] bg-primary/5 border border-primary/20 rounded-lg animate-pulse"
                />
              ))
            ) : (
              allReviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <ReviewCard review={review} />
                </motion.div>
              ))
            )}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`absolute ${isRTL ? 'left-0 -translate-x-4' : 'right-0 translate-x-4'} top-1/2 -translate-y-1/2 z-10 p-2 transition-all ${
              canScrollRight
                ? 'text-primary hover:text-primary/80'
                : 'text-primary/30 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-8 h-8" strokeWidth={1} />
          </button>
        </div>

        {/* Decorative diamond */}
        <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'} mt-8`}>
          <div className="w-4 h-4 bg-primary rotate-45" />
        </div>
      </div>

      {/* Bottom separator line */}
      <div className="max-w-7xl mx-auto mt-12">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>

      {/* Review Modal */}
      <ReviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
