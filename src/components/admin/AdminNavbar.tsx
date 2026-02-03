import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Home, Map, Users, Menu, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import ankhLogo from '@/assets/ankh-logo.png';
import { LanguageSwitcherDropdown } from '@/components/LanguageSwitcherDropdown';

const adminNavLinks = [
  { path: '/admin', label: 'HOME', icon: Home },
  { path: '/admin/tours', label: 'TOURS', icon: Map },
  { path: '/admin/tourists', label: 'TOURISTS', icon: Users },
  { path: '/admin/complaints', label: 'COMPLAINTS', icon: AlertCircle },
];

export function AdminNavbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="w-full bg-black py-4 px-6 md:px-16">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Ankh Logo - Left */}
        <Link to="/admin" className="flex items-center">
          <img src={ankhLogo} alt="Egypt Explorer Admin" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
        </Link>

        {/* Center Navigation - Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {adminNavLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "font-playfair tracking-[0.15em] uppercase text-sm transition-colors",
                isActive(link.path)
                  ? "text-primary"
                  : "text-primary/70 hover:text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Language Selector - Right (Desktop) */}
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
            {adminNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "font-playfair tracking-[0.15em] uppercase text-sm px-4 py-2 transition-colors flex items-center gap-2",
                  isActive(link.path)
                    ? "text-primary"
                    : "text-primary/70 hover:text-primary"
                )}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
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
