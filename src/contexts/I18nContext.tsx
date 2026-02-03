import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Language, translations, languageConfig, TranslationKey } from '@/lib/i18n/translations';

const STORAGE_KEY = 'egypt-explorer-language';
const USD_TO_EGP_RATE = 50; // 1 USD = 50 EGP

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  isRTL: boolean;
  dir: 'ltr' | 'rtl';
  currency: string;
  currencySymbol: string;
  formatPrice: (priceEGP: number, priceUSD?: number | null) => string;
  languageConfig: typeof languageConfig;
}

const I18nContext = createContext<I18nContextType | null>(null);

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [language, setLanguageState] = useState<Language>('en');

  // Initialize from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && (stored === 'en' || stored === 'ar')) {
      setLanguageState(stored as Language);
    }
  }, []);

  // Update localStorage and document direction when language changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.dir = languageConfig[language].dir;
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const t = useCallback((key: TranslationKey | string): string => {
    const typedKey = key as TranslationKey;
    return translations[language]?.[typedKey] || translations.en[typedKey] || String(key);
  }, [language]);

  const isRTL = language === 'ar';
  const dir = languageConfig[language].dir;
  const currency = languageConfig[language].currency;
  const currencySymbol = languageConfig[language].currencySymbol;

  const formatPrice = useCallback((priceEGP: number, priceUSD?: number | null): string => {
    if (language === 'ar') {
      // Arabic: Show EGP
      return `${priceEGP.toLocaleString('ar-EG')} ${currencySymbol}`;
    } else {
      // English: Show USD
      const usdPrice = priceUSD ?? Math.round(priceEGP / USD_TO_EGP_RATE);
      return `${currencySymbol}${usdPrice.toLocaleString('en-US')}`;
    }
  }, [language, currencySymbol]);

  const value: I18nContextType = {
    language,
    setLanguage,
    t,
    isRTL,
    dir,
    currency,
    currencySymbol,
    formatPrice,
    languageConfig,
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
