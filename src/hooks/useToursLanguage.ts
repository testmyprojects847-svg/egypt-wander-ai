import { useState, useEffect, useCallback } from 'react';
import { ToursLanguage, toursTranslations } from '@/lib/toursTranslations';

const STORAGE_KEY = 'tours_lang';

export function useToursLanguage() {
  const [language, setLanguageState] = useState<ToursLanguage>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && Object.keys(toursTranslations).includes(stored)) {
        return stored as ToursLanguage;
      }
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const setLanguage = useCallback((lang: ToursLanguage) => {
    setLanguageState(lang);
  }, []);

  const t = useCallback((key: string): string => {
    return toursTranslations[language][key] || toursTranslations.en[key] || key;
  }, [language]);

  const isRTL = language === 'ar';

  return { language, setLanguage, t, isRTL };
}
