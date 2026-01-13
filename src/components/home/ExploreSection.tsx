import { motion } from 'framer-motion';

const destinations = [
  {
    name: 'Ancient Wonders',
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600',
  },
  {
    name: 'Cosmopolitan Cairo',
    image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=600',
  },
  {
    name: 'Red Sea Riviera',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600',
  },
];

export function ExploreSection() {
  return (
    <section className="bg-black py-16 px-8 md:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-serif italic text-primary mb-10"
        >
          Explore Modern Egypt
        </motion.h2>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {destinations.map((destination, index) => (
            <motion.div
              key={destination.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group cursor-pointer"
            >
              {/* Card with gold border */}
              <div className="relative overflow-hidden rounded-lg border-2 border-primary/60">
                {/* Inner border for luxury effect */}
                <div className="absolute inset-1 border border-primary/30 rounded pointer-events-none z-10" />
                
                {/* Image */}
                <div className="relative h-56 md:h-64 overflow-hidden">
                  <motion.img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Destination Name */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-primary text-lg md:text-xl font-serif text-center">
                      {destination.name}
                    </h3>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-20 pt-8 border-t border-primary/20"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Ankh Logo */}
          <div className="text-primary">
            <svg viewBox="0 0 24 32" fill="currentColor" className="w-6 h-6">
              <path d="M12 0C8.5 0 5.5 2.5 5.5 6.5C5.5 9 6.5 11 8 12.5L8 14L5 14L5 18L8 18L8 32L16 32L16 18L19 18L19 14L16 14L16 12.5C17.5 11 18.5 9 18.5 6.5C18.5 2.5 15.5 0 12 0ZM12 4C13.5 4 14.5 5.2 14.5 6.5C14.5 7.8 13.5 9 12 9C10.5 9 9.5 7.8 9.5 6.5C9.5 5.2 10.5 4 12 4Z"/>
            </svg>
          </div>

          {/* Copyright */}
          <p className="text-primary/60 text-sm">
            © 2024 Egypt Explorer. All Rights Reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {['facebook', 'twitter', 'instagram'].map((social) => (
              <motion.a
                key={social}
                href={`#${social}`}
                whileHover={{ scale: 1.2, y: -2 }}
                className="w-8 h-8 rounded-full border border-primary/60 flex items-center justify-center text-primary hover:bg-primary hover:text-black transition-colors"
              >
                {social === 'facebook' && <span className="text-xs font-bold">f</span>}
                {social === 'twitter' && <span className="text-xs font-bold">𝕏</span>}
                {social === 'instagram' && <span className="text-xs font-bold">📷</span>}
              </motion.a>
            ))}
          </div>

          {/* Decorative Star */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="text-muted-foreground/30"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
              <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" />
            </svg>
          </motion.div>
        </div>
      </motion.footer>
    </section>
  );
}
