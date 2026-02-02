import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import ankhLogo from '@/assets/ankh-logo.png';
import { LanguageSwitcherPremium } from '@/components/LanguageSwitcherPremium';
import { useI18n } from '@/contexts/I18nContext';

export function LuxuryNavbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, isRTL } = useI18n();

  const navLinks = [
    { path: '/', label: t('home') },
    { path: '/tours', label: t('tours') },
    { path: '/about', label: t('aboutUs') },
    { path: '/contact', label: t('contactUs') },
  ];

  return (
    <nav className="w-full bg-black/95 backdrop-blur-sm py-4 px-6 md:px-16 sticky top-0 z-50">
      <div className={`max-w-7xl mx-auto flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        {/* Ankh Logo */}
        <Link to="/" className="flex items-center">
          <img src={ankhLogo} alt="Egypt Explorer" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
        </Link>

        {/* Center Navigation - Desktop */}
        <div className={`hidden md:flex items-center gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`font-playfair tracking-[0.15em] uppercase text-sm transition-colors ${
                  isActive 
                    ? 'text-primary' 
                    : 'text-primary/70 hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right Side - Book Now Button + Language Switcher */}
        <div className={`hidden md:flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Link
            to="/tours"
            className="btn-gold px-5 py-2 rounded text-sm"
          >
            {t('bookNow')}
          </Link>
          <LanguageSwitcherPremium />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-primary hover:text-primary-light transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-primary/20 animate-fade-in">
          <div className="flex flex-col gap-4 pt-4">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`font-playfair tracking-[0.15em] uppercase text-sm px-4 py-2 transition-colors ${
                    isActive 
                      ? 'text-primary' 
                      : 'text-primary/70 hover:text-primary'
                  } ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className={`px-4 pt-2 flex items-center gap-4 border-t border-primary/20 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Link
                to="/tours"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-gold px-4 py-2 rounded text-sm flex-1 text-center"
              >
                {t('bookNow')}
              </Link>
              <LanguageSwitcherPremium />
            </div>
          </div>
        </div>
      )}
      
      {/* Thin Gold Line */}
      <div className="mt-4 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
    </nav>
  );
}
