import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { LuxuryNavbar } from '@/components/home/LuxuryNavbar';
import { LuxuryFooter } from '@/components/home/LuxuryFooter';
import pharaohMask from '@/assets/pharaoh-mask.png';
import nefertitiBust from '@/assets/nefertiti-bust.png';

const AboutPage = () => {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <LuxuryNavbar />

      <section className="py-16 md:py-24 px-8 md:px-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="font-playfair text-primary text-3xl md:text-5xl tracking-[0.2em] uppercase mb-6">
              About Us
            </h1>
            <p className="font-playfair text-primary/70 text-sm md:text-base tracking-wider max-w-2xl mx-auto">
              Discover the story behind Egypt Explorer and our passion for sharing the wonders of ancient and modern Egypt
            </p>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img
                src={pharaohMask}
                alt="King Tutankhamun"
                className="w-full max-w-sm mx-auto"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <h2 className="font-playfair text-primary text-2xl tracking-[0.15em] uppercase">
                Our Mission
              </h2>
              <p className="font-playfair text-primary/70 leading-relaxed">
                Egypt Explorer was founded with a singular vision: to provide travelers with authentic, immersive experiences that reveal the true essence of Egypt. From the towering pyramids of Giza to the serene waters of the Nile, we curate journeys that connect you with 5,000 years of history and culture.
              </p>
              <p className="font-playfair text-primary/70 leading-relaxed">
                Our team of expert Egyptologists, local guides, and travel specialists work together to create unforgettable adventures. We believe that travel should be transformative, educational, and deeply personal.
              </p>
            </motion.div>
          </div>

          {/* Second Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6 order-2 lg:order-1"
            >
              <h2 className="font-playfair text-primary text-2xl tracking-[0.15em] uppercase">
                Why Choose Us
              </h2>
              <ul className="space-y-4">
                {[
                  "Expert local guides with deep historical knowledge",
                  "Exclusive access to hidden gems and private sites",
                  "Luxury accommodations with authentic Egyptian hospitality",
                  "Small group tours for personalized experiences",
                  "24/7 support throughout your journey"
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <span className="w-2 h-2 bg-primary rounded-full" />
                    <span className="font-playfair text-primary/70">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2"
            >
              <img
                src={nefertitiBust}
                alt="Nefertiti"
                className="w-full max-w-sm mx-auto"
              />
            </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-20 border border-primary/30 p-10"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: "15+", label: "Years Experience" },
                { number: "50K+", label: "Happy Travelers" },
                { number: "100+", label: "Unique Tours" },
                { number: "4.9", label: "Average Rating" }
              ].map((stat, index) => (
                <div key={index}>
                  <p className="font-playfair text-primary text-3xl md:text-4xl tracking-wider mb-2">
                    {stat.number}
                  </p>
                  <p className="font-playfair text-primary/60 text-xs tracking-wider uppercase">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <LuxuryFooter />
    </div>
  );
};

export default AboutPage;
