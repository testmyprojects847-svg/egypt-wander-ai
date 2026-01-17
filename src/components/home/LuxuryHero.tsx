import { motion } from 'framer-motion';
import pharaohMask from '@/assets/pharaoh-mask.png';
import nefertitiBust from '@/assets/nefertiti-bust.png';

export function LuxuryHero() {
  return (
    <section className="bg-black py-10 md:py-14 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
          {/* Pharaoh Image - Left */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 flex justify-center md:justify-start"
          >
            <div className="relative w-48 md:w-64 lg:w-72 h-60 md:h-72 lg:h-80">
              <img
                src={pharaohMask}
                alt="King Tutankhamun Golden Mask"
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>

          {/* Center Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 text-center py-4"
          >
            <h1 className="font-playfair text-primary tracking-[0.25em] leading-[1.15]">
              <span className="block text-3xl md:text-4xl lg:text-5xl xl:text-6xl">EXPLORE</span>
              <span className="block text-3xl md:text-4xl lg:text-5xl xl:text-6xl">MODERN</span>
              <span className="block text-3xl md:text-4xl lg:text-5xl xl:text-6xl">EGYPT</span>
            </h1>
            <div className="mt-6">
              <p className="font-playfair text-primary/70 text-xs md:text-sm tracking-[0.15em] uppercase">
                Unlock Ancient Mysteries &
              </p>
              <p className="font-playfair text-primary/70 text-xs md:text-sm tracking-[0.15em] uppercase">
                Contemporary Wonders
              </p>
            </div>
          </motion.div>

          {/* Nefertiti Image - Right */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 flex justify-center md:justify-end"
          >
            <div className="relative w-48 md:w-64 lg:w-72 h-60 md:h-72 lg:h-80">
              <img
                src={nefertitiBust}
                alt="Nefertiti Bust"
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
