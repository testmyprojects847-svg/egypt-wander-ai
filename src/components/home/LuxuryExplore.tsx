import { motion } from 'framer-motion';

const destinations = [
  {
    name: 'Ancient Wonders',
    subtitle: 'Discover the timeless and ancient temples',
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800&q=90',
  },
  {
    name: 'Cosomolital Cairo',
    subtitle: 'Experience the bustling capital and culture',
    image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800&q=90',
  },
  {
    name: 'Red Sea Riveira',
    subtitle: 'Relax is pristine beaches and dive into marine life',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=90',
  },
];

export function LuxuryExplore() {
  return (
    <section className="bg-black py-12 px-8 md:px-16">
      {/* Thin gold separator line */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section Title - Left Aligned */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-playfair text-primary text-2xl md:text-3xl tracking-[0.2em] uppercase mb-12"
        >
          Explore
        </motion.h2>

        {/* Three Cards in Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {destinations.map((dest, index) => (
            <motion.div
              key={dest.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="group"
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
                <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                  <h3 className="font-playfair text-primary text-lg md:text-xl tracking-[0.15em] uppercase mb-2">
                    {dest.name}
                  </h3>
                  <p className="font-playfair text-primary/60 text-xs md:text-sm tracking-wider uppercase">
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
