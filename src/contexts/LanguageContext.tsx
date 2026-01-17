import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, translations, languageNames, languageFlags } from '@/lib/translations';

const STORAGE_KEY = 'egypt-explorer-language';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
  languageNames: typeof languageNames;
  languageFlags: typeof languageFlags;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && ['en', 'ar', 'de', 'fr', 'es'].includes(stored)) {
        return stored as Language;
      }
    }
    return 'en';
  });

  const isRTL = language === 'ar';

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const t = useCallback((key: keyof typeof translations.en): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t, 
      languageNames, 
      languageFlags,
      isRTL 
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useGlobalLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useGlobalLanguage must be used within a LanguageProvider');
  }
  return context;
}
