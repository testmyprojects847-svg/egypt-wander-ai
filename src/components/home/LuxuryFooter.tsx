import { motion } from 'framer-motion';
import { Facebook, Twitter, Camera } from 'lucide-react';

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

export function LuxuryFooter() {
  return (
    <footer className="bg-black py-16 px-8 md:px-16">
      {/* Thin gold separator line */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Ankh Logo - Left */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-primary"
        >
          <AnkhIcon className="w-7 h-7" />
        </motion.div>

        {/* Copyright - Center */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-playfair text-primary/60 text-sm tracking-[0.15em] uppercase"
        >
          © 2026 Egypt Explorer. All Socillit The Reserved.
        </motion.p>

        {/* Social Icons - Right */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-4"
        >
          <a
            href="#facebook"
            className="w-10 h-10 rounded-full bg-primary/80 flex items-center justify-center text-black hover:bg-primary transition-colors"
          >
            <Facebook className="w-4 h-4" />
          </a>
          <a
            href="#twitter"
            className="w-10 h-10 rounded-full bg-primary/80 flex items-center justify-center text-black hover:bg-primary transition-colors"
          >
            <Twitter className="w-4 h-4" />
          </a>
          <a
            href="#instagram"
            className="w-10 h-10 rounded-full bg-primary/80 flex items-center justify-center text-black hover:bg-primary transition-colors"
          >
            <Camera className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </footer>
  );
}
