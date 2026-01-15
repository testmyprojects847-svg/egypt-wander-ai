import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ToursLanguage, toursLanguageNames, toursLanguageFlags } from '@/lib/toursTranslations';

interface ToursLanguageSwitcherProps {
  language: ToursLanguage;
  onLanguageChange: (lang: ToursLanguage) => void;
}

const languages: ToursLanguage[] = ['en', 'ar', 'fr', 'de', 'es', 'it', 'ru', 'tr', 'zh-CN', 'ja'];

export function ToursLanguageSwitcher({ language, onLanguageChange }: ToursLanguageSwitcherProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 border border-primary/40 rounded-lg bg-black/50 hover:border-primary transition-colors">
        <Globe className="w-4 h-4 text-primary" />
        <span className="text-primary text-sm">
          {toursLanguageFlags[language]} {toursLanguageNames[language]}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-black border border-primary/40 min-w-[160px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => onLanguageChange(lang)}
            className={`flex items-center gap-2 cursor-pointer hover:bg-primary/10 ${
              language === lang ? 'bg-primary/20 text-primary' : 'text-primary/80'
            }`}
          >
            <span>{toursLanguageFlags[lang]}</span>
            <span className="font-playfair">{toursLanguageNames[lang]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
