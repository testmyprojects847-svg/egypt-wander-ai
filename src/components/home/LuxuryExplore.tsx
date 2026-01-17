import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';

const destinations = [
  {
    name: 'Ancient Wonders',
    subtitle: 'Discover the timeless and ancient temples',
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800&q=90',
  },
  {
    name: 'Cosmopolitan Cairo',
    subtitle: 'Experience the bustling capital and culture',
    image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800&q=90',
  },
  {
    name: 'Red Sea Riviera',
    subtitle: 'Relax in pristine beaches and dive into marine life',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=90',
  },
];

export function LuxuryExplore() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScrollButtons, 300);
    }
  };

  return (
    <section className="bg-black py-8 px-6 md:px-16">
      {/* Thin gold separator line */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section Header with Navigation */}
        <div className="flex items-center justify-between mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-playfair text-primary text-xl md:text-2xl tracking-[0.2em] uppercase"
          >
            Explore
          </motion.h2>

          {/* Scroll Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-2 rounded-full border transition-colors ${
                canScrollLeft
                  ? 'border-primary/50 text-primary hover:bg-primary/10'
                  : 'border-primary/20 text-primary/30 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-2 rounded-full border transition-colors ${
                canScrollRight
                  ? 'border-primary/50 text-primary hover:bg-primary/10'
                  : 'border-primary/20 text-primary/30 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontally Scrollable Cards */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollButtons}
          className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 -mx-6 px-6 md:mx-0 md:px-0"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {destinations.map((dest, index) => (
            <motion.div
              key={dest.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="group flex-shrink-0 w-[280px] md:w-[320px]"
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* Card with thin gold border */}
              <div className="relative overflow-hidden border border-primary/50 aspect-[4/3]">
                {/* Image */}
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Gradient Overlay - Only at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Text Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 text-center">
                  <h3 className="font-playfair text-primary text-base md:text-lg tracking-[0.15em] uppercase mb-1.5">
                    {dest.name}
                  </h3>
                  <p className="font-playfair text-primary/60 text-xs tracking-wider uppercase">
                    {dest.subtitle}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
