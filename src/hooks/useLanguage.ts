import { useState, useEffect, useCallback } from 'react';
import { Language, translations } from '@/lib/translations';

const STORAGE_KEY = 'egypt-tours-language';

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && ['en', 'ar', 'de', 'fr', 'es'].includes(stored)) {
        return stored as Language;
      }
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    // Set RTL for Arabic
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const t = useCallback((key: keyof typeof translations.en): string => {
    return translations[language][key] || translations.en[key] || key;
  }, [language]);

  return { language, setLanguage, t };
}
