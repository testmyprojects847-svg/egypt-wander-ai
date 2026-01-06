import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Map, 
  Plane
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Map, label: 'Tours', href: '/admin' },
  { icon: Users, label: 'Tourists', href: '/tourists' },
];

interface SidebarProps {
  collapsed?: boolean;
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="h-full bg-card border-r border-border flex flex-col py-6">
      {/* Logo */}
      <div className="px-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <Plane className="h-6 w-6 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-foreground text-lg">Egypt Tours</h1>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          )}
        </div>
      </div>

      {/* Section Label */}
      {!collapsed && (
        <div className="px-4 mb-3">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            MY STUDIO
          </span>
        </div>
      )}

      {/* Menu Items */}
      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = 
              (item.label === 'Tourists' && currentPath === '/tourists') ||
              (item.label === 'Tours' && (currentPath === '/admin' || currentPath === '/')) ||
              (item.label === 'Dashboard' && currentPath === '/admin');
            
            return (
              <li key={item.label}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                    isActive 
                      ? "bg-accent/30 text-primary border-l-4 border-primary" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5 flex-shrink-0",
                    isActive ? "text-primary" : "text-muted-foreground"
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
    </div>
  );
}
