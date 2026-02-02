import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, Search, Globe } from 'lucide-react';
import { nationalities, Nationality } from '@/lib/i18n/nationalities';
import { useI18n } from '@/contexts/I18nContext';
import { cn } from '@/lib/utils';

interface NationalityDropdownProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function NationalityDropdown({ value, onChange, placeholder, className }: NationalityDropdownProps) {
  const { language, t, isRTL } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filteredNationalities = useMemo(() => {
    if (!searchQuery) return nationalities;
    const query = searchQuery.toLowerCase();
    return nationalities.filter(n => 
      n[language].toLowerCase().includes(query) ||
      n.en.toLowerCase().includes(query) ||
      n.code.toLowerCase().includes(query)
    );
  }, [searchQuery, language]);

  const selectedNationality = useMemo(() => {
    return nationalities.find(n => n.en === value || n.ar === value || n.code === value);
  }, [value]);

  const displayValue = selectedNationality ? selectedNationality[language] : '';

  const handleSelect = (nationality: Nationality) => {
    onChange(nationality.en); // Always store English name for consistency
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between gap-2 px-3 py-2 h-10 rounded-md',
          'bg-transparent border border-primary/30 text-primary',
          'hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary/20',
          'transition-all duration-200 font-playfair text-sm',
          isRTL && 'flex-row-reverse'
        )}
      >
        <div className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
          <Globe className="w-4 h-4 text-primary/50" />
          <span className={cn(!displayValue && 'text-primary/40')}>
            {displayValue || placeholder || t('selectNationality')}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-primary/50" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-black/95 backdrop-blur-md border border-primary/30 rounded-lg shadow-lg overflow-hidden"
          >
            {/* Search Input */}
            <div className="p-2 border-b border-primary/20">
              <div className={cn('relative flex items-center', isRTL && 'flex-row-reverse')}>
                <Search className={cn(
                  'absolute w-4 h-4 text-primary/40',
                  isRTL ? 'right-3' : 'left-3'
                )} />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchNationality')}
                  className={cn(
                    'w-full py-2 bg-black/50 border border-primary/20 rounded-md',
                    'text-primary text-sm placeholder:text-primary/40',
                    'focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20',
                    isRTL ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3 text-left'
                  )}
                />
              </div>
            </div>

            {/* Nationality List */}
            <div className="max-h-60 overflow-y-auto scrollbar-hide">
              {filteredNationalities.length > 0 ? (
                filteredNationalities.map((nationality) => {
                  const isSelected = selectedNationality?.code === nationality.code;
                  return (
                    <motion.button
                      key={nationality.code}
                      type="button"
                      whileHover={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
                      onClick={() => handleSelect(nationality)}
                      className={cn(
                        'w-full flex items-center justify-between px-4 py-2.5 transition-colors',
                        isSelected ? 'bg-primary/20 text-primary' : 'text-primary/80',
                        isRTL && 'flex-row-reverse'
                      )}
                    >
                      <span className="font-playfair text-sm">{nationality[language]}</span>
                      {isSelected && <Check className="w-4 h-4 text-primary" />}
                    </motion.button>
                  );
                })
              ) : (
                <div className="px-4 py-6 text-center text-primary/50 text-sm">
                  {t('noNationalityFound')}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
