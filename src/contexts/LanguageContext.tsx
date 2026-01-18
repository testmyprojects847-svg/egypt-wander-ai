import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
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

const LanguageContext = createContext<LanguageContextType | null>(null);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('en');

  // Initialize from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && ['en', 'ar', 'fr', 'de', 'es', 'it', 'ru', 'zh', 'ja', 'pt'].includes(stored)) {
      setLanguageState(stored as Language);
    }
  }, []);

  const isRTL = language === 'ar';

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const t = useCallback((key: keyof typeof translations.en): string => {
    return translations[language]?.[key] || translations.en[key] || String(key);
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    languageNames,
    languageFlags,
    isRTL,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useGlobalLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useGlobalLanguage must be used within a LanguageProvider');
  }
  return context;
}
