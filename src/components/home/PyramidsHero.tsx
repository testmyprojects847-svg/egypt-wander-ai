import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Globe, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Ankh SVG Component
const AnkhIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 32" 
    fill="currentColor" 
    className={className}
  >
    <path d="M12 0C8.5 0 5.5 2.5 5.5 6.5C5.5 9 6.5 11 8 12.5L8 14L5 14L5 18L8 18L8 32L16 32L16 18L19 18L19 14L16 14L16 12.5C17.5 11 18.5 9 18.5 6.5C18.5 2.5 15.5 0 12 0ZM12 4C13.5 4 14.5 5.2 14.5 6.5C14.5 7.8 13.5 9 12 9C10.5 9 9.5 7.8 9.5 6.5C9.5 5.2 10.5 4 12 4Z"/>
  </svg>
);

export function PyramidsHero() {
  return (
    <section className="relative min-h-[85vh] bg-black overflow-hidden">
      {/* Decorative Gold Border Frame */}
      <div className="absolute inset-4 md:inset-8 pointer-events-none z-20">
        <div className="absolute inset-0 border-2 border-primary/60 rounded-lg" />
        <div className="absolute inset-2 border border-primary/30 rounded-lg" />
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg" />
      </div>

      {/* Navigation Bar */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute top-0 left-0 right-0 z-50 px-8 md:px-16 py-6"
      >
        <div className="flex items-center justify-between">
          {/* Ankh Logo */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="text-primary"
          >
            <AnkhIcon className="w-8 h-8 md:w-10 md:h-10" />
          </motion.div>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center gap-12">
            {['Home', 'Tours', 'About Us', 'Contact Us'].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Link 
                  to={item === 'Home' ? '/' : item === 'Tours' ? '/tours' : `#${item.toLowerCase().replace(' ', '-')}`}
                  className="text-primary hover:text-primary-light transition-colors font-medium tracking-wide"
                >
                  {item}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              className="text-primary hover:text-primary-light transition-colors"
            >
              <Globe className="w-6 h-6" />
            </motion.button>
            <motion.div
              whileHover={{ scale: 1.05 }}
            >
              <Button 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary hover:text-black rounded-full px-6"
              >
                Log In
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Main Hero Content */}
      <div className="relative h-full flex items-center justify-center pt-20 pb-10 px-12 md:px-20">
        {/* Pyramids Image Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-5xl mx-auto"
        >
          {/* Decorative inner gold frame for image */}
          <div className="absolute -inset-2 border-2 border-primary/50 rounded-lg" />
          <div className="absolute -inset-4 border border-primary/20 rounded-lg" />
          
          {/* Main Pyramids Image */}
          <div className="relative rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1920&q=90"
              alt="Great Pyramids of Giza with Camel Caravan"
              className="w-full h-[50vh] md:h-[60vh] object-cover"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            
            {/* Center Text Overlay */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-center px-8 py-6 bg-black/60 backdrop-blur-sm border border-primary/50 rounded-lg">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-primary tracking-wider mb-2">
                  EXPLORE MODERN EGYPT
                </h1>
                <p className="text-primary/80 text-lg md:text-xl tracking-wide">
                  Unlock Ancient Mysteries & Contemporary Wonders
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Decorative Star/Sparkle in corner */}
      <motion.div
        animate={{ 
          rotate: [0, 180, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-8 right-12 text-muted-foreground/50"
      >
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
          <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" />
        </svg>
      </motion.div>

      {/* Ankh in Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-8 left-12 text-primary/60"
      >
        <AnkhIcon className="w-6 h-6" />
      </motion.div>
    </section>
  );
}
