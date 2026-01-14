import { motion } from 'framer-motion';
import { Facebook, Twitter, Camera } from 'lucide-react';
import ankhLogo from '@/assets/ankh-logo.png';

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
        >
          <img src={ankhLogo} alt="Egypt Explorer" className="w-8 h-8 object-contain" />
        </motion.div>

        {/* Copyright - Center */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-playfair text-primary/60 text-sm tracking-[0.15em] uppercase"
        >
          © 2026 Egypt Explorer. All Rights Reserved.
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
