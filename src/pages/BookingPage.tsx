import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { trips } from '@/data/trips';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { User, Phone, Mail, Users, Calendar, ChevronRight, MapPin, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { z } from 'zod';

const bookingSchema = z.object({
  fullName: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل').max(100),
  phone: z.string().regex(/^01[0125][0-9]{8}$/, 'رقم الهاتف غير صحيح'),
  email: z.string().email('البريد الإلكتروني غير صحيح').max(255),
  persons: z.number().min(1, 'عدد الأشخاص يجب أن يكون 1 على الأقل').max(20),
  travelDate: z.string().min(1, 'يرجى اختيار تاريخ الرحلة'),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const trip = trips.find((t) => t.id === id);

  const [formData, setFormData] = useState<BookingFormData>({
    fullName: '',
    phone: '',
    email: '',
    persons: 1,
    travelDate: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!trip) {
    return (
      <Layout>
        <div className="container-custom py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">الرحلة غير موجودة</h1>
          <Button asChild>
            <Link to="/trips">العودة للرحلات</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = bookingSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof BookingFormData, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof BookingFormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In production, this would be:
    // await fetch('/v1/booking', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ trip_id: id, ...formData }),
    // });

    setIsSubmitting(false);
    setIsSuccess(true);
    
    toast({
      title: 'تم الحجز بنجاح!',
      description: 'سنتواصل معك قريباً لتأكيد الحجز',
    });
  };

  const totalPrice = trip.price * formData.persons;

  if (isSuccess) {
    return (
      <Layout>
        <section className="py-16 md:py-24">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto text-center"
            >
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                تم الحجز بنجاح!
              </h1>
              <p className="text-muted-foreground mb-8">
                شكراً لك، تم استلام طلب حجزك لرحلة "{trip.title}". سنتواصل معك قريباً عبر البريد الإلكتروني أو الهاتف لتأكيد الحجز.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link to="/trips">تصفح رحلات أخرى</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/check-booking">تحقق من حجزك</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-secondary py-4">
        <div className="container-custom">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">الرئيسية</Link>
            <ChevronRight className="w-4 h-4 rotate-180" />
            <Link to="/trips" className="hover:text-foreground transition-colors">الرحلات</Link>
            <ChevronRight className="w-4 h-4 rotate-180" />
            <Link to={`/trips/${id}`} className="hover:text-foreground transition-colors">{trip.title}</Link>
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span className="text-foreground font-medium">الحجز</span>
          </nav>
        </div>
      </div>

      <section className="py-8 md:py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-0 shadow-medium">
                  <CardHeader>
                    <CardTitle className="text-xl">بيانات الحجز</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Full Name */}
                      <div>
                        <Label htmlFor="fullName" className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4" />
                          الاسم بالكامل
                        </Label>
                        <Input
                          id="fullName"
                          placeholder="أدخل اسمك الكامل"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className={errors.fullName ? 'border-destructive' : ''}
                        />
                        {errors.fullName && (
                          <p className="text-destructive text-sm mt-1">{errors.fullName}</p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                          <Phone className="w-4 h-4" />
                          رقم الهاتف
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          dir="ltr"
                          placeholder="01xxxxxxxxx"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className={errors.phone ? 'border-destructive' : ''}
                        />
                        {errors.phone && (
                          <p className="text-destructive text-sm mt-1">{errors.phone}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                          <Mail className="w-4 h-4" />
                          البريد الإلكتروني
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          dir="ltr"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={errors.email ? 'border-destructive' : ''}
                        />
                        {errors.email && (
                          <p className="text-destructive text-sm mt-1">{errors.email}</p>
                        )}
                      </div>

                      {/* Persons */}
                      <div>
                        <Label htmlFor="persons" className="flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4" />
                          عدد الأشخاص
                        </Label>
                        <Input
                          id="persons"
                          type="number"
                          min={1}
                          max={trip.availableSeats}
                          value={formData.persons}
                          onChange={(e) => setFormData({ ...formData, persons: parseInt(e.target.value) || 1 })}
                          className={errors.persons ? 'border-destructive' : ''}
                        />
                        {errors.persons && (
                          <p className="text-destructive text-sm mt-1">{errors.persons}</p>
                        )}
                      </div>

                      {/* Travel Date */}
                      <div>
                        <Label htmlFor="travelDate" className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4" />
                          تاريخ الرحلة
                        </Label>
                        <Input
                          id="travelDate"
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          value={formData.travelDate}
                          onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                          className={errors.travelDate ? 'border-destructive' : ''}
                        />
                        {errors.travelDate && (
                          <p className="text-destructive text-sm mt-1">{errors.travelDate}</p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full shadow-gold"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'جاري الحجز...' : 'تأكيد الحجز'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="sticky top-24"
              >
                <Card className="border-0 shadow-large">
                  <CardHeader>
                    <CardTitle className="text-lg">ملخص الحجز</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Trip Info */}
                    <div className="flex gap-4">
                      <img
                        src={trip.images[0]}
                        alt={trip.title}
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-foreground line-clamp-2">{trip.title}</h3>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                          <MapPin className="w-4 h-4" />
                          <span>{trip.city}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{trip.duration} أيام</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-border pt-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">سعر الفرد</span>
                        <span className="text-foreground">{trip.price.toLocaleString()} جنيه</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">عدد الأشخاص</span>
                        <span className="text-foreground">{formData.persons}</span>
                      </div>
                      <div className="border-t border-border pt-3 flex justify-between">
                        <span className="font-semibold text-foreground">الإجمالي</span>
                        <span className="font-bold text-xl text-primary">
                          {totalPrice.toLocaleString()} جنيه
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BookingPage;
