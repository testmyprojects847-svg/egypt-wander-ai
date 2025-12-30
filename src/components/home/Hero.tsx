import { Search, MapPin, Calendar, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1920"
          alt="أهرامات الجيزة"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-foreground/90 via-foreground/70 to-foreground/50" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="container-custom relative z-10 py-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-accent/90 text-accent-foreground px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Compass className="w-4 h-4" />
            <span>أفضل الرحلات السياحية في مصر</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-background leading-tight mb-6"
          >
            اكتشف سحر
            <span className="text-gradient-gold block mt-2">الحضارة المصرية</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-background/80 leading-relaxed mb-8 max-w-2xl"
          >
            انطلق في رحلة عبر الزمن واستكشف عجائب مصر القديمة والحديثة. من الأهرامات العظيمة إلى شواطئ البحر الأحمر الساحرة.
          </motion.p>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-effect p-4 rounded-2xl shadow-large max-w-2xl"
          >
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="إلى أين تريد الذهاب؟"
                  className="pr-10 h-12 bg-background border-border"
                />
              </div>
              <div className="flex-1 relative">
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="date"
                  className="pr-10 h-12 bg-background border-border"
                />
              </div>
              <Button asChild size="lg" className="h-12 px-8 shadow-gold">
                <Link to="/trips">
                  <Search className="w-5 h-5 ml-2" />
                  ابحث
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-8 mt-10"
          >
            {[
              { value: '+500', label: 'رحلة سياحية' },
              { value: '+10K', label: 'عميل سعيد' },
              { value: '4.9', label: 'تقييم العملاء' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-accent">{stat.value}</div>
                <div className="text-sm text-background/70">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
