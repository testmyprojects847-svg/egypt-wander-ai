import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useGlobalLanguage } from '@/contexts/LanguageContext';

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

  const languages = Object.keys(languageNames) as Array<keyof typeof languageNames>;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-primary hover:text-primary-light transition-colors px-2 py-1"
      >
        <span className="text-sm">{languageFlags[language]}</span>
        <span className="text-xs font-playfair tracking-wider uppercase">{language.toUpperCase()}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-black border border-primary/30 rounded-lg overflow-hidden shadow-lg z-50 min-w-[140px]">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => {
                setLanguage(lang);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-4 py-2.5 text-left transition-colors ${
                language === lang
                  ? 'bg-primary/20 text-primary'
                  : 'text-primary/70 hover:bg-primary/10 hover:text-primary'
              }`}
            >
              <span className="text-sm">{languageFlags[lang]}</span>
              <span className="text-xs font-playfair tracking-wider">{languageNames[lang]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
