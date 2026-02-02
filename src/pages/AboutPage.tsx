import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { LuxuryNavbar } from '@/components/home/LuxuryNavbar';
import { LuxuryFooter } from '@/components/home/LuxuryFooter';
import { useI18n } from '@/contexts/I18nContext';
import pharaohMask from '@/assets/pharaoh-mask.png';
import nefertitiBust from '@/assets/nefertiti-bust.png';

const AboutPage = () => {
  const { t, isRTL } = useI18n();

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const features = [
    t('feature1'),
    t('feature2'),
    t('feature3'),
    t('feature4'),
    t('feature5'),
  ];

  const stats = [
    { number: "15+", label: t('yearsExperience') },
    { number: "50K+", label: t('happyTravelers') },
    { number: "100+", label: t('uniqueTours') },
    { number: "4.9", label: t('averageRating') }
  ];

  return (
    <div className="min-h-screen bg-black" dir={isRTL ? 'rtl' : 'ltr'}>
      <LuxuryNavbar />

      <section className="py-16 md:py-24 px-8 md:px-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="font-playfair text-primary text-3xl md:text-5xl tracking-[0.2em] uppercase mb-6">
              {t('aboutTitle')}
            </h1>
            <p className="font-playfair text-primary/70 text-sm md:text-base tracking-wider max-w-2xl mx-auto">
              {t('aboutSubtitle')}
            </p>
          </motion.div>

          {/* Main Content */}
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={isRTL ? 'lg:order-2' : ''}
            >
              <img
                src={pharaohMask}
                alt="King Tutankhamun"
                className="w-full max-w-sm mx-auto"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`space-y-6 ${isRTL ? 'lg:order-1 text-right' : ''}`}
            >
              <h2 className="font-playfair text-primary text-2xl tracking-[0.15em] uppercase">
                {t('ourMission')}
              </h2>
              <p className="font-playfair text-primary/70 leading-relaxed">
                {t('missionText1')}
              </p>
              <p className="font-playfair text-primary/70 leading-relaxed">
                {t('missionText2')}
              </p>
            </motion.div>
          </div>

          {/* Second Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`space-y-6 ${isRTL ? 'lg:order-2 text-right' : 'order-2 lg:order-1'}`}
            >
              <h2 className="font-playfair text-primary text-2xl tracking-[0.15em] uppercase">
                {t('whyChooseUs')}
              </h2>
              <ul className="space-y-4">
                {features.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                    <span className="font-playfair text-primary/70">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={isRTL ? 'lg:order-1' : 'order-1 lg:order-2'}
            >
              <img
                src={nefertitiBust}
                alt="Nefertiti"
                className="w-full max-w-sm mx-auto"
              />
            </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-20 border border-primary/30 p-10"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index}>
                  <p className="font-playfair text-primary text-3xl md:text-4xl tracking-wider mb-2">
                    {stat.number}
                  </p>
                  <p className="font-playfair text-primary/60 text-xs tracking-wider uppercase">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <LuxuryFooter />
    </div>
  );
};

export default AboutPage;
