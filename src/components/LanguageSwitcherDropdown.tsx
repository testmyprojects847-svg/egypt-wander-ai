import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { useGlobalLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/lib/translations';

export function LanguageSwitcherDropdown() {
  const { language, setLanguage, languageNames, languageFlags } = useGlobalLanguage();
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

  const languages = Object.keys(languageNames) as Language[];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="language-pill"
      >
        <Globe className="w-4 h-4 text-primary" />
        <span className="text-primary font-playfair text-sm tracking-wider">
          {languageFlags[language]} {language.toUpperCase()}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-primary/70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-black/95 backdrop-blur-md border border-primary/30 rounded-lg overflow-hidden shadow-lg z-50 min-w-[160px] animate-fade-in">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => {
                setLanguage(lang);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-200 ${
                language === lang
                  ? 'bg-primary/20 text-primary'
                  : 'text-primary/70 hover:bg-primary/10 hover:text-primary'
              }`}
            >
              <span className="text-base">{languageFlags[lang]}</span>
              <span className="font-playfair text-sm tracking-wider">{languageNames[lang]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}