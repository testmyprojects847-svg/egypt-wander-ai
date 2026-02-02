import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import ankhLogo from '@/assets/ankh-logo.png';
import { useI18n } from '@/contexts/I18nContext';

export function LuxuryFooter() {
  const { t, isRTL } = useI18n();

  return (
    <footer className="bg-black py-10 px-6 md:px-16">
      {/* Thin gold separator line */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>

      <div className={`max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
        {/* Ankh Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <img src={ankhLogo} alt="Egypt Explorer" className="w-7 h-7 object-contain" />
        </motion.div>

        {/* Copyright - Center */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-playfair text-primary/60 text-xs tracking-[0.15em] uppercase"
        >
          © 2026 Egypt Explorer. {t('allRightsReserved')}.
        </motion.p>

        {/* Social Icons */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <a
            href="#facebook"
            className="w-8 h-8 rounded-full bg-primary/80 flex items-center justify-center text-black hover:bg-primary transition-colors"
          >
            <Facebook className="w-3.5 h-3.5" />
          </a>
          <a
            href="#twitter"
            className="w-8 h-8 rounded-full bg-primary/80 flex items-center justify-center text-black hover:bg-primary transition-colors"
          >
            <Twitter className="w-3.5 h-3.5" />
          </a>
          <a
            href="#instagram"
            className="w-8 h-8 rounded-full bg-primary/80 flex items-center justify-center text-black hover:bg-primary transition-colors"
          >
            <Instagram className="w-3.5 h-3.5" />
          </a>
        </motion.div>
      </div>
    </footer>
  );
}
