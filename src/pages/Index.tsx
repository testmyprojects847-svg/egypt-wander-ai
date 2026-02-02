import { useEffect } from 'react';
import { LuxuryNavbar } from '@/components/home/LuxuryNavbar';
import { LuxuryHero } from '@/components/home/LuxuryHero';
import { ReviewsSection } from '@/components/reviews/ReviewsSection';
import { LuxuryExplore } from '@/components/home/LuxuryExplore';
import { FAQSection } from '@/components/home/FAQSection';
import { LuxuryFooter } from '@/components/home/LuxuryFooter';
import { useI18n } from '@/contexts/I18nContext';

const Index = () => {
  const { isRTL } = useI18n();

  // Force dark mode for the luxury theme
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen bg-black" dir={isRTL ? 'rtl' : 'ltr'}>
      <LuxuryNavbar />
      <LuxuryHero />
      <ReviewsSection />
      <LuxuryExplore />
      <FAQSection />
      <LuxuryFooter />
    </div>
  );
};

export default Index;
