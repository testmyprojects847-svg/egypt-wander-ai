import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Phone, Mail, Search, Calendar, MapPin, Users, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { z } from 'zod';

const phoneSchema = z.string().regex(/^01[0125][0-9]{8}$/, 'رقم الهاتف غير صحيح');
const emailSchema = z.string().email('البريد الإلكتروني غير صحيح');

interface BookingResult {
  found: boolean;
  booking?: {
    id: string;
    tripTitle: string;
    city: string;
    travelDate: string;
    persons: number;
    totalPrice: number;
    status: 'confirmed' | 'pending' | 'cancelled';
  };
}

const CheckBookingPage = () => {
  const { toast } = useToast();
  const [searchType, setSearchType] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BookingResult | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setError('');
    setResult(null);

    // Validate input
    if (searchType === 'phone') {
      const validation = phoneSchema.safeParse(phone);
      if (!validation.success) {
        setError(validation.error.errors[0].message);
        return;
      }
    } else {
      const validation = emailSchema.safeParse(email);
      if (!validation.success) {
        setError(validation.error.errors[0].message);
        return;
      }
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In production, this would be:
    // const response = await fetch(`/v1/booking/check?${searchType}=${searchType === 'phone' ? phone : email}`);
    // const data = await response.json();

    // Mock response - simulate found booking for demo
    const mockFound = Math.random() > 0.3;
    
    if (mockFound) {
      setResult({
        found: true,
        booking: {
          id: 'BK-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          tripTitle: 'رحلة الأقصر وأسوان الساحرة',
          city: 'الأقصر - أسوان',
          travelDate: '2024-02-15',
          persons: 2,
          totalPrice: 9000,
          status: 'confirmed',
        },
      });
    } else {
      setResult({ found: false });
    }

    setIsLoading(false);
  };

  const statusLabels = {
    confirmed: { label: 'مؤكد', color: 'text-green-600', bg: 'bg-green-100' },
    pending: { label: 'قيد المراجعة', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    cancelled: { label: 'ملغي', color: 'text-red-600', bg: 'bg-red-100' },
  };

  return (
    <Layout>
      {/* Header */}
      <section className="bg-primary py-16 md:py-20">
        <div className="container-custom text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4"
          >
            تحقق من حجزك
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-primary-foreground/80 text-lg max-w-2xl mx-auto"
          >
            أدخل رقم هاتفك أو بريدك الإلكتروني للتحقق من حالة حجزك
          </motion.p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container-custom max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-0 shadow-large">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">البحث عن الحجز</CardTitle>
                <CardDescription>
                  اختر طريقة البحث وأدخل البيانات المطلوبة
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs value={searchType} onValueChange={(v) => setSearchType(v as 'phone' | 'email')}>
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="phone" className="gap-2">
                      <Phone className="w-4 h-4" />
                      رقم الهاتف
                    </TabsTrigger>
                    <TabsTrigger value="email" className="gap-2">
                      <Mail className="w-4 h-4" />
                      البريد الإلكتروني
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="phone" className="mt-6">
                    <div>
                      <Label htmlFor="phone" className="mb-2 block">رقم الهاتف</Label>
                      <Input
                        id="phone"
                        type="tel"
                        dir="ltr"
                        placeholder="01xxxxxxxxx"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={error ? 'border-destructive' : ''}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="email" className="mt-6">
                    <div>
                      <Label htmlFor="email" className="mb-2 block">البريد الإلكتروني</Label>
                      <Input
                        id="email"
                        type="email"
                        dir="ltr"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={error ? 'border-destructive' : ''}
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                {error && (
                  <p className="text-destructive text-sm">{error}</p>
                )}

                <Button
                  onClick={handleSearch}
                  size="lg"
                  className="w-full shadow-gold"
                  disabled={isLoading || (searchType === 'phone' ? !phone : !email)}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                      جاري البحث...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 ml-2" />
                      بحث
                    </>
                  )}
                </Button>

                {/* Results */}
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-6 border-t border-border"
                  >
                    {result.found && result.booking ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-green-600">
                          <CheckCircle className="w-6 h-6" />
                          <span className="font-semibold text-lg">تم العثور على حجزك!</span>
                        </div>

                        <Card className="border border-border">
                          <CardContent className="p-4 space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">رقم الحجز</span>
                              <span className="font-mono font-semibold text-foreground">
                                {result.booking.id}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">الرحلة</span>
                              <span className="font-semibold text-foreground">
                                {result.booking.tripTitle}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                الوجهة
                              </span>
                              <span className="text-foreground">{result.booking.city}</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                التاريخ
                              </span>
                              <span className="text-foreground">
                                {new Date(result.booking.travelDate).toLocaleDateString('ar-EG')}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                عدد الأشخاص
                              </span>
                              <span className="text-foreground">{result.booking.persons}</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">الإجمالي</span>
                              <span className="font-bold text-primary">
                                {result.booking.totalPrice.toLocaleString()} جنيه
                              </span>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-border">
                              <span className="text-sm text-muted-foreground">الحالة</span>
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  statusLabels[result.booking.status].bg
                                } ${statusLabels[result.booking.status].color}`}
                              >
                                {statusLabels[result.booking.status].label}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                          <XCircle className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold text-lg text-foreground mb-2">
                          لم يتم العثور على حجز
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          تأكد من صحة البيانات المدخلة أو تواصل معنا للمساعدة
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default CheckBookingPage;
