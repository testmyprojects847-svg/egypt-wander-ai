import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { Language } from '@/lib/i18n/translations';

export function LanguageSwitcherPremium() {
  const { language, setLanguage, languageConfig, isRTL } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages = Object.entries(languageConfig) as [Language, typeof languageConfig.en][];
  const currentConfig = languageConfig[language];

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/40 bg-black/60 backdrop-blur-sm transition-all duration-300 hover:border-primary hover:shadow-[0_0_15px_hsla(42,70%,52%,0.2)]"
      >
        <span className="text-sm">{currentConfig.flag}</span>
        <span className="font-playfair text-primary text-xs tracking-wider uppercase">
          {language === 'en' ? 'EN' : 'عربي'}
        </span>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-3 h-3 text-primary/70"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`absolute top-full mt-2 bg-black/95 backdrop-blur-md border border-primary/30 rounded-lg overflow-hidden shadow-lg z-50 min-w-[140px] ${
              isRTL ? 'left-0' : 'right-0'
            }`}
          >
            {languages.map(([lang, config]) => (
              <motion.button
                key={lang}
                whileHover={{ x: isRTL ? -4 : 4 }}
                onClick={() => handleLanguageChange(lang)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-${isRTL ? 'right' : 'left'} transition-all duration-200 ${
                  language === lang
                    ? 'bg-primary/20 text-primary'
                    : 'text-primary/70 hover:bg-primary/10 hover:text-primary'
                }`}
              >
                <span className="text-base">{config.flag}</span>
                <span className="font-playfair text-sm tracking-wider">{config.nativeName}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
