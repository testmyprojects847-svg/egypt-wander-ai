import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import ankhLogo from '@/assets/ankh-logo.png';
import { LanguageSwitcherDropdown } from '@/components/LanguageSwitcherDropdown';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/tours', label: 'Tours' },
  { path: '/about', label: 'About Us' },
  { path: '/contact', label: 'Contact Us' },
];

export function LuxuryNavbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-black py-4 px-6 md:px-16">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Ankh Logo - Left */}
        <Link to="/" className="flex items-center">
          <img src={ankhLogo} alt="Egypt Explorer" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
        </Link>

        {/* Center Navigation - Desktop */}
        <div className="hidden md:flex items-center gap-8">
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

        {/* Language Selector - Right */}
        <div className="hidden md:block">
          <LanguageSwitcherDropdown />
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
        <div className="md:hidden mt-4 pb-4 border-t border-primary/20">
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
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="px-4 pt-2 border-t border-primary/20">
              <LanguageSwitcherDropdown />
            </div>
          </div>
        </div>
      )}
      
      {/* Thin Gold Line */}
      <div className="mt-4 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
    </nav>
  );
}
