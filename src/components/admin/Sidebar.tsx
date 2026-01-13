import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Map, 
  Settings,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Map, label: 'Tours', href: '/admin' },
  { icon: Users, label: 'Tourists', href: '/tourists' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

interface SidebarProps {
  collapsed?: boolean;
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="hidden lg:flex h-screen w-64 bg-black border-r border-primary/20 flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-primary/20">
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="text-primary"
          >
            <AnkhIcon className="w-10 h-10" />
          </motion.div>
          {!collapsed && (
            <div>
              <h1 className="font-serif font-bold text-primary text-xl tracking-wide">Egypt Tours</h1>
              <p className="text-xs text-primary/60">Admin Panel</p>
            </div>
          )}
        </Link>
      </div>

      {/* Section Label */}
      {!collapsed && (
        <div className="px-6 py-4">
          <span className="text-xs font-semibold text-primary/60 uppercase tracking-widest">
            MY STUDIO
          </span>
        </div>
      )}

      {/* Menu Items */}
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = 
              (item.label === 'Tourists' && currentPath === '/tourists') ||
              (item.label === 'Settings' && currentPath === '/admin/settings') ||
              (item.label === 'Tours' && currentPath === '/admin') ||
              (item.label === 'Dashboard' && currentPath === '/admin');
            
            return (
              <li key={item.label}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    isActive 
                      ? "bg-primary/20 text-primary border-l-4 border-primary" 
                      : "text-primary/60 hover:bg-primary/10 hover:text-primary"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5 flex-shrink-0",
                    isActive ? "text-primary" : "text-primary/60"
                  )} />
                  {!collapsed && (
                    <span className={cn(
                      "font-medium",
                      isActive ? "text-primary" : ""
                    )}>
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* View Site Button */}
      <div className="p-4 border-t border-primary/20">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary/60 hover:bg-primary/10 hover:text-primary transition-all"
        >
          <Eye className="h-5 w-5" />
          <span className="font-medium">View Site</span>
        </Link>
      </div>

      {/* Footer Ankh */}
      <div className="p-4 flex justify-center">
        <AnkhIcon className="w-5 h-5 text-primary/30" />
      </div>
    </div>
  );
}
