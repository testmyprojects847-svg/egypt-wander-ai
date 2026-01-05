import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Map, 
  Plane
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Map, label: 'Tours', href: '/', active: true },
  { icon: Users, label: 'Tourists', href: '/tourists' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-card border-r border-border">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center shadow-gold">
            <Plane className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground">Egypt Tours</h1>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4 px-3">
          My Studio
        </p>
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.label}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-primary/10 text-primary border-l-4 border-primary ml-[-1px]" 
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive && "text-primary")} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Illustration Area */}
      <div className="p-4">
        <div className="bg-secondary/50 rounded-2xl p-4 text-center">
          <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
            <Map className="w-10 h-10 text-primary" />
          </div>
          <Link 
            to="/" 
            className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            My Tours
          </Link>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-4">© Egypt Tours</p>
      </div>
    </aside>
  );
}
