import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';

// Ankh SVG Component
const AnkhIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 32" 
    fill="currentColor" 
    className={className}
  >
    <path d="M12 0C8.5 0 5.5 2.5 5.5 6.5C5.5 9 6.5 11 8 12.5L8 14L5 14L5 18L8 18L8 32L16 32L16 18L19 18L19 14L16 14L16 12.5C17.5 11 18.5 9 18.5 6.5C18.5 2.5 15.5 0 12 0ZM12 4C13.5 4 14.5 5.2 14.5 6.5C14.5 7.8 13.5 9 12 9C10.5 9 9.5 7.8 9.5 6.5C9.5 5.2 10.5 4 12 4Z"/>
  </svg>
);

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
        <Link to="/" className="text-primary">
          <AnkhIcon className="w-7 h-7" />
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
