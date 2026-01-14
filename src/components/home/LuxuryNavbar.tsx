import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';
import ankhLogo from '@/assets/ankh-logo.png';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/tours', label: 'Tours' },
  { path: '/about', label: 'About Us' },
  { path: '/contact', label: 'Contact Us' },
];

export function LuxuryNavbar() {
  return (
    <nav className="w-full bg-black py-5 px-8 md:px-16">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Ankh Logo - Left */}
        <Link to="/" className="flex items-center">
          <img src={ankhLogo} alt="Egypt Explorer" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
        </Link>

        {/* Center Navigation */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="font-playfair text-primary hover:text-primary-light transition-colors tracking-widest uppercase text-sm"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Language Selector - Right */}
        <button className="flex items-center gap-1 text-primary hover:text-primary-light transition-colors">
          <Globe className="w-5 h-5" />
          <span className="text-xs font-playfair tracking-wider">GB</span>
        </button>
      </div>
      
      {/* Thin Gold Line */}
      <div className="mt-5 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
    </nav>
  );
}
