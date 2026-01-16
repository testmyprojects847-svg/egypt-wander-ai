import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Map, Users, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import ankhLogo from '@/assets/ankh-logo.png';

const adminNavLinks = [
  { path: '/admin', label: 'DASHBOARD', icon: LayoutDashboard },
  { path: '/admin/tours', label: 'TOURS', icon: Map },
  { path: '/admin/tourists', label: 'TOURISTS', icon: Users },
];

export function AdminNavbar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/admin') {
      return currentPath === '/admin';
    }
    return currentPath.startsWith(path);
  };

  return (
    <nav className="w-full bg-black py-5 px-8 md:px-16">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Ankh Logo - Left */}
        <Link to="/admin" className="flex items-center gap-3">
          <img src={ankhLogo} alt="Egypt Explorer Admin" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
          <span className="hidden md:block font-playfair text-primary text-lg tracking-wide">Admin Panel</span>
        </Link>

        {/* Center Navigation */}
        <div className="flex items-center gap-6 md:gap-10">
          {adminNavLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "font-playfair transition-colors tracking-widest uppercase text-sm flex items-center gap-2",
                isActive(link.path)
                  ? "text-primary border-b-2 border-primary pb-1"
                  : "text-primary/60 hover:text-primary"
              )}
            >
              <link.icon className="w-4 h-4 hidden md:block" />
              {link.label}
            </Link>
          ))}
        </div>

        {/* View Site Button - Right */}
        <Link 
          to="/" 
          target="_blank"
          className="flex items-center gap-2 text-primary/80 hover:text-primary transition-colors font-playfair text-sm tracking-wider"
        >
          <Eye className="w-4 h-4" />
          <span className="hidden md:inline">View Site</span>
        </Link>
      </div>
      
      {/* Thin Gold Line */}
      <div className="mt-5 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
    </nav>
  );
}
