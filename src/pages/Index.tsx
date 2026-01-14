import { useEffect } from 'react';
import { LuxuryNavbar } from '@/components/home/LuxuryNavbar';
import { LuxuryHero } from '@/components/home/LuxuryHero';
import { LuxuryExplore } from '@/components/home/LuxuryExplore';
import { LuxuryFooter } from '@/components/home/LuxuryFooter';

const Index = () => {
  // Force dark mode for the luxury theme
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <LuxuryNavbar />
      <LuxuryHero />
      <LuxuryExplore />
      <LuxuryFooter />
    </div>
  );
};

export default Index;
