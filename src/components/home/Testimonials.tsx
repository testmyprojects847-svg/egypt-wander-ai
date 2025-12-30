import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: 'أحمد محمد',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    location: 'القاهرة',
    rating: 5,
    text: 'تجربة رائعة في الأقصر وأسوان! التنظيم كان ممتازاً والمرشد السياحي محترف جداً. أنصح الجميع بهذه الرحلة.',
  },
  {
    id: 2,
    name: 'سارة أحمد',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    location: 'الإسكندرية',
    rating: 5,
    text: 'شرم الشيخ كانت أحلى من الخيال! الفندق ممتاز والرحلات البحرية لا تُنسى. شكراً لفريق رحلات مصر.',
  },
  {
    id: 3,
    name: 'محمود علي',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    location: 'المنصورة',
    rating: 5,
    text: 'رحلة الصحراء البيضاء كانت مغامرة حقيقية! النوم تحت النجوم والتخييم كانت تجربة لن أنساها أبداً.',
  },
];

export function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-secondary/50">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            ماذا يقول <span className="text-gradient-gold">عملاؤنا</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            آراء حقيقية من مسافرين استمتعوا برحلاتنا
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="h-full border-0 shadow-soft hover:shadow-medium transition-shadow bg-card">
                <CardContent className="p-6">
                  {/* Quote Icon */}
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                    <Quote className="w-5 h-5 text-accent" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>

                  {/* Text */}
                  <p className="text-foreground leading-relaxed mb-6">
                    "{testimonial.text}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
