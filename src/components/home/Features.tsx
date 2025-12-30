import { Shield, Clock, HeartHandshake, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Shield,
    title: 'حجز آمن',
    description: 'بياناتك محمية بأعلى معايير الأمان',
  },
  {
    icon: Clock,
    title: 'حجز فوري',
    description: 'احجز رحلتك في دقائق معدودة',
  },
  {
    icon: HeartHandshake,
    title: 'أفضل الأسعار',
    description: 'نضمن لك أفضل الأسعار في السوق',
  },
  {
    icon: Headphones,
    title: 'دعم 24/7',
    description: 'فريق الدعم متاح على مدار الساعة',
  },
];

export function Features() {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container-custom">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="text-center p-6 rounded-2xl bg-card shadow-soft hover:shadow-medium transition-shadow"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
