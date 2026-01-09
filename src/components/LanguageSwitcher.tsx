import { Language, languageNames, languageFlags } from '@/lib/translations';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export function LanguageSwitcher({ language, onLanguageChange }: LanguageSwitcherProps) {
  return (
    <Select value={language} onValueChange={(value) => onLanguageChange(value as Language)}>
      <SelectTrigger className="w-auto gap-2 bg-secondary/50 border-0">
        <Globe className="w-4 h-4" />
        <SelectValue>
          {languageFlags[language]} {languageNames[language]}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(languageNames) as Language[]).map((lang) => (
          <SelectItem key={lang} value={lang}>
            <span className="flex items-center gap-2">
              {languageFlags[lang]} {languageNames[lang]}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
