import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, Phone, Mail, MapPin } from 'lucide-react';
import { LuxuryNavbar } from '@/components/home/LuxuryNavbar';
import { LuxuryFooter } from '@/components/home/LuxuryFooter';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useI18n } from '@/contexts/I18nContext';
import pharaohMask from '@/assets/pharaoh-mask.png';

// Validation schema
const contactSchema = z.object({
  name: z.string().trim().min(2, { message: "Name must be at least 2 characters" }).max(100, { message: "Name must be less than 100 characters" }),
  email: z.string().trim().email({ message: "Invalid email address" }).max(255, { message: "Email must be less than 255 characters" }),
  phone: z.string().trim().max(20, { message: "Phone must be less than 20 characters" }).optional().or(z.literal('')),
  message: z.string().trim().min(10, { message: "Message must be at least 10 characters" }).max(1000, { message: "Message must be less than 1000 characters" })
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactPage = () => {
  const { toast } = useToast();
  const { t, isRTL } = useI18n();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: ''
    }
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          message: data.message
        });

      if (error) throw error;

      // Send to n8n webhook
      try {
        await fetch('https://n8n.algaml.com/webhook/a1219875-8532-4d89-891c-929b93e8d79a', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            phone: data.phone || undefined,
            message: data.message,
          }),
        });
      } catch (webhookError) {
        console.error('Webhook error (non-blocking):', webhookError);
      }

      toast({
        title: t('messageSent'),
        description: t('thankYouContact'),
      });
      form.reset();
    } catch (error) {
      toast({
        title: t('error'),
        description: t('sendingFailed'),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black" dir={isRTL ? 'rtl' : 'ltr'}>
      <LuxuryNavbar />

      <section className="py-16 md:py-24 px-8 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
            {/* Left Side - Pharaoh Image & Info */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className={`text-center ${isRTL ? 'lg:text-right lg:order-2' : 'lg:text-left'}`}
            >
              <div className={`mb-8 flex justify-center ${isRTL ? 'lg:justify-end' : 'lg:justify-start'}`}>
                <img
                  src={pharaohMask}
                  alt="King Tutankhamun"
                  className="w-48 md:w-64 h-auto"
                />
              </div>

              <h1 className="font-playfair text-primary text-3xl md:text-4xl tracking-[0.15em] uppercase mb-6">
                {t('contactTitle')}
              </h1>
              <p className="font-playfair text-primary/70 text-sm tracking-wider mb-8">
                {t('contactSubtitle')}
              </p>

              <div className="space-y-4">
                <div className={`flex items-center gap-4 justify-center ${isRTL ? 'lg:justify-end flex-row-reverse' : 'lg:justify-start'}`}>
                  <div className="w-10 h-10 rounded-full border border-primary/50 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-playfair text-primary/80 tracking-wide">+20 123 456 7890</span>
                </div>
                <div className={`flex items-center gap-4 justify-center ${isRTL ? 'lg:justify-end flex-row-reverse' : 'lg:justify-start'}`}>
                  <div className="w-10 h-10 rounded-full border border-primary/50 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-playfair text-primary/80 tracking-wide">info@egyptexplorer.com</span>
                </div>
                <div className={`flex items-center gap-4 justify-center ${isRTL ? 'lg:justify-end flex-row-reverse' : 'lg:justify-start'}`}>
                  <div className="w-10 h-10 rounded-full border border-primary/50 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-playfair text-primary/80 tracking-wide">
                    {isRTL ? 'القاهرة، مصر' : 'Cairo, Egypt'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className={`border border-primary/30 p-8 md:p-10 ${isRTL ? 'lg:order-1' : ''}`}
            >
              <h2 className="font-playfair text-primary text-xl tracking-[0.15em] uppercase mb-8 text-center">
                {t('sendUsMessage')}
              </h2>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={`font-playfair text-primary/80 tracking-wider uppercase text-xs ${isRTL ? 'text-right block' : ''}`}>
                          {t('fullName')} *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className={`bg-transparent border-primary/30 text-primary placeholder:text-primary/40 focus:border-primary ${isRTL ? 'text-right' : ''}`}
                            placeholder={isRTL ? 'أدخل اسمك' : 'Enter your name'}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={`font-playfair text-primary/80 tracking-wider uppercase text-xs ${isRTL ? 'text-right block' : ''}`}>
                          {t('email')} *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            className={`bg-transparent border-primary/30 text-primary placeholder:text-primary/40 focus:border-primary ${isRTL ? 'text-right' : ''}`}
                            placeholder={isRTL ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                            dir="ltr"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={`font-playfair text-primary/80 tracking-wider uppercase text-xs ${isRTL ? 'text-right block' : ''}`}>
                          {t('phone')} ({t('optional')})
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="tel"
                            className={`bg-transparent border-primary/30 text-primary placeholder:text-primary/40 focus:border-primary ${isRTL ? 'text-right' : ''}`}
                            placeholder={isRTL ? 'أدخل رقم هاتفك' : 'Enter your phone (optional)'}
                            dir="ltr"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={`font-playfair text-primary/80 tracking-wider uppercase text-xs ${isRTL ? 'text-right block' : ''}`}>
                          {t('yourMessage')} *
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={5}
                            className={`bg-transparent border-primary/30 text-primary placeholder:text-primary/40 focus:border-primary resize-none ${isRTL ? 'text-right' : ''}`}
                            placeholder={t('messagePlaceholder')}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )}
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-gold btn-gold-lg rounded-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      t('submitting')
                    ) : (
                      <span className={`flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Send className="w-5 h-5" />
                        {t('sendMessage')}
                      </span>
                    )}
                  </button>
                </form>
              </Form>
            </motion.div>
          </div>
        </div>
      </section>

      <LuxuryFooter />
    </div>
  );
};

export default ContactPage;
