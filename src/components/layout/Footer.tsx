import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';

const quickLinks = [
  { path: '/', label: 'الرئيسية' },
  { path: '/trips', label: 'الرحلات' },
  { path: '/chat', label: 'المساعد الذكي' },
  { path: '/check-booking', label: 'تحقق من حجزك' },
];

const destinations = ['القاهرة', 'الأقصر وأسوان', 'شرم الشيخ', 'الغردقة', 'الإسكندرية'];

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <MapPin className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-lg">رحلات مصر</h3>
                <p className="text-xs text-muted-foreground">اكتشف سحر الفراعنة</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              نقدم لك أفضل الرحلات السياحية داخل مصر بأسعار منافسة وخدمة متميزة لتعيش تجربة لا تُنسى.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Destinations */}
          <div>
            <h4 className="font-semibold text-lg mb-4">الوجهات الشائعة</h4>
            <ul className="space-y-2">
              {destinations.map((city) => (
                <li key={city}>
                  <Link
                    to="/trips"
                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">تواصل معنا</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-accent" />
                <span dir="ltr">+20 100 123 4567</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-accent" />
                <span>info@egypttrips.com</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-accent" />
                <span>القاهرة، مصر</span>
              </li>
            </ul>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-muted/20 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-muted/20 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-muted/20 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-muted/20 mt-10 pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} رحلات مصر. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
